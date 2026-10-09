// app/favicon.ico/route.js
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  // Read the SVG file
  const svgPath = path.join(process.cwd(), 'public', 'favicon.svg');
  const svg = fs.readFileSync(svgPath, 'utf8');
  
  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
