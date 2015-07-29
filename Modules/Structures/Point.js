/* 
 * This file was created by João Luís Reis
 */

var Point = function(x, y, z)
{
    this.x = x;
    this.y = y;
    this.z = z;
    this.position = function(){return [this.x, this.y, this.z];};
}

Point.prototype.init = function()
{
    
}