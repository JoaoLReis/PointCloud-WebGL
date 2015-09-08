/* 
 * This file was created by João Luís Reis
 */

//if it is root arguments (OriginPoint, OriginHalfLength, Octree)
//if it is not root arguments (Center, HL, Octree, depth)
var OctreeNode = function(Center, HL, Octree, depth)
{
    this.ID = 0;
//    this.childIndex = 0;
    this.depth = depth;
    this.root = false;
    this.origin = new Point(arguments[0].x, arguments[0].y, arguments[0].z); //Point structure
    this.HL = new Point(arguments[1].x, arguments[1].y, arguments[1].z); //Point structure
    this.halfLength = new Point(arguments[1].x, arguments[1].y, arguments[1].z);
    this.center = new Point(arguments[0].x, arguments[0].y, arguments[0].z);
    this.children = new Array(null, null, null, null, null, null, null, null);
    this.octree = arguments[2];
    this.forward = [0, 0, arguments[1].z];
    this.right = [arguments[1].x, 0, 0];
    this.up = [0, arguments[1].y, 0];
    this.data = [];
};

OctreeNode.prototype.init = function()
{
    this.updateDirections();
};

//region OCTREE BUILDING FUNCTIONS
OctreeNode.prototype.isLeafNode = function(){
    // We are a leaf if we have no children. Since we either have none, or 
    // all eight, it is sufficient to just check the first.
    
    return this.children[0] == null;
};
                
OctreeNode.prototype.insert = function(point, maxDepth, Octree)
{
    // If this node doesn't have a data point yet assigned 
    // and if it is a leaf, then we're done!
    if(this.isLeafNode()) {
        if(this.data.length == 0 || this.depth >= maxDepth) {
            this.data.push(point);
            return;
        } else {
            // We're at a leaf, but there's already something here
            // We will split this node so that it has 8 child octants
            // and then insert the old data that was here, along with 
            // this new data point
            Octree.numberNodes += 8;
            // Save this data point that was here for a later re-insert
            var oldPoint = this.data[0];
            this.data = [];

            // Split the current node and create new empty trees for each
            // child octant.
            for(var i=0; i<8; i++) {
                    // Compute new bounding box for this child
                    var newOrigin = new Point(this.origin.x, this.origin.y, this.origin.z);
    
                    newOrigin.x += this.HL.x * (i&4 ? 0.5 : -0.5);
                    newOrigin.y += this.HL.y * (i&2 ? 0.5 : -0.5);
                    newOrigin.z += this.HL.z * (i&1 ? 0.5 : -0.5);
                    
                    this.children[i] = new OctreeNode(newOrigin, new Point(this.HL.x*0.5, this.HL.y*0.5, this.HL.z*0.5), Octree, this.depth + 1);
            }

            // Re-insert the old point, and insert this new point
            // (We wouldn't need to insert from the root, because we already
            // know it's guaranteed to be in this section of the tree)
            
            this.children[this.getPointOctant(oldPoint)].insert(oldPoint, maxDepth, Octree);
            this.children[this.getPointOctant(point)].insert(point, maxDepth, Octree);
        }
    } else {
            // We are at an interior node. Insert recursively into the 
            // appropriate child octant
            var octant = this.getPointOctant(point);
            this.children[octant].insert(point, maxDepth, Octree);
    }
};

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
    var center = this.origin;
    if(point.x >= center.x) oct |= 4;
    if(point.y >= center.y) oct |= 2;
    if(point.z >= center.z) oct |= 1;
    
    return oct;
};
//endregion

//region COLLISION DETECTION FUNCTIONS
//We are sending all points contained in the node for debug - send only center or node for performance
OctreeNode.prototype.simpleCollision = function(bmin, bmax, results) {
    // If we're at a leaf node, just see if the current data point is inside
    // the query bounding box
    collisionManager.numNodes++;
    if(this.isLeafNode()) {
        if(this.data.length > 0) {
            for(var i = 0; i < this.data.length; i++)
            {
                var p = this.data[i];
                results.results.push(p);
            }
        }
        return results;
    } else {
        // We're at an interior node of the tree. We will check to see if
        // the query bounding box lies outside the octants of this node.
        for(var i = 0; i < 8; i++) {
            // Compute the min/max corners of this child octant
            var cmax = new Point(this.children[i].center.x + this.children[i].halfLength.x, this.children[i].center.y + this.children[i].halfLength.y, this.children[i].center.z + this.children[i].halfLength.z);
            var cmin = new Point(this.children[i].center.x - this.children[i].halfLength.x, this.children[i].center.y - this.children[i].halfLength.y, this.children[i].center.z - this.children[i].halfLength.z);
            
            // If the query rectangle is outside the child's bounding box, 
            // then continue
            if(cmax.x<bmin.x || cmax.y<bmin.y || cmax.z<bmin.z) continue;
            if(cmin.x>bmax.x || cmin.y>bmax.y || cmin.z>bmax.z) continue;

            // At this point, we've determined that this child is intersecting 
            // the query bounding box
            this.children[i].simpleCollision(bmin,bmax, results);
        } 
        return results;
    }
};
                
