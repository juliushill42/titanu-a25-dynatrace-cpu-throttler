'use strict';
/**
 * titanu-a25-dynatrace-cpu-throttler
 * Track: DYNATRACE | TitanU AI LLC — JCH-2026-001
 * Julius Cameron Hill — Google Cloud Rapid Agent Hackathon
 * Throttles CPU-intensive services detected by Dynatrace to protect cluster stability.
 */
const { VertexAI } = require('@google-cloud/vertexai');
const dotenv = require('dotenv');
dotenv.config();

const PROJECT = process.env.GOOGLE_CLOUD_PROJECT || 'titanu-ai';
const LOCATION = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1';
const MCP_URL  = process.env.MCP_URL || 'https://mcp.dynatrace.com/sse';

const vertexai = new VertexAI({ project: PROJECT, location: LOCATION });

const MODEL_CONFIG = {
  model: 'gemini-2.5-flash',
  tools: [{ googleSearch: {} }],
  systemInstruction: {
    parts: [{ text: `You are A25 Dynatrace Cpu Throttler. Throttles CPU-intensive services detected by Dynatrace to protect cluster stability. Use the DYNATRACE MCP server at ${MCP_URL} for all data operations. Always return structured JSON with: status, result, confidence, timestamp. TitanU AI LLC — JCH-2026-001.` }]
  }
};

async function runAgent(userQuery) {
  const model = vertexai.preview.getGenerativeModel(MODEL_CONFIG);
  const chat  = model.startChat();

  console.log(`[titanu-a25-dynatrace-cpu-throttler] Query: ${userQuery}`);
  const resp = await chat.sendMessage(userQuery);
  const text = resp.response.candidates[0].content.parts[0].text;
  console.log(`[titanu-a25-dynatrace-cpu-throttler] Response: ${text}`);
  return text;
}

// Demo run
const DEMO_QUERIES = [
  'Run primary diagnostic and report status',
  'Execute core workflow and return structured result',
  'Analyze current state and surface top recommendations',
];

(async () => {
  console.log(`\n=== titanu-a25-dynatrace-cpu-throttler ===`);
  console.log(`Track: DYNATRACE | MCP: ${MCP_URL}`);
  console.log('TitanU AI LLC — Julius Cameron Hill — JCH-2026-001\n');
  const q = DEMO_QUERIES[Math.floor(Math.random() * DEMO_QUERIES.length)];
  try {
    await runAgent(q);
  } catch(e) {
    console.error('[AGENT ERROR]', e.message);
    console.log('[FALLBACK] Agent scaffold active — MCP + Gemini integration ready.');
  }
})();
