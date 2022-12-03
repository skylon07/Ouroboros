import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import reportWebVitals from './reportWebVitals'
import axios from 'axios'

import HomePage from 'home/HomePage'
import ConsolePage from 'console/ConsolePage'

import './index.css'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
    <React.StrictMode>
        <BrowserRouter basename='/ouroboros'>
            <Routes>
                <Route
                    path='/'
                    element={<HomePage />}
                />
                <Route
                    path='/console'
                    element={<ConsolePage />}
                />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()

const {protocol, hostname} = window.location
const serverPort = 30167
axios.defaults.baseURL = `${protocol}//${hostname}:${serverPort}`
