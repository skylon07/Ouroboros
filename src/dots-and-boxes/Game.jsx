// originally copied from https://github.com/skylon07/CS-260-partner/dots-and-boxes-react
// (originally App.jsx)

import { DotsAndBoxesGame, Player } from "./gamestate"
import FillArray from './FillArray'

import Board from './Board'
import InfoBar from "./InfoBar"

import './Game.css'

export default function Game({state, callApi}) {
    const {
        playerTurn,
        boardState,
        gameOver,
        winningPlayer,
        menuState,
        menuData
    } = state

    const resetGame = async () => {
        await callApi(async (api) => {
            await api.resetGame()
        })
    }

    const updateBoardShape = async (newBoardShape) => {
        await callApi(async (api) => {
            await api.updateBoard(newBoardShape)
        })
    }
    
    const recordNewBoard = async (newBoardShape) => {
        await callApi(async (api) => {
            await api.recordNewBoard(newBoardShape)
        })
    }

    const activateEditor = async () => {
        await callApi(async (api) => {
            await api.activateEditor()
        })
    }

    const activateBoardSelector = async () => {
        await callApi(async (api) => {
            await api.activateBoardSelector()
        })
    }

    const editorElem = null // TODO

    const boardSelectorElem = null // TODO

    const showPlayerTurn = !gameOver

    return <div className="Game">
        {renderGameOver(gameOver, winningPlayer, resetGame)}
        <button
            className="ResettableApp-EditorButton"
            onClick={activateEditor}
        >
            Editor
        </button>
        {editorElem}
        <button
            className="ResettableApp-SelectBoardButton"
            onClick={activateBoardSelector}
        >
            Select
        </button>
        {boardSelectorElem}
        <InfoBar
            currPlayer={showPlayerTurn && playerTurn}
            playerBlueScore=""
            playerRedScore=""
        />
        <Board
            currPlayerTurn={playerTurn}
        />
    </div>
}

function renderGameOver(gameFinished, winningPlayer, resetGame) {
    if (gameFinished) {
        const winningPlayerMessage = winningPlayer === Player.PLAYER_BLUE ?
            "Player Blue won!" : winningPlayer === Player.PLAYER_RED ?
            "Player Red won!" : "It's a tie!"
        return <div className="Game-Modal gameover">
            {`${winningPlayerMessage}`}
            <div className="Game-Modal-Spacer" />
            <button onClick={resetGame}>Play again?</button>
        </div>
    } else {
        return null
    }
}
