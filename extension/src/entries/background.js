chrome.runtime.onInstalled.addListener(() => {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [
                new chrome.declarativeContent.PageStateMatcher({
                    pageUrl: {
                        // hostEquals:
                        schemes: ['http', 'https'],
                    },
                }),
            ],
            actions: [new chrome.declarativeContent.ShowPageAction()],
        }])
    })
})
