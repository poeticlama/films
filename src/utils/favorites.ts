const FAVORITES_STORAGE_KEY = 'favoriteFilmIds'

export const parseFavoriteIds = (value: string | null): number[] => {
  if (!value) return []

  try {
    const parsed = JSON.parse(value)
    if (!Array.isArray(parsed)) return []

    return Array.from(
      new Set(
        parsed
          .map((item) => Number(item))
          .filter((item) => Number.isInteger(item) && item > 0)
      )
    )
  } catch {
    return []
  }
}

export const getFavoriteIds = (): number[] => {
  return parseFavoriteIds(localStorage.getItem(FAVORITES_STORAGE_KEY))
}

export const saveFavoriteIds = (favoriteIds: number[]) => {
  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoriteIds))
}

