#!/usr/bin/env node
// Deployment safety gate, run as a Firebase Hosting predeploy hook.
//
// firebase-tools (web frameworks integration) builds the Next.js app and
// copies it, together with EVERY `.env.*` file in the project root, into
// `.firebase/<site>/functions` (the SSR Cloud Function source) and the static
// output into `.firebase/<site>/hosting`. That happens before predeploy hooks
// run; the upload happens after. This script inspects that generated artifact
// and exits non-zero if it contains secrets, so the deploy aborts before
// anything is uploaded.
//
// It never prints file contents or variable values: findings report only the
// problem type, the file and (where applicable) the variable name.
//
// Exit codes: 0 = artifact clean, 1 = artifact unsafe, 2 = artifact or
// configuration could not be inspected (fails closed).
//
// Usage:
//   node scripts/check-deploy-artifact.js
//   node scripts/check-deploy-artifact.js --functions-dir <dir> [--hosting-dir <dir>] [--project <id>]

'use strict';

const fs = require('fs');
const path = require('path');

// Production secrets for this project (served from Secret Manager via
// frameworksBackend.secrets). They must never appear in a bundled .env file.
const KNOWN_SECRETS = ['FB_ADMIN_PRIVATE_KEY', 'RESEND_API_KEY', 'GOOGLE_CLIENT_SECRET'];

// Variable names that denote credentials. NEXT_PUBLIC_* is exempt: those are
// public by design and inlined into the browser bundle by Next.js anyway.
const SENSITIVE_NAME = /PRIVATE_KEY|SECRET|API_KEY|ACCESS_TOKEN|REFRESH_TOKEN|PASSWORD|CREDENTIAL/i;

// Credential formats with a distinctive, documented prefix/structure. Plain
// "looks random" or length-based heuristics are deliberately not used: the
// minified bundle is full of identifiers such as gRPC's
// `failure_percentage_ejection` that such heuristics misreport. Leading \b
// ensures a prefix is not matched in the middle of another identifier.
const CREDENTIAL_PATTERNS = [
  { kind: 'PEM private key', re: /-----BEGIN (?:RSA |EC |DSA |ENCRYPTED |OPENSSH )?PRIVATE KEY-----/ },
  { kind: 'Google OAuth client secret', re: /\bGOCSPX-[A-Za-z0-9_-]{24,}/ },
  { kind: 'Google OAuth access token', re: /\bya29\.[A-Za-z0-9_-]{40,}/ },
  { kind: 'Resend API key', re: /\bre_[A-Za-z0-9]{8}_[A-Za-z0-9]{20,}\b/ },
  { kind: 'Stripe live secret key', re: /\bsk_live_[A-Za-z0-9]{20,}/ },
];

const BINARY_EXTENSIONS = new Set([
  '.png', '.jpg', '.jpeg', '.gif', '.webp', '.avif', '.ico', '.bmp',
  '.woff', '.woff2', '.ttf', '.otf', '.eot', '.mp4', '.webm', '.mp3', '.pdf',
]);

const findings = [];
const report = (message) => findings.push(message);

function fail(code, message) {
  console.error(`check-deploy-artifact: ${message}`);
  process.exit(code);
}

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const key = argv[i];
    if (!['--functions-dir', '--hosting-dir', '--project'].includes(key) || argv[i + 1] === undefined) {
      fail(2, `unknown or incomplete argument: ${key}`);
    }
    args[key.slice(2)] = argv[++i];
  }
  return args;
}

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    return null;
  }
}

// Resolves the artifact directories firebase-tools generates for every
// frameworks-enabled hosting config: .firebase/<site>/{functions,hosting}.
function resolveTargets(projectDir, projectId) {
  const firebaseJson = readJson(path.join(projectDir, 'firebase.json'));
  if (!firebaseJson) fail(2, 'cannot read firebase.json');
  const firebaserc = readJson(path.join(projectDir, '.firebaserc')) || {};

  const hostingConfigs = [].concat(firebaseJson.hosting || []);
  const targets = [];
  for (const config of hostingConfigs) {
    if (!config.source) continue; // not a web frameworks config
    let site = config.site;
    if (!site && config.target) {
      site = firebaserc.targets?.[projectId]?.hosting?.[config.target]?.[0];
    }
    site = site || projectId; // default site id equals the project id
    const dist = path.join(projectDir, '.firebase', site);
    targets.push({
      site,
      functionsDir: config.frameworksBackend?.omit ? null : path.join(dist, 'functions'),
      hostingDir: path.join(dist, 'hosting'),
      declaredSecrets: config.frameworksBackend?.secrets || [],
    });
  }
  if (targets.length === 0) fail(2, 'no web frameworks hosting config (hosting.source) found in firebase.json');
  return targets;
}

function walk(dir, visit, root = dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isSymbolicLink()) continue;
    if (entry.isDirectory()) {
      // Not uploaded by the functions deploy (dependencies are installed
      // server-side from package.json).
      if (entry.name === 'node_modules' || entry.name === '.git') continue;
      walk(full, visit, root);
    } else if (entry.isFile()) {
      visit(full, path.relative(root, full));
    }
  }
}

// Returns variable names defined in a dotenv file. Values are never kept.
function envVariableNames(file) {
  const names = [];
  for (const line of fs.readFileSync(file, 'utf8').replace(/^﻿/, '').split(/\r?\n/)) {
    const match = line.match(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=/);
    if (match) names.push(match[1]);
  }
  return names;
}

