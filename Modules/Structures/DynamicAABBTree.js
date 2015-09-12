/**
 * Created by Jo�o Lu�s Reis.
 */

var DynamicAABBTree = function() {
    this.root;
    this.pairs;/*ColliderPairList*/
    this.margin = 0.2;
    this.invalidNodes;/*NodeList*/
    this.ID = 0;
    this.numberNodes = 0;
    this.wireframeVertices = [];
};

DynamicAABBTree.prototype.Add = function(aabb){
    if (this.root)
    {
        // not first node, insert node to tree
        var node = new AABBNode();
        node.SetLeaf(aabb);
        node.UpdateAABB(this.margin);
        this.InsertNode(node, this.root);
    }
    else
    {
        // first node, make root
        this.root = new AABBNode();
        this.root.SetLeaf(aabb);
        this.root.UpdateAABB(this.margin);
    }
};
DynamicAABBTree.prototype.Remove = function(aabb){
    var node = aabb.userData;

    // remove two-way link
    node.data = null;
    aabb.userData = null;

    this.RemoveNode(node);
};
DynamicAABBTree.prototype.Update = function(){
    if (this.root)
    {
        if (this.root.isLeafNode())
            this.root.UpdateAABB(this.margin);
        else
        {
            // grab all invalid nodes
            this.invalidNodes.clear();
            this.UpdateNodeHelper(this.root, this.invalidNodes);

            // re-insert all invalid nodes
            for (var i = 0; i < this.invalidNodes.length; i++)
            {
                var node = this.invalidNodes[i];
                // grab parent link
                // (pointer to the pointer that points to parent)
                var parent = node.parent;
                var sibling = node.GetSibling();
                var parentLink =
                    parent.parent
                        ? (parent == parent.parent.children[0]
                            ? parent.parent.children[0]
                            : parent.parent.children[1])
                        : this.root;

                // replace parent with sibling
                sibling.parent =
                    parent.parent
                        ? parent.parent
                        : null; // root has null parent

                parentLink = sibling;

                // re-insert node
                node.UpdateAABB(this.margin);
                this.InsertNode(node, this.root);
            }
            this.invalidNodes.clear();
        }
    }
};
DynamicAABBTree.prototype.UpdateNodeHelper = function(node, invalidNodes){
    if (node.isLeafNode())
    {
        // check if fat AABB doesn't
        // contain the collider's AABB anymore
        if (!node.aabb.Contains(node.data.aabb))
            invalidNodes.push_back(node);
    }
    else
    {
        this.UpdateNodeHelper(node.children[0], invalidNodes);
        this.UpdateNodeHelper(node.children[1], invalidNodes);
    }
};

DynamicAABBTree.prototype.ComputePairs = function(){
    this.pairs.clear();

    // early out
    if (!this.root || this.root.isLeafNode())
        return this.pairs;

    // clear Node::childrenCrossed flags
    this.ClearChildrenCrossFlagHelper(this.root);

    // base recursive call
    this.ComputePairsHelper(this.root.children[0],
        this.root.children[1]);

    return m_pairs;
};
DynamicAABBTree.prototype.Pick = function(point){
    var q; //queue
    if (this.root)
        q.push(this.root);

    while (!q.empty())
    {
        var node = q.front();
        q.pop();

        if (node.isLeafNode())
        {
            if (node.data.Collides(pos))
                result.push_back(node.data.Collider());
        }
        else
        {
            q.push(node.children[0]);
            q.push(node.children[1]);
        }
    }
};
DynamicAABBTree.prototype.Query = function(aabb, out){};
DynamicAABBTree.prototype.RayCast = function(ray, maxDistance){
    var result; // raycastresult
    result.hit = false;
    result.t = 1.0;

    var q; //queue
    if (this.root)
    {
        q.push(this.root);
    }

    while (!q.empty())
    {
        var node = q.front();
        q.pop();

        var colliderAABB = node.data;
        var aabb =
            node.isLeafNode()
                ? colliderAABB
                : node.aabb;

        var t;
        if (RayAABB(ray, aabb, maxDistance, t))
        {
            // the node cannot possibly give closer results, skip
            if (result.hit && result.t < t)
                continue;

            if (node.IsLeaf())
            {
                var collider = colliderAABB.Collider();
                var n; //vec3
                var t; //float
                if (collider.RayCast(ray, maxDistance, t, n))
                {
                    if (result.hit) // compare hit
                    {
                        if (t < result.t)
                        {
                            result.collider = collider;
                            result.t = t;
                            result.normal = n;
                            result.intersection = ray.pos
                                + t * maxDistance * ray.dir.Normalized();
                        }
                    }
                    else // first hit
                    {
                        result.hit = true;
                        result.collider = collider;
                        result.t = t;
                        result.ray = ray;
                        result.normal = n;
                        result.intersection = ray.pos
                            + t * maxDistance * ray.dir.Normalized();
                    }
                }
            }
            else // is branch
            {
                q.push(node.children[0]);
                q.push(node.children[1]);
            }
        }
    }

    return result;
};

