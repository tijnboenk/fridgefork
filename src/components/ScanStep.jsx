import { useRef, useState } from 'react'
import { scanFridge, scanSpices } from '../api/claude'

function ScanCard({ title, subtitle, preview, count, loading, onScan, inputRef, onChange, optional }) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      {preview ? (
        <div className="relative">
          <img src={preview} alt={title} className="w-full h-48 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          {count !== null && (
            <span className="absolute bottom-3 left-4 text-white text-sm font-semibold">
              {count} ingredients detected
            </span>
          )}
          <button
            onClick={onScan}
            disabled={loading}
            className="absolute bottom-3 right-3 bg-white/90 backdrop-blur text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-white transition-colors"
          >
            Rescan
          </button>
        </div>
      ) : (
        <button
          onClick={onScan}
          disabled={loading}
          className="w-full h-36 flex flex-col items-center justify-center gap-2 hover:bg-gray-50 transition-colors border-b border-gray-100"
        >
          {loading ? (
            <svg className="animate-spin h-7 w-7 text-green-500" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          ) : (
            <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-2xl">
              📷
            </div>
          )}
          <span className="text-sm font-medium text-gray-500">{loading ? 'Analysing…' : 'Tap to scan'}</span>
        </button>
      )}
      <div className="px-5 py-4 flex items-center justify-between">
        <div>
          <p className="font-semibold text-gray-800">{title}</p>
          <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
        </div>
        {optional && !preview && (
          <span className="text-xs bg-gray-100 text-gray-400 px-2 py-1 rounded-full">Optional</span>
        )}
        {preview && !loading && (
          <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={onChange} />
    </div>
  )
}

export default function ScanStep({ onDone }) {
  const fridgeRef = useRef(null)
  const spiceRef = useRef(null)
  const [fridgePreview, setFridgePreview] = useState(null)
  const [spicePreview, setSpicePreview] = useState(null)
  const [fridgeIngredients, setFridgeIngredients] = useState(null)
  const [spiceIngredients, setSpiceIngredients] = useState(null)
  const [loading, setLoading] = useState(null)
  const [error, setError] = useState(null)

  async function handleScan(file, type) {
    if (!file) return
    setError(null)
    const reader = new FileReader()
    reader.onload = async (ev) => {
      const dataUrl = ev.target.result
      const [meta, base64] = dataUrl.split(',')
      const mediaType = meta.match(/data:([^;]+)/)[1]
      if (type === 'fridge') setFridgePreview(dataUrl)
      else setSpicePreview(dataUrl)
      setLoading(type)
      try {
        const items = type === 'fridge' ? await scanFridge(base64, mediaType) : await scanSpices(base64, mediaType)
        if (type === 'fridge') setFridgeIngredients(items)
        else setSpiceIngredients(items)
      } catch (e) { setError(e.message) }
      finally { setLoading(null) }
    }
    reader.readAsDataURL(file)
  }

  const allIngredients = [...(fridgeIngredients || []), ...(spiceIngredients || [])]

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto px-4 pt-14 pb-8">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-full mb-4">
          <span className="text-green-600 text-xs font-semibold tracking-wide uppercase">Smart Cooking</span>
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">FridgeFork</h1>
        <p className="text-gray-400 mt-2 text-base">Scan what you have, cook what you love.</p>
      </div>

      <div className="flex flex-col gap-4">
        <ScanCard
          title="Fridge"
          subtitle="Scan your fridge contents"
          preview={fridgePreview}
          count={fridgeIngredients?.length ?? null}
          loading={loading === 'fridge'}
          onScan={() => fridgeRef.current?.click()}
          inputRef={fridgeRef}
          onChange={e => handleScan(e.target.files[0], 'fridge')}
        />
        <ScanCard
          title="Spice cupboard"
          subtitle="Add spices & condiments"
          preview={spicePreview}
          count={spiceIngredients?.length ?? null}
          loading={loading === 'spice'}
          onScan={() => spiceRef.current?.click()}
          inputRef={spiceRef}
          onChange={e => handleScan(e.target.files[0], 'spice')}
          optional
        />
      </div>

      {error && (
        <div className="mt-4 bg-red-50 text-red-600 text-sm px-4 py-3 rounded-2xl">{error}</div>
      )}

      <div className="mt-auto pt-8">
        <button
          onClick={() => onDone(allIngredients)}
          disabled={!fridgeIngredients}
          className="w-full bg-gray-900 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold py-4 rounded-2xl text-base tracking-wide transition-all hover:bg-gray-800 active:scale-95"
        >
          {fridgeIngredients ? `Find meals with ${allIngredients.length} ingredients →` : 'Scan your fridge to continue'}
        </button>
      </div>
    </div>
  )
}
