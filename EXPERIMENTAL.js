var {execSync} = require("child_process");
var {readFileSync} = require("fs");
var {path} = JSON.parse(readFileSync("./options.json", "utf8"));

console.log("PATH: " + path + "Binaries\\Win64\\MCSServer.exe");

var result;
try {
    result = execSync(`wmic process get processid,executablepath | find \"${path}Binaries\\Win64\\MCSServer.exe\"`);
} catch (err) {
    if(err)
        console.log("It done an error.");
}

result = result.toString()
            .split(/\s/)
            .filter(e => !!e);

console.log(result[1]);
// console.log(execSync("taskkill /PID 12744").toString());

/*
D:\Vertex\Server\MCSServer.exe                                                                                    12744
D:\Vertex\Server\MCS\Binaries\Win64\MCSServer.exe                                                                 15856

*/