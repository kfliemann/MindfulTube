//GLOBAL VARIABLES
let extension_prefix = 'custom_';

let yt_start = new RegExp('youtube.[a-zA-Z]{1,4}(\\/)?$');
let yt_start_theme = new RegExp('\\?themeRefresh=1');
let yt_start_lang = new RegExp('youtube.[a-zA-Z]{1,4}(\\/)??.*');
let yt_result = new RegExp('youtube.[a-zA-Z]{1,4}\\/results.*');
let yt_watch = new RegExp('youtube.[a-zA-Z]{1,4}\\/watch.*');

//presets the extension configs
let hide_start = { key: 'hideYtStartPage', value: true };
let hide_result = { key: 'hideYtResultPage', value: true };
let hide_watch = { key: 'hideYtWatchPage', value: true };
let config_arr = [hide_start, hide_result, hide_watch];

/**
 * possible states:
 * 0 = start page
 * 1 = (search)result page
 * 2 = watch page
 * -1 = unintended error state, e.g. a subsite, which was not meant to be visited. leave error state pages untouched.
 */
let global_state = -1;
let lastUrl = location.pathname;

let start_hide_array = [
    'page-manager',
    'guide-button',
    'items',
    'guide-content',
    'country-code',
];
let start_manip_array = ['logo', 'logo-icon', 'center', 'end'];
let result_hide_array = [
    'guide-button',
    'items',
    'guide-content',
    'country-code',
];
let watch_hide_array = [
    'sections',
    'guide-button',
    'items',
    'guide-content',
    'country-code',
];

//listens for messages from background.js
//sends all cookies to background.js / sets new cookie value from background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.direction) {
        case 'getCookies':
            sendResponse({ data: getCookieArray() });
            break;
        case 'setCookie':
            document.cookie = message.data.key + '=' + message.data.value;
            break;
    }
});

//init cookies needed to deal avoid asynchronity of chrome.storage when switching pages
function initExtensionCookies() {
    let cookieArray = getCookieArray();
    config_arr.forEach((config) => {
        const cookie = cookieArray.find((item) => item.key === config.key);

        if (!cookie) {
            document.cookie = config.key + '=' + config.value;
        } else {
            config.value = JSON.parse(cookie.value);
        }
    });
}

//initialize on earliest page load point
document.addEventListener('DOMContentLoaded', () => {
    initExtensionCookies();

    if (
        yt_start.test(window.location.href) ||
        yt_start_theme.test(window.location.search)
    ) {
        if (hide_start.value) {
            enter_start_state();
        }
        global_state = 0;
    } else if (yt_result.test(window.location.href)) {
        if (hide_result.value) {
            enter_result_state();
        }
        global_state = 1;
    } else if (yt_watch.test(window.location.href)) {
        if (hide_watch.value) {
            enter_watch_state();
        }
        global_state = 2;
    } else {
        global_state = -1;
    }
});

//display body, when everything initialized
window.addEventListener('load', () => {
    removeBloat();
    if (
        yt_start.test(window.location.href) ||
        yt_start_theme.test(window.location.search)
    ) {
        if (hide_start.value) {
            enter_start_state();
        }
        global_state = 0;
    } else if (yt_result.test(window.location.href)) {
        if (hide_result.value) {
            enter_result_state();
        }
        global_state = 1;
    } else if (yt_watch.test(window.location.href)) {
        if (hide_watch.value) {
            enter_watch_state();
        }
        global_state = 2;
    } else {
        global_state = -1;
    }

    document.body.style.display = 'block';
});

//site observer to look out for page changes
new MutationObserver(() => {
    //needs to be called on every observer call in case new shorts /ads get loaded on resultpage scroll
    if (yt_result.test(window.location.href)) {
        removeBloat();
    }
    //check for theatermode and rearrange /watch page accordingly
    if (yt_watch.test(window.location.href)) {
        let ytRecommObj = document
            .getElementById('page-manager')
            .querySelector('#columns')
            .querySelector('#secondary');
        if (ytRecommObj) {
            checkforTheaterMode(ytRecommObj.offsetWidth);
        }
    }

    const currentUrl = location.pathname;
    if (currentUrl !== lastUrl) {
        lastUrl = currentUrl;

        //leave current state on page switch
        switch (global_state) {
            case 0:
                if (hide_start.value) {
                    leave_start_state();
                }
                break;
            case 1:
                if (hide_result.value) {
                    leave_result_state();
                }
                break;
            case 2:
                if (hide_watch.value) {
                    leave_watch_state();
                }
                break;
            default:
                //leave_start_state();
                //leave_result_state();
                //leave_watch_state();
                break;
        }

        updateVariablesFromCookie();

        //enter new state based on new page
        if (yt_start.test(window.location.href)) {
            if (hide_start.value) {
                enter_start_state();
            }
            global_state = 0;
        } else if (yt_result.test(window.location.href)) {
            if (hide_result.value) {
                enter_result_state();
            }
            global_state = 1;
        } else if (yt_watch.test(window.location.href)) {
            if (hide_watch.value) {
                enter_watch_state();
            }
            global_state = 2;
        } else {
            global_state = -1;
        }
    }
}).observe(document, { subtree: true, childList: true });

