import { Link } from "react-router-dom"

export default function PageHeader({title}) {
    return <div className="PageHeader">
        <Link to="/">Back to Home</Link>
        <h1>{title}</h1>
    </div>
}