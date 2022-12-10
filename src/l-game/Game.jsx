// originally copied from https://github.com/skylon07/CS-260-partner/l-game-react
// (originally App.jsx)

import { PlayerMoveMode } from './gamestate'

import Board from './Board'
import Timer from './Timer'

import './Game.css'

export default function Game({state, callApi}) {
    const {
        playerMoveMode,
        bluePlayerPiecePosition,
        redPlayerPiecePosition,
        tokenPiece1Position,
        tokenPiece2Position,
        gameOver,
        winningPlayer,
    } = state

    const movePlayer = async (newPlayerPosition) => {
        if (playerMoveMode.moveMode === PlayerMoveMode.MODE_MOVE_PLAYER) {
            await callApi(async (api) => {
                await api.setActivePlayerPosition(newPlayerPosition)
            })
        }
    }

    const moveToken = async (tokenNum, newPosition) => {
        if (playerMoveMode.moveMode === PlayerMoveMode.MODE_MOVE_TOKEN) {
            await callApi(async (api) => {
                await api.setTokenPiecePosition(tokenNum, newPosition)
            })
        }
    }

    const resetGame = async () => {
        await callApi(async (api) => {
            await api.resetGame()
        })
    }

    const piecePositions = {
        bluePlayerPiecePosition,
        redPlayerPiecePosition,
        tokenPiece1Position,
        tokenPiece2Position,
    }

    return <div className="Game">
        <Timer
            playerTurn={playerMoveMode.player}
        />
        <Board
            playerMoveMode={playerMoveMode}
            piecePositions={piecePositions}
            onPlayerMove={movePlayer}
            onTokenMove={moveToken}
        />
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
