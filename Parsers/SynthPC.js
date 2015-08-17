/* 
 * This file was created by João Luís Reis
 */

function generateSynthPC(name, numberPoints, min, max)
{
    document.getElementById("Debug").innerHTML = "Synthesizing " + name;
 
    var centerPC = new Point(0, 0, 0);
    var XYZlength = new Point(0, 0, 0);
        
    var maxXYZ = [-99999999, -99999999, -99999999];
    var minXYZ = [99999999, 99999999, 99999999];
        
    var vertex = [];
    var colors = [];
    var numberColors = 3;
    var numberVertex = numberPoints;
    var points = [];
    for(var i = 0; i < numberVertex; i++)
    {
        for(var k = 0; k < 3; k++)
        {
            var value = Math.random() * (max - min) + min;
            var freq = 1;
            switch(k)
            {
                case 0: 
                    value = name == "Avatar" ? value /(k*2+1) : Math.cos((min+((max-min)/numberVertex)*i)*freq*Math.PI);
                    break;
                case 1: 
                    value = name == "Avatar" ? value /(k*2+1) : Math.cos((min+((max-min)/numberVertex)*i)*4*freq*Math.PI);
                    break;
                case 2: 
                    value = name == "Avatar" ? value /(k*2+1) : value;
                    break;
            }
            vertex.push(value);
//            colors.push((value-min)/(max-min));
            colors.push(name == "Avatar" ? (3-k)/3: (k+1)/3);
            maxXYZ[k] = value > maxXYZ[k] ? value : maxXYZ[k];
            minXYZ[k] = value < minXYZ[k] ? value : minXYZ[k];
        }
        var vertexLength = vertex.length;
        var colorLength = colors.length;
        points.push(new Point(vertex[vertexLength-3], vertex[vertexLength-2], vertex[vertexLength-1], colors[colorLength-3], colors[colorLength-2], colors[colorLength-1], vertex.length - 3));    
    }
    
    centerPC.x = (minXYZ[0] + maxXYZ[0])*1000000/2000000;
    centerPC.y = (minXYZ[1] + maxXYZ[1])*1000000/2000000;
    centerPC.z = (minXYZ[2] + maxXYZ[2])*1000000/2000000;
    XYZlength.x = Math.abs((minXYZ[0] - maxXYZ[0])*1000000/2000000);
    XYZlength.y = Math.abs((minXYZ[1] - maxXYZ[1])*1000000/2000000);
    XYZlength.z = Math.abs((minXYZ[2] - maxXYZ[2])*1000000/2000000);
                
    var pointCloud;
    if(name === "Avatar")
        pointCloud = new Avatar(name, vertex, colors, numberColors, numberVertex, points);
    else
        pointCloud = new PointCloud(name, vertex, colors, numberColors, numberVertex, points);

    pointCloud.init();
    pointCloud.prepareDraw();
    pointCloud.cleanUp();
    pointCloud.octreeManager.createOctree(centerPC, XYZlength, points);
    if(drawOctrees){
        pointCloud.octreeManager.prepareOctreeDraw();
        pointCloud.octreeDrawing();
    }
    currentPointClouds[name] = pointCloud;
}