/* 
 * This file was created by João Luís Reis
 */

var CollisionDetectionManager = function()
{
    this.numNodes = 0;
};

CollisionDetectionManager.prototype.init = function()
{
};

CollisionDetectionManager.prototype.computeCollision = function()
{
    this.numNodes = 0;
    var results = { results:[]};
    var avatar = currentPointClouds["Avatar"];
    if(avatar == null)
        return;
    var rootNode = avatar.octreeManager.pointCloudOctree.root;
    var keysPC = Object.keys(currentPointClouds);
    for(var i = 0; i < keysPC.length; i++)
    {
        var currentPC = currentPointClouds[keysPC[i]];
        if(keysPC[i] === "Avatar") continue;
        var now = new Date().getTime();
        checkCollision(rootNode, currentPC, results);
        document.getElementById("DebugString4").innerHTML = "Check Collision Time: " + (new Date().getTime() - now);
        now = new Date().getTime();
        for(var k = 0; k < results.results.length; k++)
        {
            var data = new Float32Array(3);
            data[0] = 1;
            data[1] = 0;
            data[2] = 0;
            currentPC.initColorBuffer(results.results[k].index, data);
            //currentPC.colors[results.results[k].index] = 1;
            //currentPC.colors[results.results[k].index + 1] = 0;
            //currentPC.colors[results.results[k].index + 2] = 0;
        }
        //currentPC.initColorBuffer(0, 0);
        document.getElementById("DebugString5").innerHTML = "Change Color Time: " + (new Date().getTime() - now);
//        console.log(results.results.length);
//        console.log(this.numNodes);
    }
};

function checkCollision(node, PC, results)
{
    var theoMin = new Point(node.center.x - node.halfLength.x, node.center.y - node.halfLength.y, node.center.z - node.halfLength.z);
    var theoMax = new Point(node.center.x + node.halfLength.x, node.center.y + node.halfLength.y, node.center.z + node.halfLength.z);
    var bmin = new Point(theoMin.x < theoMax.x ? theoMin.x : theoMax.x, theoMin.y < theoMax.y ? theoMin.y : theoMax.y, theoMin.z < theoMax.z ? theoMin.z : theoMax.z);
    var bmax = new Point(theoMin.x > theoMax.x ? theoMin.x : theoMax.x, theoMin.y > theoMax.y ? theoMin.y : theoMax.y, theoMin.z > theoMax.z ? theoMin.z : theoMax.z);

//    console.log(node.center.toString());
//    console.log(node.halfLength.toString());
    PC.checkCollision(bmin, bmax, results);
}

function checkIfInsideAvatarBB()
{

}