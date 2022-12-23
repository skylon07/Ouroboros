// originally copied from https://github.com/skylon07/CS-260-partner/dots-and-boxes-react

import './Dot.css'

/**
 * @param {{
 *      filled: boolean
 * }} props
 */
export default function Dot({filled}) {
    const filledClass = filled ? "filled" : ""
    return <div className={`Dot ${filledClass}`} />
}
