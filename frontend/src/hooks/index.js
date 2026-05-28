import { useAuthStore } from '../stores'

export const useAuth = () => {
  return useAuthStore()
}

export const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = React.useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.log(error)
      return initialValue
    }
  })

  const setStoredValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(value) : value
      setValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.log(error)
    }
  }

  return [value, setStoredValue]
}

export const useAsync = (asyncFunction, immediate = true) => {
  const [status, setStatus] = React.useState('idle')
  const [data, setData] = React.useState(null)
  const [error, setError] = React.useState(null)

  const execute = React.useCallback(async () => {
    setStatus('pending')
    setData(null)
    setError(null)
    try {
      const response = await asyncFunction()
      setData(response)
      setStatus('success')
      return response
    } catch (error) {
      setError(error)
      setStatus('error')
    }
  }, [asyncFunction])

  React.useEffect(() => {
    if (immediate) {
      execute()
    }
  }, [execute, immediate])

  return { execute, status, data, error }
}
