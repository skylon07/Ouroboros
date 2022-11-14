import { useRef } from 'react'

import PageHeader from 'shared/PageHeader'
import { usePageApi } from 'shared/hooks'

import ConsoleApi from './ConsoleApi'

export default function ConsolePage() {
    const api = usePageApi(ConsoleApi)
    const fileInputRef = useRef(null)
    const consoleRef = useRef(null)

    const uploadPyFile = async () => {
        consoleRef.current.value = ""
        
        const pyFile = fileInputRef.current.files[0]
        await api.updatePyFile(pyFile)
        
        const messagesStr = await api.fetchMessages()
        consoleRef.current.value = messagesStr
    }

    return <div className="Console">
        <PageHeader title="Python Test Console" />
        <input type="file" ref={fileInputRef} />
        <button onClick={uploadPyFile}>Upload</button>
        <br />
        <br />
        <br />
        <textarea ref={consoleRef} />
    </div>
}
