import { useState } from 'react'

import AppHeader from 'shared/AppHeader'
import AppTitle from 'shared/AppTitle'
import PyFileUploader from 'shared/PyFileUploader'
import { useAppApi } from 'shared/hooks'

import ConsoleApi from './ConsoleApi'
import driverDocs from './driverdocs.txt'

import './ConsoleApp.css'

export default function ConsoleApp() {
    const consoleApi = useAppApi(ConsoleApi)
    
    const [consoleMessages, setConsoleMessages] = useState("")

    const resetConsole = () => setConsoleMessages("")
    const getConsoleMessages = async () => {
        const messages = await consoleApi.fetchMessages()
        setConsoleMessages(messages)
    }

    return <div className="ConsoleApp">
        <AppHeader docRef={driverDocs} />
        <PyFileUploader
            appApi={consoleApi}
            onUploadStart={resetConsole}
            onUploadComplete={getConsoleMessages}
        />
        <AppTitle title="Echo Console" />
        <br />
        <textarea value={consoleMessages} readOnly />
    </div>
}
