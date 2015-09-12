/**
 * Created by João Luís Reis.
 */

var AABBNode = function(DAABB, depth)
{
    this.ID = 0;
    this.depth = depth;
    this.root = false;
    this.children = new Array(null, null);
    this.parent = DAABB;
    this.data = [];
    this.childrenCrossed;
    this.aabb;
};

// make this ndoe a branch
AABBNode.prototype.SetBranch = function(n0, n1) {
    n0.parent = this;
    n1.parent = this;

    this.children[0] = n0;
    this.children[1] = n1;
};

// make this node a leaf
AABBNode.prototype.SetLeaf = function(dat) {
    // create two-way link
    this.data = dat;
    dat.userData = this;

    this.children[0] = nullptr;
    this.children[1] = nullptr;
};

AABBNode.prototype.UpdateAABB = function(margin) {
    if (IsLeaf())
    {
        // make fat AABB
        var marginVec = [margin, margin, margin];
        aabb.minPoint = this.data.minPoint - marginVec;
        aabb.maxPoint = this.data.maxPoint + marginVec;
    }
    else
    // make union of child AABBs of child nodes
        aabb = this.children[0].aabb.Union(this.children[1].aabb);
};

AABBNode.prototype.GetSibling = function() {
        return this == this.parent.children[0] ? this.parent.children[1] : this.parent.children[0];
};

AABBNode.prototype.init = function() {
};

AABBNode.prototype.insert = function() {
};

AABBNode.prototype.isLeafNode = function() {
    return this.children[0] == null;
};