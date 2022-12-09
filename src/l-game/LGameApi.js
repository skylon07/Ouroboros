import PageApi from 'shared/PageApi'

import { PlayerPosition, Position } from './gamestate'

export default class LGameApi extends PageApi {
    constructor() {
        super('/l-game')
    }

    async fetchPlayerTurn() {
        const response = await this._callGetAction('/turn/player')
        return response.player
    }

    async fetchMoveMode() {
        const response = await this._callGetAction('/turn/mode')
        return response.mode
    }

    async advanceTurnCycle() {
        await this._callPostAction('/turn', {})
    }

    async fetchPlayerPieces() {
        const {bluePositionPath, redPositionPath} = await this._callGetAction('/pieces/players')
        return {
            bluePlayerPiecePosition: PlayerPosition.fromPositionPath(
                bluePositionPath.map((positionRep) => 
                    new Position(positionRep.row, positionRep.col)
                )
            ),
            redPlayerPiecePosition: PlayerPosition.fromPositionPath(
                redPositionPath.map((positionRep) => 
                    new Position(positionRep.row, positionRep.col)
                )
            ),
        }
    }

    async setActivePlayerPosition(newPosition) {
        await this._callPostAction('/pieces/activeplayer', {
            positionPath: newPosition.toPositionPath().map((position) => {
                return {
                    row: position.rowIdx,
                    col: position.colIdx,
                }
            })
        })
    }

    async fetchTokenPieces() {
        const {token1Position, token2Position} = await this._callGetAction('/pieces/tokens')
        return {
            tokenPiece1Position: new Position(token1Position.row, token1Position.col),
            tokenPiece2Position: new Position(token2Position.row, token2Position.col),
        }
    }

    async setTokenPiecePosition(tokenNum, newPosition) {
        await this._callPostAction('/pieces/token', {
            id: tokenNum,
            position: {
                row: newPosition.rowIdx,
                col: newPosition.colIdx,
            },
        })
    }

    async fetchGameOver() {
        const response = await this._callGetAction('/game-over')
        return response.isGameOver
    }

    async notifyOutOfTime() {
        await this._callPostAction('/turn/out-of-time', {})
    }

    async fetchWinningPlayer() {
        const response = await this._callGetAction('/game-over/winner')
        return response.player
    }
}
