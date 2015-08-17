/* 
 * This file was created by João Luís Reis
 */

var OctreeManager = function()
{
    this.ID = 0;
    this.radius = 0.01;
    this.pointCloudOctree;
}

OctreeManager.prototype.init = function()
{
//    var parsedPC = document.getElementById("selector").options[parseIndex].value;
//    if(parsedPC == "Parliament")
//    {
//        this.radius = 0.0057;
//    }
//    else if(parsedPC == "Manuscript")
//    {
//        this.radius = 0.1;
//    }
//    else if(parsedPC == "Dragon")
//    {
//        this.radius = 0.1;
//    }
}

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// OCTREE CONSTRUCTION
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
OctreeManager.prototype.createOctree = function(centerPC, XYZlength, vertex)
{
    var now = new Date().getTime();
    this.pointCloudOctree = new Octree(centerPC, XYZlength);
    this.pointCloudOctree.init(vertex);
    addTime("Create Octree", now);
}

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// OCTREE DRAWING
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
OctreeManager.prototype.prepareOctreeDraw = function()
{
    var now = new Date().getTime();
    this.pointCloudOctree.generateWireframe();
//    addTime("Prepare Octree for drawing", now);
}

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// CHECK COLLISION
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
OctreeManager.prototype.checkCollision = function(bmin, bmax, results)
{
    var now = new Date().getTime();
    return this.pointCloudOctree.checkCollision(bmin, bmax, results);
//    addTime("Prepare Octree for drawing", now);
}







//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// TO CALCULATE MIN DISTANCE BETWEEN 2 POINTS
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
OctreeManager.prototype.calculateRadius = function()
{
    document.getElementById("Debug").innerHTML = "calculating Radius";
//    usingBuckets();
    calculatingNearestNeighbors();
}

function calculatingNearestNeighbors()
{
    var minRadius = 9999999;
    var targetPoint = [0, 0, 0];
    var currentPoint = [0, 0, 0];
    var tenthOfVertices = 250; //TODO get a function that grows faster at first(and never higher then numVertex) and slows when it reaches 100 in order to reach no more than 1000 for 10M vertex
    var indexesUsed = [];
    var vertexAnalysed = [];
    
    for(var i = 0; i < tenthOfVertices; i++)
    {
        document.getElementById("Debug2").innerHTML = "sample number = " + i;
        //Calculate a random Point index
        var randomIndex = 0;
        do{
            randomIndex = Math.floor((Math.random() * numberVertex));
            randomIndex -= ((randomIndex % 3) != 0) ? (randomIndex % 3) : 0;
        }while(arrayContains(indexesUsed, randomIndex) != -1)
        indexesUsed.push(randomIndex);
    
        // get the target Point's coordinates
        for(var k = 0; k < 3; k++)
            targetPoint[k] = vertex[randomIndex+k];
        
        var vertexNeighbors = {vertex:targetPoint, neighbors:[999999, 999999, 999999, 999999]};
        
        //iterate all Vertex except self to check nearestNeighbors
        for(var k = 0; k < numberVertex - 3; k+=3)
        {
            if(k == randomIndex) //if it is the same vertex
                continue;
            
            for(var j = 0; j < 3; j++)
                currentPoint[j] = vertex[k+j]; 
    
            var value = vectorLength(subVectors(currentPoint, vertexNeighbors.vertex));
            insertIfLower(vertexNeighbors.neighbors, value);
        }
        vertexAnalysed.push(vertexNeighbors);
    }
    
    //calculate the average distance from all samples
    var distanceAvg = 0;
    for(var i = 0; i < vertexAnalysed.length; i++)
    {
        var internalAvg = 0;
        for(var k = 0; k < vertexAnalysed[i].neighbors.length; k++)
        {
            internalAvg += vertexAnalysed[i].neighbors[k];
        }
        internalAvg /= vertexAnalysed[i].neighbors.length;
        distanceAvg += internalAvg;
    }
    distanceAvg /= vertexAnalysed.length;

    document.getElementById("Debug2").innerHTML = "minRadius = " + distanceAvg;
    window.alert("minRadius = " + distanceAvg);
}

function insertIfLower(array, value)
{
    for(var i = 0; i < array.length; i++)
    {
        if(value < array[i])
        {
            for(var k = array.length - 1; k > i; k--)
            {
                array[k] = array[k-1];
            }
            array[i] = value;
        }
    }
}

function usingBuckets()
{
    var minRadius = 9999999;
    var prevPoint = [0, 0, 0];
    var currentPoint = [0, 0, 0];
    var distanceArray = [];
    var bucketStruct = {buckets:[1, 0.5, 0.1, 0.05, 0.01, 0.005, 0.001, 0.0001, 0.00001, 0.000001, 0.0000001, 0.00000001, 0.000000001, 0], numHits: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]};
    
    for(var i = 0; i < numberVertex - 3; i+=3)
    {
        for(var k = 0; k < 3; k++)
            prevPoint[k] = vertex[i+k];
        for(var k = 0; k < 3; k++)
            currentPoint[k] = vertex[i+k+3]; 
        
        var value = vectorLength(subVectors(currentPoint, prevPoint));
        
        addToBucket(value, bucketStruct);
    }
    
    var str = "";
    for(var i = 0; i < bucketStruct.buckets.length; i++)
    {
        str += ("bucket: " + bucketStruct.buckets[i] + " has " + bucketStruct.numHits[i] + " hits \n");
    }
    window.alert(str);
    document.getElementById("Debug2").innerHTML = "minRadius = " + minRadius;
}

function addToBucket(value, bucketStruct)
{
    bucketStruct.numHits[checkBucket(value, bucketStruct.buckets)] += 1;
}

function checkBucket(value, buckets)
{
    for(var i = 0; i < buckets.length; i++)
    {
        if(value > buckets[i])
        {
            return i;
        }
    }
    return buckets.length - 1;
}

function arrayContains(array, value)
{
    for(var i = 0; i < array.length; i++)
    {
        if(array[i] == value)
        {
            return i;
        }
    }
    return -1;
}