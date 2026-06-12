import { client, SCAN_PROMPT, readBody, sendJson } from './_lib.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return sendJson(res, 405, { error: 'Method not allowed' })
  try {
    const { base64, mediaType } = await readBody(req)
    const response = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 1024,
      system: SCAN_PROMPT,
      messages: [{
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: mediaType, data: base64 } },
          { type: 'text', text: 'Identify the ingredients in this photo.' },
        ],
      }],
    })
    sendJson(res, 200, JSON.parse(response.content[0].text))
  } catch (e) {
    sendJson(res, 500, { error: e.message })
  }
}
