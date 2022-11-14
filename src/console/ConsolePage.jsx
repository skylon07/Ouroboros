import { useRef } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

import PageHeader from 'shared/PageHeader'

export default function ConsolePage() {
    const textRef = useRef(null)
    const consoleRef = useRef(null)

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
