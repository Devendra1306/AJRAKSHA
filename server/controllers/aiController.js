

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const KEYS = [
  process.env.OPENROUTER_API_KEY,
  process.env.OPENROUTER_API_KEY_2,
].filter(Boolean);

let keyIndex = 0;

const getKey = () => {
  const key = KEYS[keyIndex % KEYS.length];
  keyIndex++;
  return key;
};

const chat = async ({ messages, model = 'google/gemini-flash-1.5', stream = false, temperature = 0.7 }) => {
  let lastError;
  
  for (let i = 0; i < KEYS.length; i++) {
    const apiKey = KEYS[(keyIndex + i) % KEYS.length];
    try {
      const response = await fetch(OPENROUTER_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://ajraksha.ai',
          'X-Title': 'AJRAKSHA Agriculture Platform',
        },
        body: JSON.stringify({ model, messages, stream, temperature, max_tokens: 4096 })
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      keyIndex = (keyIndex + i) % KEYS.length;
      return stream ? response.body : { data: await response.json() };
    } catch (err) {
      console.warn(`⚠️ API Key ${i + 1} failed. Falling back to next key...`, err.message);
      lastError = err;
    }
  }
  
  throw lastError || new Error("All API keys exhausted. AI service is down.");
};

const chatWithVision = async ({ text, imageBase64, model = 'google/gemini-flash-1.5' }) => {
  const response = await chat({
    messages: [{
      role: 'user',
      content: [
        { type: 'text', text },
        { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${imageBase64}` } }
      ]
    }],
    model,
  });
  return response.data.choices[0].message.content;
};

const analyzeWithSchema = async (prompt, systemPrompt) => {
  const response = await chat({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt }
    ],
    model: 'google/gemini-flash-1.5',
    temperature: 0.3,
  });
  const text = response.data.choices[0].message.content;
  try {
    const jsonMatch = text.match(/```json([\s\S]*?)```/) || text.match(/{[\s\S]*}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[1] || jsonMatch[0]);
    }
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
};

exports.analyzeWithSchema = analyzeWithSchema;


const { query } = require('../config/db');

const SYSTEM_PROMPT = `You are Ajraksha AI — a very friendly, supportive, and kind agriculture assistant for farmers.
You have deep knowledge of farming, crops, weather, and markets.

CRITICAL INSTRUCTIONS FOR YOUR TONE AND LANGUAGE:
1. Speak in VERY SIMPLE, easy-to-understand English. Assume the user is a beginner.
2. DO NOT use complex scientific jargon, big words, or complicated agricultural terms.
3. Be incredibly friendly, patient, and encouraging. Use a warm tone.
4. Keep your sentences short and clear. 
5. If asked in Hindi or a regional language, respond in that exact language using simple words.
6. When giving advice (like fertilizer amounts or costs), be very specific but explain it simply.
7. Use bullet points to make things easy to read.
8. STRICT BOUNDARY: You are an agricultural assistant. If the user asks about anything unrelated to farming, crops, weather, agriculture, or rural life (e.g. coding, math, general chat, movies), you MUST politely decline to answer. Say: "I am your farming assistant. I can only help you with questions about agriculture, crops, and farming!"`;

exports.analyzeCrop = async (req, res, next) => {
  try {
    // ponytail: accept JSON base64 (Vercel) or multipart buffer (local) — multer fails on Vercel serverless
    const imageBase64 = req.body?.imageBase64 || req.file?.buffer?.toString('base64');
    if (!imageBase64) return res.status(400).json({ error: 'Image required' });
    const prompt = `Analyze this plant/crop image and provide a detailed diagnosis in JSON format:
{
  "disease": "exact disease name or Healthy",
  "confidence": 0-100 number,
  "severity": "None|Low|Moderate|High|Critical",
  "crop": "crop type detected",
  "symptoms": ["symptom1", "symptom2"],
  "cause": "cause description",
  "organicSolution": "organic treatment details",
  "chemicalSolution": "chemical treatment details",
  "treatmentSteps": ["step1", "step2"],
  "recovery": "expected recovery time",
  "alternatives": [{"name": "alternative disease", "confidence": number}]
}`;
    const result = await chatWithVision({ text: prompt, imageBase64 });
    const parsed = JSON.parse(result.match(/{[\s\S]*}/)?.[0] || result);
    if (req.user) {
      await query(
        `INSERT INTO crop_reports (user_id, disease, confidence, severity, crop, symptoms, treatment)
         VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        [req.user.id, parsed.disease, parsed.confidence, parsed.severity, parsed.crop,
         parsed.symptoms, JSON.stringify(parsed)]
      );
    }
    res.json(parsed);
  } catch (err) { next(err); }
};

exports.analyzeSoil = async (req, res, next) => {
  try {
    const { ph, nitrogen, phosphorus, potassium, moisture, organicMatter, soilType } = req.body;
    const result = await analyzeWithSchema(
      `Analyze soil data: pH=${ph}, N=${nitrogen}kg/ha, P=${phosphorus}kg/ha, K=${potassium}kg/ha, Moisture=${moisture}%, Organic Matter=${organicMatter}%, Type=${soilType}
       Provide JSON: { healthScore: 0-100, grade: "A/B/C/D/F", issues: [], recommendations: [], bestCrops: [], waterRetention: "Low/Medium/High", amendments: [], organicSuggestions: [] }`,
      'You are a soil science expert. Return valid JSON only.'
    );
    res.json(result);
  } catch (err) { next(err); }
};

exports.recommendCrop = async (req, res, next) => {
  try {
    const { temperature, humidity, rainfall, nitrogen, phosphorus, potassium, ph, region, season } = req.body;
    const result = await analyzeWithSchema(
      `Recommend crops for: Temp=${temperature}°C, Humidity=${humidity}%, Rainfall=${rainfall}mm, N=${nitrogen}, P=${phosphorus}, K=${potassium}, pH=${ph}, Region=${region}, Season=${season}
       Return JSON: { crops: [{ name, confidence, profitEstimate, yieldPerHectare, duration, difficulty, marketDemand, price, pros, cons }] }`,
      'You are an expert agronomist. Return valid JSON only. Include top 5 crops.'
    );
    res.json(result);
  } catch (err) { next(err); }
};

exports.recommendFertilizer = async (req, res, next) => {
  try {
    const { crop, growthStage, nitrogen, phosphorus, potassium, ph, soilType } = req.body;
    const result = await analyzeWithSchema(
      `Recommend fertilizers for ${crop} at ${growthStage} stage. Soil: N=${nitrogen}, P=${phosphorus}, K=${potassium}, pH=${ph}, Type=${soilType}
       Return JSON: { fertilizers: [{ name, type, npkRatio, dosage, timing, method, cost, organic }], warnings: [], applicationSchedule: {} }`,
      'You are a fertilizer expert. Return valid JSON only.'
    );
    res.json(result);
  } catch (err) { next(err); }
};

exports.predictYield = async (req, res, next) => {
  try {
    const { crop, area, season, soilHealth, rainfall, temperature } = req.body;
    const result = await analyzeWithSchema(
      `Predict yield for ${crop}, area=${area} hectares, season=${season}, soilHealth=${soilHealth}/100, rainfall=${rainfall}mm, avgTemp=${temperature}°C
       Return JSON: { expectedYield: "X tons", expectedRevenue: "₹X", profit: "₹X", riskLevel: "Low/Medium/High", risks: [], suggestions: [], harvestDate: "approximate" }`,
      'You are an agricultural data scientist. Return valid JSON only.'
    );
    res.json(result);
  } catch (err) { next(err); }
};

exports.identifyPest = async (req, res, next) => {
  try {
    const imageBuffer = req.file?.buffer;
    if (!imageBuffer) return res.status(400).json({ error: 'Image required' });
    const imageBase64 = imageBuffer.toString('base64');
    const result = await chatWithVision({
      text: `Identify the pest/insect in this image and provide JSON: { name, scientificName, damageLevel: "Low/Medium/High/Critical", affectedCrops: [], prevention: [], chemicalControl: "", biologicalControl: "", symptoms: [], lifecycle: "" }`,
      imageBase64
    });
    const parsed = JSON.parse(result.match(/{[\s\S]*}/)?.[0] || result);
    res.json(parsed);
  } catch (err) { next(err); }
};

exports.sendChatMessage = async (req, res, next) => {
  try {
    const { message, chatId, history = [] } = req.body;
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history.slice(-10),
      { role: 'user', content: message }
    ];
    const stream = await chat({ messages, stream: true });
    let fullContent = '';
    
    // consume web stream
    const reader = stream.getReader();
    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n');
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6).trim();
          if (data === '[DONE]') {
            res.write('data: [DONE]\n\n');
            res.end();
            
            if (req.user && chatId) {
              query('INSERT INTO chat_messages (chat_id, role, content) VALUES ($1, $2, $3)',
                [chatId, 'user', message]).catch(() => {});
              query('INSERT INTO chat_messages (chat_id, role, content) VALUES ($1, $2, $3)',
                [chatId, 'assistant', fullContent]).catch(() => {});
            }
            return;
          }
          if (!data) continue;
          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              fullContent += content;
              res.write(`data: ${JSON.stringify({ content })}\n\n`);
            }
          } catch {}
        }
      }
    }
  } catch (err) { next(err); }
};

exports.irrigationAdvice = async (req, res, next) => {
  try {
    const { crop, soilMoisture, temperature, humidity, farmSize, cropStage } = req.body;
    const result = await analyzeWithSchema(
      `Irrigation advice for ${crop} (${cropStage} stage), farm=${farmSize} acres, soil moisture=${soilMoisture}%, temp=${temperature}°C, humidity=${humidity}%
       Return JSON: { waterRequired: "X liters", bestTime: "time of day", frequency: "how often", method: "drip/sprinkler/flood", estimatedCost: "₹X", nextIrrigation: "date", tips: [] }`,
      'You are an irrigation expert. Return valid JSON only.'
    );
    res.json(result);
  } catch (err) { next(err); }
};
