window.onload = function () {
    //set the settings checkboxes
    const checkbox_arr = [
        { key: 'hideYtStartPage' },
        { key: 'hideYtResultPage' },
        { key: 'hideYtWatchPage' },
    ];

    checkbox_arr.forEach(({ key }) => {
        const checkbox_obj = document.getElementById(key);

        chrome.storage.local.get([key], (value) => {
            if (value[key] !== undefined) {
                checkbox_obj.checked = value[key];
            }
        });

        checkbox_obj.addEventListener('input', (e) => {
            chrome.storage.local.set({ [key]: e.target.checked });
        });
    });
    
    // version
    let manifestData = chrome.runtime.getManifest();
    document.getElementById('ext-version').textContent =
        'v' + manifestData.version;
};