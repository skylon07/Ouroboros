// originally copied from https://github.com/skylon07/CS-260-partner/l-game-react
// (originally App.jsx)

import React, { useEffect, useReducer, useState } from 'react'

import { PlayerMoveMode, Position, PlayerPosition } from './gamestate'

import Board from './Board'
import Timer from './Timer'
import { useConstant } from './hooks'
import { usePageApi, usePlainPageApiCallback } from 'shared/hooks'

import './Game.css'

export default function Game({onResetGame, api}) {
    const [playerMoveMode, cyclePlayerMoveMode] = usePlayerMoveMode(api)
    // // ORIGINAL
    // const [playerMoveMode, cyclePlayerMoveMode] = usePlayerMoveMode(
    //     new PlayerMoveMode(PlayerMoveMode.PLAYER_BLUE, PlayerMoveMode.MODE_MOVE_PLAYER)
    // )

    const [playerPiecePositions, setActivePlayerPiecePosition] = usePlayerPiecePositions(api, playerMoveMode)
    // // ORIGINAL
    // const initPlayerPiecePositions = {
    //     bluePlayerPiecePosition: new PlayerPosition(1, 1, Position.DIR_DOWN, Position.DIR_REL_LEFT),
    //     redPlayerPiecePosition: new PlayerPosition(2, 2, Position.DIR_UP, Position.DIR_REL_LEFT)
    // }
    // const [playerPiecePositions, setActivePlayerPiecePosition] = usePlayerPiecePositions(initPlayerPiecePositions, playerMoveMode)

    const [tokenPiece1Position, tokenPiece2Position, setTokenPiece1Position, setTokenPiece2Position] = useTokenPiecePositions(api)
    // // ORIGINAL
    // const [tokenPiece1Position, setTokenPiece1Position] = useState(new Position(0, 0))
    // const [tokenPiece2Position, setTokenPiece2Position] = useState(new Position(3, 3))

    const piecePositions = {
        ...playerPiecePositions,
        tokenPiece1Position,
        tokenPiece2Position,
    }

    const [gameOver, invalidateGameOver] = useGameOverState(api)
    // // ORIGINAL
    // const [gameOver, setGameOver] = useState(false)
    // if (!gameOver && checkPlayerStuck(piecePositions, playerMoveMode)) {
    //     setGameOver(true)
    // }
    //
    // const winningPlayer = playerMoveMode.player === PlayerMoveMode.PLAYER_BLUE ? 
    //     "Player Red" : "Player Blue"

    const movePlayer = async (newPosition) => {
        if (playerMoveMode.moveMode === PlayerMoveMode.MODE_MOVE_PLAYER) {
            await setActivePlayerPiecePosition(newPosition)
            await cyclePlayerMoveMode()
            invalidateGameOver()
        }
    }

    const moveToken = async (tokenNum, newPosition) => {
        if (playerMoveMode.moveMode === PlayerMoveMode.MODE_MOVE_TOKEN) {
            const skipped = tokenNum === null
            if (skipped) {
                // pass -- don't need to do anything
            } else if (tokenNum === 1) {
                await setTokenPiece1Position(newPosition)
            } else if (tokenNum === 2) {
                await setTokenPiece2Position(newPosition)
            } else {
                throw new Error("Incorrect tokenNumber; can only move token 1 or 2")
            }
            await cyclePlayerMoveMode()
            invalidateGameOver()
        }
    }

    const [initTime] = usePlainPageApiCallback(() => api.fetchInitTime())

    const [winningPlayer, setWinningPlayer] = useState(null)
    useEffect(() => {
        if (gameOver && winningPlayer === null) {
            const asyncFn = async () => {
                const winningPlayer = await api.fetchWinningPlayer()
                setWinningPlayer(winningPlayer)
            }
            asyncFn()
        }
    }, [gameOver, winningPlayer, api])

    return (
        <div className="Game">
            {initTime !== null ?
                <Timer
                    initTime={initTime}
                    playerTurn={playerMoveMode.player}
                    onOutOfTime={async () => {
                        await api.notifyOutOfTime()
                        invalidateGameOver()
                    }}
                />
                :
                null
            }
            <Board
                api={api}
                playerMoveMode={playerMoveMode}
                piecePositions={piecePositions}
                onPlayerMove={movePlayer}
                onTokenMove={moveToken}
            />
            {winningPlayer !== null ?
                <div className="Game-GameOver">
                    {`${winningPlayer} won!`}
                    <button onClick={onResetGame}>Play again?</button>
                </div>
                :
                null
            }
        </div>
    )
}

