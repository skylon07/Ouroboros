import './AppButton.css'

export default function AppButton({onClick, children}) {
    return <button
        className="AppButton"
        onClick={onClick}
    >
        {children}
    </button>
}
