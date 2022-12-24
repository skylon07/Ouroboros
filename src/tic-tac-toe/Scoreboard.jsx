import { Player } from './gamestate'

import './Scoreboard.css'

export default function Scoreboard({scores, turn}) {
    const playerExTurnClass = turn === Player.PLAYER_EX ? "active-player" : ""
    const playerOhTurnClass = turn === Player.PLAYER_OH ? "active-player" : ""

    return <div className="Scoreboard">
        <div className="Scoreboard-Spacer" />
        <div className="Scoreboard-Spacer" />
        <div className="Scoreboard-Spacer" />
        <div className="Scoreboard-Spacer" />
        <div className="Scoreboard-Spacer" />
        <div className="Scoreboard-Spacer" />
        <div className="Scoreboard-Spacer" />
        <div className={`Scoreboard-Player player-ex ${playerExTurnClass}`}>✕</div>
        <div className="Scoreboard-Spacer" />
        <div className="Scoreboard-Score player-ex">{scores[Player.PLAYER_EX]}</div>
        <div className="Scoreboard-Spacer" />
        <div className="Scoreboard-Spacer" />
        <div className="Scoreboard-Score player-oh">{scores[Player.PLAYER_OH]}</div>
        <div className="Scoreboard-Spacer" />
        <div className={`Scoreboard-Player player-oh ${playerOhTurnClass}`}>O</div>
        <div className="Scoreboard-Spacer" />
        <div className="Scoreboard-Spacer" />
        <div className="Scoreboard-Spacer" />
        <div className="Scoreboard-Spacer" />
        <div className="Scoreboard-Spacer" />
        <div className="Scoreboard-Spacer" />
        <div className="Scoreboard-Spacer" />
    </div>
}
