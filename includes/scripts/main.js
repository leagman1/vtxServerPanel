document.addEventListener("DOMContentLoaded", function(){
    document.getElementById("startServer").addEventListener("click", function(e){
        postData('/sc', {command: "start"})
            .then(data => {
                console.log(data); // JSON data parsed by `data.json()` call
            });
    });

    document.getElementById("stopServer").addEventListener("click", function(e){
        postData('/sc', {command: "stop"})
            .then(data => {
                console.log(data); // JSON data parsed by `data.json()` call
            });
    });

    var settingsTabs = document.getElementsByClassName("settingsTab");
    
    for(let i = 0; i< settingsTabs.length; i++){
        settingsTabs[i].style.display = "none";
    }

    document.getElementById("GameModeBase").style.display = "grid";
    document.getElementById("linkGameModeBase").classList.add("active");
});

function showSettingsTab(event, tabName){
    var settingsTabs = document.getElementsByClassName("settingsTab");

    for(let i = 0; i< settingsTabs.length; i++){
        settingsTabs[i].style.display = "none";
    }

    document.getElementById(tabName).style.display = "grid";

    var links = document.getElementsByTagName("button");
    for(let i = 0; i< links.length; i++){
        links[i].classList.remove("active");
    }

    document.getElementById("link" + tabName).classList.add("active");
}