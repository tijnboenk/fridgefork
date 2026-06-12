import { useEffect, useState } from 'react'
import { getRecipe } from '../api/claude'

function Spinner() {
  return (
    <svg className="animate-spin h-5 w-5 text-green-500" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
    </svg>
  )
}

export default function RecipeDetail({ meal, ingredients, onBack }) {
  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getRecipe(meal.name, ingredients)
      .then(setRecipe)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const seed = meal.name.length * 7 + meal.imageQuery.length * 13
  const imgUrl = `https://loremflickr.com/800/500/${encodeURIComponent(meal.imageQuery)},food?lock=${seed}`
  const groceryList = recipe?.allIngredients.filter(i => !i.have) || []

  return (
    <div className="flex flex-col max-w-md mx-auto pb-16">
      {/* Hero image */}
      <div className="relative">
        <img src={imgUrl} alt={meal.name} className="w-full h-64 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <button
          onClick={onBack}
          className="absolute top-14 left-4 w-9 h-9 rounded-full bg-white/20 backdrop-blur flex items-center justify-center hover:bg-white/30 transition-colors"
        >
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="absolute bottom-5 left-5 right-5">
          <p className="text-green-400 text-xs font-semibold uppercase tracking-wide mb-1 capitalize">{meal.difficulty} · {meal.time}</p>
          <h2 className="text-white font-extrabold text-2xl leading-tight">{meal.name}</h2>
        </div>
      </div>

      <div className="px-4 pt-6 flex flex-col gap-5">
        {/* Meta row */}
        {recipe && (
          <div className="flex gap-3">
            {[
              { label: 'Time', value: meal.time },
              { label: 'Difficulty', value: meal.difficulty },
              { label: 'Servings', value: `${recipe.servings} people` },
            ].map(m => (
              <div key={m.label} className="flex-1 bg-gray-50 rounded-2xl px-3 py-3 text-center">
                <p className="text-xs text-gray-400 mb-1">{m.label}</p>
                <p className="text-sm font-bold text-gray-800">{m.value}</p>
              </div>
            ))}
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center gap-3 py-10 text-gray-400">
            <Spinner />
            <span className="text-sm">Loading recipe…</span>
          </div>
        )}

        {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-2xl">{error}</div>}

        {recipe && (
          <>
            {/* Grocery list */}
            {groceryList.length > 0 && (
              <div className="bg-amber-50 border border-amber-100 rounded-3xl p-5">
                <p className="font-bold text-amber-900 mb-3 flex items-center gap-2">
                  <span>🛒</span> Grocery list
                </p>
                <ul className="flex flex-col gap-2.5">
                  {groceryList.map(item => (
                    <li key={item.name} className="flex items-center gap-3 text-sm text-amber-800">
                      <span className="w-5 h-5 rounded-md border-2 border-amber-300 flex-shrink-0" />
                      <span><span className="font-medium">{item.amount}</span> {item.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Ingredients */}
            <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm">
              <p className="font-bold text-gray-900 mb-4">Ingredients</p>
              <ul className="flex flex-col gap-3">
                {recipe.allIngredients.map(item => (
                  <li key={item.name} className="flex items-center gap-3 text-sm">
                    <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${item.have ? 'bg-green-400' : 'bg-amber-300'}`} />
                    <span className="text-gray-500 w-24 flex-shrink-0">{item.amount}</span>
                    <span className={`font-medium ${item.have ? 'text-gray-800' : 'text-amber-700'}`}>{item.name}</span>
                    {!item.have && <span className="ml-auto text-xs text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full">buy</span>}
                  </li>
                ))}
              </ul>
            </div>

            {/* Steps */}
            <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm">
              <p className="font-bold text-gray-900 mb-4">Instructions</p>
              <ol className="flex flex-col gap-5">
                {recipe.steps.map((step, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="w-7 h-7 rounded-full bg-gray-900 text-white flex items-center justify-center flex-shrink-0 font-bold text-xs mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-gray-600 text-sm leading-relaxed flex-1">{step}</p>
                  </li>
                ))}
              </ol>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
