const COMPARED_STORAGE_KEY = 'comparedFilmIds'
const MAX_COMPARED_FILMS = 2

export const parseComparedIds = (value: string | null): number[] => {
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

export const getComparedIds = (): number[] => {
  return parseComparedIds(localStorage.getItem(COMPARED_STORAGE_KEY))
}

export const saveComparedIds = (comparedIds: number[]) => {
  localStorage.setItem(COMPARED_STORAGE_KEY, JSON.stringify(comparedIds))
}

export const addComparedId = (currentIds: number[], filmId: number): number[] => {
  if (currentIds.includes(filmId)) return currentIds

  const nextIds = [...currentIds, filmId]
  if (nextIds.length <= MAX_COMPARED_FILMS) return nextIds

  return nextIds.slice(nextIds.length - MAX_COMPARED_FILMS)
}

export const removeComparedId = (currentIds: number[], filmId: number): number[] => {
  return currentIds.filter((id) => id !== filmId)
}

