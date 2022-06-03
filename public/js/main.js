document.addEventListener("DOMContentLoaded", function(){
    document.getElementById("startServer").addEventListener("click", function(e){
        postData('/sc', {command: "start"})
            .then(data => {
                if(data.commandResult){
                    alert("Started server.\nTo edit settings, you have to stop the server first.");
                    location.reload();
                } else {
                    alert("Server already running.");
                }
            });
    });

    document.getElementById("stopServer").addEventListener("click", function(e){
        postData('/sc', {command: "stop"})
            .then(data => {
                if(data.commandResult){
                    alert("Stopped server.\nYou may edit settings now.");
                    location.reload();
                } else {
                    alert("Server not running.");
                }
            });
    });

    document.getElementById("saveSettings").addEventListener("click", function(e){
        postData('/sc', {command: "save", svSettings: svSettings})
            .then(data => {
                if(data.commandResult){
                    alert("Saved settings.");
                    location.reload();
                } else {
                    alert("Could not save settings.\nPlease try deez nuts or stepping on a bee.");
                    location.reload();
                }
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

function updateSetting(event, settingName){
    // they are interpolated into the site via pug. See index.pug
    var settings = svSettings;

    settings.forEach(function searchCategories(category){
        category.settings.forEach(function searchSetting(setting){
            if(setting.name == settingName)
                setting.value = event.target.value;
        })
    })
}