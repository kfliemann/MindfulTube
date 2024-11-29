let yt_start = new RegExp('youtube.com(\/)?$');
let yt_start_lang = new RegExp('youtube.com(\/)?\?.*');
let yt_result = new RegExp('youtube.[a-zA-Z]{1,4}\/results.*');
let yt_watch = new RegExp('youtube.[a-zA-Z]{1,4}\/watch.*');

let extension_prefix = "custom_"
let lastUrl = location.pathname;

let global_state;

let start_hide_array = ["page-manager", "guide-button", "items", "guide-content", "country-code"]
let start_manip_array = ["logo", "logo-icon", "center", "end"]

let result_hide_array = ["guide-button", "items", "guide-content", "country-code"]
        




//INITIALISIERUNG, WENN DIE SEITE DAS ERSTE MAL GELADEN WIRD
document.addEventListener('DOMContentLoaded', () => {
    console.log(window.location.href)
    console.log(yt_start_lang.test(window.location.href))
    if (yt_start.test(window.location.href)) {
        enter_start_state()
        global_state = 0
    } else if (yt_result.test(window.location.href)) {
        enter_result_state()
        global_state = 1
    }else if(yt_watch){
        enter_watch_state()
        global_state = 2
    }
    console.log(global_state)
});


//ANZEIGEN DER SEITE, WENN ALLES FERTIG GELADEN
window.addEventListener('load', () => {
    removeShorts()

    document.body.style.display = 'block';
});

//BEOBACHTER, OB SICH DIE SEITE ÄNDERT
new MutationObserver(() => {
    removeShorts()

    const currentUrl = location.pathname;
    if (currentUrl !== lastUrl) {
        lastUrl = currentUrl;

        //WIRD GEBRAUCHT, DAMIT DIE CONTAINER CSS REGEL IN STARTPAGE.CSS FUNKTIONIERT
        let yt_search = document.getElementsByTagName("ytd-search")
        if(yt_search.length > 0){
            for (el of document.getElementsByTagName("ytd-search")) {
                el.remove()
            }
        }

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
}

function leave_start_state(){
    removeCSS()

    //HIDE SECTION
    toggleElements(start_hide_array, "show")
    document.getElementsByTagName("ytd-mini-guide-renderer")[0].classList.remove(extension_prefix + "dnone")
    
    //MANIPULATE SECTION
    manipulateElements(start_manip_array, "remove")
}

function enter_result_state(){
    injectCSS("resultpage.css");
    console.log("hier aber weinigsdstene?")

    //HIDE SECTION
    toggleElements(result_hide_array, "hide")
}

function leave_result_state(){
    removeCSS()

    //HIDE SECTION
    toggleElements(result_hide_array, "show")
}

function enter_watch_state(){}

function leave_watch_state(){}

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






function removeShorts(){
    let shortsDOMObj = document.getElementsByTagName("ytd-reel-shelf-renderer")
    if(shortsDOMObj.length > 0){
        for(let short of shortsDOMObj){
            short.remove()
        }
    }

    let test = document.getElementsByTagName("ytd-ad-slot-renderer")
    if(test.length > 0){
        for(let short of test){
            short.remove()
        }
    }
    
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
    console.log(arr)
    switch (state) {
        case "hide":
            for(let el of arr){
                var dom_el = document.getElementById(el)
                console.log(dom_el)
                if(dom_el){
                    dom_el.classList.add(extension_prefix + "dnone")
                }
                console.log(dom_el)
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