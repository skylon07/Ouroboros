import { useRef } from 'react'

export default function PyFileUploader({ pageApi, onUploadStart, onUploadComplete }) {
    const fileInputRef = useRef(null)
    
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
        <input type="file" ref={fileInputRef} />
        <button onClick={uploadPyFile}>Upload/Execute</button>
    </div>
}
