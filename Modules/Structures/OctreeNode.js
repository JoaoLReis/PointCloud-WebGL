/* 
 * This file was created by João Luís Reis
 */

var OctreeNode = function(centerPoint, halflengthDistance, depth)
{
    this.ID = 0;
    this.isLeaf = true;
    this.depth = depth;
    this.center = centerPoint;
    this.halfLength = halflengthDistance;
    this.children = new Array(null, null, null, null, null, null, null, null);
    this.data = [];
}

OctreeNode.prototype.init = function()
{
    
}

OctreeNode.prototype.isLeafNode = function(){
    // We are a leaf if we have no children. Since we either have none, or 
    // all eight, it is sufficient to just check the first.
    
    return this.children[0] == null;
}
                
OctreeNode.prototype.insert = function(point, maxDepth)
{
    // If this node doesn't have a data point yet assigned 
    // and it is a leaf, then we're done!
    if(this.isLeafNode()) {
        if(this.data.length == 0 || this.depth >= maxDepth) {
            this.data.push(point);
            return;
        } else {
            // We're at a leaf, but there's already something here
            // We will split this node so that it has 8 child octants
            // and then insert the old data that was here, along with 
            // this new data point

            // Save this data point that was here for a later re-insert
            var oldPoint = this.data[0];
            this.data = [];

            // Split the current node and create new empty trees for each
            // child octant.
            for(var i=0; i<8; i++) {
                    // Compute new bounding box for this child
                    var newOrigin = new Point(this.center.x, this.center.y, this.center.z);
    
                    newOrigin.x += this.halfLength.x * (i&4 ? 0.5 : -0.5);
                    newOrigin.y += this.halfLength.y * (i&2 ? 0.5 : -0.5);
                    newOrigin.z += this.halfLength.z * (i&1 ? 0.5 : -0.5);
                    this.children[i] = new OctreeNode(newOrigin, new Point(this.halfLength.x*0.5, this.halfLength.y*0.5, this.halfLength.z*0.5), this.depth + 1);
            }

            // Re-insert the old point, and insert this new point
            // (We wouldn't need to insert from the root, because we already
            // know it's guaranteed to be in this section of the tree)
            
            this.children[this.getPointOctant(oldPoint)].insert(oldPoint, maxDepth);
            this.children[this.getPointOctant(point)].insert(point, maxDepth);
        }
    } else {
            // We are at an interior node. Insert recursively into the 
            // appropriate child octant
            var octant = this.getPointOctant(point);
            this.children[octant].insert(point, maxDepth);
    }
}

/*
    Children follow a predictable pattern to make accesses simple.
    Here, - means less than 'origin' in that dimension, + means greater than.
    child:	0 1 2 3 4 5 6 7
        x:      - - - - + + + +
        y:      - - + + - - + +
        z:      - + - + - + - +
*/
OctreeNode.prototype.getPointOctant = function(point)
{
    var oct = 0;
    if(point[0] >= this.center.x) oct |= 4;
    if(point[1] >= this.center.y) oct |= 2;
    if(point[2] >= this.center.z) oct |= 1;
    
    return oct;
}

OctreeNode.prototype.generateSelfWireframe = function()
{
    if(!this.isLeafNode())
    {
        var vertexCollection = new Array(48);
        var HL = this.halfLength;
        //create vertex -> pick each center of each face of parent and add 4 vertex (axis aligned and not to center) 
        //Hammertime
        for(var i = 0; i < 6; i++)
        {
            var newCenter = new Point(this.center.x, this.center.y, this.center.z, this.depth);
            var xMove = (!(i&4)&&!(i&2) ? ((i&1)? -1 : 1) : 0);
            var yMove = (i&2 ? ((i&1)? -1 : 1) : 0);
            var zMove = (i&4 ? ((i&1)? -1 : 1) : 0);
            newCenter.x += HL.x * xMove;
            newCenter.y += HL.y * yMove;
            newCenter.z += HL.z * zMove;
            
            var aux = i*8;
            vertexCollection[aux] = newCenter;
            if(xMove !== 0)
            {
                var newPoint = new Point(newCenter.x, newCenter.y, newCenter.z, this.depth);
                
                newPoint.y += HL.y;
                vertexCollection[aux+1] = newPoint;
                
                var newPoint = new Point(newCenter.x, newCenter.y, newCenter.z, this.depth);
                
                newPoint.y -= HL.y;
                vertexCollection[aux+2] = newPoint;
                vertexCollection[aux+3] = vertexCollection[aux];
                
                var newPoint = new Point(newCenter.x, newCenter.y, newCenter.z, this.depth);
                
                newPoint.z += HL.z;
                vertexCollection[aux+4] = newPoint;
                vertexCollection[aux+5] = vertexCollection[aux];
                
                var newPoint = new Point(newCenter.x, newCenter.y, newCenter.z, this.depth);
                
                newPoint.z -= HL.z;
                vertexCollection[aux+6] = newPoint;
                vertexCollection[aux+7] = vertexCollection[aux];
            }
            else if(yMove !== 0)
            {
                var newPoint = new Point(newCenter.x, newCenter.y, newCenter.z, this.depth);
                
                newPoint.x += HL.x;
                vertexCollection[aux+1] = newPoint;
                
                var newPoint = new Point(newCenter.x, newCenter.y, newCenter.z, this.depth);
                
                newPoint.x -= HL.x;
                vertexCollection[aux+2] = newPoint;
                vertexCollection[aux+3] = vertexCollection[aux];
                
                var newPoint = new Point(newCenter.x, newCenter.y, newCenter.z, this.depth);
                
                newPoint.z += HL.z;
                vertexCollection[aux+4] = newPoint;
                vertexCollection[aux+5] = vertexCollection[aux];
                
                var newPoint = new Point(newCenter.x, newCenter.y, newCenter.z, this.depth);
                
                newPoint.z -= HL.z;
                vertexCollection[aux+6] = newPoint;
                vertexCollection[aux+7] = vertexCollection[aux];
            }
            else if(zMove !== 0)
            {
                
                var newPoint = new Point(newCenter.x, newCenter.y, newCenter.z, this.depth);
                
                newPoint.y += HL.y;
                vertexCollection[aux+1] = newPoint;
                
                var newPoint = new Point(newCenter.x, newCenter.y, newCenter.z, this.depth);
                
                newPoint.y -= HL.y;
                vertexCollection[aux+2] = newPoint;
                vertexCollection[aux+3] = vertexCollection[aux];
                
                var newPoint = new Point(newCenter.x, newCenter.y, newCenter.z, this.depth);
                
                newPoint.x += HL.x;
                vertexCollection[aux+4] = newPoint;
                vertexCollection[aux+5] = vertexCollection[aux];
                
                var newPoint = new Point(newCenter.x, newCenter.y, newCenter.z, this.depth);
                
                newPoint.x -= HL.x;
                vertexCollection[aux+6] = newPoint;
                vertexCollection[aux+7] = vertexCollection[aux];
            }
            else
            {
                alert("Something Went Wrong! octree Node generateSelfWireFrame");
            }
        }
        
        //create vertex -> pick center of parent and create a union between the center of oposite faces (6 faces -> 3 unions)
        for(var i = 0; i < 3; i++)
        {
            
        }
        
        for(var i = 0; i < this.children.length; i++)
        {
          
            var returned = this.children[i].generateSelfWireframe();
            if(returned !== null)
            {
                for(var k = 0; k < returned.length; k++)
                {
                    vertexCollection.push(returned[k]);
                }
            }
        }
        return vertexCollection;
    }
    return null;
}