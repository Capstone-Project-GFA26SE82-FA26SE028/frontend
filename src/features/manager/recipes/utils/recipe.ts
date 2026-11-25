import type { Recipe } from '../types/ingredient'

export function recipeStatus(recipe: Recipe) {
  const now = Date.now()
  if (new Date(recipe.effectiveFrom).getTime() > now) return 'Scheduled'
  if (recipe.effectiveTo && new Date(recipe.effectiveTo).getTime() <= now)
    return 'Ended'
  return 'Active'
}

export function activeRecipe(recipes: Recipe[]) {
  const active = recipes.filter((recipe) => recipeStatus(recipe) === 'Active')
  return active.length === 1 ? active[0] : undefined
}
