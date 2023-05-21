
window.onload = function() {
    if ( document.URL.includes("StartGame.html") ) {
        GameSettings();
    }
}

var mapList = ["Bind","Breeze","Haven","IceBox","Split","Pearl","Fracture","Ascent","Lotus"];
const difficulties = ["Easy","Mid","Hard","Impossible","Random"];

var session = {
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
        session.currentSelectedMaps[map] = !session.currentSelectedMaps[map];
        if(session.currentSelectedMaps[map]){
            document.getElementById("map"+map.toString()).classList.add("mapButtonSelected");
        }
        else{
            document.getElementById("map"+map.toString()).classList.remove("mapButtonSelected");
        }
    }
    else{
        var allOn = true;
        for(var i = 0 ; i < session.currentSelectedMaps.length;i++){
            if(!session.currentSelectedMaps[i]){
                allOn =false;
            }
        }
        for(var i = 0; i< session.currentSelectedMaps.length;i++){
            var classList = document.getElementById("map"+i.toString()).classList; 
            if(allOn && classList.contains("mapButtonSelected")){
                session.currentSelectedMaps[i] = false;
                classList.remove("mapButtonSelected");
            }
            else{
                session.currentSelectedMaps[i] = true;
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
        session.currentRoundAmmount = value;
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
        session.currentTimeLimit = value;
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
    DifficultyText.innerHTML = "-" + difficulties[session.currentDifficulty] + "-";

    DifficultyButton.onclick = function() {
        if(session.currentDifficulty < difficulties.length-1){
            session.currentDifficulty++;
        }
        else{
            session.currentDifficulty = 0;
        }
        DifficultyText.innerHTML = "-" + difficulties[session.currentDifficulty] + "-";
    }
}

function chooseModifier(key){
    var classList = document.getElementById("modifier-"+key).classList;
    
    session.modifiers[key] = !session.modifiers[key];

    if(session.modifiers[key]){
        classList.add("mapButtonSelected");
    }
    else{
        classList.remove("mapButtonSelected");
    }
}

function SelectMap(map){
    //Loop trough all 9 of the map buttons and turn them off
    for(var i = 0; i < 9;i++){
        var button = document.getElementById("mapbut"+i.toString());
        if(button.classList.contains("selectedMap")){
            button.classList.remove("selectedMap");
        }
    }
    document.getElementById("mapbut"+map.toString()).classList.add("selectedMap");
}

function debug(){
    console.log(session);
}