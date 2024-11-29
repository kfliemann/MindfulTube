let yt_homepage = new RegExp('youtube.com(/)?$');
let yt_searchresult = new RegExp('youtube.[a-zA-Z]{1,4}\/results.*');
let yt_watchpage = new RegExp('youtube.[a-zA-Z]{1,4}\/watch.*');
let extension_prefix = "custom_"
let lastUrl = location.href;

let changed_elements = [];
let global_state;



//INITIALISIERUNG, WENN DIE SEITE DAS ERSTE MAL GELADEN WIRD
document.addEventListener('DOMContentLoaded', () => {
    if (yt_homepage.test(window.location.href)) {
        enter_start_state()
        global_state = 0
    } else if (yt_searchresult.test(window.location.href)) {
        global_state = 1
        //TODO für den fall, dass jemand einen link öffnet
        //injectCSS("watchpage.css");
    }
});


//ANZEIGEN DER SEITE, WENN ALLES FERTIG GELADEN
window.addEventListener('load', () => {
    console.log("test?")
    document.body.style.display = 'block';
});

//BEOBACHTER, OB SICH DIE SEITE ÄNDERT
new MutationObserver(() => {
    const currentUrl = location.href;
    if (currentUrl !== lastUrl) {
        lastUrl = currentUrl;

        //WIRD GEBRAUCHT, DAMIT DIE CONTAINER CSS REGEL IN MAINPAGE.CSS FUNKTIONIERT
        let yt_search = document.getElementsByTagName("ytd-search")
        if(yt_search.length > 0){
            for (el of document.getElementsByTagName("ytd-search")) {
                el.remove()
            }
        }

        if(document.getElementById("custom_css_sheet")){
            //document.getElementById("custom_css_sheet").remove()
        }

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
        }

        if (yt_homepage.test(window.location.href)) {
            //FALL: ES WIRD ZUR HAUPTSEITE GEWECHSELT
            console.log("//FALL: ES WIRD ZUR HAUPTSEITE GEWECHSELT")
            injectCSS("mainpage.css");
        } else if (yt_searchresult.test(window.location.href)) {
            //FALL: ES WIRD ZUR SEARCHRESULT SEITE GEWECHSELT
            console.log("//FALL: ES WIRD ZUR SEARCHRESULT SEITE GEWECHSELT")
            document.getElementById("page-manager").classList.remove("custom_dnone")
            //injectCSS("watchpage.css");
            document.getElementById("custom_css_sheet").href = browser.runtime.getURL("watchpage.css");
        }
    }
}).observe(document, { subtree: true, childList: true });



function enter_start_state(){
    injectCSS("mainpage.css");

    //HIDE SECTION
    let hide_array = ["page-manager", "guide-button", "items", "guide-content", "country-code"]
    toggleElements(hide_array, "hide")
    document.getElementsByTagName("ytd-mini-guide-renderer")[0].classList.add(extension_prefix + "dnone")
    
    //MANIPULATE SECTION
    let manip_array = ["logo", "logo-icon", "center", "end"]
    manipulateElements(manip_array, "add")
}

function leave_start_state(){
    //HIDE SECTION
    let hide_array = ["page-manager", "guide-button", "items", "guide-content", "country-code"]
    toggleElements(hide_array, "show")
    document.getElementsByTagName("ytd-mini-guide-renderer")[0].classList.add(extension_prefix + "dnone")
    
    //MANIPULATE SECTION
    let manip_array = ["logo", "logo-icon", "center", "end"]
    manipulateElements(manip_array, "remove")

}

function enter_result_state(){}

function leave_result_state(){}

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























































//LADE CSS DATEI NACH
function injectCSS(fileName) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = browser.runtime.getURL(fileName);
    link.id = 'custom_css_sheet'; // Um es später zu entfernen
    document.head.appendChild(link);
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