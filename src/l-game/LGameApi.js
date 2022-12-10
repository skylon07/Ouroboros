import AppApi from 'shared/AppApi'

import { PlayerMoveMode, PlayerPosition, Position } from './gamestate'

export default class LGameApi extends AppApi {
    constructor() {
        super('/l-game')
    }

    async fetchGameState() {
        const response = await this._callGetAction('/game-state')
        const {
            playerTurn,
            moveMode,
            bluePositionPath,
            redPositionPath,
            token1Position,
            token2Position,
            gameOver,
            winningPlayer,
        } = response
        return {
            playerMoveMode: new PlayerMoveMode(playerTurn, moveMode),
            bluePlayerPiecePosition: bluePositionPath !== null ? 
                PlayerPosition.fromPositionPath(
                    bluePositionPath.map((positionRep) => 
                        new Position(positionRep.row, positionRep.col)
                    )
                )
                :
                null,
            redPlayerPiecePosition: redPositionPath !== null ? 
                PlayerPosition.fromPositionPath(
                    redPositionPath.map((positionRep) => 
                        new Position(positionRep.row, positionRep.col)
                    )
                )
                :
                null,
            tokenPiece1Position: token1Position !== null ?
                new Position(token1Position.row, token1Position.col) : null,
            tokenPiece2Position: token2Position !== null ?
                new Position(token2Position.row, token2Position.col) : null,
            gameOver,
            winningPlayer,
        }
    }

    async setActivePlayerPosition(newPlayerPosition) {
        await this._callPostAction('/player-position', {
            positionPath: newPlayerPosition.toPositionPath().map((position) => {
                return {
                    row: position.rowIdx,
                    col: position.colIdx,
                }
            })
        })
    }

    async setTokenPiecePosition(tokenNum, newPosition) {
        await this._callPostAction('/token-position', {
            id: tokenNum,
            position: {
                row: newPosition.rowIdx,
                col: newPosition.colIdx,
            },
        })
    }

    async resetGame() {
        await this._callPostAction('/reset')
    }
}
