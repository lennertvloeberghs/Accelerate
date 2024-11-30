wcU = encodeURIComponent(window.location.href)
newRequest = function(e = !0) {
    fetch("https://api.websitecarbon.com/b?url=" + wcU).then((function(e) {
        if (!e.ok) throw Error(e);
        return e.json()
    })).then((function(n) {
        e && renderResult(n), n.t = (new Date).getTime(), localStorage.setItem("wcb_" + wcU, JSON.stringify(n))
    })).catch((function(e) {
        var text = $('.carbonperview').text().replace('#',  "N/A ")
        $('.carbonperview').text(text);
        var text = $('.carbonpres').text().replace('#',  "N/A")
        $('.carbonpres').text(text);
    }))
}
renderResult = function(e) {
    var text = $('.carbonperview').text().replace('#',  e.c)
    $('.carbonperview').text(text);
    var text = $('.carbonpres').text().replace('#',  e.p)
    $('.carbonpres').text(text);
}
if ("fetch" in window) {
    let e = localStorage.getItem("wcb_" + wcU);
    const n = (new Date).getTime();
    if (e) {
        const t = JSON.parse(e);
        renderResult(t), n - t.t > 864e5 && newRequest(!1)
    } else newRequest()
}
$(document).ready(function () {
    
    var str = window.location.href;
    result = str.split('.be')[1];
    result = result.replaceAll("/","-")

    $('.carbonperview').attr("href", "https://www.websitecarbon.com/website/acceleratestudio-be"+result); // Set herf value
}); 