function usePlayerMoveMode(api) {
    const [playerTurn, invalidatePlayerTurn] = usePlainPageApiCallback(() => api.fetchPlayerTurn())
    const [moveMode, invalidateMoveMode] = usePlainPageApiCallback(() => api.fetchMoveMode())
    const playerMoveMode = new PlayerMoveMode(playerTurn, moveMode)
    // // ORIGINAL
    // const [playerMoveMode, setPlayerMoveMode] = useState(initPlayerMoveMode)

    const cyclePlayerMoveMode = useConstant(() => {
        return async () => {
            await api.advanceTurnCycle()
            invalidatePlayerTurn()
            invalidateMoveMode()
            // // ORIGINAL
            // setPlayerMoveMode((playerMoveMode) => {
            //     const newPlayer = playerMoveMode.moveMode === PlayerMoveMode.MODE_MOVE_TOKEN ?
            //         PlayerMoveMode.opposite(playerMoveMode.player) : playerMoveMode.player
            //     const newMoveMode = PlayerMoveMode.opposite(playerMoveMode.moveMode)
            //     return new PlayerMoveMode(newPlayer, newMoveMode)
            // })
        }
    }, [])
    return [playerMoveMode, cyclePlayerMoveMode]
}

function usePlayerPiecePositions(api, playerMoveMode) {
    const [playerPiecePositions, invalidatePlayerPiecePositions] = usePlainPageApiCallback(() => api.fetchPlayerPieces())
    const setActivePlayerPiecePosition = async (newActivePlayerPiecePosition) => {
        await api.setActivePlayerPosition(newActivePlayerPiecePosition)
        invalidatePlayerPiecePositions()
    }
    // // ORIGINAL
    // // setting state depends on playerMoveMode.player,
    // // hence a dynamic reducer is used instead of static state setter
    // const [playerPiecePositions, setActivePlayerPiecePosition] = useReducer(
    //     (playerPiecePositions, newActivePlayerPiecePosition) => {
    //         let {bluePlayerPiecePosition, redPlayerPiecePosition} = playerPiecePositions
    //         if (playerMoveMode.player === PlayerMoveMode.PLAYER_BLUE) {
    //             bluePlayerPiecePosition = newActivePlayerPiecePosition
    //         } else {
    //             redPlayerPiecePosition = newActivePlayerPiecePosition
    //         }
    //         return {bluePlayerPiecePosition, redPlayerPiecePosition}
    //     },
    //     initPlayerPiecePositions,
    // )
    return [playerPiecePositions, setActivePlayerPiecePosition]
}

function useTokenPiecePositions(api) {
    const [tokenPositions, invalidateTokenPiecePositions] = usePlainPageApiCallback(() => api.fetchTokenPieces())
    const {tokenPiece1Position, tokenPiece2Position} = tokenPositions
    const setTokenPiece1Position = async (newPosition) => {
        await api.setTokenPiecePosition(1, newPosition)
        invalidateTokenPiecePositions()
    }
    const setTokenPiece2Position = async (newPosition) => {
        await api.setTokenPiecePosition(2, newPosition)
        invalidateTokenPiecePositions()
    }
    return [tokenPiece1Position, tokenPiece2Position, setTokenPiece1Position, setTokenPiece2Position]
}

function useGameOverState(api) {
    const [gameOver, invalidateGameOver] = usePlainPageApiCallback(() => api.fetchGameOver())
    return [gameOver, invalidateGameOver]
}

/**
 * @param {PiecePositions} piecePositions 
 * @param {PlayerMoveMode} playerMoveMode
 * @param {function} setGameOver
 * 
 * @typedef {import('./gamestate').PiecePositions} PiecePositions
 * @typedef {import('./gamestate').PlayerMoveMode} PlayerMoveMode
 */
