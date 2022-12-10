import { useState } from 'react'

import AppHeader from 'shared/AppHeader'
import AppTitle from 'shared/AppTitle'
import PyFileUploader from 'shared/PyFileUploader'
import { useAppApi } from 'shared/hooks'

import LGameApi from './LGameApi'
import Game from './Game'
import driverDocs from './driverdocs.txt'

import './LGameApp.css'

export default function LGameApp() {
    const lGameApi = useAppApi(LGameApi)

    const [resetCount, setResetCount] = useState(0)
    const resetGame = () => setResetCount((resetCount) => resetCount + 1)
    
    return <div className="LGameApp">
        <AppHeader docRef={driverDocs} />
        <PyFileUploader
            appApi={lGameApi}
            onUploadComplete={resetGame}
        />
        <AppTitle title="L-Game" />
        <br />
        <Game
            key={resetCount}
            onResetGame={resetGame}
            api={lGameApi}
        />
    </div>
}
