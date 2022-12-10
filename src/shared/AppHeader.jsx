import { useEffect, useRef, useState } from 'react'

import Link from 'shared/Link'
import AppButton from 'shared/AppButton'

import './AppHeader.css'

export default function AppHeader({docRef}) {
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

    return <div className="AppHeader">
        <div className="AppHeader-TopBar">
            <div className="AppHeader-HomeLink">
                <Link to="/">Back to Home</Link>
            </div>
            <div className="AppHeader-Spacer" />
            <AppButton onClick={showDoc}>Show Driver Docs</AppButton>
        </div>
        <div className={`AppHeader-DocViewer ${docVisibleClass}`}>
            <AppButton onClick={hideDoc}>✕</AppButton>
            <pre>{docText}</pre>
            <div className="AppHeader-DocViewerBottomSpacer" />
        </div>
    </div>
}