function checkEnvFile(file, label, declaredSecrets) {
  for (const name of envVariableNames(file)) {
    if (name.startsWith('NEXT_PUBLIC_')) continue;
    if (KNOWN_SECRETS.includes(name) || SENSITIVE_NAME.test(name)) {
      report(`ERROR: Deployment artifact contains sensitive variable ${name} in ${label}`);
    } else if (declaredSecrets.includes(name)) {
      report(`ERROR: Variable ${name} is declared in frameworksBackend.secrets but also set as a plain variable in ${label}`);
    }
  }
}

// Structural references: a secret name assigned a literal value, e.g. an env
// dump (`NAME=...`) or an inlined config object (`"NAME":"..."`). Plain code
// references such as `process.env.NAME` are not assignments and don't match.
function literalAssignmentPattern(name) {
  return new RegExp(`(?:^|[\\s{,;])["']?${name}["']?\\s*[:=]\\s*["'\`]?[^\\s"'\`,;}]{8,}`, 'm');
}

function scanContents(file, label, secretNames) {
  // latin1 keeps a 1:1 byte mapping for binary-ish files; drop a UTF-8 BOM so
  // a secret on the first line of a dotenv file is still anchored at ^.
  const text = fs.readFileSync(file).toString('latin1').replace(/^ï»¿/, '');
  for (const { kind, re } of CREDENTIAL_PATTERNS) {
    if (re.test(text)) report(`ERROR: Deployment artifact contains a ${kind} in ${label}`);
  }
  if (text.includes('"service_account"') && /"private_key"\s*:/.test(text)) {
    report(`ERROR: Deployment artifact contains a service account key (JSON) in ${label}`);
  }
  for (const name of secretNames) {
    if (text.includes(name) && literalAssignmentPattern(name).test(text)) {
      report(`ERROR: Deployment artifact assigns a literal value to ${name} in ${label}`);
    }
  }
}

function checkFunctionsDir(dir, projectId, declaredSecrets, secretNames) {
  const allowedEnvFiles = new Set(['.env', `.env.${projectId}`]);
  let scanned = 0;
  walk(dir, (file, rel) => {
    const base = path.basename(file);
    const label = `functions/${rel.split(path.sep).join('/')}`;
    if (base.startsWith('.env')) {
      // Only the .env firebase-tools generates and the public per-project
      // .env.<projectId> may be shipped, and only at the artifact root.
      if (!allowedEnvFiles.has(base) || rel !== base) {
        report(`ERROR: Deployment artifact contains unexpected env file ${label}`);
      } else {
        checkEnvFile(file, label, declaredSecrets);
      }
    }
    if (!BINARY_EXTENSIONS.has(path.extname(file).toLowerCase())) {
      scanContents(file, label, secretNames);
      scanned++;
    }
  });
  return scanned;
}

function checkHostingDir(dir, secretNames) {
  let scanned = 0;
  walk(dir, (file, rel) => {
    const label = `hosting/${rel.split(path.sep).join('/')}`;
    // Everything here is publicly served; no env file may be present at all.
    if (path.basename(file).startsWith('.env')) {
      report(`ERROR: Public hosting artifact contains env file ${label}`);
    }
    if (!BINARY_EXTENSIONS.has(path.extname(file).toLowerCase())) {
      scanContents(file, label, secretNames);
      scanned++;
    }
  });
  return scanned;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const projectDir = process.env.PROJECT_DIR || path.resolve(__dirname, '..');
  const firebaserc = readJson(path.join(projectDir, '.firebaserc')) || {};
  const projectId = args.project || process.env.GCLOUD_PROJECT || firebaserc.projects?.default;
  if (!projectId) fail(2, 'cannot determine the Firebase project id');

  const targets = args['functions-dir']
    ? [{
        site: '(explicit)',
        functionsDir: path.resolve(args['functions-dir']),
        hostingDir: args['hosting-dir'] ? path.resolve(args['hosting-dir']) : null,
        declaredSecrets: [].concat(readJson(path.join(projectDir, 'firebase.json'))?.hosting || [])
          .flatMap((config) => config.frameworksBackend?.secrets || []),
      }]
    : resolveTargets(projectDir, projectId);

  let scanned = 0;
  for (const target of targets) {
    const secretNames = [...new Set([...KNOWN_SECRETS, ...target.declaredSecrets])]
      .filter((name) => SENSITIVE_NAME.test(name));
    if (target.functionsDir) {
      if (!fs.existsSync(target.functionsDir)) {
        fail(2, `functions artifact not found for site ${target.site}: ${target.functionsDir} (run through firebase deploy so it is generated first)`);
      }
      scanned += checkFunctionsDir(target.functionsDir, projectId, target.declaredSecrets, secretNames);
    }
    if (target.hostingDir && fs.existsSync(target.hostingDir)) {
      scanned += checkHostingDir(target.hostingDir, secretNames);
    }
  }

  if (findings.length) {
    for (const message of findings) console.error(message);
    console.error(`check-deploy-artifact: ${findings.length} problem(s) found in ${scanned} scanned file(s). Deployment aborted.`);
    process.exit(1);
  }
  console.log(`check-deploy-artifact: OK - ${scanned} file(s) scanned, no secrets found in the deployment artifact.`);
}

main();
