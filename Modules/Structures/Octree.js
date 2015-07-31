/* 
 * This file was created by João Luís Reis
 */

var Octree = function(centerPC, XYZlength)
{
    this.ID = 0;
    this.root = new OctreeNode(centerPC, XYZlength, 0);
    this.maxDepth = 8;
    this.wireframeVertices = [];
}

Octree.prototype.init = function(points)
{
    for(var i = 0; i < points.length; i+=3)
    {
        this.root.insert([points[i], points[i+1], points[i+2]], this.maxDepth);
    }
}

Octree.prototype.generateWireframe = function()
{
    this.generateRootWireframe();
    this.generateRestWireframe();
}

Octree.prototype.generateRootWireframe = function()
{
    //origin - center of all octree
    //HL - halflength of box
    var origin = this.root.center;
    var HL = this.root.halfLength;
    
    //points chosen in the for are all face diagonal from the others
    for(var i = 0; i < 4; i++)
    {
        //point to draw
        var ptd = new Point(origin.x, origin.y, origin.z);
        var xMove = (i&1 ? 1 : -1);
        var yMove = (!(i&2) ? 1 : -1);
        var zMove = (((i&1)&&(i&2)) || !((i&1)||(i&2)) ? 1 : -1);
        ptd.x += HL.x * xMove;
        ptd.y += HL.y * yMove;
        ptd.z += HL.z * zMove;
        
        for(var k = 0; k < 3;  k++)
        {
            this.wireframeVertices.push(ptd);
            //the three connected vertices
            var newVertex = new Point(ptd.x, ptd.y, ptd.z);       
            newVertex.x += (-xMove)*(k===2 ? 1 : 0)*HL.x*2 ;
            newVertex.y += (-yMove)*(k===1 ? 1 : 0)*HL.y*2;
            newVertex.z += (-zMove)*(k===0 ? 1 : 0)*HL.z*2;

            this.wireframeVertices.push(newVertex);
        }
    }
}

Octree.prototype.generateRestWireframe = function()
{
    var returned = this.root.generateSelfWireframe();
    if(returned !== null)
    {
        for(var i = 0; i < returned.length; i++)
        {
            this.wireframeVertices.push(returned[i]);
        }
    }
}