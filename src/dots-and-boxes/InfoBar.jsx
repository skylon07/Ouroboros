// originally copied from https://github.com/skylon07/CS-260-partner/dots-and-boxes-react

import { useRef } from 'react'

import { Player } from './gamestate'

import './InfoBar.css'

/**
 * @param {{
 *      currPlayer: string,
 *      playerBlueScore: number,
 *      playerRedScore: number,
 *      onPlayerNameChange: function,
 * }} props 
 */
export default function InfoBar({currPlayer, playerBlueScore, playerRedScore, onPlayerNameChange}) {
    const blueTurnClass = currPlayer === Player.PLAYER_BLUE ? "active" : ""
    const redTurnClass = currPlayer === Player.PLAYER_RED ? "active" : ""

    const blueNameRef = useRef("Player Blue")
    const redNameRef = useRef("Player Red")
    
    const onBlueNameChange = (event) => {
        if (typeof onPlayerNameChange === "function") {
            const newName = event.target.value
            const didChange = blueNameRef.current !== newName
            if (didChange) {
                onPlayerNameChange(Player.PLAYER_BLUE, newName)
            }
        }
    }
    const onRedNameChange = (event) => {
        if (typeof onPlayerNameChange === "function") {
            const newName = event.target.value
            const didChange = redNameRef.current !== newName
            if (didChange) {
                onPlayerNameChange(Player.PLAYER_RED, newName)
            }
        }
    }

    return <div className="InfoBar">
        <input
            className="InfoBar-Player player-blue"
            contentEditable={!!onPlayerNameChange}
            onBlur={onBlueNameChange}
            defaultValue={blueNameRef.current}
        />
        <h2 className="InfoBar-Score player-blue">{playerBlueScore}</h2>
        <div className={`InfoBar-Turn player-blue ${blueTurnClass}`} />
        <div className={`InfoBar-Turn player-red ${redTurnClass}`} />
        <h2 className="InfoBar-Score player-red">{playerRedScore}</h2>
        <input
            className="InfoBar-Player player-red"
            contentEditable={!!onPlayerNameChange}
            onBlur={onRedNameChange}
            defaultValue={redNameRef.current}
        />
    </div>
}