function checkPlayerStuck(piecePositions, playerMoveMode) {
    if (playerMoveMode.moveMode === PlayerMoveMode.MODE_MOVE_TOKEN) {
        return false
    }

    for (let currRowIdx = 0; currRowIdx < 4; currRowIdx += 1) {
        for (let currColIdx = 0; currColIdx < 4; currColIdx += 1) {
            const position = new Position(currRowIdx, currColIdx)
            if (checkOpenLPath([position], piecePositions, playerMoveMode)) {
                return false
            }
        }
    }
    return true
}

/**
 * Recursively checks from a given position if there is space
 * for a player piece (disregarding the active player)
 * @param {Position} position is the current position being checked
 * @param {PiecePositions} piecePositions is the position of all pieces to check against
 * @param {PlayerMoveMode} playerMoveMode is given to indicate the active player (ie the one to ignore)
 * @param {number} forwardPaths is a count of the number of "forward paths" taken by previous invocations
 * @param {number} sidePaths is a count of the number of "sideways paths" taken by previous invocations
 */
function checkOpenLPath(positionStack, piecePositions, playerMoveMode) {
    const position = positionStack[positionStack.length - 1]
    const rowIdxInBounds = position.rowIdx >= 0 && position.rowIdx < 4
    const colIdxInBoudns = position.colIdx >= 0 && position.colIdx < 4
    const inBounds = rowIdxInBounds && colIdxInBoudns
    if (inBounds) {
        if (position.equals(piecePositions.tokenPiece1Position)) {
            return false
        }
        if (position.equals(piecePositions.tokenPiece2Position)) {
            return false
        }
        if (playerMoveMode.player !== PlayerMoveMode.PLAYER_BLUE) {
            for (const playerPosition of piecePositions.bluePlayerPiecePosition.toPositionPath()) {
                if (position.equals(playerPosition)) {
                    return false
                }
            }
        }
        if (playerMoveMode.player !== PlayerMoveMode.PLAYER_RED) {
            for (const playerPosition of piecePositions.redPlayerPiecePosition.toPositionPath()) {
                if (position.equals(playerPosition)) {
                    return false
                }
            }
        }

        let forwardPaths = 0
        let sidePaths = 0
        let lastMove = null
        for (let positionIdx = positionStack.length - 3; positionIdx < positionStack.length; positionIdx += 1) {
            const position = positionStack[positionIdx] || null
            const lastPosition = positionStack[positionIdx - 1] || null
            const currMove = Position.getAbsMoveDirection(lastPosition, position)
            const relDir = Position.getRelMoveDirection(lastMove, currMove)
            if (relDir === Position.DIR_REL_FORWARD) {
                forwardPaths += 1
            } else if (relDir === Position.DIR_REL_LEFT || relDir === Position.DIR_REL_RIGHT) {
                sidePaths += 1
            }
            lastMove = currMove
        }

        if (forwardPaths === 2 && sidePaths === 1) {
            const stackAsPlayerPosition = PlayerPosition.fromPositionPath(positionStack.slice(-4))
            const playerPosition = playerMoveMode.player === PlayerMoveMode.PLAYER_BLUE ?
                piecePositions.bluePlayerPiecePosition : piecePositions.redPlayerPiecePosition
            const pathsAreJustPlayerPosition = stackAsPlayerPosition.equals(playerPosition)
            if (!pathsAreJustPlayerPosition) {
                return true
            }
        }

        const applyDirs = [
            Position.DIR_LEFT,
            Position.DIR_RIGHT,
            Position.DIR_UP,
            Position.DIR_DOWN,
        ]
        for (const dir of applyDirs) {
            const newPosition = Position.applyAbsDir(position, dir)
            const alreadyUsedPosition = positionStack.reduce(
                (used, position) => used || position.equals(newPosition),
                false,
            )
            if (!alreadyUsedPosition) {
                const newPositionStack = positionStack.concat([newPosition])
                const foundPath = checkOpenLPath(
                    newPositionStack,
                    piecePositions,
                    playerMoveMode,
                    forwardPaths,
                    sidePaths,
                )
                if (foundPath) {
                    return true
                }
            }
        }
        return false
    } else {
        return false
    }
}
