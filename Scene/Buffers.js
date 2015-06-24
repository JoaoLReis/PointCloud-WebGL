//BUFFERS
//var pointVertexPositionBuffer;
//var pointVertexColorBuffer;

var depthFrameBuffer;
var depthTexture;

var laptopScreenVertexPositionBuffer;
var laptopScreenVertexNormalBuffer;
var laptopScreenVertexTextureCoordBuffer;

//function initPCBuffers() {
//    
//    //POINT CLOUD
//        //Vertex buffer
//	pointVertexPositionBuffer = gl.createBuffer();
//	gl.bindBuffer(gl.ARRAY_BUFFER, pointVertexPositionBuffer);
//	
//	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertex), gl.STATIC_DRAW);
//	pointVertexPositionBuffer.itemSize = 3;
//	pointVertexPositionBuffer.numItems = numberVertex;
//
//        //Color buffer
//	pointVertexColorBuffer = gl.createBuffer();
//	gl.bindBuffer(gl.ARRAY_BUFFER, pointVertexColorBuffer);
//        
//	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
//	pointVertexColorBuffer.itemSize = numberColors;
//	pointVertexColorBuffer.numItems = numberVertex;
//        
//}

function initDepthScreenBuffers()
{
    laptopScreenVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, laptopScreenVertexPositionBuffer);
    vertices = [
         16, 9, 0,
        0, 9, 0,
         16, 0, 0,
        0, 0, 0
        ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    laptopScreenVertexPositionBuffer.itemSize = 3;
    laptopScreenVertexPositionBuffer.numItems = 4;

    laptopScreenVertexNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, laptopScreenVertexNormalBuffer);
    var vertexNormals = [
         0.000000, 0, -1,
         0.000000, 0, -1,
         0.000000, 0, -1,
         0.000000, 0, -1
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals), gl.STATIC_DRAW);
    laptopScreenVertexNormalBuffer.itemSize = 3;
    laptopScreenVertexNormalBuffer.numItems = 4;

    laptopScreenVertexTextureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, laptopScreenVertexTextureCoordBuffer);
    var textureCoords = [
        1.0, 1.0,
        0.0, 1.0,
        1.0, 0.0,
        0.0, 0.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
    laptopScreenVertexTextureCoordBuffer.itemSize = 2;
    laptopScreenVertexTextureCoordBuffer.numItems = 4;
    
}

function createDepthTexture()
{
    depthFrameBuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, depthFrameBuffer);
    depthFrameBuffer.width = 512;
    depthFrameBuffer.height = 512;

    depthTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, depthTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, depthFrameBuffer.width, depthFrameBuffer.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

    var renderbuffer = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, depthFrameBuffer.width, depthFrameBuffer.height);

    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, depthTexture, 0);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderbuffer);

    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    
}