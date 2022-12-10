import { useRef, useState } from 'react'

import AppButton from 'shared/AppButton'

import './PyFileUploader.css'

export default function PyFileUploader({ appApi, onUploadStart, onUploadComplete }) {
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
        await appApi.updatePyFile(pyFile)
        fileInput.value = ""
        updateButtonText()

        if (typeof onUploadComplete === "function") {
            onUploadComplete()
        }
    }
    
    return <div className="PyFileUploader">
        <div className="PyFileUploader-Upload">
            <AppButton onClick={activateFileInput}>{filePickerText}</AppButton>
            <input type="file" ref={fileInputRef} onChange={updateButtonText} />
        </div>
        <div className="PyFileUploader-Spacer" />
        <AppButton onClick={uploadPyFile}>Upload/Execute</AppButton>
    </div>
}
