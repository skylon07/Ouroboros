import Board from './Board'
import Scoreboard from './Scoreboard'

import './Game.css'

export default function Game({state, callApi}) {
    const {
        playerTurn,
        score,
        boardState,
        gameOver,
        winningPlayer
    } = state

    const selectSquare = async (position) => {
        await callApi(async (api) => {
            await api.selectSquare(position)
        })
    }

    const resetGame = async () => {
        await callApi(async (api) => {
            await api.resetGame()
        })
    }

    return <div className="Game">
        <Scoreboard scores={score} turn={playerTurn} />
        <Board state={boardState} currPlayer={playerTurn} onSelectSquare={selectSquare} />
        {gameOver ?
            <div className="Game-GameOver">
                {`${winningPlayer} won!`}
                <button onClick={resetGame}>Play again?</button>
            </div>
            :
            null
        }
    </div>
}
