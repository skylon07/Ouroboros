import { useRef, useState } from 'react'

import './PyFileUploader.css'

export default function PyFileUploader({ pageApi, onUploadStart, onUploadComplete }) {
    const fileInputRef = useRef(null)
    const activateFileInput = () => {
        fileInputRef.current.click()
    }
    
    const [filePickerText, setFilePickerText] = useState("Choose File")
    const updateButtonText = () => {
        setFilePickerText(`Choose File: ${fileInputRef.current.files[0].name}`)
    }
    
    const uploadPyFile = async () => {
        if (typeof onUploadStart === "function") {
            onUploadStart()
        }

        const fileInput = fileInputRef.current
        const pyFile = fileInput.files[0]
        await pageApi.updatePyFile(pyFile)
        fileInput.value = ""

        if (typeof onUploadComplete === "function") {
            onUploadComplete()
        }
    }
    
    return <div className="PyFileUploader">
        <div className="PyFileUploader-Upload">
            <button onClick={activateFileInput}>{filePickerText}</button>
            <input type="file" ref={fileInputRef} onChange={updateButtonText} />
        </div>
        <div className="PyFileUploader-Spacer" />
        <button onClick={uploadPyFile}>Upload/Execute</button>
    </div>
}
