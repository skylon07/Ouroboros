import {Player} from './gamestate'

import './Board.css'

export default function Board({state, onSelectSquare}) {
    const rows = state?.map((row, rowIdx) => {
        const elements = row?.map((player, colIdx) => {
            const playerClass = {
                [Player.PLAYER_EX]: "player-ex",
                [Player.PLAYER_OH]: "player-oh",
                [null]: "",
            }[player]
            const selectSquare = () => {
                const position = {
                    row: rowIdx,
                    col: colIdx,
                }
                onSelectSquare(position)
            }
            return <div
                className={`Board-Square ${playerClass}`}
                onClick={selectSquare}
            />
        })
        return <div className="Board-Row">
            {elements}
        </div>
    })

    return <div className="Board">
        {rows}
    </div>
}
