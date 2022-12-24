import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import reportWebVitals from './reportWebVitals'
import axios from 'axios'

import HomePage from 'home/HomePage'
import ConsoleApp from 'console/ConsoleApp'
import TicTacToeApp from 'tic-tac-toe/TicTacToeApp'
import LGameApp from 'l-game/LGameApp'
import DotsAndBoxesApp from 'dots-and-boxes/DotsAndBoxesApp'

import './index.css'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
    <React.StrictMode>
        <BrowserRouter basename={process.env.NODE_ENV === "production" ? '/ouroboros' : '/'}>
            <Routes>
                <Route
                    path='/'
                    element={<HomePage />}
                />
                <Route
                    path='/console'
                    element={<ConsoleApp />}
                />
                <Route
                    path='/tic-tac-toe'
                    element={<TicTacToeApp />}
                />
                <Route
                    path='/l-game'
                    element={<LGameApp />}
                />
                <Route
                    path='/dots-and-boxes'
                    element={<DotsAndBoxesApp />}
                />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()

if (process.env.NODE_ENV === "production") {
    console.log("Using production URL...")

    axios.defaults.baseURL = `https://thedelta.stream`
} else if (process.env.NODE_ENV === "development") {
    console.log("Using development URL...")
    
    const port = 30167
    axios.defaults.baseURL = `http://localhost:${port}`
}