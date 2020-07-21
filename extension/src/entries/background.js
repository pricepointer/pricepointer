chrome.runtime.onInstalled.addListener(() => {
    // Set initialization options here
    // chrome.storage.sync.set({ color: '#3aa757' }, () => {
    //     console.log('The color is green!')
    // })

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
