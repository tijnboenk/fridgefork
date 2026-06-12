import { useEffect, useState } from 'react'
import { getMealSuggestions } from '../api/claude'

function Spinner() {
  return (
    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
    </svg>
  )
}

function MealCard({ meal, onClick }) {
  const seed = meal.name.length * 7 + meal.imageQuery.length * 13
  const imgUrl = `https://loremflickr.com/600/400/${encodeURIComponent(meal.imageQuery)},food?lock=${seed}`

  return (
    <button
      onClick={onClick}
      className="group bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden text-left hover:shadow-md transition-all duration-200 active:scale-95 w-full"
    >
      <div className="relative">
        <img src={imgUrl} alt={meal.name} className="w-full h-44 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <span className={`absolute top-3 right-3 text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm ${
          meal.canMakeNow
            ? 'bg-green-500/90 text-white'
            : 'bg-white/90 text-amber-700'
        }`}>
          {meal.canMakeNow ? '✓ Ready to cook' : `+${meal.missingIngredients.length} to buy`}
        </span>
        <p className="absolute bottom-3 left-4 text-white font-bold text-lg leading-tight drop-shadow">{meal.name}</p>
      </div>
      <div className="px-5 py-4">
        <p className="text-gray-500 text-sm leading-relaxed">{meal.description}</p>
        <div className="flex items-center gap-4 mt-3">
          <span className="flex items-center gap-1.5 text-xs text-gray-400">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
            </svg>
            {meal.time}
          </span>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
            meal.difficulty === 'Easy' ? 'bg-green-50 text-green-600' :
            meal.difficulty === 'Medium' ? 'bg-amber-50 text-amber-600' :
            'bg-red-50 text-red-600'
          }`}>{meal.difficulty}</span>
          {!meal.canMakeNow && (
            <span className="text-xs text-amber-600 truncate">Need: {meal.missingIngredients.slice(0,2).join(', ')}{meal.missingIngredients.length > 2 ? '…' : ''}</span>
          )}
        </div>
      </div>
    </button>
  )
}

export default function MealSuggestions({ ingredients, mealType, onSelect, onBack }) {
  const [meals, setMeals] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getMealSuggestions(ingredients, mealType)
      .then(setMeals)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="flex flex-col max-w-md mx-auto px-4 pt-14 pb-10">
      <button onClick={onBack} className="self-start flex items-center gap-1.5 text-gray-400 hover:text-gray-600 text-sm mb-8 transition-colors">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      <div className="mb-6">
        <p className="text-green-600 text-xs font-semibold tracking-wide uppercase mb-2 capitalize">{mealType}</p>
        <h2 className="text-3xl font-extrabold text-gray-900">What to cook</h2>
      </div>

      {loading && (
        <div className="flex flex-col items-center gap-3 text-green-600 py-20">
          <Spinner />
          <p className="text-sm font-medium text-gray-500">Finding the best meals for you…</p>
        </div>
      )}

      {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-2xl">{error}</div>}

      {meals && (
        <div className="flex flex-col gap-4">
          {meals.map(meal => (
            <MealCard key={meal.name} meal={meal} onClick={() => onSelect(meal)} />
          ))}
        </div>
      )}
    </div>
  )
}
