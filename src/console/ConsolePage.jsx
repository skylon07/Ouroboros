import { useState } from 'react'

import PageHeader from 'shared/PageHeader'
import PageTitle from 'shared/PageTitle'
import PyFileUploader from 'shared/PyFileUploader'
import { usePageApi } from 'shared/hooks'

import ConsoleApi from './ConsoleApi'
import driverDocs from './driverdocs.txt'

import './ConsolePage.css'

export default function ConsolePage() {
    const consoleApi = usePageApi(ConsoleApi)
    
    const [consoleMessages, setConsoleMessages] = useState("")

    const resetConsole = () => setConsoleMessages("")
    const getConsoleMessages = async () => {
        const messages = await consoleApi.fetchMessages()
        setConsoleMessages(messages)
    }

    return <div className="ConsolePage">
        <PageHeader docRef={driverDocs} />
        <PyFileUploader
            pageApi={consoleApi}
            onUploadStart={resetConsole}
            onUploadComplete={getConsoleMessages}
        />
        <PageTitle   title="Python Test Console" />
        <br />
        <br />
        <br />
        <textarea value={consoleMessages} readOnly />
    </div>
}
