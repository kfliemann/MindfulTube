let yt_start = new RegExp('youtube.com(\/)?$');
let yt_start_lang = new RegExp('youtube.com(\/)?\?.*');
let yt_result = new RegExp('youtube.[a-zA-Z]{1,4}\/results.*');
let yt_watch = new RegExp('youtube.[a-zA-Z]{1,4}\/watch.*');

let extension_prefix = "custom_"
let lastUrl = location.pathname;

let global_state;

let start_hide_array = ["page-manager", "guide-button", "items", "guide-content", "country-code"]
let start_manip_array = ["logo", "logo-icon", "center", "end"]

let result_hide_array = ["guide-button", "items", "guide-content", "items", "country-code"]
        
let watch_hide_array = ["guide-button", "items", "guide-content", "items", "country-code", "sections"]



//INITIALISIERUNG, WENN DIE SEITE DAS ERSTE MAL GELADEN WIRD
document.addEventListener('DOMContentLoaded', () => {
    if (yt_start.test(window.location.href)) {
        enter_start_state()
        global_state = 0
    } else if (yt_result.test(window.location.href)) {
        enter_result_state()
        global_state = 1
    }else if(yt_watch.test(window.location.href)){
        enter_watch_state()
        global_state = 2
    }else{
        global_state = -1
    }
});

//ANZEIGEN DER SEITE, WENN ALLES FERTIG GELADEN
window.addEventListener('load', () => {
    removeBloat()
    document.body.style.display = 'block';
});

//BEOBACHTER, OB SICH DIE SEITE ÄNDERT
new MutationObserver(() => {
    removeBloat()
    
    let ytRecommObj = document.getElementById("page-manager").querySelector("#columns").querySelector("#secondary").offsetWidth
    checkforTheaterMode(ytRecommObj)

    const currentUrl = location.pathname;
    if (currentUrl !== lastUrl) {
        lastUrl = currentUrl;

        //LEAVE CURRENT STATE
        switch (global_state) {
            case 0:
                leave_start_state()
                break;
            case 1:
                leave_result_state()
                break;
            case 2:
                leave_watch_state()
                break;
            default:
                leave_start_state()
                leave_result_state()
                leave_watch_state()
        }

        //ENTER NEW STATE
        if (yt_start.test(window.location.href)) {
            enter_start_state()
            global_state = 0
        } else if (yt_result.test(window.location.href)) {
            enter_result_state()
            global_state = 1
        }else if(yt_watch.test(window.location.href)){
            enter_watch_state()
            global_state = 2
        }else{
            global_state = -1
        }
    }
}).observe(document, { subtree: true, childList: true });



function enter_start_state(){
    injectCSS("startpage.css");

    //HIDE SECTION
    toggleElements(start_hide_array, "hide")
    document.getElementsByTagName("ytd-mini-guide-renderer")[0].classList.add(extension_prefix + "dnone")
    
    //MANIPULATE SECTION
    manipulateElements(start_manip_array, "add")
    document.getElementById("masthead").children.namedItem("container").classList.add("custom_searchbar")
}

function leave_start_state(){
    removeCSS()

    //HIDE SECTION
    toggleElements(start_hide_array, "show")
    document.getElementsByTagName("ytd-mini-guide-renderer")[0].classList.remove(extension_prefix + "dnone")
    
    //MANIPULATE SECTION
    manipulateElements(start_manip_array, "remove")
    document.getElementById("masthead").children.namedItem("container").classList.remove("custom_searchbar")

}

function enter_result_state(){
    injectCSS("resultpage.css");

    //HIDE SECTION
    toggleElements(result_hide_array, "hide")
}

function leave_result_state(){
    removeCSS()

    //HIDE SECTION
    toggleElements(result_hide_array, "show")
}

function enter_watch_state(){ 
    injectCSS("watchpage.css");

    //HIDE SECTION
    toggleElements(watch_hide_array, "hide")
    //HIDE RECOMMENDED SIDEBAR & COMMENTS
    //WAIT FOR THE PAGE-MANAGER TO LOAD THEN REMOVE UNWANTED ITEMS
    waitForElement("#page-manager", document.getElementById("page-manager"))
        .then((asyncObj) => {
            return waitForElement("#columns", asyncObj);
        })
        .then((asyncObj) => {
            //REMOVE COMMENTS
            asyncObj.querySelector("ytd-comments").classList.add(extension_prefix + "dnone") 

            //REMOVE RECOMMENDED VIDEOS
            let ytRecomm = asyncObj.querySelector("#secondary")
            ytRecomm.innerHTML = ""            
            checkforTheaterMode(ytRecomm.offsetWidth)
            document.body.style.overflowX = 'hidden';
        })
    }

