import { useRef, useEffect, useState } from 'react'

export function usePlainAppApiCallback(appApiFn) {
    const appApiFnRef = useRef(appApiFn)
    appApiFnRef.current = appApiFn
    const [value, setValue] = useState(null)
    useEffect(() => {
        if (value === null) {
            const asyncFn = async () => {
                const newValue = await appApiFnRef.current()
                setValue(newValue)
            }
            asyncFn()
        }
    }, [value])
    const invalidate = () => setValue(null)
    return [value, invalidate]
}

export function useAppApi(AppApiClass) {
    const apiRef = useRef(null)
    if (apiRef.current == null) {
        apiRef.current = new AppApiClass()
    }
    const api = apiRef.current

    useEffect(() => {
        api.listenForConsole()
        return () => api.cancelConsoleListener()
    }, [api])

    return api
}