OctreeNode.prototype.hardCollision = function(bmin, bmax, results) {
    // If we're at a leaf node, just see if the current data point is inside
    // the query bounding box

    if(this.isLeafNode()) {
        if(this.data.length > 0) {
            for(var i = 0; i < this.data.length; i++)
            {
                var p = this.data[i];
                if(p.x>bmax.x || p.y>bmax.y || p.z>bmax.z) continue;
                if(p.x<bmin.x || p.y<bmin.y || p.z<bmin.z) continue;
                results.results.push(p);
            }
        }
    } else {
        // We're at an interior node of the tree. We will check to see if
        // the query bounding box lies outside the octants of this node.
        for(var i = 0; i < 8; i++) {
            // Compute the min/max corners of this child octant
            var cmax = new Point(this.children[i].center.x + this.children[i].halfLength.x, this.children[i].center.y + this.children[i].halfLength.y, this.children[i].center.z + this.children[i].halfLength.z);
            var cmin = new Point(this.children[i].center.x - this.children[i].halfLength.x, this.children[i].center.y - this.children[i].halfLength.y, this.children[i].center.z - this.children[i].halfLength.z);
            
            // If the query rectangle is outside the child's bounding box, 
            // then continue
            if(cmax.x<bmin.x || cmax.y<bmin.y || cmax.z<bmin.z) continue;
            if(cmin.x>bmax.x || cmin.y>bmax.y || cmin.z>bmax.z) continue;

            // At this point, we've determined that this child is intersecting 
            // the query bounding box
            this.children[i].hardCollision(bmin,bmax,results);
        }  
    }
};
//endregion

//region WIREFRAME GENERATION
OctreeNode.prototype.generateSelfWireframe = function()
{
    if(!this.isLeafNode())
    {
        var vertexCollection = new Array(48);
        var HL = this.halfLength;
        var center = this.center;
        //create vertex -> pick each center of each face of parent and add 4 vertex (axis aligned and not to center) 
        //Hammertime
        for(var i = 0; i < 6; i++)
        {
            var newCenter = new Point(center.x, center.y, center.z, this.depth);
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
                
                newPoint = new Point(newCenter.x, newCenter.y, newCenter.z, this.depth);
                
                newPoint.y -= HL.y;
                vertexCollection[aux+2] = newPoint;
                vertexCollection[aux+3] = vertexCollection[aux];
                
                newPoint = new Point(newCenter.x, newCenter.y, newCenter.z, this.depth);
                
                newPoint.z += HL.z;
                vertexCollection[aux+4] = newPoint;
                vertexCollection[aux+5] = vertexCollection[aux];
                
                newPoint = new Point(newCenter.x, newCenter.y, newCenter.z, this.depth);
                
                newPoint.z -= HL.z;
                vertexCollection[aux+6] = newPoint;
                vertexCollection[aux+7] = vertexCollection[aux];
            }
            else if(yMove !== 0)
            {
                var newPoint = new Point(newCenter.x, newCenter.y, newCenter.z, this.depth);
                
                newPoint.x += HL.x;
                vertexCollection[aux+1] = newPoint;
                
                newPoint = new Point(newCenter.x, newCenter.y, newCenter.z, this.depth);
                
                newPoint.x -= HL.x;
                vertexCollection[aux+2] = newPoint;
                vertexCollection[aux+3] = vertexCollection[aux];
                
                newPoint = new Point(newCenter.x, newCenter.y, newCenter.z, this.depth);
                
                newPoint.z += HL.z;
                vertexCollection[aux+4] = newPoint;
                vertexCollection[aux+5] = vertexCollection[aux];
                
                newPoint = new Point(newCenter.x, newCenter.y, newCenter.z, this.depth);
                
                newPoint.z -= HL.z;
                vertexCollection[aux+6] = newPoint;
                vertexCollection[aux+7] = vertexCollection[aux];
            }
            else if(zMove !== 0)
            {
                
                var newPoint = new Point(newCenter.x, newCenter.y, newCenter.z, this.depth);
                
                newPoint.y += HL.y;
                vertexCollection[aux+1] = newPoint;
                
                newPoint = new Point(newCenter.x, newCenter.y, newCenter.z, this.depth);
                
                newPoint.y -= HL.y;
                vertexCollection[aux+2] = newPoint;
                vertexCollection[aux+3] = vertexCollection[aux];
                
                newPoint = new Point(newCenter.x, newCenter.y, newCenter.z, this.depth);
                
                newPoint.x += HL.x;
                vertexCollection[aux+4] = newPoint;
                vertexCollection[aux+5] = vertexCollection[aux];
                
                newPoint = new Point(newCenter.x, newCenter.y, newCenter.z, this.depth);
                
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
};
//endregion

//region OCTREE UPDATE
OctreeNode.prototype.updateDirections = function()
{
    this.forward = [this.octree.forward[0] >> this.depth, this.octree.forward[1] >> this.depth,this.octree.forward[2] >> this.depth];
    this.right = [this.octree.right[0] >> this.depth, this.octree.right[1] >> this.depth,this.octree.right[2] >> this.depth];
    this.up = [this.octree.up[0] >> this.depth, this.octree.up[1] >> this.depth,this.octree.up[2] >> this.depth];
};

OctreeNode.prototype.updatePosition = function(modelM)
{
    if(!this.isLeafNode())
    {
        for(var i = 0; i < this.children.length; i++)
        {
            this.children[i].updatePosition(modelM);
        }
    }
    
    var newCenter = vec4.fromValues(this.origin.x, this.origin.y, this.origin.z, 1);
    var newHL = vec4.fromValues(this.HL.x, this.HL.y, this.HL.z, 1);
    
    newCenter = vec4.transformMat4(vec4.create(), newCenter, modelM);    
    //newHL = vec4.transformMat4(vec4.create(), newHL, mat4.invert(mat4.create(), camera.orientation()));
    newHL = vec4.transformMat4(vec4.create(), newHL, currentPointClouds["Avatar"].getRotation());

    //this.updateDirections();
    
    this.center.x = newCenter[0];
    this.center.y = newCenter[1];
    this.center.z = newCenter[2];
//    if(this.depth === 0)
//    {
//    console.log(this.center.x);
//    console.log(this.center.y);
//    console.log(this.center.z);
//    }
    this.halfLength.x = newHL[0];
    this.halfLength.y = newHL[1];
    this.halfLength.z = newHL[2];
};
//endregion