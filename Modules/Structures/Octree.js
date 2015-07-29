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
    for(var i = 0; i < points.length; i++)
    {
        this.root.insert(points[i], this.maxDepth);
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
    var origin = this.root.center.position();
    var HL = this.root.halfLength;
    
//    console.log("origin: " + origin);
//    console.log("HalfLength: " + HL.x + ", " + HL.y + ", " + HL.z);

    
    //points chosen in the for are all face diagonal from the others
    for(var i = 0; i < 4; i++)
    {
        //point to draw
        var ptd = [];
        ptd[0] = origin[0];
        ptd[1] = origin[1];
        ptd[2] = origin[2];
        var xMove = (i&1 ? 1 : -1);
        var yMove = (!(i&2) ? 1 : -1);
        var zMove = (((i&1)&&(i&2)) || !((i&1)||(i&2)) ? 1 : -1);
        ptd[0] += HL.x * xMove;
        ptd[1] += HL.y * yMove;
        ptd[2] += HL.z * zMove;
        
//        console.log("xMove" + xMove);
//        console.log("yMove" + yMove);
//        console.log("zMove" + zMove);
//        console.log("ptd 0: " + ptd[0]);
//        console.log("ptd 1: " + ptd[1]);
//        console.log("ptd 2: " + ptd[2]);

        
        for(var k = 0; k < 3;  k++)
        {
            this.wireframeVertices.push(ptd);
            //the three connected vertices
            var newVertex = [];
            newVertex[0] = ptd[0];
            newVertex[1] = ptd[1];
            newVertex[2] = ptd[2];            
            newVertex[0] += (-xMove)*(k===2 ? 1 : 0)*HL.x*2 ;
            newVertex[1] += (-yMove)*(k===1 ? 1 : 0)*HL.y*2;
            newVertex[2] += (-zMove)*(k===0 ? 1 : 0)*HL.z*2;

            this.wireframeVertices.push(newVertex);
        }
    }
    
//    for(var i = 0; i < this.wireframeVertices.length; i++)
//    {
//        console.log("Vertex: " + this.wireframeVertices[i] + ", " + this.wireframeVertices[i + 1] + ", " + this.wireframeVertices[i + 2]);
//    }
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