import AppHeader from 'shared/AppHeader'
import AppTitle from 'shared/AppTitle'
import PyFileUploader from 'shared/PyFileUploader'
import { useAppApi, useAppComponent, useAppState } from 'shared/hooks'

import LGameApi from './LGameApi'
import Game from './Game'
import driverDocs from './driverdocs.txt'

import './LGameApp.css'

export default function LGameApp() {
    const lGameApi = useAppApi(LGameApi)

    const [lGameState, callLGameApi] = useAppState(lGameApi, async (api) => {
        const gameState = await api.fetchGameState()
        return gameState
    })

    const [gameApp, resetConsoleApp] = useAppComponent(lGameApi, lGameState, () => {
        return <Game state={lGameState} callApi={callLGameApi} />
    })
    
    return <div className="LGameApp">
        <AppHeader docRef={driverDocs} />
        <PyFileUploader
            appApi={lGameApi}
            onUploadComplete={resetConsoleApp}
        />
        <AppTitle title="L-Game" />
        <br />
        {gameApp}
    </div>
}
