//the following code gets executed, everytime the extension settings pop up gets opened
//the "DOM" of the extension pop up gets destroyed on close and rebuilt on open
//so fetching the current cookies from the content context is needed
window.onload = async function () {
    const checkbox_arr = [
        { key: 'hideYtStartPage' },
        { key: 'hideYtResultPage' },
        { key: 'hideYtWatchPage' },
        { key: 'hideAdsShorts' },
        { key: 'showSubscriptionsButton' },
        { key: 'showPlaylistButton' },
        { key: 'showHistoryButton' },
    ];

    let manifestData = chrome.runtime.getManifest();
    document.getElementById('ext-version').textContent = 'Version ' + manifestData.version;

    try {
        let cookieArray = await getCookiesFromContent();
        cookieArray = cookieArray.data;

        checkbox_arr.forEach(({ key }) => {
            const checkbox_obj = document.getElementById(key);
            if (checkbox_obj) {
                const checkbox_value = cookieArray.find((item) => item.key === key)?.value;
                checkbox_obj.checked = JSON.parse(checkbox_value);

                checkbox_obj.addEventListener('input', (e) => {
                    sendCookieToContent(e.target.id, e.target.checked);
                });
            }
        });
    } catch (error) {
        //TODO: display error message in extension window (cookies not found or similar)
        document.getElementById('settings').style.display = 'none';
        document.getElementById('errorMessage').style.display = 'block';
    }
};

//get the cookies from the content with the help of background.js
//because the extensionSetting.js runs in its own context, separated from the content context
//therefore no cookies exist in this realm :(
//send message to background.js, which will forward this message to content js which will respond with the cookies array
//which will be sent back by background.js
async function getCookiesFromContent() {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ direction: 'getCookies' }, (response) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve(response);
            }
        });
    });
}

//upon changing a setting, send a call to the content context to change the cookies
function sendCookieToContent(target, checked) {
    chrome.runtime.sendMessage({
        direction: 'setCookie',
        data: { key: target, value: checked },
    });
}
