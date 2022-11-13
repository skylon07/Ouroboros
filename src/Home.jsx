import { Link } from 'react-router-dom'

export default function Home() {
    return <>
        <h1>Welcome Home!</h1>
        <Link to="/about">About</Link>
    </>
}