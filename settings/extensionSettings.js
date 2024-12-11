window.onload = function() {
    chrome.storage.local.get(null, function(value)
    {
        let hideYtStartPageInput = document.getElementById("hideYtStartPage");
        if (value.hideYtStartPageInput != undefined)
            hideYtStartPageInput.checked = value.hideYtStartPageInput;
        hideYtStartPageInput.addEventListener("input", function(e) {
            chrome.storage.local.set({hideYtStartPageInput: e.target.checked});
        })
    });

    // version
    let manifestData = chrome.runtime.getManifest();
    document.getElementById("ext-version").textContent = "v" + manifestData.version;
};

const tooltips = document.querySelectorAll(".tooltip");
const details = document.querySelector("details");

tooltips.forEach(tooltip => {
    tooltip.onmouseover = function (e) {
        const detailsY = details.getBoundingClientRect().bottom;
        const tooltipRect = tooltip.getBoundingClientRect()

        const tooltipText = tooltip.querySelector(".tooltiptext");
        tooltipText.style.bottom = (detailsY - tooltipRect.bottom + tooltipRect.height) + 'px';
    };
});