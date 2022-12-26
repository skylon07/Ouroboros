import Board from './Board'
import Scoreboard from './Scoreboard'

import { Player } from './gamestate'

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

    const winningPlayerName = {
        [Player.PLAYER_EX]: "Player 1 (✕s)",
        [Player.PLAYER_OH]: "Player 2 (Os)",
        [null]: "Nobody",
    }[winningPlayer]

    return <div className="Game">
        <Scoreboard scores={score} turn={playerTurn} />
        <Board state={boardState} currPlayer={playerTurn} onSelectSquare={selectSquare} />
        {gameOver ?
            <div className="Game-GameOver">
                {`${winningPlayerName} won!`}
                <button onClick={resetGame}>Play again?</button>
            </div>
            :
            null
        }
    </div>
}
