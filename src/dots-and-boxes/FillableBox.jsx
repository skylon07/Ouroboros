// originally copied from https://github.com/skylon07/CS-260-partner/dots-and-boxes-react

import { Player } from './gamestate'

import './FillableBox.css'

/**
 * @param {{
 *      filledByPlayer: string
 * }} props 
 */
export default function FillableBox({filledByPlayer}) {
    const playerClass = filledByPlayer === Player.PLAYER_BLUE ? "blue-filled"
        : filledByPlayer === Player.PLAYER_RED ? "red-filled"
        : "unfilled"

    return <div className={`FillableBox ${playerClass}`}>
        <div className="FillableBox-Fill" />
    </div>
}