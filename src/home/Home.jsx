import { useRef } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

export default function Home() {
    const inputRef = useRef(null)
    const dataInputRef = useRef(null)
    
    const callAxiosGet = async () => {
        const axiosUrl = inputRef.current.value
        const axiosData = dataInputRef.current.value
        const response = await axios.get(axiosUrl, axiosData)
        console.log(`GET: ${response.data}`)
    }

    const callAxiosPost = async () => {
        const axiosUrl = inputRef.current.value
        const axiosData = dataInputRef.current.value
        const response = await axios.post(axiosUrl, axiosData)
        console.log(`POST: ${response.data}`)
    }

    return <div className="Home">
        <input ref={inputRef} defaultValue="http://localhost:3001" />
        <input ref={dataInputRef} defaultValue="DATA" />
        <button onClick={callAxiosGet}>GET</button>
        <button onClick={callAxiosPost}>POST</button>
    </div>
}