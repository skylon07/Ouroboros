import { useRef, useEffect, useState } from 'react'

export function usePlainPageApiCallback(pageApiFn) {
    const pageApiFnRef = useRef(pageApiFn)
    pageApiFnRef.current = pageApiFn
    const [value, setValue] = useState(null)
    useEffect(() => {
        if (value === null) {
            const asyncFn = async () => {
                const newValue = await pageApiFnRef.current()
                setValue(newValue)
            }
            asyncFn()
        }
    }, [value])
    const invalidate = () => setValue(null)
    return [value, invalidate]
}

export function usePageApi(PageApiClass) {
    const apiRef = useRef(null)
    if (apiRef.current == null) {
        apiRef.current = new PageApiClass()
    }
    const api = apiRef.current

    useEffect(() => {
        api.listenForConsole()
        return () => api.cancelConsoleListener()
    }, [api])

    return api
}
