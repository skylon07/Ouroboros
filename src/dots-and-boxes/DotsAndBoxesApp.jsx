import AppHeader from 'shared/AppHeader'
import AppTitle from 'shared/AppTitle'
import PyFileUploader from 'shared/PyFileUploader'
import { useAppApi, useAppComponent, useAppState } from 'shared/hooks'

import DotsAndBoxesApi from './DotsAndBoxesApi'
import Game from './Game'
import driverDocs from './driverdocs.txt'

import './DotsAndBoxesApp.css'

export default function DotsAndBoxesApp() {
    const dotsAndBoxesApi = useAppApi(DotsAndBoxesApi)

    const [dotsAndBoxesState, callDotsAndBoxesApi] = useAppState(dotsAndBoxesApi, async (api) => {
        const gameState = await api.fetchGameState()
        return gameState
    })

    const [gameApp, resetDotsAndBoxesApp] = useAppComponent(dotsAndBoxesApi, dotsAndBoxesState, () => {
        return <Game state={dotsAndBoxesState} callApi={callDotsAndBoxesApi} />
    })
    
    return <div className="DotsAndBoxesApp">
        <AppHeader docRef={driverDocs} />
        <PyFileUploader
            appApi={dotsAndBoxesApi}
            onUploadComplete={resetDotsAndBoxesApp}
        />
        <AppTitle title="Dots And Boxes" />
        <br />
        {gameApp}
    </div>
}
