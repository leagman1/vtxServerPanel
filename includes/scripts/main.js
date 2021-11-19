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
});