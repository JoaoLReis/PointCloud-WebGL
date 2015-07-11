//General
var gl;
var camera = new Camera();

//Objects
var globalID = 0;
var currentObject;
var currentPolygon;
var currentPolygon2;
var appObjects = new Map();

//PARSING
var colors = [];
var vertex = [];
var numberVertex = 0;
var numberColors = 0;
var ready = false;

//FPS Counter
var numFrames = 0;
var time = 0;
var prevTime = new Date().getTime();

//BUFFERS
var depthFrameBuffer;
var colorTexture;
var depthTexture;
