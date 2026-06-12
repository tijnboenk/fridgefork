import Anthropic from '@anthropic-ai/sdk'

// Server-side key — NOT exposed to the browser.
export const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export const SCAN_PROMPT =
  'You are an ingredient detection assistant. Analyze the photo and return ONLY a valid JSON array. No explanation, no markdown, no backticks. Each item: name (string), quantity (string), confidence ("high"|"medium"|"low"), notes (string).'

export const MEALS_PROMPT = `You are a chef assistant. Given a list of available ingredients and a meal type, suggest exactly 4 meals.
Return ONLY a valid JSON array. No explanation, no markdown, no backticks.
Each meal object must have:
- name (string)
- description (string, 1 sentence)
- time (string, e.g. "20 min")
- difficulty ("Easy"|"Medium"|"Hard")
- canMakeNow (boolean — true if makeable with only the provided ingredients)
- missingIngredients (array of strings — ingredients needed but not available, empty if canMakeNow)
- imageQuery (string — 2-3 word search term for an appetizing photo of this dish)`

export const RECIPE_PROMPT = `You are a chef assistant. Given a meal name and available ingredients, return a full recipe.
Return ONLY a valid JSON object. No explanation, no markdown, no backticks.
The object must have:
- title (string)
- time (string)
- servings (number)
- steps (array of strings — clear step-by-step instructions)
- allIngredients (array of objects with: name (string), amount (string), have (boolean — true if in the available list))`

// Read and JSON-parse a request body across Vercel/Node runtimes.
export async function readBody(req) {
  if (req.body) return typeof req.body === 'string' ? JSON.parse(req.body) : req.body
  const chunks = []
  for await (const chunk of req) chunks.push(chunk)
  return JSON.parse(Buffer.concat(chunks).toString('utf8'))
}

export function sendJson(res, status, data) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(data))
}
