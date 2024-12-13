chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.direction) {
        //forwards the request from extensionSetting to the content and responds with the cookies from content
        case 'getCookies':
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs.length > 0) {
                    chrome.tabs.sendMessage(
                        tabs[0].id,
                        message,
                        (response) => {
                            sendResponse(response); // Antwort senden
                        }
                    );
                } else {
                    sendResponse({ error: 'Kein aktiver Tab gefunden' });
                }
            });
            break;

        //forwards the new cookie
        case 'setCookie':
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs.length > 0) {
                    chrome.tabs.sendMessage(tabs[0].id, message);
                }
            });
            break;
    }
    //signals an asynchronous response
    return true;
});
