import { useState } from 'react'
import { scanPhoto } from '../api/claude'
import ScanCard from './ScanCard'

let nextId = 1

const INITIAL = [
  { id: 'fridge', label: 'Fridge', subtitle: 'Scan your fridge contents', optional: false, removable: false, custom: false, preview: null, ingredients: null, loading: false },
  { id: 'spice', label: 'Spice cupboard', subtitle: 'Spices & condiments', optional: true, removable: false, custom: false, preview: null, ingredients: null, loading: false },
]

export default function ScanStep({ onDone }) {
  const [sources, setSources] = useState(INITIAL)
  const [error, setError] = useState(null)

  function update(id, patch) {
    setSources(prev => prev.map(s => (s.id === id ? { ...s, ...patch } : s)))
  }

  async function handleScan(id, file) {
    if (!file) return
    setError(null)
    const reader = new FileReader()
    reader.onload = async (ev) => {
      const dataUrl = ev.target.result
      const [meta, base64] = dataUrl.split(',')
      const mediaType = meta.match(/data:([^;]+)/)[1]
      update(id, { preview: dataUrl, loading: true })
      try {
        const items = await scanPhoto(base64, mediaType)
        update(id, { ingredients: items, loading: false })
      } catch (e) {
        setError(e.message)
        update(id, { loading: false })
      }
    }
    reader.readAsDataURL(file)
  }

  function addSpot() {
    setSources(prev => [...prev, {
      id: `custom-${nextId++}`, label: '', subtitle: 'e.g. rice, pasta, tins',
      optional: true, removable: true, custom: true, preview: null, ingredients: null, loading: false,
    }])
  }

  const fridge = sources.find(s => s.id === 'fridge')
  const allIngredients = sources.flatMap(s => s.ingredients || [])
  const ready = fridge?.ingredients != null

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto px-4 pt-14 pb-8">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-full mb-4">
          <span className="text-green-600 text-xs font-semibold tracking-wide uppercase">Smart Cooking</span>
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">FridgeFork</h1>
        <p className="text-gray-400 mt-2 text-base">Scan everything you've got, cook what you love.</p>
      </div>

      <div className="flex flex-col gap-4">
        {sources.map(source => (
          <ScanCard
            key={source.id}
            source={source}
            onScan={file => handleScan(source.id, file)}
            onRename={label => update(source.id, { label })}
            onRemove={() => setSources(prev => prev.filter(s => s.id !== source.id))}
          />
        ))}

        <button
          onClick={addSpot}
          className="w-full border-2 border-dashed border-gray-200 rounded-3xl py-5 flex items-center justify-center gap-2 text-gray-400 hover:border-green-300 hover:text-green-500 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <span className="text-sm font-semibold">Add another spot (drawer, cupboard…)</span>
        </button>
      </div>

      {error && <div className="mt-4 bg-red-50 text-red-600 text-sm px-4 py-3 rounded-2xl">{error}</div>}

      <div className="mt-auto pt-8">
        <button
          onClick={() => onDone(allIngredients)}
          disabled={!ready}
          className="w-full bg-gray-900 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold py-4 rounded-2xl text-base tracking-wide transition-all hover:bg-gray-800 active:scale-95"
        >
          {ready ? `Find meals with ${allIngredients.length} ingredients →` : 'Scan your fridge to continue'}
        </button>
      </div>
    </div>
  )
}
