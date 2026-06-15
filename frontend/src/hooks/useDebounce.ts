import { useState, useEffect } from 'react'

// 검색 입력 등에서 API 호출 빈도를 줄이기 위한 debounce
export function useDebounce<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}
