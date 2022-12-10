import AppHeader from 'shared/AppHeader'
import AppTitle from 'shared/AppTitle'
import PyFileUploader from 'shared/PyFileUploader'
import { useAppApi, useAppComponent, useAppState } from 'shared/hooks'

import ConsoleApi from './ConsoleApi'
import driverDocs from './driverdocs.txt'

import './ConsoleApp.css'

export default function ConsoleApp() {
    const consoleApi = useAppApi(ConsoleApi)

    const [consoleState, callConsoleApi] = useAppState(consoleApi, async (api) => {
        const futureMessages = api.fetchMessages()
        return {
            messages: await futureMessages,
        }
    })

    let [consoleApp, resetConsoleApp] = useAppComponent(consoleState, () => {
        return <Console state={consoleState} callApi={callConsoleApi} />
    })

    return <div className="ConsoleApp">
        <AppHeader docRef={driverDocs} />
        <PyFileUploader
            appApi={consoleApi}
            onUploadStart={resetConsoleApp}
            onUploadComplete={callConsoleApi}
        />
        <AppTitle title="Echo Console" />
        <br />
        {consoleApp}
    </div>
}

function Console({state, callApi}) {
    return <div className="Console">
        <textarea value={state.messages} readOnly />
    </div>
}
