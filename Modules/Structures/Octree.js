/* 
 * This file was created by João Luís Reis
 */

var Octree = function(centerPC, XYZlength)
{
    this.ID = 0;
    this.numberNodes = 0;
    this.forward = [0, 0, XYZlength.z];
    this.right = [XYZlength.x, 0, 0];
    this.up = [0, XYZlength.y, 0];
    this.root = new OctreeNode(centerPC, XYZlength, this, 0);
    this.root.init();
    this.originalCenter = new Point(centerPC.x, centerPC.y, centerPC.z);
    this.originalHL = new Point(XYZlength.x, XYZlength.y, XYZlength.z);
    this.maxDepth = 5;
    this.wireframeVertices = [];
};

Octree.prototype.init = function(points)
{
    for(var i = 0; i < points.length; i++)
    {
        this.root.insert(points[i], this.maxDepth, this);
    }
    console.log(this.numberNodes);
};

//region WIREFRAME GENERATION
Octree.prototype.generateWireframe = function()
{
    this.wireframeVertices = [];
    this.generateRootWireframe();
    this.generateRestWireframe();
};

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
};

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
};
//endregion

Octree.prototype.updatePosition = function(modelM)
{
    this.forward = vec3.transformMat4(vec3.create(), this.forward, currentPointClouds["Avatar"].getRotation());
    this.right = vec3.transformMat4(vec3.create(), this.right, currentPointClouds["Avatar"].getRotation());
    this.up = vec3.transformMat4(vec3.create(), this.up, currentPointClouds["Avatar"].getRotation());

    this.root.updatePosition(modelM);
};

Octree.prototype.checkCollision = function(bmin, bmax, results)
{
    return this.root.hardCollision(bmin, bmax, results);
};