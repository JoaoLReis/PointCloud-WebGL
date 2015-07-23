/* 
 * This file was created by João Luís Reis
 */

var Octree = function()
{
    this.ID = 0;
    this.root = new OctreeNode(centerPC, XYZlength, 0);
    this.maxDepth = 10;
    this.wireframeVertices = [];
}

Octree.prototype.init = function(points)
{
    for(var i = 0; i < points.length; i++)
    {
        this.root.insert(points[i], this.maxDepth);
    }
}

Octree.prototype.generateWireframe = function()
{
    generateRootWireframe();
    generateRestWireframe();
}

Octree.prototype.generateRootWireframe = function()
{
    //origin - center of all octree
    //HL - halflength of box
    var origin = this.root.center.position;
    var HL = this.root.halfLength;
    
    //points chosen in the for are all face diagonal from the others
    for(var i = 0; i < 4; i++)
    {
        //point to draw
        var ptd = origin;
        var xMove = (i&1 ? 1 : -1);
        var yMove = (i&2 ? -1 : 1);
        var zMove = ((i&1)^(i&2) ? -1 : 1);
        ptd += HL.x * xMove;
        ptd += HL.y * yMove;
        ptd += HL.z * zMove;
        
        for(var k = 0; k < 3;  k++)
        {
            this.wireframeVertices.push(ptd);
            //the three connected vertices
            var newVertex = ptd + (-xMove)(i===2 ? 1 : 0)*HL.x*2 + (-yMove)(i===1 ? 1 : 0)*HL.y*2 + (-zMove)(i===0 ? 1 : 0)*HL.z*2;
            this.wireframeVertices.push(newVertex);
        }
    }
}

Octree.prototype.generateRestWireframe = function()
{
    var returned = this.root.generateSelfWireframe();
    if(returned !== null)
        this.wireframeVertices.push(returned);
}