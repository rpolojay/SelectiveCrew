// lib/analytics.js
// Simple analytics without Firebase dependency

export async function logEvent(eventType, details) {
  try {
    // Store logs in localStorage for now
    const logs = JSON.parse(localStorage.getItem('adminLogs') || '[]');
    logs.push({
      eventType,
      details,
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : ''
    });
    // Keep only last 100 logs
    while (logs.length > 100) logs.shift();
    localStorage.setItem('adminLogs', JSON.stringify(logs));
    console.log(`[${eventType}]`, details);
  } catch (error) {
    console.error("Failed to log event:", error);
  }
}

export async function logEmailSent(to, template, status) {
  await logEvent('email_sent', { to, template, status });
}

export async function logStageChange(candidateId, fromStage, toStage) {
  await logEvent('stage_change', { candidateId, fromStage, toStage });
}

export function getLogs() {
  if (typeof window !== 'undefined') {
    return JSON.parse(localStorage.getItem('adminLogs') || '[]');
  }
  return [];
}

export function clearLogs() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('adminLogs');
  }
}
