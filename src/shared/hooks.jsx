import { useEffect, useState } from 'react'

import AppApi from './AppApi'

export function useAppState(AppApiClass, appStateConstructor, initStateConstructor) {
    if (!(AppApiClass.prototype instanceof AppApi)) {
        throw new Error("useAppState() received an invalid AppApiClass")
    }
    const [api] = useState(() => new AppApiClass())

    useEffect(() => {
        api.listenForConsole()
        return () => api.cancelConsoleListener()
    }, [api])

    const [appState, setAppState] = useState(initStateConstructor)
    useEffect(() => {
        if (appState === null) {
            const asyncFn = async () => {
                const newAppState = await appStateConstructor(api)
                setAppState(newAppState)
            }
            asyncFn()
        }
    }, [appState, appStateConstructor, api])
    const invalidateAppState = () => setAppState(null)

    const callAppApi = async (callerFn) => {
        await callerFn(api)
        invalidateAppState()
    }

    return [appState, callAppApi]
}
