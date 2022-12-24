import { Player } from './gamestate'

import './Scoreboard.css'

export default function Scoreboard({scores, turn}) {
    const playerExTurnClass = turn === Player.PLAYER_EX ? "active-player" : ""
    const playerOhTurnClass = turn === Player.PLAYER_OH ? "active-player" : ""

    return <div className="Scoreboard">
        <div className="Scoreboard-Spacer" />
        <div className="Scoreboard-Spacer" />
        <h3 className={`Scoreboard-Player player-ex ${playerExTurnClass}`}>✕</h3>
        <h2 className="Scoreboard-Score player-ex">{scores[Player.PLAYER_EX]}</h2>
        <div className="Scoreboard-Spacer" />
        <h2 className="Scoreboard-Score player-oh">{scores[Player.PLAYER_OH]}</h2>
        <h3 className={`Scoreboard-Player player-oh ${playerOhTurnClass}`}>O</h3>
        <div className="Scoreboard-Spacer" />
        <div className="Scoreboard-Spacer" />
    </div>
}
