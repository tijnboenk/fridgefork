import { useState } from 'react'
import ScanStep from './components/ScanStep'
import MealTypeStep from './components/MealTypeStep'
import MealSuggestions from './components/MealSuggestions'
import RecipeDetail from './components/RecipeDetail'

export default function App() {
  const [step, setStep] = useState('scan') // scan | mealtype | suggestions | recipe
  const [ingredients, setIngredients] = useState([])
  const [mealType, setMealType] = useState(null)
  const [selectedMeal, setSelectedMeal] = useState(null)

  return (
    <div className="min-h-screen bg-transparent px-4 py-8">
      {step === 'scan' && (
        <ScanStep onDone={items => { setIngredients(items); setStep('mealtype') }} />
      )}
      {step === 'mealtype' && (
        <MealTypeStep
          ingredients={ingredients}
          onSelect={type => { setMealType(type); setStep('suggestions') }}
          onBack={() => setStep('scan')}
        />
      )}
      {step === 'suggestions' && (
        <MealSuggestions
          ingredients={ingredients}
          mealType={mealType}
          onSelect={meal => { setSelectedMeal(meal); setStep('recipe') }}
          onBack={() => setStep('mealtype')}
        />
      )}
      {step === 'recipe' && (
        <RecipeDetail
          meal={selectedMeal}
          ingredients={ingredients}
          onBack={() => setStep('suggestions')}
        />
      )}
    </div>
  )
}
