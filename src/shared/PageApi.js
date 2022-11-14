import axios from 'axios'

import { readFile } from 'shared/files'

export default class PageApi {
    constructor(apiBase) {
        if (typeof apiBase !== "string" || apiBase[0] !== "/") {
            throw new Error("A PageApi was created without a valid api base")
        }
        this._apiBase = apiBase
        this._consoleListener = null
        this._printedLogs = {}
    }

    async updatePyFile(pyFile) {
        const fileDataAsStr = await readFile(pyFile)
        return await axios.post(this._apiBase, {pyfile: fileDataAsStr})
    }

    listenForConsole() {
        if (this._consoleListener == null) {
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
            throw new Error("A PageApi attempted to call an action (get) with an invalid action url")
        }
        const response = await axios.get(`${this._apiBase}${actionUrl}`)
        return response.data
    }

    async _callPostAction(actionUrl, requestData) {
        if (typeof actionUrl !== "string" || actionUrl[0] !== "/") {
            throw new Error("A PageApi attempted to call an action (post) with an invalid action url")
        }
        const response = await axios.post(`${this._apiBase}${actionUrl}`, requestData)
        return response.data
    }
}
