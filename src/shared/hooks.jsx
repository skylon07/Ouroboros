import { useEffect, useRef, useState, useCallback } from 'react'

import AppApi from './AppApi'

export function useAppApi(AppApiClass) {
    const [appApi] = useState(() => new AppApiClass())
    if (!(appApi instanceof AppApi)) {
        throw new Error("useAppApi() received an invalid appApi instance")
    }
    
    useEffect(() => {
        appApi.listenForConsole()
        return () => appApi.cancelConsoleListener()
    }, [appApi])

    return appApi
}

export function useAppState(appApi, appStateConstructor, initStateConstructor = null) {
    if (!(appApi instanceof AppApi)) {
        throw new Error("useAppState() received an invalid appApi instance")
    }

    const appStateRef = useRef(null)
    if (appStateRef.current === null) {
        if (typeof initStateConstructor === "function") {
            appStateRef.current = initStateConstructor()
        } else {
            appStateRef.current = initStateConstructor
        }
    }
    const [invalidated, setInvalidated] = useState(true)
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
    const invalidateAppState = useCallback(() => setInvalidated(true), [])

    const callAppApi = useCallback(async (asyncCallerFn) => {
        if (typeof asyncCallerFn === "function") {
            await asyncCallerFn(appApi)
        }
        invalidateAppState()
    }, [appApi, invalidateAppState])

    return [appStateRef.current, callAppApi]
}

export function useAppComponent(appState, componentFactory) {
    const [component, setComponent] = useState(null)
    const mountComponent = useCallback(() => setComponent(componentFactory()), [componentFactory])

    useEffect(() => {
        if (component === null && appState !== null) {
            mountComponent()
        }
    }, [appState, component, mountComponent])

    const resetComponent = useCallback(() => setComponent(null), [])

    return [
        appState !== null ? component : null,
        resetComponent
    ]
}
