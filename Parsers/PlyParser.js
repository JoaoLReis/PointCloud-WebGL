var plyFiles = "";
var parseIndex = 0;

var points = [];

var centerPC = new Point(0, 0, 0);
var XYZlength = new Point(0, 0, 0);

function ParsePly() {
    
    var auxStruct = {file:"",reader:"" };
    
    parseIndex = document.getElementById("selector").selectedIndex;
    
    auxInput(auxStruct);
    document.getElementById("Debug2").innerHTML = document.getElementById("selector").options[parseIndex].value;
    
    // If we use onloadend, we need to check the readyState.
    auxStruct.reader.onloadend = function(evt) {
        
        var maxXYZ = [-99999999, -99999999, -99999999];
        var minXYZ = [99999999, 99999999, 99999999];
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
                maxXYZ[i] = splitted[i] > maxXYZ[i] ? parseFloat(splitted[i]) : parseFloat(maxXYZ[i]);
                minXYZ[i] = splitted[i] < minXYZ[i] ? parseFloat(splitted[i]) : parseFloat(minXYZ[i]);
            }
            
            if(parseFloat(splitted[0]) != parseFloat(splitted[0]))
            {
                console.log("WARNING SOME CRAZY *** **** IS HAPPENING!!!!!!");
                console.log("point X: " + parseFloat(splitted[0]) + ", " + parseFloat(splitted[1]) + ", " + parseFloat(splitted[2]));
                console.log("maxX: " + maxXYZ[0] + ", " + maxXYZ[1] + ", " + maxXYZ[2]);
            }
            
            points.push(new Point(parseFloat(splitted[0]), parseFloat(splitted[1]), parseFloat(splitted[2]))); 
            
            var colorInterval = 3 + numberColors; 
            for(var k = 3; k < colorInterval; k++)
            {
                colors.push(splitted[k]/255.0);
            }
            if(line === lines.length-1)
            {        
//                console.log("minXYZ: " + minXYZ[0] + ", " + minXYZ[1] + ", " + minXYZ[2]);
//                console.log("maxXYZ: " + maxXYZ[0] + ", " + maxXYZ[1] + ", " + maxXYZ[2]);
                
                centerPC.x = (minXYZ[0] + maxXYZ[0])*1000000/2000000;
                centerPC.y = (minXYZ[1] + maxXYZ[1])*1000000/2000000;
                centerPC.z = (minXYZ[2] + maxXYZ[2])*1000000/2000000;
                XYZlength.x = Math.abs((minXYZ[0] - maxXYZ[0])*1000000/2000000);
                XYZlength.y = Math.abs((minXYZ[1] - maxXYZ[1])*1000000/2000000);
                XYZlength.z = Math.abs((minXYZ[2] - maxXYZ[2])*1000000/2000000);
                
                console.log("centerPC: " + centerPC.x + ", " + centerPC.y + ", " + centerPC.z);
                console.log("XYZlength: " + XYZlength.x + ", " + XYZlength.y + ", " + XYZlength.z);
                
                //document.getElementById("Debug").innerHTML = "about to calculate Radius";
                //collisionManager.calculateRadius();
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