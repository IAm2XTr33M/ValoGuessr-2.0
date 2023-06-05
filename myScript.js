var devMode = false;


window.onload = function() {
    if ( document.URL.includes("StartGame.html") ) {
        GameSettings();
    }
    if ( document.URL.includes("Game.html") && !document.URL.includes("StartGame.html")) {
        StartGame();
    }
}

function info(info){
    var text;
    switch(info){
        case "difficulty":
            text ="Please keep in mind difficulty is not set for each level.\n"+
                  "\n"+
                  "Each level has a difficulty between 1 and 10\n"+
                  "\n"+
                  "If you pick Impossible it will get levels"+
                  " with a difficulty between 6 and 10\n"+
                  "\n"+
                  "Mid difficulty can also get a difficulty of 6\n"+
                  "\n"+
                  "This means that the levels in Mid and Impossible"+
                  " COULD be the same, but in general impossible"+
                  " will be way harder on average\n"+
                  "\n"+
                  "Wanted to clear up some confusion lol";
        break;
    }
    alert(text);
}

var mapList = ["Bind","Breeze","Haven","IceBox","Split","Pearl","Fracture","Ascent","Lotus"];
const difficulties = ["Easy","Mid","Hard","Impossible","Random"];

var sessionSettings = {
    currentSelectedMaps : [false,false,false,false,false,false,false,false,false],
    currentRoundAmmount : 0,
    currentTimeLimit : 0,
    currentDifficulty : 0,
    modifiers : {
        guessMap: false,
        outOfBounds: false,
        inverted: false,
        blurry: false,
        pixelated: false,
        screen50: false,
        blackWhite: false
    }
}

function GameSettings(){
    RoundAmountSliderLoad();
    TimeLimitSliderLoad();
    DifficultyButtonLoad();
}

function chooseMap(map){
    if(map < 9){
        sessionSettings.currentSelectedMaps[map] = !sessionSettings.currentSelectedMaps[map];
        if(sessionSettings.currentSelectedMaps[map]){
            document.getElementById("map"+map.toString()).classList.add("mapButtonSelected");
        }
        else{
            document.getElementById("map"+map.toString()).classList.remove("mapButtonSelected");
        }
    }
    else{
        var allOn = true;
        for(var i = 0 ; i < sessionSettings.currentSelectedMaps.length;i++){
            if(!sessionSettings.currentSelectedMaps[i]){
                allOn =false;
            }
        }
        for(var i = 0; i< sessionSettings.currentSelectedMaps.length;i++){
            var classList = document.getElementById("map"+i.toString()).classList; 
            if(allOn && classList.contains("mapButtonSelected")){
                sessionSettings.currentSelectedMaps[i] = false;
                classList.remove("mapButtonSelected");
            }
            else{
                sessionSettings.currentSelectedMaps[i] = true;
                classList.add("mapButtonSelected");
            }
        }
    }
}

function RoundAmountSliderLoad(){
    var roundAmmountSlider = document.getElementById("roundAmmountSlider");
    var roundAmmountSliderText = document.getElementById("roundAmmountSliderText");
    changeValue(roundAmmountSlider.value);
    
    roundAmmountSlider.oninput = function() {
        changeValue(this.value);
    }

    function changeValue(value){
        sessionSettings.currentRoundAmmount = value;
        if(value == 1){
            roundAmmountSliderText.innerHTML = "&nbsp;&nbsp;" + value + " round";
        }
        else if(value < 10){
            roundAmmountSliderText.innerHTML = "&nbsp;&nbsp;" + value + " rounds";
        }
        else{
            roundAmmountSliderText.innerHTML = value + " rounds";
        }
    }
}

function TimeLimitSliderLoad(){
    var timeLimitSlider = document.getElementById("timeLimitSlider");
    var timeLimitSliderText = document.getElementById("timeLimitSliderText");
    changeValue(timeLimitSlider.value);
    
    timeLimitSlider.oninput = function(){
        changeValue(this.value);
    }

    function changeValue(value){
        sessionSettings.currentTimeLimit = value;
        if(value < 10){
            if(value == 0){
                timeLimitSliderText.innerHTML = "&nbsp;&nbsp;" + "No Limit" + "&nbsp;";
            }
            else{
                timeLimitSliderText.innerHTML = "&nbsp;" + value + " Seconds";
            }
        }
        else{
            timeLimitSliderText.innerHTML = value + " Seconds";
        }
    }
}

function DifficultyButtonLoad(){
    var DifficultyButton = document.getElementById("difficultyButton");
    var DifficultyText = document.getElementById("difficultyText");
    DifficultyText.innerHTML = "-" + difficulties[sessionSettings.currentDifficulty] + "-";

    DifficultyButton.onclick = function() {
        if(sessionSettings.currentDifficulty < difficulties.length-1){
            sessionSettings.currentDifficulty++;
        }
        else{
            sessionSettings.currentDifficulty = 0;
        }
        DifficultyText.innerHTML = "-" + difficulties[sessionSettings.currentDifficulty] + "-";
    }
}

function chooseModifier(key){
    var classList = document.getElementById("modifier-"+key).classList;
    
    sessionSettings.modifiers[key] = !sessionSettings.modifiers[key];

    if(sessionSettings.modifiers[key]){
        classList.add("mapButtonSelected");
    }
    else{
        classList.remove("mapButtonSelected");
    }
}

var CurrentSelectedMap = null;

function SelectMap(map){
    //Loop trough all 9 of the map buttons and turn them off
    for(var i = 0; i < 9;i++){
        var button = document.getElementById("mapbut"+i.toString());
        if(button.classList.contains("selectedMap")){
            button.classList.remove("selectedMap");
        }
    }
    
    switch(map){
        case 0 : CurrentSelectedMap = "Bind"; break;
        case 1 : CurrentSelectedMap = "Breeze"; break;
        case 2 : CurrentSelectedMap = "Haven"; break;
        case 3 : CurrentSelectedMap = "IceBox"; break;
        case 4 : CurrentSelectedMap = "Split"; break;
        case 5 : CurrentSelectedMap = "Pearl"; break;
        case 6 : CurrentSelectedMap = "Fracture"; break;
        case 7 : CurrentSelectedMap = "Ascent"; break;
        case 8 : CurrentSelectedMap = "Lotus"; break;
    }

    document.getElementById("mapbut"+map.toString()).classList.add("selectedMap");
    document.getElementById("mapImg").src = "game/maps/"+CurrentSelectedMap+"/map.png";
}

function StartGameButton(){
    if(typeof(sessionStorage) != 'undefined') {
        sessionStorage.setItem("settings", JSON.stringify(sessionSettings));
    }
    else{
        alert("Something went wrong, please try again or try a different browser. Sorry.")
    }
    window.location = "Game.html";
}

function StartGame(){
    if (sessionStorage.getItem("settings")) {
        sessionSettings = JSON.parse(sessionStorage.getItem("settings"));
    }
    else{
        alert("Something went wrong, please try again or try a different browser. Sorry.")
    }

    if(sessionSettings.modifiers.guessMap){
        document.getElementById("mapSelect").style.display = "flex";
    }
    
    GetAllMapLevels();
}

