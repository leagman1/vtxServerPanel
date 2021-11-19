module.exports = {
    test: function test(){
        console.log("svManage test");
    },

    startServer: startServer,
    stopServer: stopServer
}

function startServer(arg){
    if(typeof arg == "function"){
        arg();
    } else {
        
    }
}

function stopServer(arg){
    if(typeof arg == "function"){
        arg();
    } else {
        
    }
}