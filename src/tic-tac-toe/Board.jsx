import {Player} from './gamestate'

import './Board.css'

export default function Board({state, currPlayer, onSelectSquare}) {
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
            const svg = {
                [Player.PLAYER_EX]:
                    <svg viewBox="0 0 100 100" className="cross">
                        <line x1="20" y1="20" x2="80" y2="80"></line>
                        <line x1="80" y1="20" x2="20" y2="80"></line>
                    </svg>,
                [Player.PLAYER_OH]:
                    <svg viewBox="0 0 100 100" className="circle">
                        <circle cx="50" cy="50" r="35"></circle>
                    </svg>,
            }[player]
            return <div
                key={`${rowIdx},${colIdx}`}
                className={`Board-Square ${playerClass}`}
                onClick={selectSquare}
            >
                {svg}
            </div>
        })
        return <div key={rowIdx} className="Board-Row">
            {elements}
        </div>
    })

    const playerTurnClass = {
        [Player.PLAYER_EX]: "player-ex",
        [Player.PLAYER_OH]: "player-oh",
    }[currPlayer] || ""

    return <div className={`Board ${playerTurnClass}`}>
        {rows}
    </div>
}
