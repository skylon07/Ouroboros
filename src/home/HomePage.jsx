import { Link } from 'react-router-dom'

export default function HomePage() {
    return <div className="HomePage">
        <h1>Home</h1>
        <ul>
            <li><Link to="/console">Echo Console</Link></li>
        </ul>
    </div>
}