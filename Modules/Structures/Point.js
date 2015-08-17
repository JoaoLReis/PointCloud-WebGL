/* 
 * This file was created by João Luís Reis
 */

var Point = function(x, y, z)
{
    this.index = 0;
    this.x = x;
    this.y = y;
    this.z = z;
    this.r = 0;
    this.g = 0;
    this.b = 0;
    this.a = 1;
    this.depth = 0;
    if(arguments.length === 4)
        this.depth = arguments[3];
    if(arguments.length === 7)
    {
        this.r = arguments[3];
        this.g = arguments[4];
        this.b = arguments[5];
        this.index = arguments[6];
    }
    this.position = function(){return [this.x, this.y, this.z];};
    this.color = function(){return [this.r, this.g, this.b, this.a];};
}

Point.prototype.init = function()
{
    
}

Point.prototype.toString = function()
{
    return "X: " + this.x + " Y: " + this.y + " Z: " + this.z + " |||||| R: " + this.r + " G: " + this.g + " B: " + this.b + " A: " + this.a;
}