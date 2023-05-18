var mapAmmount = 9;

function SelectMap(map){
    for(var i = 0; i < mapAmmount;i++){
        var button = document.getElementById("mapbut"+i.toString());
        if(button.classList.contains("selectedMap")){
            button.classList.remove("selectedMap");
        }
    }
    document.getElementById("mapbut"+map.toString()).classList.add("selectedMap");
}