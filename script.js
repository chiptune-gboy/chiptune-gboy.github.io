// Désolé, pas de mot de passe ici!

var canvas = document.getElementById("renderCanvas");
var engine = new BABYLON.Engine(canvas, true);

engine.loadingUIBackgroundColor = "#4998ff";

var camRig;

var code;

var noteA = new Audio("sounds/a.mp3");
var noteR = new Audio("sounds/r.mp3");
var noteSEL = new Audio("sounds/sel.mp3");
var noteU = new Audio("sounds/u.mp3");
var noteD = new Audio("sounds/d.mp3");
var noteB = new Audio("sounds/b.mp3");
var noteL = new Audio("sounds/l.mp3");
var noteBRR = new Audio("sounds/brr.mp3");

var createScene = function () {
    var scene = new BABYLON.Scene(engine);
    var camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(1,5,-10), scene, true);

    BABYLON.SceneLoader.Append("", "gboy.babylon", scene, function () {
        var light = scene.lights[0];
        light.intensity = 1.5;

        scene.materials.forEach(mat => {
            if(mat.ambientColor !== undefined) {
                mat.ambientColor = new BABYLON.Color3(1.2,1.2,1.2);
                mat.albedoTexture = new BABYLON.Texture("texture.png");
            }
        });

        scene.ambientColor = new BABYLON.Color3(1,1,1);

        scene.onPointerDown = function (evt, pickResult) {
            if (pickResult.hit) {
                if(pickResult.pickedMesh.name == "GB_Button_Directional_L") {
                    noteL.currentTime = 0;
                    noteL.play();
                    AddCodeLetter("l");
                } else if(pickResult.pickedMesh.name == "GB_Button_Directional_R") {
                    noteR.currentTime = 0;
                    noteR.play();
                    AddCodeLetter("r");
                } else if(pickResult.pickedMesh.name == "GB_Button_Directional_U") {
                    noteU.currentTime = 0;
                    noteU.play();
                    AddCodeLetter("u");
                } else if(pickResult.pickedMesh.name == "GB_Button_Directional_D") {
                    noteD.currentTime = 0;
                    noteD.play();
                    AddCodeLetter("d");
                } else if(pickResult.pickedMesh.name == "GB_Button_Start") {
                    noteBRR.currentTime = 0;
                    noteBRR.play();
                    AddCodeLetter("s");
                } else if(pickResult.pickedMesh.name == "GB_Button_Select") {
                    noteSEL.currentTime = 0;
                    noteSEL.play();
                    AddCodeLetter("e");
                } else if(pickResult.pickedMesh.name == "GB_Button_A") {
                    noteA.currentTime = 0;
                    noteA.play();
                    AddCodeLetter("a");
                } else if(pickResult.pickedMesh.name == "GB_Button_B") {
                    noteB.currentTime = 0;
                    noteB.play();
                    AddCodeLetter("b");
                }
            }
        };


        camRig = scene.getMeshByName("Cam Rig");
        camRig.rotation = new BABYLON.Vector3(0, 0, 0);
    
        document.addEventListener('mousemove', e => {
            let mouseX = e.pageX / window.innerWidth;
            let mouseY = e.pageY / window.innerHeight;
            camRig.rotation = new BABYLON.Vector3((mouseY * 0.75 - 0.375) - 0.2, mouseX * 1 - 0.5, 0);
        });

        scene.clearColor = (1, 1, 1, 0.0);
        scene.setActiveCameraByName("Main Camera");
    });

    return scene;
};

var scene = createScene();
var useGyro = false;

if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    useGyro = true;
}

engine.runRenderLoop(function () {
    scene.render();
});


window.addEventListener("resize", function () {
    engine.resize();
});

var xGyro = 0;
var yGyro = 0;

function handleMotion(event) {
    xGyro = (clamp(event.accelerationIncludingGravity.x, -4 , 4)) / -6;
    yGyro = ((clamp(event.accelerationIncludingGravity.y, -1, 7) + 1) / 8) - 0.6;
}

window.addEventListener("devicemotion", handleMotion);

setTimeout(rotateLoop, 30);

function rotateLoop() {
    if(useGyro) {
        if(camRig != null) {
            var rotation = camRig.rotation;
            rotation.x = lerp(rotation.x, yGyro, 0.2);
            rotation.y = lerp(rotation.y, xGyro, 0.2);
            camRig.rotation = rotation;
        }
    }
    setTimeout(rotateLoop, 30);
}

function lerp(a, b, t) {
    return a + (b - a) * t;
}

function min(a, b) {
    return a < b ? a : b;
}

function max(a, b) {
    return a > b ? a : b;
}

function clamp(value, minVal, maxVal) {
    if(minVal < maxVal) {
        return min(max(value, minVal), maxVal);
    } else {
        return max(min(value, minVal), maxVal);
    }
}

var codeRestart = window.setTimeout(ResetCodeString, 3000);
var box = document.getElementById("box");

function RestartCodeResetTimer() {
    window.clearTimeout(codeRestart);
    codeRestart = window.setTimeout(ResetCodeString, 3000);
}

function ResetCodeString() {
    code = "";
}


function AddCodeLetter(letter) {
    code += letter;
    RestartCodeResetTimer();
    CheckCode();
}

// C'est juste un easter egg, vous affolez pas
function CheckCode() {
    if(code.endsWith("uuddlrlrba")) {
        box.innerHTML = "Malin ! Mais non.";
        ResetCodeString();
        box.classList.add("animated");
        window.setTimeout(HideBox, 3000);
    }
}

function HideBox() {
    box.innerHTML = "";
    box.classList.remove("animated");
}