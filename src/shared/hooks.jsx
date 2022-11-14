const { useRef, useEffect } = require("react")

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
