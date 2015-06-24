function fpsCounter()
{
    var now = new Date().getTime();
    
    time += (now - prevTime);
    
    numFrames++;
    
    prevTime = now;
    
    var fpscounter = document.getElementById("fps");
    if(time >= 1000)
    {
        fpscounter.innerHTML = "FPS: " + numFrames.toString();
        numFrames = 0;
        time -= 1000;
    }
}

function submitPly()
{
    plyFiles = document.getElementById('input').files;
    var fileNames = [];
    for(var i=0; i<plyFiles.length; i++)
    {
      fileNames.push(plyFiles[i].name.split(".")[0]);  //new Option("Text", "Value")
      document.getElementById("Debug2").innerHTML = plyFiles[i].name.split(".")[0];
    }
    populateSelect(fileNames);
    document.getElementById("selector").style.visibility="visible";
}

function populateSelect(fileNames)
{
    var select = document.getElementById('selector');
    for(var i=0; i<fileNames.length; i++)
    {
      select.options[i] = new Option(fileNames[i], fileNames[i]);  //new Option("Text", "Value")
    }
};

//Get a list of all files in a directory
function _getAllFilesFromFolder(dir)
{

    var filesystem = require("fs");
    var results = [];

    filesystem.readdirSync(dir).forEach(function(file) {

        file = dir+'/'+file;
        var stat = filesystem.statSync(file);

        if (stat && stat.isDirectory()) {
            results = results.concat(_getAllFilesFromFolder(file));
        } else results.push(file);

    });

    return results;

};

function getNewObjectID()
{
    var id = globalID;
    globalID += 1;
    
    return id;
}