var selectedMapsLevels = [];

function GetAllMapLevels(){
    var alloff = true;
    for(var i = 0; i < sessionSettings.currentSelectedMaps.length; i++){
        if(sessionSettings.currentSelectedMaps[i]){
            alloff = false;
            switch(i){
                case 0 : selectedMapsLevels.push(BindLevels); break;
                case 1 : selectedMapsLevels.push(BreezeLevels); break;
                case 2 : selectedMapsLevels.push(HavenLevels); break;
                case 3 : selectedMapsLevels.push(IceBoxLevels); break;
                case 4 : selectedMapsLevels.push(SplitLevels); break;
                case 5 : selectedMapsLevels.push(PearlLevels); break;
                case 6 : selectedMapsLevels.push(FractureLevels); break;
                case 7 : selectedMapsLevels.push(AscentLevels); break;
                case 8 : selectedMapsLevels.push(LotusLevels); break;
            }
        }
    }
    if(alloff){
        selectedMapsLevels.push(
            BindLevels,BreezeLevels,HavenLevels,
            IceBoxLevels,SplitLevels,PearlLevels,
            FractureLevels,AscentLevels,LotusLevels
        );
    }
    GetUsableLevels();
}

function GetUsableLevels(){

    var useableLevels = [];

    var difNum = 0;
    switch (sessionSettings.currentDifficulty) {
        case 0:difNum = 3; break;
        case 1:difNum = 5; break;
        case 2:difNum = 7; break;
        case 3:difNum = 8; break;
        case 4:difNum = 0; break;
    }

    for (let i = 0; i < selectedMapsLevels.length; i++) {
        for (let b = 0; b < selectedMapsLevels[i].length; b++) {
            var level = selectedMapsLevels[i][b];
            
            var checks = [false,false];

            if(level[2] || sessionSettings.modifiers.outOfBounds && !level[2]){
                checks[0] = true
            }

            if(difNum == 0){
                checks[1] = true
            }
            else if(Math.abs(difNum - level[1]) <= 2){
                checks[1] = true
            }

            if(checks[0]&&checks[1]){
                useableLevels.push(level);
            }
        }
    }

    GetFinalRounds(useableLevels);
}

var finalRounds = [];
var CR = 0;

function GetFinalRounds(usableLevels){
    addLevel();

    function addLevel(){
        if(finalRounds.length < sessionSettings.currentRoundAmmount){
            var rand = Math.floor(Math.random() * usableLevels.length);
            if(!finalRounds.includes(usableLevels[rand])){
                finalRounds.push(usableLevels[rand])
            }
            addLevel();
        }
    }

    if(sessionSettings.modifiers.guessMap){
        var MapDir = "game/maps/NoMap/map.png";
    }
    else{
        var MapDir = "game/maps/"+RoundMap+"/map.png";
    }

    document.getElementById('mapImg').src= MapDir; 

    startRound();
}

var hasGuessed = false;
var hasSubmitted = false;
var hasConfirmed = false;

var currentGuess = [0,0];
var currentPoints = 0;

var imgWidth;
var imgHeight;

async function startRound(){
    ResetGame();

    var RoundMap = finalRounds[CR][4];
    var RoundImg = finalRounds[CR][0];

    var text = "Round " + (CR+1).toString() + "/" + finalRounds.length;
    document.getElementById("currentRoundText").innerHTML = text;

    var Imgdir = "game/maps/"+RoundMap+"/" + RoundImg + ".png";
    var Ansdir = "game/maps/"+RoundMap+"/locations/" + RoundImg + ".png";

    document.getElementById('AnswerImg').src= Ansdir; 
    document.getElementById('levelImg').src= Imgdir; 

    await document.getElementById("levelImg").complete;
    document.getElementById("overlay").classList.add("overlayOff");
}

var imgWidth;
var imgHeight;

function clickHotspotImage(event) {
    if(!hasSubmitted){
        var xCoordinate = event.offsetX;
        var yCoordinate = event.offsetY;
    
        imgWidth = document.getElementById("levelImg").clientWidth;;
        imgHeight = document.getElementById("levelImg").clientHeight;
    
        currentGuess = [xCoordinate/imgWidth*100,yCoordinate/imgHeight*100]
    
        var selectImgEl = document.getElementById("selectImg").style;
        selectImgEl.left = "calc(" + currentGuess[0].toString()+"% - 4px)";
        selectImgEl.top = "calc(" + currentGuess[1].toString()+"% - 4px)";
        selectImgEl.opacity = "100";
    
        document.getElementById("submitButton").classList.add("buttonSelected");
    
        hasGuessed = true;
    }
}

function SubmitGuess(){
    if(hasGuessed){
        hasSubmitted = true;
        hasGuessed = false;
        document.getElementById("submitButton").classList.remove("buttonSelected");
        document.getElementById("continueButton").classList.add("buttonSelected");
        
        document.getElementById("mapImg").style.display = "none";
        document.getElementById("levelImg").style.opacity = "0%";
        document.getElementById("AnswerImg").style.opacity = "100%";

        var pointsGained = 0;
        
        var levelAns = [finalRounds[CR][3][0],finalRounds[CR][3][1]];
        var difference = Math.abs(currentGuess[0]-levelAns[0])+Math.abs(currentGuess[1]-levelAns[1]);

        if(sessionSettings.modifiers.guessMap){
            if(CurrentSelectedMap.toUpperCase() == finalRounds[CR][4].toUpperCase()){
                console.log("test");
                if(difference<2){
                    pointsGained = 5000;
                }
                else{
                    pointsGained = 5000+400-(200*difference);
                }
                if(pointsGained < 0){
                    pointsGained = 0;
                }
                hasSubmitted = true;
                document.getElementById("gameText").innerHTML = "You gained "+ Math.round(pointsGained).toString() +" out of 5000 points!" ;
            }
            else{
                hasSubmitted = true;
                document.getElementById("gameText").innerHTML = "You guessed the wrong map, it was "+ finalRounds[CR][4]; 
            }
        }
        else{
            if(difference<2){
                pointsGained = 5000;
            }
            else{
                pointsGained = 5000+400-(200*difference);
            }
            if(pointsGained < 0){
                pointsGained = 0;
            }
            hasSubmitted = true;
            document.getElementById("gameText").innerHTML = "You gained "+ Math.round(pointsGained).toString() +" out of 5000 points!" ;
        }
        currentPoints += Math.round(pointsGained);

        document.getElementById("pointsText").innerHTML = "Points: "+getNumberWithCommas(currentPoints);
    }
}

function Continue(){
    if(hasSubmitted){
        if(CR < sessionSettings.currentRoundAmmount){
            CR++
            startRound();
        }
        else{
            //End the game
        }
    }
}