function leave_watch_state(){
    removeCSS();

    //HIDE SECTION
    toggleElements(watch_hide_array, "show")
    document.getElementById("page-manager").querySelector("ytd-comments").classList.remove(extension_prefix + "dnone") 
    document.getElementById("page-manager").querySelector("#secondary").classList.remove(extension_prefix + "dnone")
}

function leave_global_state(){
    switch (global_state) {
        case 0:
            leave_start_state()
            break;
        case 1:
            leave_result_state()
            break;
        case 2:
            leave_watch_state()
            break;
        default:
            //GOD FORBID YOU ENTERING THIS
            break;
    }
}

function waitForElement(selector, observeElement = document.body, { childList = true, subtree = true } = {}) {
    return new Promise(resolve => {
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
      elementObserver.observe(observeElement, { childList: childList, subtree: subtree });
    });
  }










function removeBloat(){
    let shortsDOMObj = document.getElementsByTagName("ytd-reel-shelf-renderer")
    if(shortsDOMObj.length > 0){
        for(let short of shortsDOMObj){
            short.remove()
        }
    }
    //getting rid of ads in result page
    let test = document.getElementsByTagName("ytd-ad-slot-renderer")
    if(test.length > 0){
        for(let short of test){
            short.remove()
        }
    }
    
}







//CHECK IF THEADERMODE IS ON, IF ON THEN DONT ADD CENTERING MARGINS
function checkforTheaterMode(ytRecommObj){
    var pageManager = document.getElementById("page-manager");
    var belowVideo = document.getElementById("page-manager").querySelector("#below")  
    if(!getCookieValue("wide")){
        pageManager.style.marginLeft = ytRecommObj / 2 + "px"
        pageManager.style.marginRight = "-" + ytRecommObj / 2 + "px"
        belowVideo.style.marginLeft = "0px"
        belowVideo.style.marginRight = "0px"
        document.body.style.overflowX = 'hidden';
    }else{
        pageManager.style.marginLeft = "0px"
        pageManager.style.marginRight = "0px"
        belowVideo.style.marginLeft = ytRecommObj / 2 + "px"
        belowVideo.style.marginRight = "-" + ytRecommObj / 2  + "px"
    }
}

function getCookieValue(cookieName) {
    let cookieString = document.cookie;
    let cookies = cookieString.split(';'); // Teilt den Cookie-String in einzelne Cookies
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim(); // Entfernt führende und nachfolgende Leerzeichen
        if (cookie.startsWith(cookieName + '=')) {
            console.log("das ist der cookie: " + cookie.substring(cookieName.length + 1) )
            if(cookie.substring(cookieName.length + 1) == "1"){
                return true
            }else{
                return false
            }
        }
    }
    return false; // Wenn der Cookie nicht gefunden wird
}






































//LADE CSS DATEI NACH
function injectCSS(fileName) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = browser.runtime.getURL(fileName);
    link.id = 'custom_css_sheet'; // Um es später zu entfernen
    document.head.appendChild(link);
}

function removeCSS(){
    let cssFile = document.getElementById("custom_css_sheet")
    if(cssFile){
        cssFile.remove()
    }
}


function toggleElements(arr, state){
    switch (state) {
        case "hide":
            for(let el of arr){
                var dom_el = document.getElementById(el)
                if(dom_el){
                    dom_el.classList.add(extension_prefix + "dnone")
                }
            }
            break;
        case "show":
            for(let el of arr){
                var dom_el = document.getElementById(el)
        
                if(dom_el){
                    dom_el.classList.remove(extension_prefix + "dnone")
                }
            }
            break;
    }

}

function manipulateElements(arr, state){
    switch (state) {
        case "add":
            for(let el of arr){
                var dom_el = document.getElementById(el)
                if(dom_el){
                    dom_el.classList.add(extension_prefix + el)
                }
            }            
            break;
        case "remove":
            for(let el of arr){
                var dom_el = document.getElementById(el)
                if(dom_el){
                    dom_el.classList.remove(extension_prefix + el)
                }
            }    
            break;

    }
}