//all changes made to start page
function enter_start_state() {
    injectCSS('./styles/startpage.css', 'startpage');

    //hide section
    toggleElements(start_hide_array, 'hide');
    document
        .getElementsByTagName('ytd-mini-guide-renderer')[0]
        .classList.add(extension_prefix + 'dnone');

    //manipulate section
    manipulateElements(start_manip_array, 'add');
    document
        .getElementById('masthead')
        .children.namedItem('container')
        .classList.add('custom_searchbar');
}

//undo all changes made to start page
function leave_start_state() {
    removeCSS();

    //hide section
    toggleElements(start_hide_array, 'show');
    document
        .getElementsByTagName('ytd-mini-guide-renderer')[0]
        .classList.remove(extension_prefix + 'dnone');

    //manipulate section
    manipulateElements(start_manip_array, 'remove');
    document
        .getElementById('masthead')
        .children.namedItem('container')
        .classList.remove('custom_searchbar');
}

//all changes made to result page
function enter_result_state() {
    injectCSS('./styles/resultpage.css', 'resultpage');
    toggleElements(result_hide_array, 'hide');
}

//undo all changes made to result page
function leave_result_state() {
    removeCSS();
    toggleElements(result_hide_array, 'show');
}

//all changes made to watch page
function enter_watch_state() {
    injectCSS('./styles/watchpage.css', 'watchpage');

    //hide section
    toggleElements(watch_hide_array, 'hide');

    //manipulate section
    //hide recommended video sidebar and comments
    //wait for the #page-manager to load, then remove unwanted items
    waitForElement('#page-manager', document.getElementById('page-manager'))
        .then((asyncObj) => {
            return waitForElement('#columns', asyncObj);
        })
        .then((asyncObj) => {
            //because we waited for the promise to return we have now access to all loaded children of #page-manager

            //remove comments
            asyncObj
                .querySelector('ytd-comments')
                .classList.add(extension_prefix + 'dnone');

            //remove recommended videos
            //in order to not mess up the video controls (moving around parts of the site messes with the position of video controls for some reason)
            //set the innerHTML to empty string instead of display:none and offset by half the size to each side
            let ytRecomm = asyncObj.querySelector('#secondary');
            ytRecomm.innerHTML = '';
            checkforTheaterMode(ytRecomm.offsetWidth);
            document.body.style.overflowX = 'hidden';
        });
}

//undo all changes made to watch page
function leave_watch_state() {
    removeCSS();

    //hide section
    toggleElements(watch_hide_array, 'show');
    let pageManager = document.getElementById('page-manager');

    pageManager
        .querySelector('ytd-comments')
        .classList.remove(extension_prefix + 'dnone');
    pageManager
        .querySelector('#secondary')
        .classList.remove(extension_prefix + 'dnone');

    //manipulate section (needs to be reset, page-manager doesn't get fully reloaded)
    pageManager.classList.remove(extension_prefix + 'page_manager');
    pageManager
        .querySelector('#below')
        .classList.remove(extension_prefix + 'below_video');
    document.body.classList.add(extension_prefix + 'body');
}

//inject custom css file
function injectCSS(fileName, cssSheetName) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = browser.runtime.getURL(fileName);
    link.id = extension_prefix + cssSheetName + 'css_sheet'; // Um es später zu entfernen
    document.head.appendChild(link);
}

//remove custom css file
function removeCSS() {
    let cssFile = document.getElementById(extension_prefix + 'css_sheet');
    if (cssFile) {
        cssFile.remove();
    }
}

//un/-hide given elements
function toggleElements(arr, state) {
    switch (state) {
        case 'hide':
            for (let el of arr) {
                var dom_el = document.getElementById(el);
                if (dom_el) {
                    dom_el.classList.add(extension_prefix + 'dnone');
                }
            }
            break;
        case 'show':
            for (let el of arr) {
                var dom_el = document.getElementById(el);

                if (dom_el) {
                    dom_el.classList.remove(extension_prefix + 'dnone');
                }
            }
            break;
    }
}

