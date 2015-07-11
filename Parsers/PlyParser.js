var plyFiles = "";
var parseIndex = 0;

function ParsePly() {
    
    var auxStruct = {file:"",reader:"" };
    
    parseIndex = document.getElementById("selector").selectedIndex;
    
    auxInput(auxStruct);
    document.getElementById("Debug2").innerHTML = document.getElementById("selector").options[parseIndex].value;
    
    // If we use onloadend, we need to check the readyState.
    auxStruct.reader.onloadend = function(evt) {
        
        colors = [];
        vertex = [];
        numberVertex = 0;
        numberColors = 0;
        ready = false;
        var lines = this.result.split('\n');
        
        
        //Reads every line
        for(var line = 0; line < lines.length; line++){
            var splitted = lines[line].split(" ");
            if(splitted[0] === "ply" || splitted[0] === "comment" || splitted[0] === "end_header" || splitted[0] === "format")
            {
                continue;
            }
            
            if(splitted[0] === "element")
            {
                if(splitted[1] === "face")
                {
                    if(splitted[2] > 0)
                    {
                        alert('Unsupported Format!!!! -> polygons OMG!!!');
                        break;
                    }
                }
                if(splitted[1] === "vertex")
                {
                    numberVertex = splitted[2];
                }
                
                continue;
            }
            
            if(splitted[0] === "property")
            {
                if(splitted[1] === "uchar")
                {
                    numberColors += 1;  
                }
                continue;
            }
            
            for(var i = 0; i < 3; i++)
            {
                vertex.push(splitted[i]);
            }
            
            var colorInterval = 3 + numberColors; 
            for(var k = 3; k < colorInterval; k++)
            {
                colors.push(splitted[k]/255.0);
            }
            if(line === lines.length-1)
            {
                document.getElementById("Debug").innerHTML = "about to calculate Radius";
                collisionManager.calculateRadius();
                ready = true;
                document.getElementById("Ready").innerHTML = "Ready";
                document.getElementById("Ready").style.color = "green";
            }
            
            
        }
    };

    auxStruct.reader.readAsText(auxStruct.file);
    
}

function auxInput(auxStruct)
{
    
    document.getElementById("Ready").innerHTML = "Not Ready";
    document.getElementById("Ready").style.color = "red";
    
    document.getElementById("Debug").innerHTML = "Start parse";
    
   if (!plyFiles.length) {
   alert('Please select a file!');
     return false;
   }

    document.getElementById("Debug").innerHTML = "File size not 0";

    auxStruct.file = plyFiles[parseIndex];

    auxStruct.reader = new FileReader();
    
    document.getElementById("Debug").innerHTML = "Start reading";
}