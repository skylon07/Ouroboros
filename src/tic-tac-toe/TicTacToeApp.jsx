import AppHeader from 'shared/AppHeader'
import AppTitle from 'shared/AppTitle'
import PyFileUploader from 'shared/PyFileUploader'
import { useAppApi, useAppComponent, useAppState } from 'shared/hooks'

import TicTacToeApi from './TicTacToeApi'
import Game from './Game'
import driverDocs from './driverdocs.txt'

import './TicTacToeApp.css'

export default function TicTacToeApp() {
    const ticTacToeApi = useAppApi(TicTacToeApi)

    const [ticTacToeGameState, callTicTacToeApi] = useAppState(ticTacToeApi, async (api) => {
        const gameState = await api.fetchGameState()
        return gameState
    })

    const [gameApp, resetTicTacToeApp] = useAppComponent(ticTacToeApi, ticTacToeGameState, () => {
        return <Game state={ticTacToeGameState} callApi={callTicTacToeApi} />
    })
    
    return <div className="TicTacToeApp">
        <AppHeader docRef={driverDocs} />
        <PyFileUploader
            appApi={ticTacToeApi}
            onUploadComplete={resetTicTacToeApp}
        />
        <AppTitle title="Tic Tac Toe" />
        <br />
        {gameApp}
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
    </div>
}
