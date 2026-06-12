import { useRef } from 'react'

export default function ScanCard({ source, onScan, onRename, onRemove }) {
  const inputRef = useRef(null)
  const { label, subtitle, preview, ingredients, loading, optional, removable, custom } = source

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      {preview ? (
        <div className="relative">
          <img src={preview} alt={label} className="w-full h-44 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          {ingredients && (
            <span className="absolute bottom-3 left-4 text-white text-sm font-semibold">
              {ingredients.length} items detected
            </span>
          )}
          <button
            onClick={() => inputRef.current?.click()}
            disabled={loading}
            className="absolute bottom-3 right-3 bg-white/90 backdrop-blur text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-white transition-colors"
          >
            Rescan
          </button>
        </div>
      ) : (
        <button
          onClick={() => inputRef.current?.click()}
          disabled={loading}
          className="w-full h-32 flex flex-col items-center justify-center gap-2 hover:bg-gray-50 transition-colors border-b border-gray-100"
        >
          {loading ? (
            <svg className="animate-spin h-7 w-7 text-green-500" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          ) : (
            <div className="w-11 h-11 rounded-2xl bg-green-50 flex items-center justify-center text-2xl">📷</div>
          )}
          <span className="text-sm font-medium text-gray-500">{loading ? 'Analysing…' : 'Tap to scan'}</span>
        </button>
      )}

      <div className="px-5 py-4 flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          {custom ? (
            <input
              value={label}
              onChange={e => onRename(e.target.value)}
              placeholder="Name this spot"
              className="font-semibold text-gray-800 w-full bg-transparent outline-none focus:bg-gray-50 rounded px-1 -ml-1"
            />
          ) : (
            <p className="font-semibold text-gray-800 truncate">{label}</p>
          )}
          <p className="text-xs text-gray-400 mt-0.5 truncate">{subtitle}</p>
        </div>
        {optional && !preview && !removable && (
          <span className="text-xs bg-gray-100 text-gray-400 px-2 py-1 rounded-full flex-shrink-0">Optional</span>
        )}
        {preview && !loading && (
          <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
        {removable && (
          <button onClick={onRemove} className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <input ref={inputRef} type="file" accept="image/*" capture="environment" className="hidden"
        onChange={e => onScan(e.target.files[0])} />
    </div>
  )
}
