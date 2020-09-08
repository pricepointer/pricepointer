import { create } from 'jss'
import preset from 'jss-preset-default'
import PropTypes from 'prop-types'
import React from 'react'
import Frame, { FrameContextConsumer } from 'react-frame-component'
import { JssProvider } from 'react-jss'
import ReactResizeDetector from 'react-resize-detector'
import iframeStylesUrl from '../styles.iframe.scss'
import Prompt from './Prompt'


class ContentFrame extends React.Component {
    static propTypes = {
        element: PropTypes.node.isRequired,
        closePopup: PropTypes.func.isRequired,
        handleResize: PropTypes.func.isRequired,
        height: PropTypes.number.isRequired,
        width: PropTypes.number.isRequired,
    }

    componentWillReceiveProps(nextProps) {
        const { height, width, handleResize } = nextProps
        handleResize(width, height)
    }

    shouldComponentUpdate() {
        // we never need to update from props after mount
        return false
    }

    render() {
        const { element, closePopup } = this.props
        return (
            <FrameContextConsumer>
                {
                    ({ document }) => {
                        const { head } = document
                        const comment = document.createComment('jss')
                        head.appendChild(comment)
                        const jss = create({ ...preset(), insertionPoint: comment })

                        document.body.style.margin = '0px'
                        document.body.style.overflow = 'hidden'

                        return (
                            <JssProvider jss={jss}>
                                <Prompt
                                    target={element}
                                    handleClose={closePopup}
                                />
                            </JssProvider>
                        )
                    }
                }
            </FrameContextConsumer>
        )
    }
}

export default (props) => {
    const styleUrl = iframeStylesUrl
    const chromeUrl = chrome.extension.getURL(styleUrl)
    return (
        <Frame
            initialContent={`
            <!DOCTYPE html>
            <html>
                <head>
                    <link href="${chromeUrl}" type="text/css" rel="stylesheet" />
                </head>
                <body><div></div></body>
            </html>
        `}
        >
            <ReactResizeDetector handleWidth handleHeight>
                {({ width, height }) => <ContentFrame {...props} width={width} height={height} />}
            </ReactResizeDetector>
        </Frame>
    )
}
