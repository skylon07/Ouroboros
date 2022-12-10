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

export function useAppState(AppApiClass, appStateConstructor, initStateConstructor = null) {
    if (!(AppApiClass.prototype instanceof AppApi)) {
        throw new Error("useAppState() received an invalid AppApiClass")
    }
    const [api] = useState(() => new AppApiClass())

    useEffect(() => {
        api.listenForConsole()
        return () => api.cancelConsoleListener()
    }, [api])

    const appStateRef = useRef(null)
    if (appStateRef.current === null) 
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
                const newAppState = await appStateConstructor(api)
                appStateRef.current = newAppState
                setInvalidated(false)
            }
            asyncFn()
        }
    }, [invalidated, appStateConstructor, api])
    const invalidateAppState = () => setInvalidated(true)

    const callAppApi = async (asyncCallerFn) => {
        await asyncCallerFn(api)
        invalidateAppState()
    }

    return [appStateRef.current, callAppApi]
}
