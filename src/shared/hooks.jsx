import { useEffect, useState } from 'react'

import AppApi from './AppApi'

export function useAppState(AppApiClass, appStateConstructor) {
    if (!(AppApiClass.prototype instanceof AppApi)) {
        throw new Error("useAppState() received an invalid AppApiClass")
    }
    const [api] = useState(() => new AppApiClass())

    useEffect(() => {
        api.listenForConsole()
        return () => api.cancelConsoleListener()
    }, [api])

    const [appState, setAppState] = useState(null)
    useEffect(() => {
        if (appState === null) {
            setAppState(appStateConstructor(api))
        }
    }, [appState, appStateConstructor, api])
    const invalidateAppState = () => setAppState(null)

    const callAppApi = async (callerFn) => {
        await callerFn(api)
        invalidateAppState()
    }

    return [appState, callAppApi]
}
