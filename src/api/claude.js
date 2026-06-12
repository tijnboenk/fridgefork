// Frontend calls our own serverless functions — the API key never touches the browser.

async function post(path, body) {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`)
  return data
}

export function scanFridge(base64, mediaType) {
  return post('/api/scan', { base64, mediaType })
}

export function scanSpices(base64, mediaType) {
  return post('/api/scan', { base64, mediaType })
}

export function getMealSuggestions(ingredients, mealType) {
  return post('/api/meals', { ingredients, mealType })
}

export function getRecipe(mealName, ingredients) {
  return post('/api/recipe', { mealName, ingredients })
}
