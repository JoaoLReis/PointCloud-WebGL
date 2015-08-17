var plyFiles = "";
var parseIndex = 0;

function ParsePly() {
    
    var auxStruct = {file:"",reader:"" };
    
    parseIndex = document.getElementById("selector").selectedIndex;
    
    var namePC = document.getElementById("selector").options[parseIndex].value;
    
    auxInput(auxStruct, namePC);
    
    document.getElementById("Debug2").innerHTML = namePC;
    
    // If we use onloadend, we need to check the readyState.
    auxStruct.reader.onloadend = function(evt) {
        
        
        var centerPC = new Point(0, 0, 0);
        var XYZlength = new Point(0, 0, 0);
        
        var maxXYZ = [-99999999, -99999999, -99999999];
        var minXYZ = [99999999, 99999999, 99999999];
        
        var colors = [];
        var vertex = [];
        var points = [];
        var numberVertex = 0;
        var numberColors = 0;
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
                console.log("WARNING SOMETHING CRAZY IS HAPPENING!!!!!!");
                console.log("point: " + parseFloat(splitted[0]) + ", " + parseFloat(splitted[1]) + ", " + parseFloat(splitted[2]));
                console.log("maxX: " + maxXYZ[0] + ", " + maxXYZ[1] + ", " + maxXYZ[2]);
            }
            
            var colorInterval = 3 + numberColors; 
            for(var k = 3; k < colorInterval; k++)
            {
                colors.push(splitted[k]/255.0);
            }
            
            var vertexLength = vertex.length;
            var colorLength = colors.length;
            points.push(new Point(vertex[vertexLength-3], vertex[vertexLength-2], vertex[vertexLength-1], colors[colorLength-3], colors[colorLength-2], colors[colorLength-1], vertex.length - 3));
            
            if(line === lines.length-1)
            {        
                
                centerPC.x = (minXYZ[0] + maxXYZ[0])*1000000/2000000;
                centerPC.y = (minXYZ[1] + maxXYZ[1])*1000000/2000000;
                centerPC.z = (minXYZ[2] + maxXYZ[2])*1000000/2000000;
                XYZlength.x = Math.abs((minXYZ[0] - maxXYZ[0])*1000000/2000000);
                XYZlength.y = Math.abs((minXYZ[1] - maxXYZ[1])*1000000/2000000);
                XYZlength.z = Math.abs((minXYZ[2] - maxXYZ[2])*1000000/2000000);
                
                var pointCloud;
                if(namePC === "Avatar")
                    pointCloud = new Avatar(namePC, vertex, colors, numberColors, numberVertex, points);
                else
                    pointCloud = new PointCloud(namePC, vertex, colors, numberColors, numberVertex, points);
                
                pointCloud.init();
                pointCloud.prepareDraw();
                pointCloud.cleanUp();
                pointCloud.octreeManager.createOctree(centerPC, XYZlength, points);
                if(drawOctrees){
                    pointCloud.octreeManager.prepareOctreeDraw();
                    pointCloud.octreeDrawing();
                }
                currentPointClouds[namePC] = pointCloud;
                //document.getElementById("Debug").innerHTML = "about to calculate Radius";
                //octreeManager.calculateRadius();
                ready = true;
                document.getElementById("Ready").innerHTML = "Ready";
                document.getElementById("Ready").style.color = "green";
            }
            
            
        }
    };

    auxStruct.reader.readAsText(auxStruct.file);
    
}

function auxInput(auxStruct, namePC)
{
    
    document.getElementById("Ready").innerHTML = "Not Ready";
    document.getElementById("Ready").style.color = "red";
    
    document.getElementById("Debug").innerHTML = "Start parse";
    
    if (!plyFiles.length) {
    alert('Please select a file!');
      return false;
    }

    if(namePC in currentPointClouds)
    {
        alert('Duplicate Point Cloud!');
        return false;
    }

    document.getElementById("Debug").innerHTML = "File size not 0";

    auxStruct.file = plyFiles[parseIndex];

    auxStruct.reader = new FileReader();
    
    document.getElementById("Debug").innerHTML = "Start reading";
}