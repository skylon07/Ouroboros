import { useRef, useState } from 'react'

import PageButton from 'shared/PageButton'

import './PyFileUploader.css'

export default function PyFileUploader({ pageApi, onUploadStart, onUploadComplete }) {
    const fileInputRef = useRef(null)
    const activateFileInput = () => {
        fileInputRef.current.click()
    }
    
    const [filePickerText, setFilePickerText] = useState("Choose File")
    const updateButtonText = () => {
        const fileName = fileInputRef.current?.files[0]?.name || null
        if (fileName !== null) {
            setFilePickerText(`Choose File: ${fileName}`)
        } else {
            setFilePickerText(`Choose File`)
        }
    }
    
    const uploadPyFile = async () => {
        if (typeof onUploadStart === "function") {
            onUploadStart()
        }

        const fileInput = fileInputRef.current
        const pyFile = fileInput.files[0]
        await pageApi.updatePyFile(pyFile)
        fileInput.value = ""
        updateButtonText()

        if (typeof onUploadComplete === "function") {
            onUploadComplete()
        }
    }
    
    return <div className="PyFileUploader">
        <div className="PyFileUploader-Upload">
            <PageButton onClick={activateFileInput}>{filePickerText}</PageButton>
            <input type="file" ref={fileInputRef} onChange={updateButtonText} />
        </div>
        <div className="PyFileUploader-Spacer" />
        <PageButton onClick={uploadPyFile}>Upload/Execute</PageButton>
    </div>
}
