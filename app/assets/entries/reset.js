import '../styles/reset.scss'
import React from 'react'
import ReactDOM from 'react-dom'
import Reset from '../components/reset/Reset'


ReactDOM.render(
    <React.StrictMode>
        <Reset {...(window.Data || {})} />
    </React.StrictMode>,
    document.getElementById('reset-content'),
)
