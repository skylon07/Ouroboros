import { useState } from 'react'

import PageHeader from 'shared/PageHeader'
import PageTitle from 'shared/PageTitle'
import PyFileUploader from 'shared/PyFileUploader'
import { usePageApi } from 'shared/hooks'

import LGameApi from './LGameApi'
import Game from './Game'
import driverDocs from './driverdocs.txt'

import './LGamePage.css'

export default function LGamePage() {
    const lGameApi = usePageApi(LGameApi)

    const [resetCount, setResetCount] = useState(0)
    const resetGame = () => setResetCount((resetCount) => resetCount + 1)
    
    return <div className="LGamePage">
        <PageHeader docRef={driverDocs} />
        <PyFileUploader
            pageApi={lGameApi}
            onUploadComplete={resetGame}
        />
        <PageTitle title="L-Game" />
        <br />
        <Game
            key={resetCount}
            onResetGame={resetGame}
            api={lGameApi}
        />
    </div>
}
