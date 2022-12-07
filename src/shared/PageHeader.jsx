import { useEffect, useRef, useState } from 'react'

import Link from 'shared/Link'

import './PageHeader.css'

export default function PageHeader({docRef}) {
    const [docShown, setDocShown] = useState(false)
    const showDoc = () => setDocShown(true)
    const hideDoc = () => setDocShown(false)

    const [docText, setDocText] = useState(null)
    const docTextReadRef = useRef(false)
    useEffect(() => {
        if (!docTextReadRef.current) {
            const asyncFn = async () => {
                const docFileResponse = await fetch(docRef)
                const docText = await docFileResponse.text()
                setDocText(docText)
            }
            asyncFn()
            docTextReadRef.current = true
        }
    })

    const docVisibleClass = docShown ? "" : "hidden"

    return <div className="PageHeader">
        <div className="PageHeader-TopBar">
            <Link to="/">Back to Home</Link>
            <div className="PageHeader-Spacer" />
            <button onClick={showDoc}>Show Driver Docs</button>
        </div>
        <div className={`PageHeader-DocViewer ${docVisibleClass}`}>
            <button onClick={hideDoc}>✕</button>
            <pre>{docText}</pre>
        </div>
    </div>
}