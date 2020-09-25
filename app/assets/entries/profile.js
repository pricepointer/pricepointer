import '../styles/profile.scss'
import React from 'react'
import ReactDOM from 'react-dom'
import { appIdentifier } from '../../../extension/constants'
import DownloadExtension from '../components/profile/DownloadExtension'
import Usage from '../components/profile/Usage'

window.addEventListener('load', () => {
    const extensionDownloaded = document.getElementById(appIdentifier)

    ReactDOM.render(
        <React.StrictMode>
            {extensionDownloaded ? <Usage /> : <DownloadExtension />}
        </React.StrictMode>,
        document.getElementById('profile'),
    )
})
