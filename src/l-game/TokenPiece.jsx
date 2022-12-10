// originally copied from https://github.com/skylon07/CS-260-partner/l-game-react

import { Position } from "./gamestate"

import './TokenPiece.css'
import React from "react"
import { MouseControlledSection } from "./selectables"

/**
 * 
 * @param {{
 *      position: Position,
 *      isPickedUp: boolean,
 *      mouseHandler: MouseController.MouseHandler,
 * }} props
 * 
 * @typedef {import('./gamestate').Position} Position
 */
export default function TokenPiece({position, isPickedUp, mouseHandler}) {
    if (!(position instanceof Position) && position !== null) {
        throw new TypeError("TokenPiece must be given a position: Position prop")
    }

    const offsetRow = position !== null ? position.rowIdx : -999
    const offsetCol = position !== null ? position.colIdx : -999
    const offsetYCss = `calc(${offsetRow} * var(--l-game--TokenPiece-size) + var(--l-game--TokenPiece-indent))`
    const offsetXCss = `calc(${offsetCol} * var(--l-game--TokenPiece-size) + var(--l-game--TokenPiece-indent))`

    const style = {
        top: offsetYCss,
        left: offsetXCss,
    }

    const pickedUpClass = isPickedUp ? "pickedUp" : ""

    return (
        <div className={`TokenPiece ${pickedUpClass}`} style={style}>
            <MouseControlledSection mouseHandler={mouseHandler}>
                <div className="TokenPiece-Circle" />
            </MouseControlledSection>
        </div>
    )
}
