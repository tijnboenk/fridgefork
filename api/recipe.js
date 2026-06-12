import { client, RECIPE_PROMPT, readBody, sendJson } from './_lib.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return sendJson(res, 405, { error: 'Method not allowed' })
  try {
    const { mealName, ingredients } = await readBody(req)
    const ingredientList = ingredients.map(i => i.name).join(', ')
    const response = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 2048,
      system: RECIPE_PROMPT,
      messages: [{ role: 'user', content: `Meal: ${mealName}\nAvailable ingredients: ${ingredientList}` }],
    })
    sendJson(res, 200, JSON.parse(response.content[0].text))
  } catch (e) {
    sendJson(res, 500, { error: e.message })
  }
}