DynamicAABBTree.prototype.InsertNode = function(node, parent){
    var p =  parent;
    if (p.isLeafNode())
    {
        // parent is leaf, simply split
        var newParent = new AABBNode();
        newParent.parent = p.parent;
        newParent.SetBranch(node, p);
        parent = newParent;
    }
    else
    {
        // parent is branch, compute volume differences
        // between pre-insert and post-insert
        var aabb0 = p.children[0].aabb;
        var aabb1 = p.children[1].aabb;
        var volumeDiff0 =
        aabb0.Union(node.aabb).Volume() - aabb0.Volume();
        var volumeDiff1 =
        aabb1.Union(node.aabb).Volume() - aabb1.Volume();

        // insert to the child that gives less volume increase
        if (volumeDiff0 < volumeDiff1)
            this.InsertNode(node, p.children[0]);
        else
            this.InsertNode(node, p.children[1]);
    }

    // update parent AABB
    // (propagates back up the recursion stack)
    parent.UpdateAABB(this.margin);
};
DynamicAABBTree.prototype.RemoveNode = function(node){
    // replace parent with sibling, remove parent node
    var parent = node.parent;
    if (parent) // node is not root
    {
        var sibling = node.GetSibling();
        if (parent.parent) // if there's a grandparent
        {
            // update links
            sibling.parent = parent.parent;
            if(parent == parent.parent.children[0])
                parent.parent.children[0] = sibling;
            else parent.parent.children[1] = sibling;
        }
        else // no grandparent
        {
            // make sibling root
            var sibling = node.GetSibling();
            this.root = sibling;
            sibling.parent = null;
        }
    }
    else // node is root
    {
        this.root = null;
    }
};
//DynamicAABBTree.prototype.ComputePairsHelper = function(n0, n1){
//    if (n0.isLeafNode())
//    {
//        // 2 leaves, check proxies instead of fat AABBs
//        if (n1->IsLeaf())
//        {
//            if (n0->data->Collides(*n1->data))
//            m_pairs.push_back(AllocatePair(n0->data->Collider(),
//                n1->data->Collider()));
//        }
//        // 1 branch / 1 leaf, 2 cross checks
//        else
//        {
//            CrossChildren(n1);
//            ComputePairsHelper(n0, n1->children[0]);
//            ComputePairsHelper(n0, n1->children[1]);
//        }
//    }
//    else
//    {
//        // 1 branch / 1 leaf, 2 cross checks
//        if (n1->IsLeaf())
//        {
//            CrossChildren(n0);
//            ComputePairsHelper(n0->children[0], n1);
//            ComputePairsHelper(n0->children[1], n1);
//        }
//        // 2 branches, 4 cross checks
//        else
//        {
//            CrossChildren(n0);
//            CrossChildren(n1);
//            ComputePairsHelper(n0->children[0], n1->children[0]);
//            ComputePairsHelper(n0->children[0], n1->children[1]);
//            ComputePairsHelper(n0->children[1], n1->children[0]);
//            ComputePairsHelper(n0->children[1], n1->children[1]);
//        }
//    } // end of if (n0->IsLeaf())
//};
//DynamicAABBTree.prototype.ClearChildrenCrossFlagHelper = function(node){
//    node->childrenCrossed = false;
//    if (!node->IsLeaf())
//    {
//        ClearChildrenCrossFlagHelper(node->children[0]);
//        ClearChildrenCrossFlagHelper(node->children[1]);
//    }
//};
//DynamicAABBTree.prototype.CrossChildren = function(node){
//    if (!node->childrenCrossed)
//    {
//        ComputePairsHelper(node->children[0],
//            node->children[1]);
//        node->childrenCrossed = true;
//    }
//};

DynamicAABBTree.prototype.init = function() {
};

//region WIREFRAME GENERATION
DynamicAABBTree.prototype.generateWireframe = function()
{
    this.wireframeVertices = [];
    this.generateRootWireframe();
    this.generateRestWireframe();
};

DynamicAABBTree.prototype.generateRootWireframe = function()
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

DynamicAABBTree.prototype.generateRestWireframe = function()
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