async function ResetGame(){
    hasGuessed = false;
    hasSubmitted = false;

    document.getElementById("submitButton").classList.remove("buttonSelected");
    document.getElementById("continueButton").classList.remove("buttonSelected");
    
    document.getElementById("mapImg").style.display = "flex";
    document.getElementById("levelImg").style.opacity = "100%";
    document.getElementById("AnswerImg").style.opacity = "0%";

    document.getElementById("gameText").innerHTML = "Guess as close as possible!";

    var selectImgEl = document.getElementById("selectImg").style;
    selectImgEl.opacity = "0%";
}

function getNumberWithCommas(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

function debug(){
    console.log(sessionSettings);
}

const BindLevels = [
    [1 , 5,  true,   [] , ""],
    [2 , 5,  true,   [] , ""],
    [3 , 5,  true,   [] , ""],
    [4 , 5,  true,   [] , ""],
    [5 , 5,  true,   [] , ""],
    [6 , 5,  true,   [] , ""],
    [7 , 5,  true,   [] , ""],
    [8 , 5,  true,   [] , ""],
    [9 , 5,  true,   [] , ""],
    [10, 5,  true,   [] , ""],
    [11, 5,  true,   [] , ""],
    [12, 5,  true,   [] , ""],
    [13, 5,  true,   [] , ""],
    [14, 5,  true,   [] , ""],
    [15, 5,  true,   [] , ""],
    [16, 5,  true,   [] , ""],
    [17, 5,  true,   [] , ""],
    [18, 5,  true,   [] , ""],
    [19, 5,  true,   [] , ""],
    [20, 5,  true,   [] , ""],
    [21, 5,  true,   [] , ""],
    [22, 5,  true,   [] , ""],
    [23, 5,  true,   [] , ""],
    [24, 5,  true,   [] , ""],
    [25, 5,  true,   [] , ""],
    [26, 5,  true,   [] , ""],
    [27, 5,  true,   [] , ""],
    [28, 5,  true,   [] , ""],
    [29, 5,  true,   [] , ""],
    [30, 5,  true,   [] , ""],
    [31, 5,  true,   [] , ""],
    [32, 5,  true,   [] , ""],
    [33, 5,  true,   [] , ""],
    [34, 5,  true,   [] , ""],
    [35, 5,  true,   [] , ""],
    [36, 5,  true,   [] , ""],
    [37, 5,  true,   [] , ""],
    [38, 5,  true,   [] , ""],
    [39, 5,  true,   [] , ""],
    [40, 5,  true,   [] , ""],
    [41, 5,  true,   [] , ""],
    [42, 5,  true,   [] , ""],
    [43, 5,  true,   [] , ""],
    [44, 5,  true,   [] , ""],
    [45, 5,  true,   [] , ""],
    [46, 5,  true,   [] , ""],
    [47, 5,  true,   [] , ""],
    [48, 5,  true,   [] , ""],
    [49, 5,  true,   [] , ""],
    [50, 5,  true,   [] , ""],
    [51, 5,  true,   [] , ""],
    [52, 5,  true,   [] , ""],
    [53, 5,  true,   [] , ""],
    [54, 5,  true,   [] , ""],
    [55, 5,  true,   [] , ""],
    [56, 5,  true,   [] , ""],
    [57, 5,  true,   [] , ""],
    [58, 5,  true,   [] , ""],
    [59, 5,  true,   [] , ""],
    [60, 5,  true,   [] , ""],
    [61, 5,  true,   [] , ""],
    [62, 5,  true,   [] , ""],
    [63, 5,  true,   [] , ""],
];
const LotusLevels = [
    [1 , 5,  true,   [] , ""],
    [2 , 5,  true,   [] , ""],
    [3 , 5,  true,   [] , ""],
    [4 , 5,  true,   [] , ""],
    [5 , 5,  true,   [] , ""],
    [6 , 5,  true,   [] , ""],
    [7 , 5,  true,   [] , ""],
    [8 , 5,  true,   [] , ""],
    [9 , 5,  true,   [] , ""],
    [10, 5,  true,   [] , ""],
    [11, 5,  true,   [] , ""],
    [12, 5,  true,   [] , ""],
    [13, 5,  true,   [] , ""],
    [14, 5,  true,   [] , ""],
    [15, 5,  true,   [] , ""],
    [16, 5,  true,   [] , ""],
    [17, 5,  true,   [] , ""],
    [18, 5,  true,   [] , ""],
    [19, 5,  true,   [] , ""],
    [20, 5,  true,   [] , ""],
    [21, 5,  true,   [] , ""],
    [22, 5,  true,   [] , ""],
    [23, 5,  true,   [] , ""],
    [24, 5,  true,   [] , ""],
    [25, 5,  true,   [] , ""],
    [26, 5,  true,   [] , ""],
    [27, 5,  true,   [] , ""],
    [28, 5,  true,   [] , ""],
    [29, 5,  true,   [] , ""],
    [30, 5,  true,   [] , ""],
    [31, 5,  true,   [] , ""],
    [32, 5,  true,   [] , ""],
    [33, 5,  true,   [] , ""],
    [34, 5,  true,   [] , ""],
    [35, 5,  true,   [] , ""],
    [36, 5,  true,   [] , ""],
    [37, 5,  true,   [] , ""],
    [38, 5,  true,   [] , ""],
    [39, 5,  true,   [] , ""],
    [40, 5,  true,   [] , ""],
    [41, 5,  true,   [] , ""],
    [42, 5,  true,   [] , ""],
    [43, 5,  true,   [] , ""],
    [44, 5,  true,   [] , ""],
    [45, 5,  true,   [] , ""],
    [46, 5,  true,   [] , ""],
    [47, 5,  true,   [] , ""],
    [48, 5,  true,   [] , ""],
    [49, 5,  true,   [] , ""],
    [50, 5,  true,   [] , ""],
    [51, 5,  true,   [] , ""],
    [52, 5,  true,   [] , ""],
    [53, 5,  true,   [] , ""],
    [54, 5,  true,   [] , ""],
    [55, 5,  true,   [] , ""],
    [56, 5,  true,   [] , ""],
    [57, 5,  true,   [] , ""],
    [58, 5,  true,   [] , ""],
    [59, 5,  true,   [] , ""],
    [60, 5,  true,   [] , ""],
    [61, 5,  true,   [] , ""],
    [62, 5,  true,   [] , ""],
    [63, 5,  true,   [] , ""],
];
const BreezeLevels = [
    [1 , 5,  true,   [] , ""],
    [2 , 5,  true,   [] , ""],
    [3 , 5,  true,   [] , ""],
    [4 , 5,  true,   [] , ""],
    [5 , 5,  true,   [] , ""],
    [6 , 5,  true,   [] , ""],
    [7 , 5,  true,   [] , ""],
    [8 , 5,  true,   [] , ""],
    [9 , 5,  true,   [] , ""],
    [10, 5,  true,   [] , ""],
    [11, 5,  true,   [] , ""],
    [12, 5,  true,   [] , ""],
    [13, 5,  true,   [] , ""],
    [14, 5,  true,   [] , ""],
    [15, 5,  true,   [] , ""],
    [16, 5,  true,   [] , ""],
    [17, 5,  true,   [] , ""],
    [18, 5,  true,   [] , ""],
    [19, 5,  true,   [] , ""],
    [20, 5,  true,   [] , ""],
    [21, 5,  true,   [] , ""],
    [22, 5,  true,   [] , ""],
    [23, 5,  true,   [] , ""],
    [24, 5,  true,   [] , ""],
    [25, 5,  true,   [] , ""],
    [26, 5,  true,   [] , ""],
    [27, 5,  true,   [] , ""],
    [28, 5,  true,   [] , ""],
    [29, 5,  true,   [] , ""],
    [30, 5,  true,   [] , ""],
    [31, 5,  true,   [] , ""],
    [32, 5,  true,   [] , ""],
    [33, 5,  true,   [] , ""],
    [34, 5,  true,   [] , ""],
    [35, 5,  true,   [] , ""],
    [36, 5,  true,   [] , ""],
    [37, 5,  true,   [] , ""],
    [38, 5,  true,   [] , ""],
    [39, 5,  true,   [] , ""],
    [40, 5,  true,   [] , ""],
    [41, 5,  true,   [] , ""],
    [42, 5,  true,   [] , ""],
    [43, 5,  true,   [] , ""],
    [44, 5,  true,   [] , ""],
    [45, 5,  true,   [] , ""],
    [46, 5,  true,   [] , ""],
    [47, 5,  true,   [] , ""],
    [48, 5,  true,   [] , ""],
    [49, 5,  true,   [] , ""],
    [50, 5,  true,   [] , ""],
    [51, 5,  true,   [] , ""],
    [52, 5,  true,   [] , ""],
    [53, 5,  true,   [] , ""],
    [54, 5,  true,   [] , ""],
    [55, 5,  true,   [] , ""],
    [56, 5,  true,   [] , ""],
    [57, 5,  true,   [] , ""],
    [58, 5,  true,   [] , ""],
    [59, 5,  true,   [] , ""],
    [60, 5,  true,   [] , ""],
    [61, 5,  true,   [] , ""],
    [62, 5,  true,   [] , ""],
    [63, 5,  true,   [] , ""],
];
const HavenLevels = [
    [1 , 5,  true,   [39.5,53.3] , "haven"],
    [2 , 6,  true,   [39.4,51.8] , "haven"],
    [3 , 5,  true,   [38.2,53.9] , "haven"],
    [4 , 6,  true,   [37.7,52.8] , "haven"],
    [5 , 8,  true,   [36.2,61.7] , "haven"],
    [6 , 5,  true,   [37.5,62.4] , "haven"],
    [7 , 7,  true,   [41.3,65.6] , "haven"],
    [8 , 4,  true,   [44.6,67.5] , "haven"],
    [9 , 6,  true,   [43.3,56.0] , "haven"],
    [10, 5,  true,   [46.2,55.7] , "haven"],
    [11, 5,  true,   [48.9,54.3] , "haven"],
    [12, 6,  true,   [50.0,60.7] , "haven"],
    [13, 7,  true,   [50.0,63.3] , "haven"],
    [14, 4,  true,   [49.4,45.7] , "haven"],
    [15, 8,  true,   [51.3,39.4] , "haven"],
    [16, 4,  true,   [55.2,42.4] , "haven"],
    [17, 6,  true,   [54.4,46.8] , "haven"],
    [18, 7,  true,   [54.6,47.2] , "haven"],
    [19, 6,  true,   [54.5,52.9] , "haven"],
    [20, 9,  true,   [54.7,51.0] , "haven"],
    [21, 5,  true,   [53.7,52.4] , "haven"],
    [22, 6,  true,   [52.3,41.9] , "haven"],
    [23, 6,  true,   [46.4,37.1] , "haven"],
    [24, 7,  true,   [46.4,41.9] , "haven"],
    [25, 4,  true,   [46.1,42.1] , "haven"],
    [26, 9,  true,   [42.3,39.7] , "haven"],
    [27, 7,  true,   [43.4,45.0] , "haven"],
    [28, 7,  true,   [40.8,43.2] , "haven"],
    [29, 3,  true,   [36.9,46.3] , "haven"],
    [30, 2,  true,   [35.3,47.8] , "haven"],
    [31, 3,  true,   [46.4,75.0] , "haven"],
    [32, 8,  true,   [44.7,74.4] , "haven"],
    [33, 7,  true,   [48.1,71.4] , "haven"],
    [34, 6,  true,   [50.0,72.6] , "haven"],
    [35, 8,  true,   [54.0,57.5] , "haven"],
    [36, 4,  true,   [62.8,52.4] , "haven"],
    [37, 5,  true,   [49.0,56.7] , "haven"],
    [38, 5,  true,   [53.3,38.6] , "haven"],
    [39, 1,  true,   [52.1,25.7] , "haven"],
    [40, 7,  true,   [51.0,21.3] , "haven"],
    [41, 5,  true,   [49.7,21.9] , "haven"],
    [42, 3,  true,   [57.5,33.6] , "haven"],
    [43, 5,  true,   [62.6,36.8] , "haven"],
    [44, 7,  true,   [60.2,38.6] , "haven"],
    [45, 5,  true,   [61.1,36.5] , "haven"],
    [46, 3,  true,   [59.2,58.2] , "haven"],
    [47, 4,  true,   [58.8,52.1] , "haven"],
    [48, 3,  true,   [61.1,54.4] , "haven"],
    [49, 8,  true,   [62.3,59.3] , "haven"],
    [50, 5,  true,   [57.8,63.2] , "haven"],
    [51, 8,  false,   [35.8,61.0] , "haven"],
    [52, 7,  false,   [58.8,43.5] , "haven"],
    [53, 6,  false,   [47.6,60.4] , "haven"],
    [54, 5,  true,   [45.8,51.2] , "haven"],
    [55, 8,  true,   [45.6,51.2] , "haven"],
    [56, 6,  true,   [46.1,47.9] , "haven"],
    [57, 8,  true,   [45.9,41.8] , "haven"],
    [58, 7,  false,   [38.0,42.9] , "haven"],
    [59, 6,  false,   [47.1,37.9] , "haven"],
    [60, 6,  true,   [60.7,43.6] , "haven"],
    [61, 5,  true,   [60.1,55.4] , "haven"],
    [62, 6,  true,   [54.6,55.4] , "haven"],
    [63, 4,  true,   [48.7,38.9] , "haven"],
    [64, 6,  true,   [54.4,58.3] , "haven"],
    [65, 4,  true,   [61.5,55.3] , "haven"]
];
const IceBoxLevels = [
    [1, 4,  true,   [42.0,70.8] , "icebox"],
    [2, 3,  true,   [47.8,71.5] , "icebox"],
    [3, 2,  true,   [46.9,64.3] , "icebox"],
    [4, 6,  true,   [49.0,60.7] , "icebox"],
    [5, 5,  true,   [45.4,56.0] , "icebox"],
    [6, 5,  true,   [51.3,53.3] , "icebox"],
    [7, 4,  true,   [45.9,47.9] , "icebox"],
    [8, 3,  true,   [48.7,40.1] , "icebox"],
    [9, 6,  true,   [47.6,35.8] , "icebox"],
    [10, 8,  false,   [48.7,28.6] , "icebox"],
    [11, 6,  true,   [49.4,34.6] , "icebox"],
    [12, 9,  true,   [40.3,43.9] , "icebox"],
    [13, 4,  true,   [43.0,43.2] , "icebox"],
    [14, 6,  true,   [41.6,48.1] , "icebox"],
    [15, 8,  true,   [38.5,51.5] , "icebox"],
    [16, 4,  true,   [37.4,50.4] , "icebox"],
    [17, 6,  true,   [36.8,45.4] , "icebox"],
    [18, 5,  true,   [40.7,60.3] , "icebox"],
    [19, 6,  true,   [41.3,64.2] , "icebox"],
    [20, 8,  true,   [42.4,70.1] , "icebox"],
    [21, 7,  true,   [39.8,73.2] , "icebox"],
    [22, 9,  false,   [56.0,61.0] , "icebox"],
    [23, 3,  true,   [62.9,49.6] , "icebox"],
    [24, 10,  false,   [63.4,73.9] , "icebox"],
    [25, 4,  true,   [62.9,66.4] , "icebox"],
    [26, 8,  true,   [49.4,59.9] , "icebox"],
    [27, 6,  true,   [48.6,60.0] , "icebox"],
    [28, 7,  true,   [41.3,66.7] , "icebox"],
    [29, 5,  true,   [36.8,66.9] , "icebox"],
    [30, 6,  true,   [35.8,48.8] , "icebox"],
    [31, 6,  true,   [38.1,49.9] , "icebox"],
    [32, 3,  true,   [43.3,53.2] , "icebox"],
    [33, 2,  true,   [50.9,54.0] , "icebox"],
    [34, 8,  true,   [50.9,58.8] , "icebox"],
    [35, 5,  true,   [50.0,64.4] , "icebox"],
    [36, 6,  true,   [55.7,62.1] , "icebox"],
    [37, 7,  true,   [57.8,61.3] , "icebox"],
    [38, 8,  true,   [58.9,59.2] , "icebox"],
    [39, 3,  true,   [54.5,54.7] , "icebox"],
    [40, 5,  true,   [54.0,54.0] , "icebox"],
    [41, 6,  true,   [50.5,52.4] , "icebox"],
    [42, 5,  true,   [46.2,23.9] , "icebox"],
    [43, 6,  true,   [54.1,40.6] , "icebox"],
    [44, 4,  true,   [63.6,46.4] , "icebox"],
    [45, 7,  false,   [51.0,45.6] , "icebox"],
    [46, 2,  true,   [45.0,45.3] , "icebox"],
    [47, 9,  false,   [41.0,45.1] , "icebox"],
    [48, 8,  false,   [35.2,61.7] , "icebox"],
    [49, 6,  true,   [56.2,68.9] , "icebox"],
    [50, 8,  false,   [57.6,63.3] , "icebox"],
    [51, 8,  false,   [60.3,63.7] , "icebox"],
    [52, 7,  true,   [58.4,58.1] , "icebox"],
    [53, 5,  true,   [54.7,46.9] , "icebox"],
    [54, 6,  true,   [56.7,46.9] , "icebox"]
];
const SplitLevels = [
    [1 , 2,  true,   [48.7,75.8] , "split"],
    [2 , 1,  true,   [48.8,72.8] , "split"],
    [3 , 2,  true,   [47.5,69.9] , "split"],
    [4 , 5,  true,   [50.4,67.2] , "split"],
    [5 , 6,  true,   [52.4,68.1] , "split"],
    [6 , 8,  true,   [55.7,67.8] , "split"],
    [7 , 4,  true,   [55.3,64.9] , "split"],
    [8 , 5,  true,   [58.1,63.1] , "split"],
    [9 , 4,  true,   [57.1,62.6] , "split"],
    [10, 6,  true,   [60.2,61.8] , "split"],
    [11, 3,  true,   [61.3,60.4] , "split"],
    [12, 4,  true,   [62.8,60.0] , "split"],
    [13, 5,  true,   [62.9,62.9] , "split"],
    [14, 5,  true,   [64.7,55.6] , "split"],
    [15, 4,  true,   [61.5,49.9] , "split"],
    [16, 8,  true,   [59.0,47.4] , "split"],
    [17, 5,  true,   [59.1,51.0] , "split"],
    [18, 6,  true,   [59.2,51.0] , "split"],
    [19, 7,  true,   [59.6,46.5] , "split"],
    [20, 3,  true,   [58.3,49.7] , "split"],
    [21, 8,  true,   [56.6,51.8] , "split"],
    [22, 6,  true,   [55.4,50.4] , "split"],
    [23, 8,  true,   [54.8,44.0] , "split"],
    [24, 7,  true,   [54.2,45.8] , "split"],
    [25, 6,  true,   [55.2,46.5] , "split"],
    [26, 5,  true,   [54.9,38.2] , "split"],
    [27, 5,  true,   [56.2,35.4] , "split"],
    [28, 7,  true,   [57.9,37.9] , "split"],
    [29, 5,  true,   [58.3,40.7] , "split"],
    [30, 6,  true,   [58.2,42.8] , "split"],
    [31, 5,  true,   [58.9,38.3] , "split"],
    [32, 6,  true,   [60.2,34.7] , "split"],
    [33, 9,  true,   [60.5,30.4] , "split"],
    [34, 7,  true,   [61.7,27.6] , "split"],
    [35, 6,  true,   [61.0,28.7] , "split"],
    [36, 6,  true,   [60.4,28.2] , "split"],
    [37, 7,  true,   [58.6,29.0] , "split"],
    [38, 6,  true,   [56.2,28.6] , "split"],
    [39, 6,  true,   [56.3,30.4] , "split"],
    [40, 7,  true,   [56.7,28.6] , "split"],
    [41, 4,  true,   [54.4,34.0] , "split"],
    [42, 8,  true,   [54.8,40.1] , "split"],
    [43, 7,  true,   [54.0,41.5] , "split"],
    [44, 8,  true,   [52.4,41.3] , "split"],
    [45, 7,  true,   [52.5,43.5] , "split"],
    [46, 6,  true,   [51.2,42.9] , "split"],
    [47, 5,  true,   [52.0,45.8] , "split"],
    [48, 6,  true,   [50.3,45.0] , "split"],
    [49, 6,  true,   [48.8,44.4] , "split"],
    [50, 5,  true,   [49.4,44.6] , "split"],
    [51, 6,  true,   [49.1,49.9] , "split"],
    [52, 4,  true,   [48.2,51.9] , "split"],
    [53, 6,  true,   [46.9,53.8] , "split"],
    [54, 5,  true,   [49.4,56.3] , "split"],
    [55, 7,  true,   [51.1,57.1] , "split"],
    [56, 6,  true,   [53.5,55.7] , "split"],
    [57, 7,  true,   [55.3,59.9] , "split"],
    [58, 8,  true,   [58.7,56.4] , "split"],
    [59, 7,  true,   [59.8,56.8] , "split"],
    [60, 5,  true,   [59.4,57.2] , "split"],
    [61, 3,  true,   [47.1,59.4] , "split"],
    [62, 4,  true,   [45.4,58.6] , "split"],
    [63, 4,  true,   [45.6,58.3] , "split"],
    [64, 7,  true,   [46.0,57.2] , "split"],
    [65, 8,  true,   [45.2,56.1] , "split"],
    [66, 6,  true,   [42.8,58.6] , "split"],
    [67, 7,  true,   [43.8,56.4] , "split"],
    [68, 6,  true,   [42.9,57.1] , "split"],
    [69, 5,  true,   [43.0,61.5] , "split"],
    [70, 6,  true,   [44.7,69.0] , "split"],
    [71, 9,  true,   [39.5,64.9] , "split"],
    [72, 7,  true,   [38.4,62.1] , "split"],
    [73, 8,  true,   [39.3,67.9] , "split"],
    [74, 6,  true,   [38.5,67.2] , "split"],
    [75, 4,  true,   [40.7,57.2] , "split"],
    [76, 7,  true,   [40.9,56.1] , "split"],
    [77, 5,  true,   [38.4,56.5] , "split"],
    [79, 5,  true,   [39.8,50.6] , "split"],
    [79, 5,  true,   [35.3,56.5] , "split"],
    [80, 7,  true,   [36.6,56.4] , "split"],
    [81, 9,  true,   [33.6,45.7] , "split"],
    [82, 8,  true,   [33.5,39.9] , "split"],
    [83, 5,  true,   [34.1,38.5] , "split"],
    [84, 6,  true,   [34.5,33.6] , "split"],
    [85, 5,  true,   [34.3,33.9] , "split"],
    [86, 7,  true,   [34.9,35.3] , "split"],
    [87, 4,  true,   [34.6,34.3] , "split"],
    [88, 6,  true,   [37.9,40.3] , "split"],
    [89, 8,  true,   [53.1,42.1] , "split"],
    [90, 7,  true,   [37.3,38.2] , "split"],
    [91, 6,  true,   [46.9,46.7] , "split"],
    [92, 6,  true,   [46.2,47.8] , "split"],
    [93, 4,  true,   [43.3,46.1] , "split"],
    [94, 5,  true,   [43.0,51.5] , "split"],
    [95, 4,  true,   [42.9,47.9] , "split"],
    [96, 8,  true,   [42.1,42.6] , "split"],
    [97, 6,  true,   [40.8,37.8] , "split"],
    [98, 4,  true,   [40.5,39.0] , "split"],
    [99, 4,  true,   [44.5,41.0] , "split"],
    [100, 6,  true,   [46.0,38.5] , "split"],
    [101, 6,  true,   [45.4,40.1] , "split"],
    [102, 5,  true,   [44.1,40.0] , "split"],
    [103, 7,  true,   [45.7,34.4] , "split"],
    [104, 5,  true,   [42.4,34.6] , "split"],
    [105, 4,  true,   [39.8,31.8] , "split"],
    [106, 8,  true,   [42.7,32.2] , "split"],
    [107, 9,  true,   [48.5,35.3] , "split"],
    [108, 3,  true,   [49.6,22.4] , "split"],
    [109, 2,  true,   [48.3,23.3] , "split"],
    [110, 1,  true,   [50.1,25.3] , "split"],
    [111, 4,  true,   [53.4,32.4] , "split"],
    [112, 7,  true,   [51.9,31.9] , "split"],
    [113, 6,  false,   [46.1,27.1] , "split"],
    [114, 10,  false,   [53.4,23.6] , "split"],
    [115, 6,  true,   [64.9,34.6] , "split"],
    [116, 7,  false,   [50.4,63.9] , "split"],
    [117, 8,  false,   [55.7,59.9] , "split"],
    [118, 7,  false,   [54.0,53.8] , "split"],
    [119, 4,  false,   [49.9,47.1] , "split"],
    [120, 6,  false,   [48.9,42.4] , "split"],
    [121, 8,  false,   [44.2,41.9] , "split"],
    [122, 6,  false,   [41.1,26.8] , "split"],
    [123, 7,  false,   [30.9,40.3] , "split"],
    [124, 8,  false,   [32.7,51.0] , "split"],
    [125, 6,  false,   [40.4,51.8] , "split"],
    [126, 8,  false,   [34.8,64.6] , "split"],
    [127, 9,  false,   [41.7,72.6] , "split"],
    [128, 10,  false,   [44.4,81.8] , "split"],
    [129, 8,  false,   [40.8,78.8] , "split"],
    [130, 3,  true,   [50.4,75.3] , "split"],
    [131, 6,  false,   [57.6,76.9] , "split"],
    [132, 5,  false,   [62.2,67.9] , "split"],
    [133, 7,  false,   [65.8,57.6] , "split"]

];
const PearlLevels = [
    [1, 7,  true,   [52.7,42.2] , "pearl"],
    [2, 2,  true,   [53.1,34.3] , "pearl"],
    [3, 4,  true,   [48.2,44.3] , "pearl"],
    [4, 6,  true,   [39.0,69.4] , "pearl"],
    [5, 5,  true,   [50.7,56.5] , "pearl"],
    [6, 5,  true,   [54.4,47.4] , "pearl"],
    [7, 4,  true,   [65.8,56.0] , "pearl"],
    [8, 7,  false,  [61.6,46.8] , "pearl"],
    [9, 6,  true,   [57.3,35.7] , "pearl"],
    [10, 1,  true,  [49.1,21.7] , "pearl"],
    [11, 7,  true,  [47.8,35.0] , "pearl"],
    [12, 2,  true,  [49.1,46.4] , "pearl"],
    [13, 6,  true,  [53.5,51.2] , "pearl"],
    [14, 7,  false, [49.5,64.9] , "pearl"],
    [15, 7,  false, [52.3,69.7] , "pearl"],
    [16, 8,  false, [50.9,71.1] , "pearl"],
    [17, 9,  false, [50.5,69.6] , "pearl"],
    [18, 7,  true,  [34.6,65.4] , "pearl"],
    [19, 6,  true,  [42.1,42.4] , "pearl"],
    [20, 5,  true,  [42.5,37.9] , "pearl"],
    [21, 9,  true,  [56.1,45.7] , "pearl"],
    [22, 6,  true,  [54.1,67.5] , "pearl"],
    [23, 5,  true,  [54.9,64.2] , "pearl"],
    [24, 7,  true,  [55.8,56.4] , "pearl"],
    [25, 10,  true, [55.0,38.1] , "pearl"],
    [26, 3,  true,  [50.0,50.7] , "pearl"],
    [27, 2,  true,  [57.5,49.6] , "pearl"],
    [28, 2,  true,  [58.8,54.9] , "pearl"],
    [29, 3,  true,  [65.8,58.1] , "pearl"],
    [30, 6,  true,  [58.3,59.2] , "pearl"],
    [31, 1,  true,  [47.3,79.0] , "pearl"],
    [32, 4,  false, [50.5,77.1] , "pearl"],
    [33, 5,  false, [42.9,71.9] , "pearl"],
    [34, 7,  false, [33.8,53.5] , "pearl"],
    [35, 9,  false, [38.8,24.6] , "pearl"],
    [36, 5,  true,  [47.4,63.9] , "pearl"],
    [37, 6,  true,  [47.2,56.3] , "pearl"],
    [38, 5,  true,  [42.3,57.5] , "pearl"],
    [39, 4,  true,  [46.9,31.4] , "pearl"],
    [40, 5,  true,  [52.0,24.4] , "pearl"],
    [41, 8,  true,  [58.0,32.1] , "pearl"],
    [42, 2,  true,  [65.3,35.3] , "pearl"],
    [43, 3,  true,  [62.7,45.8] , "pearl"],
    [44, 7,  true,  [60.5,63.2] , "pearl"],
    [45, 9,  true,  [60.3,63.2] , "pearl"],
    [46, 6,  false, [45.2,56.5] , "pearl"],
    [47, 7,  false, [39.7,56.5] , "pearl"],
    [48, 6,  false, [36.6,47.4] , "pearl"],
    [49, 9,  true,  [51.3,53.5] , "pearl"],
]
const FractureLevels = [
    [1 , 2,  true,   [38.9,49.2] , "fracture"],
    [2 , 3,  true,   [38.1,53.5] , "fracture"],
    [3 , 4,  true,   [37.0,49.9] , "fracture"],
    [4 , 3,  true,   [36.4,45.7] , "fracture"],
    [5 , 6,  true,   [36.2,45.6] , "fracture"],
    [6 , 4,  true,   [36.7,47.9] , "fracture"],
    [7 , 5,  true,   [36.2,49.6] , "fracture"],
    [8 , 4,  true,   [41.5,49.3] , "fracture"],
    [9 , 7,  true,   [43.3,48.3] , "fracture"],
    [10, 8,  true,   [41.3,51.0] , "fracture"],
    [11, 6,  true,   [40.9,57.9] , "fracture"],
    [12, 5,  true,   [39.0,52.8] , "fracture"],
    [13, 8,  true,   [38.9,53.3] , "fracture"],
    [14, 6,  true,   [39.7,58.5] , "fracture"],
    [15, 4,  true,   [41.6,61.0] , "fracture"],
    [16, 7,  true,   [41.5,62.5] , "fracture"],
    [17, 8,  true,   [42.1,64.9] , "fracture"],
    [18, 6,  true,   [42.9,71.9] , "fracture"],
    [19, 7,  true,   [48.1,69.0] , "fracture"],
    [20, 6,  true,   [56.4,74.4] , "fracture"],
    [21, 5,  true,   [51.9,76.8] , "fracture"],
    [22, 5,  true,   [47.6,74.9] , "fracture"],
    [23, 6,  true,   [50.6,51.2] , "fracture"],
    [24, 7,  true,   [37.2,39.3] , "fracture"],
    [25, 6,  true,   [41.1,32.8] , "fracture"],
    [26, 7,  true,   [42.7,37.2] , "fracture"],
    [27, 4,  true,   [46.1,43.2] , "fracture"],
    [28, 5,  true,   [47.3,42.6] , "fracture"],
    [29, 9,  true,   [47.5,44.3] , "fracture"],
    [30, 4,  true,   [43.3,32.2] , "fracture"],
    [31, 7,  true,   [43.9,26.1] , "fracture"],
    [32, 5,  true,   [45.4,25.6] , "fracture"],
    [33, 6,  true,   [46.8,23.9] , "fracture"],
    [34, 4,  true,   [49.8,24.9] , "fracture"],
    [35, 5,  true,   [61.1,54.9] , "fracture"],
    [36, 6,  true,   [53.2,32.2] , "fracture"],
    [37, 7,  true,   [49.4,33.2] , "fracture"],
    [38, 8,  true,   [54.1,27.2] , "fracture"],
    [39, 8,  true,   [59.7,29.3] , "fracture"],
    [40, 6,  true,   [58.0,34.4] , "fracture"],
    [41, 3,  true,   [54.3,29.9] , "fracture"],
    [42, 3,  true,   [44.6,51.5] , "fracture"],
    [43, 5,  true,   [49.7,52.8] , "fracture"],
    [44, 2,  true,   [48.8,52.9] , "fracture"],
    [45, 2,  true,   [50.5,52.8] , "fracture"],
    [46, 1,  true,   [49.3,52.5] , "fracture"],
    [47, 7,  true,   [50.9,51.5] , "fracture"],
    [48, 9,  true,   [53.7,55.1] , "fracture"],
    [49, 5,  true,   [56.2,55.3] , "fracture"],
    [50, 6,  true,   [56.7,41.9] , "fracture"],
    [51, 7,  true,   [58.0,43.2] , "fracture"],
    [52, 3,  true,   [63.0,42.6] , "fracture"],
    [53, 9,  true,   [64.7,51.2] , "fracture"],
    [54, 5,  true,   [65.1,47.2] , "fracture"],
    [55, 4,  true,   [57.6,48.2] , "fracture"],
    [56, 5,  true,   [60.8,48.5] , "fracture"],
    [57, 7,  true,   [61.5,49.2] , "fracture"],
    [58, 8,  true,   [66.2,53.5] , "fracture"],
    [59, 4,  true,   [64.4,53.3] , "fracture"],
    [60, 9,  true,   [54.1,62.6] , "fracture"],
    [61, 7,  true,   [61.6,59.6] , "fracture"],
    [62, 6,  true,   [58.0,67.4] , "fracture"],
    [63, 7,  false,   [60.1,66.7] , "fracture"],
    [64, 8,  false,   [60.2,69.2] , "fracture"],
    [65, 9,  false,   [54.0,45.6] , "fracture"],
    [66, 10,  false,   [41.6,57.1] , "fracture"],
    [67, 7,  false,   [49.3,49.9] , "fracture"],
    [68, 8,  false,   [41.8,18.6] , "fracture"],
    [69, 6,  false,   [41.5,26.4] , "fracture"],
    [70, 7,  false,   [41.5,31.1] , "fracture"],
    [71, 8,  false,   [42.1,57.1] , "fracture"],
    [72, 8,  false,   [49.7,50.4] , "fracture"],
    [73, 7,  false,   [49.6,47.8] , "fracture"],
];
const AscentLevels = [
    [1 , 6,  true,   [57.6,61.8] , "ascent"],
    [2 , 4,  true,   [56.9,63.1] , "ascent"],
    [3 , 7,  true,   [58.9,67.9] , "ascent"],
    [4 , 5,  true,   [61.2,66.9] , "ascent"],
    [5 , 7,  true,   [64.4,64.6] , "ascent"],
    [6 , 8,  true,   [63.7,61.8] , "ascent"],
    [7 , 3,  true,   [62.0,63.1] , "ascent"],
    [8 , 5,  true,   [59.2,63.5] , "ascent"],
    [9 , 7,  true,   [58.2,61.1] , "ascent"],
    [10, 5,  true,   [62.0,59.3] , "ascent"],
    [11, 6,  true,   [60.5,64.0] , "ascent"],
    [12, 7,  true,   [55.3,67.4] , "ascent"],
    [13, 5,  true,   [55.4,71.1] , "ascent"],
    [14, 6,  true,   [56.1,69.0] , "ascent"],
    [15, 5,  true,   [57.6,63.6] , "ascent"],
    [16, 4,  true,   [55.6,61.7] , "ascent"],
    [17, 5,  true,   [54.9,55.0] , "ascent"],
    [18, 5,  true,   [54.4,57.1] , "ascent"],
    [19, 5,  true,   [55.6,58.2] , "ascent"],
    [20, 6,  true,   [57.6,55.7] , "ascent"],
    [21, 7,  true,   [59.1,52.1] , "ascent"],
    [22, 6,  true,   [59.5,47.8] , "ascent"],
    [23, 7,  true,   [57.3,47.9] , "ascent"],
    [24, 9,  true,   [56.2,50.6] , "ascent"],
    [25, 6,  true,   [53.5,50.7] , "ascent"],
    [26, 6,  true,   [52.8,47.1] , "ascent"],
    [27, 4,  true,   [49.8,49.0] , "ascent"],
    [28, 8,  true,   [49.8,46.3] , "ascent"],
    [29, 3,  true,   [48.2,41.4] , "ascent"],
    [30, 5,  true,   [49.2,56.3] , "ascent"],
    [31, 5,  true,   [46.9,53.1] , "ascent"],
    [32, 5,  true,   [47.8,49.9] , "ascent"],
    [33, 8,  true,   [48.3,44.2] , "ascent"],
    [34, 4,  true,   [49.8,54.2] , "ascent"],
    [35, 7,  true,   [46.9,48.6] , "ascent"],
    [36, 8,  true,   [46.5,46.3] , "ascent"],
    [37, 6,  true,   [47.0,43.8] , "ascent"],
    [38, 5,  true,   [46.4,40.8] , "ascent"],
    [39, 6,  true,   [47.2,40.0] , "ascent"],
    [40, 9,  true,   [41.0,37.4] , "ascent"],
    [41, 7,  true,   [42.9,38.2] , "ascent"],
    [42, 5,  true,   [41.7,38.9] , "ascent"],
    [43, 6,  true,   [40.2,37.9] , "ascent"],
    [44, 4,  true,   [56.7,43.9] , "ascent"],
    [45, 5,  true,   [55.7,40.3] , "ascent"],
    [46, 5,  true,   [56.3,35.3] , "ascent"],
    [47, 6,  true,   [56.2,31.1] , "ascent"],
    [48, 5,  true,   [55.5,27.8] , "ascent"],
    [49, 6,  true,   [54.7,29.2] , "ascent"],
    [50, 5,  true,   [53.1,34.4] , "ascent"],
    [51, 7,  true,   [50.9,36.0] , "ascent"],
    [52, 4,  true,   [49.0,36.3] , "ascent"],
    [53, 5,  true,   [42.9,32.2] , "ascent"],
    [54, 6,  true,   [43.3,30.7] , "ascent"],
    [55, 3,  true,   [45.0,32.1] , "ascent"],
    [56, 7,  true,   [44.9,40.0] , "ascent"],
    [57, 5,  true,   [40.7,45.6] , "ascent"],
    [58, 6,  true,   [40.4,47.8] , "ascent"],
    [59, 7,  true,   [42.4,47.9] , "ascent"],
    [60, 7,  true,   [41.8,50.3] , "ascent"],
    [61, 5,  true,   [41.7,53.5] , "ascent"],
    [62, 5,  true,   [38.0,50.3] , "ascent"],
    [63, 3,  true,   [40.7,49.4] , "ascent"],
    [64, 5,  true,   [35.5,56.0] , "ascent"],
    [65, 4,  true,   [35.8,55.8] , "ascent"],
    [66, 7,  true,   [34.8,49.7] , "ascent"],
    [67, 6,  true,   [34.6,51.0] , "ascent"],
    [68, 3,  true,   [39.1,61.0] , "ascent"],
    [69, 4,  true,   [35.7,61.1] , "ascent"],
    [70, 6,  true,   [35.8,64.0] , "ascent"],
    [71, 5,  true,   [38.3,66.1] , "ascent"],
    [72, 5,  true,   [39.9,56.7] , "ascent"],
    [73, 4,  true,   [36.3,65.8] , "ascent"],
    [74, 6,  true,   [42.5,66.1] , "ascent"],
    [75, 8,  true,   [42.4,66.1] , "ascent"],
    [76, 5,  true,   [41.2,68.5] , "ascent"],
    [77, 6,  true,   [41.5,59.4] , "ascent"],
    [78, 6,  true,   [44.5,64.3] , "ascent"],
    [79, 5,  true,   [44.7,65.8] , "ascent"],
    [80, 5,  true,   [43.5,57.1] , "ascent"],
    [81, 5,  true,   [44.0,52.1] , "ascent"],
    [82, 2,  true,   [44.8,51.0] , "ascent"],
    [83, 1,  true,   [46.4,52.6] , "ascent"],
    [84, 3,  true,   [50.0,58.5] , "ascent"],
    [85, 7,  true,   [51.3,65.1] , "ascent"],
    [86, 5,  true,   [52.1,61.7] , "ascent"],
    [87, 3,  true,   [52.1,62.6] , "ascent"],
    [88, 6,  true,   [47.4,68.2] , "ascent"],
    [89, 2,  true,   [48.4,71.1] , "ascent"],
    [90, 3,  true,   [49.2,76.4] , "ascent"],
    [91, 6,  false,   [51.1,68.6] , "ascent"],
    [92,10,  false,   [47.4,63.5] , "ascent"],
    [93, 8,  false,   [55.4,52.9] , "ascent"],
    [94, 9,  false,   [49.5,42.8] , "ascent"],
    [95,10,  false,   [40.7,25.7] , "ascent"],
    [96, 8,  false,   [42.8,36.5] , "ascent"],
    [97, 7,  false,   [40.2,61.9] , "ascent"],
    [98, 8,  false,   [45.8,68.8] , "ascent"],
    [99, 7,  false,   [43.6,61.7] , "ascent"],
    [100,8,  false,   [48.9,36.9] , "ascent"]
];