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

    useEffect(() => {
        const interval = setInterval(invalidateAppState, 300)
        return () => clearInterval(interval)
    }, [invalidateAppState])

    const callAppApi = useCallback(async (asyncCallerFn) => {
        if (typeof asyncCallerFn === "function") {
            await asyncCallerFn(appApi)
        }
        invalidateAppState()
    }, [appApi, invalidateAppState])

    return [appStateRef.current, callAppApi]
}

export function useAppComponent(appApi, appState, componentFactory) {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        if (!isMounted && appState !== null) {
            setIsMounted(true)
        }
    }, [isMounted, appState])

    const resetComponent = useCallback(() => setIsMounted(false), [])
    
    useEffect(() => {
        appApi.listenForPyFileUpdated(resetComponent)
        return () => appApi.cancelPyFileUpdatedListener()
    }, [appApi, resetComponent])

    const shouldRender = isMounted && appState !== null
    const component = shouldRender ? componentFactory() : null

    return [component, resetComponent]
}
