import PageApi from 'shared/PageApi'

export default class LGameApi extends PageApi {
    constructor() {
        super('/l-game')
    }

    async fetchPlayerTurn() {
        // TODO
    }

    async fetchMoveMode() {
        // TODO
    }

    async advanceTurnCycle() {
        // TODO
    }

    async fetchPlayerPieces() {
        // TODO
    }

    async setActivePlayerPosition(newPosition) {
        // TODO
    }

    async fetchTokenPieces() {
        // TODO
    }

    async setTokenPiecePosition(tokenNum, newPosition) {
        // TODO
    }

    async fetchGameOver() {
        // TODO
    }

    async recalculateGameOver() {
        // TODO
    }

    async notifyOutOfTime() {
        // TODO
    }

    async fetchWinningPlayer() {
        // TODO
    }
}
