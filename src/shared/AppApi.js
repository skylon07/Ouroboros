import axios from 'axios'

import { readFile } from 'shared/files'

// TODO: rename to AppApi (and other Page -> App references)
export default class AppApi {
    constructor(apiBase) {
        if (typeof apiBase !== "string" || apiBase[0] !== "/") {
            throw new Error("An AppApi was created without a valid api base")
        }
        this._apiBase = "/ouroboros-api" + apiBase
        this._consoleListener = null
        this._pyFileListener = null
        this._printedLogs = {}
    }

    async updatePyFile(pyFile) {
        try {
            const fileDataAsStr = await readFile(pyFile)
            return await axios.post(this._apiBase, {pyfile: fileDataAsStr})
        } catch (error) {
            if (error?.message?.includes("Failed to execute 'readAsText' on 'FileReader': parameter 1 is not of type 'Blob'")) {
                throw new Error("No file selected")
            } else {
                throw error
            }
        }
    }
    
    listenForPyFileUpdated(callback) {
        if (this._pyFileListener === null) {
            let lastFileUpdated = null
            this._pyFileListener = setInterval(async () => {
                const response = await axios.get(this._apiBase)
                if (response.data !== lastFileUpdated) {
                    callback()
                    lastFileUpdated = response.data
                }
            }, 500)
        }
    }

    cancelPyFileUpdatedListener() {
        clearInterval(this._pyFileListener)
        this._pyFileListener = null
    }

    listenForConsole() {
        if (this._consoleListener === null) {
            this._consoleListener = setInterval(async () => {
                const response = await axios.get(this._apiBase, {params: {logs: true}})
                const logs = response.data
                for (const log of logs) {
                    const {id, type, message} = log
                    if (!(id in this._printedLogs)) {
                        console[type](message)
                        this._printedLogs[id] = log
                    }
                }
            }, 500);
        }
    }

    cancelConsoleListener() {
        clearInterval(this._consoleListener)
        this._consoleListener = null
    }

    async _callGetAction(actionUrl) {
        if (typeof actionUrl !== "string" || actionUrl[0] !== "/") {
            throw new Error("An AppApi attempted to call an action (get) with an invalid action url")
        }
        const response = await axios.get(`${this._apiBase}${actionUrl}`)
        return response.data
    }

    async _callPostAction(actionUrl, requestData = {}) {
        if (typeof actionUrl !== "string" || actionUrl[0] !== "/") {
            throw new Error("An AppApi attempted to call an action (post) with an invalid action url")
        }
        const response = await axios.post(`${this._apiBase}${actionUrl}`, requestData)
        return response.data
    }
}
