import { useEffect, useRef, useState } from 'react'

import AppApi from './AppApi'

export function useAppApi(appApiFactory) {
    const [appApi] = useState(appApiFactory)
    
    useEffect(() => {
        appApi.listenForConsole()
        return () => appApi.cancelConsoleListener()
    }, [appApi])

    return appApi
}

export function useAppState(appApi, appStateConstructor, initStateConstructor = null) {
    if (!(appApi instanceof AppApi)) {
        throw new Error("useAppState() received an invalid AppApiClass")
    }

    const appStateRef = useRef(null)
    if (appStateRef.current === null) {
        if (typeof initStateConstructor === "function") {
            appStateRef.current = initStateConstructor()
        } else {
            appStateRef.current = initStateConstructor
        }
    }
    const [invalidated, setInvalidated] = useState(false)
    useEffect(() => {
        if (invalidated) {
            const asyncFn = async () => {
                const newAppState = await appStateConstructor(appApi)
                appStateRef.current = newAppState
                setInvalidated(false)
            }
            asyncFn()
        }
    }, [invalidated, appStateConstructor, appApi])
    const invalidateAppState = () => setInvalidated(true)

    const callAppApi = async (asyncCallerFn) => {
        await asyncCallerFn(appApi)
        invalidateAppState()
    }

    return [appStateRef.current, callAppApi]
}
