import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

import PageHeader from 'shared/PageHeader'

export default function ConsolePage() {
    const textRef = useRef(null)
    const consoleRef = useRef(null)

    useEffect(() => {
        const logsPrinted = {}
        const interval = setInterval(async () => {
            const response = await axios.get("/console", {params: {logs: true}})
            const logs = response.data
            for (const log of logs) {
                const {id, type, message} = log
                if (!(id in logsPrinted)) {
                    console[type](message)
                    logsPrinted[id] = log
                }
            }
        }, 500)
        return () => clearInterval(interval)
    }, [])

    const runPython = async () => {
        consoleRef.current.value = ""
        
        const fileData = textRef.current.value
        await axios.post("/console", {pyfile: fileData})

        const response = await axios.get("/console/messages")
        consoleRef.current.value = response.data.messages
    }

    return <div className="Console">
        <PageHeader title="Python Test Console" />
        <textarea ref={textRef} />
        <button onClick={runPython}>Run Python</button>
        <br />
        <br />
        <textarea ref={consoleRef} />
    </div>
}