//manipulate elements by adding / removing css classes
function manipulateElements(arr, state) {
    switch (state) {
        case 'add':
            for (let el of arr) {
                var dom_el = document.getElementById(el);
                if (dom_el) {
                    dom_el.classList.add(extension_prefix + el);
                }
            }
            break;
        case 'remove':
            for (let el of arr) {
                var dom_el = document.getElementById(el);
                if (dom_el) {
                    dom_el.classList.remove(extension_prefix + el);
                }
            }
            break;
    }
}

//wait for any async element to be loaded
function waitForElement(
    selector,
    observeElement = document.body,
    { childList = true, subtree = true } = {}
) {
    return new Promise((resolve) => {
        let element = document.querySelector(selector);
        if (element) {
            return resolve(element);
        }
        const elementObserver = new MutationObserver(() => {
            element = document.querySelector(selector);
            if (element) {
                resolve(element);
                elementObserver.disconnect();
            }
        });
        elementObserver.observe(observeElement, {
            childList: childList,
            subtree: subtree,
        });
    });
}

//update local variables to match with cookies
//needed after resetting a page to default on leave and before entering a new page
function updateVariablesFromCookie() {
    let cookieArray = getCookieArray();
    config_arr.forEach((element) => {
        const cookieValue = cookieArray.find(
            (item) => item.key === element.key
        )?.value;
        element.value = JSON.parse(cookieValue);
    });
}

//collection of things that need to be removed
function removeBloat() {
    //getting rid of shorts in result page
    let shortsDOMObj = document.getElementsByTagName('ytd-reel-shelf-renderer');
    if (shortsDOMObj.length > 0) {
        for (let short of shortsDOMObj) {
            short.remove();
        }
    }
    //getting rid of ads in result page
    let test = document.getElementsByTagName('ytd-ad-slot-renderer');
    if (test.length > 0) {
        for (let short of test) {
            short.remove();
        }
    }
}

//check if theater mode is on
//if theater mode is on, add margin to description
//if theater mode is off, add margin to page-manager
function checkforTheaterMode(ytRecommObj) {
    var pageManager = document.getElementById('page-manager');
    var belowVideo = document
        .getElementById('page-manager')
        .querySelector('#below');

    //no margins on page-manager, if video is fullscreen
    if (document.fullscreenElement) {
        document.documentElement.style.setProperty(
            '--manager-margin-left',
            '0px'
        );
        document.documentElement.style.setProperty(
            '--manager-margin-right',
            '0px'
        );
        pageManager.classList.add(extension_prefix + 'page_manager');
    } else {
        if (!getCookieValue('wide')) {
            document.documentElement.style.setProperty(
                '--manager-margin-left',
                ytRecommObj / 2 + 'px',
                'important'
            );
            document.documentElement.style.setProperty(
                '--manager-margin-right',
                '-' + ytRecommObj / 2 + 'px',
                'important'
            );
            document.documentElement.style.setProperty(
                '--belowvid-margin-left',
                '0px',
                'important'
            );
            document.documentElement.style.setProperty(
                '--belowvid-margin-right',
                '0px',
                'important'
            );
            document.body.classList.add(extension_prefix + 'body');
        } else {
            document.documentElement.style.setProperty(
                '--dynamic-margin-left',
                '0px',
                'important'
            );
            document.documentElement.style.setProperty(
                '--dynamic-margin-right',
                '0px',
                'important'
            );
            document.documentElement.style.setProperty(
                '--belowvid-margin-left',
                ytRecommObj / 2 + 'px',
                'important'
            );
            document.documentElement.style.setProperty(
                '--belowvid-margin-right',
                '-' + ytRecommObj / 2 + 'px',
                'important'
            );
        }
        pageManager.classList.add(extension_prefix + 'page_manager');
        belowVideo.classList.add(extension_prefix + 'below_video');
    }
}

//someone explain to me why there is no built in function to return cookies as array (for example: document.cookie.toArray() or something)
function getCookieValue(cookieName) {
    let cookieString = document.cookie;
    let cookies = cookieString.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.startsWith(cookieName + '=')) {
            if (cookie.substring(cookieName.length + 1) == '1') {
                return true;
            } else {
                return false;
            }
        }
    }
    return false;
}

//transform document.cookie string to array of cookie objects
function getCookieArray() {
    let cookieString = document.cookie;
    let cookies = cookieString.split(';');
    let cookieArray = [];
    for (let i = 0; i < cookies.length; i++) {
        let cookieString = cookies[i].trim();
        cookieArray.push({
            key: cookieString.substring(0, cookieString.indexOf('=')),
            value: cookieString.substring(cookieString.indexOf('=') + 1),
        });
    }
    return cookieArray;
}
