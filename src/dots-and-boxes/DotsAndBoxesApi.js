import AppApi from 'shared/AppApi'

export default class DotsAndBoxesApi extends AppApi {
    constructor() {
        super('/dots-and-boxes')
    }

    async fetchGameState() {
        const response = await this._callGetAction('/game-state')
        const {
            playerTurn,
            boardState,
            gameOver,
            winningPlayer,
            menuState,
            menuData
        } = response
        return {
            
        }
    }

    async selectBoardLine(elementRow, elementCol) {
        await this._callPostAction('/line-select', {
            elementRow,
            elementCol,
        })
    }

    async updateBoard(boardShape) {
        await this._callPostAction('/board', {
            boardShape,
        })
    }

    async recordNewBoard(newBoardShape) {
        await this._callPostAction('/new-board', {
            newBoardShape,
        })
    }

    async resetGame() {
        await this._callPostAction('/reset')
    }

    async activateEditor() {
        await this._callPostAction('/editor-activate')
    }

    async activateBoardSelector() {
        await this._callPostAction('/selector-activate')
    }

    async cancelMenu() {
        await this._callPostAction('/menu-cancel')
    }

    async submitMenu(menuData) {
        await this._callPostAction('/menu-submit', {
            menuData,
        })
    }
}