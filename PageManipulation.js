/*
 * This file was created by João Luís Reis
 */

var parsed = false;
var synthed = false;

function choiceOfPCType(type)
{
    switch(type)
    {
        case 0:
            parsed = true;
            synthed = false;
            document.getElementById("bInit").style.visibility = "hidden";
            document.getElementById("input").style.visibility = "visible";
            document.getElementById("submitPly").style.visibility = "visible";
            break;
        case 1:
            synthed = true;
            parsed = false;
            document.getElementById("bInit").style.visibility = "visible";
            document.getElementById("input").style.visibility = "hidden";
            document.getElementById("submitPly").style.visibility = "hidden";
            document.getElementById("selector").style.visibility = "hidden";
            break;
    }
}

var inited = false;

function submitButton()
{
    submitPly();
    pcSubmitted = true;
    document.getElementById("bInit").style.visibility = "visible";
}

function initButton()
{
    webGLInit();
    if(synthed)
    document.getElementById("synth").style.visibility = "visible";
    if(parsed)
        document.getElementById("bParse").style.visibility = "visible";
    inited = true;
}

function parseButton()
{
    ParsePly();
    document.getElementById("bStart").style.visibility = "visible";
}

function synthPCButton()
{
    createSynthPC();
    document.getElementById("bStart").style.visibility = "visible";
}

function startButton()
{
    webGLStart();
}