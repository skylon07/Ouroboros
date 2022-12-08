import { Link as RLink } from 'react-router-dom'

import './Link.css'

export default function Link({to, children}) {
    return <div className="Link">
        <RLink to={to}>{children}</RLink>
    </div>
}
