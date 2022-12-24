import AppApi from 'shared/AppApi'

export default class TicTacToeApi extends AppApi {
    constructor() {
        super('/tic-tac-toe')
    }

    async fetchGameState() {
        const response = await this._callGetAction('/game-state')
        const {
            playerTurn,
            score,
            boardState,
            gameOver,
            winningPlayer,
        } = response
        return {
            playerTurn,
            score,
            boardState,
            gameOver,
            winningPlayer,
        }
    }

    async selectSquare(position) {
        await this._callPostAction('/square-select', {position})
    }

    async resetGame() {
        await this._callPostAction('/reset')
    }
}
