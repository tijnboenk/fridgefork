const TYPES = [
  { id: 'breakfast', label: 'Breakfast', emoji: '🥐', desc: 'Start the day right', time: 'Morning' },
  { id: 'lunch',     label: 'Lunch',     emoji: '🥗', desc: 'Light & energising',  time: 'Midday' },
  { id: 'dinner',    label: 'Dinner',    emoji: '🍽️', desc: 'End the day well',    time: 'Evening' },
]

export default function MealTypeStep({ ingredients, onSelect, onBack }) {
  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto px-4 pt-14 pb-8">
      <button onClick={onBack} className="self-start flex items-center gap-1.5 text-gray-400 hover:text-gray-600 text-sm mb-8 transition-colors">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      <div className="mb-8">
        <p className="text-green-600 text-xs font-semibold tracking-wide uppercase mb-2">{ingredients.length} ingredients ready</p>
        <h2 className="text-3xl font-extrabold text-gray-900">What are you<br />cooking?</h2>
      </div>

      <div className="flex flex-col gap-3">
        {TYPES.map(t => (
          <button
            key={t.id}
            onClick={() => onSelect(t.id)}
            className="group w-full bg-white hover:bg-gray-900 border border-gray-100 hover:border-gray-900 rounded-3xl p-6 flex items-center gap-5 transition-all duration-200 text-left shadow-sm hover:shadow-lg active:scale-95"
          >
            <span className="text-4xl">{t.emoji}</span>
            <div className="flex-1">
              <div className="font-bold text-gray-900 group-hover:text-white text-lg transition-colors">{t.label}</div>
              <div className="text-gray-400 group-hover:text-gray-300 text-sm transition-colors">{t.desc}</div>
            </div>
            <svg className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  )
}
