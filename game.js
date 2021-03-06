//Use this.attribute for the attributes(use currentlevel for final game but block level for testing)
class Meteor{
    constructor(x,y,level=currentLevel,symbol=blockSymbol,speed=blockSpeed,lives=blockLives,color="black",width=blockWidth,height=blockHeight,dead=false) {
        this.x=x;
        this.y=y;
        this.color=color;
        //Use level to determine the strength of each symbol, boss and minion
        this.level=level;
        //Each level has an unique number of lives, lives-- to 0 means dead(-- when symbol is clicked)
        this.lives=lives;
        this.symbol=symbol;
        this.dead=dead;
        this.width=width;
        this.height=height;
        this.speed=speed;
        this.shouldDraw=true;
        //Use to store the previous inputs player made
        this.inputCheck=[];
        //Number of clicks, only for level 16 meteors
        this.clickNum=100;
    }
    fall(){
        this.y+=this.speed;
    }
    //Becomes dead if symbol is clicked
    resolved(){
        this.dead=true;
    }
    levelResolved(){
        this.lives--;
        //Change the color according to the lives
    }
}

var blockSpeed=0.5;
var blockWidth=50;
var blockHeight=50;
var blockSymbol="";
var blockLevel=1;
var blockLives=1;
var meteorTime=5000;
var score=0;

//Intro transitions 2000
setTimeout(function(){
    document.getElementById("img").style.opacity=0;
    document.getElementById("clickAnywhere").style.display="block";
    document.getElementById("transition").style.opacity=1;
},2000);
//Hides this page so hover button will work
document.getElementById("introImg").addEventListener("click", function(){
    document.getElementById("introImg").style.opacity=0;
    introMusic();
    setTimeout(function(){
        document.getElementById("introImg").style.display="none";
    },1000);
});

var gameTime=20;
const grid=document.getElementById("grid");
const drawInput=document.getElementById("drawInput");
var pause=true;
var dead=false;
var allMeteors=[];
//Use magic items to slow time, break meteors, etc(access them by using 1,2,3,4,5,6,7,8,9, 0 can be used to throw away things to create space)
var inventory=[];
//Background floor
var floor={
    height:150,
    y:0
}
//Initialize y position for floor
floor.y=window.innerHeight-floor.height;
//Extra life
var immune=false;
//All keys work
var omnipitent=false;
var letterOnly=false;
var numOnly=false;
var symbolOnly=false;
var arrowOnly=false;
var juggernaut={
    on:false,
    x:0,
    y:0,
    speed:2
};
//Used for meteor level > 30
var holdShift=false;
//Used for meter level > 35
var holdShiftRight=false;
var randomLuck=0;
var hotStreak=false;
var restrict={
    on:false,
    x:0
};
var volume=true;

function drawBackground(){
    let canvas=document.getElementById("background");
    let ds=canvas.getContext("2d");
    canvas.style.left=grid.offsetLeft+"px";
    canvas.style.top=grid.offsetTop+"px";
    canvas.width = grid.offsetWidth;
    canvas.height = grid.offsetHeight;
    ds.clearRect(canvas.left,canvas.top,canvas.width,canvas.height);
    ds.fillRect(0,floor.y,window.innerWidth,floor.height);
    ds.beginPath();
    ds.moveTo(0,floor.y+2);
    ds.lineTo(window.innerWidth,floor.y+2 );
    ds.closePath();
    ds.lineWidth=4;
    ds.strokeStyle="rgb(243, 149, 13)";
    ds.stroke();
}

function drawGame(){
    let canvas=document.getElementById("meteorCanvas");
    let dp=canvas.getContext("2d");
    canvas.style.left=grid.offsetLeft+"px";
    canvas.style.top=grid.offsetTop+"px";
    canvas.width = grid.offsetWidth;
    canvas.height = grid.offsetHeight;
    dp.clearRect(canvas.left,canvas.top,canvas.width,canvas.height);
    if(juggernaut.on){
        dp.fillStyle="red";
        dp.fillRect(juggernaut.x,juggernaut.y,50,50);
        //Turns the juggernaut block when hit the sides of the screen
        if(juggernaut.x+50>=grid.offsetWidth||juggernaut.x<=0){
            juggernaut.speed*=-1;
        }
        //Moves the juggernaut block
        juggernaut.x+=juggernaut.speed;
    }
    if(restrict.on){
        dp.fillStyle="skyblue";
        dp.fillRect(restrict.x,0,100,grid.offsetHeight-floor.height);
    }
    //Draws all meteors as long as game not over
    for(let i=0;i<allMeteors.length;i++){
        //Draws meteor only if it's not dead
        if(!allMeteors[i].dead){
            dp.fillStyle=allMeteors[i].color;
        } else{
            dp.fillStyle="rgb(205, 24, 24)";
        }
        if(allMeteors[i].shouldDraw){
            let levelX=0;
            //Only draws according to the number of symbols
            for(let j=0;j<allMeteors[i].symbol.length;j++){
                dp.fillRect(allMeteors[i].x+levelX,allMeteors[i].y,allMeteors[i].width,allMeteors[i].height);
                levelX+=allMeteors[i].width;
            }
            dp.fillStyle="white";
            dp.font="30px Arial";
            let offsetx=0;
            for(let j=0;j<allMeteors[i].symbol.length;){
                //Makes the drawing of each symbol centered in each meteor
                switch(allMeteors[i].symbol[j]){
                    case "G":
                    case "U":
                    case "C":
                    case "Q":
                        offsetx=14;
                        break;
                    case "M":
                        offsetx=13;
                        break;
                    case "W":
                        offsetx=12;
                        break;
                    case "L":
                        offsetx=16;
                        break;
                    case "A":
                    case "B":
                    case "D":
                    case "E":
                    case "F":
                    case "H":
                    case "J":
                    case "K":
                    case "N":
                    case "O":
                    case "P":
                    case "R":
                    case "S":
                    case "T":
                    case "V":
                    case "X":
                    case "Y":
                    case "Z":
                        offsetx=15;
                        break;
                    case "I":
                        offsetx=21;
                        break;
                    case "1":
                    case "2":
                    case "3":
                    case "4":
                    case "5":
                    case "6":
                    case "7":
                    case "8":
                    case "9":
                    case "0":
                        offsetx=17;
                        break;
                    case "[":
                    case "]":
                    case ";":
                    case "\\":
                    case "/":
                    case ".":
                    case ",":
                    case "'":
                        offsetx=22;
                        break;
                    case "-":
                        offsetx=20;
                        break;
                    case "=":
                        offsetx=17;
                        break;
                    case "???":
                    case "???":
                        offsetx=18;
                        break;
                    default:
                        offsetx=10;
                        break
                }
                if(allMeteors[i].level>=22&&allMeteors[i].level<=25){
                    dp.fillText(allMeteors[i].symbol[j],allMeteors[i].x+offsetx+(j*allMeteors[i].width),allMeteors[i].y+35);
                    if(j!=allMeteors[i].inputCheck.length){
                        j++;
                    } else{
                        //Make it six to break out of the for loop
                        j=6;
                    }
                } else{
                    dp.fillText(allMeteors[i].symbol[j],allMeteors[i].x+offsetx+(j*allMeteors[i].width),allMeteors[i].y+35);
                    j++;
                }
            }
        }
    }
}

function nextInstruct(){
    document.getElementById("intro").style.bottom="100vh";
    document.getElementById("gadgetPage").style.bottom="100vh";
    introMusicStop();
}
function nextGadget(){
    document.getElementById("intro").style.bottom="100vh";
    document.getElementById("instructionPage").style.bottom="100vh";
    introMusicStop();
}
function back(){
    document.getElementById("intro").style.bottom="0vh";
    document.getElementById("instructionPage").style.bottom="0vh";
    document.getElementById("gadgetPage").style.bottom="0vh";
    pause=true;
    restartGame();
    settings.style.top="0vh";
    settingPage.style.top="-26vh";
    showInventory.style.bottom="0vh";
    inventoryPage.style.bottom="-50vh";
    introMusic();
}
function startGame(){
    nextInstruct();
    nextGadget();
    //Unpause game
    pause=false;
    document.getElementById("pauseButton").style.backgroundColor="rgb(244, 225, 133)";
    introMusicStop();
}
function restartGame(){
    blockSpeed=0.5;
    blockWidth=50;
    blockHeight=50;
    blockSymbol="";
    blockLevel=1;
    blockLives=1;
    meteorTime=5000;
    num=0;
    dead=false;
    keyInput="";
    allMeteors=[];
    inventory=[];
    wrongInput=false;
    score=0;
    grid.style.backgroundColor="rgb(15, 44, 103)";
    for(let i=0;i<box.length;i++){
        box[i].style.backgroundColor="transparent";
    }
    idIndex=-1;
    bonus=0;
    levelTime=0
    immune=false;
    omnipitent=false;
    letterOnly=false;
    numOnly=false;
    symbolOnly=false;
    arrowOnly=false;
    juggernaut.on=false;
    randomLuck=0;
    hotStreak=false;
    restrict.on=false;
}
const showInventory=document.getElementById("showInventory");
const inventoryPage=document.getElementById("inventory");
showInventory.addEventListener("click",function(){
    if(showInventory.style.bottom=="50vh"){
        showInventory.style.bottom="0vh";
        inventoryPage.style.bottom="-50vh";
        //Give player more time to prepare, idk y pauseGame function doesn;t work here
        setTimeout(function(){
            pause=false;
            document.getElementById("pauseButton").style.backgroundColor="rgb(244, 225, 133)";
        },3000);
    } else{
        showInventory.style.bottom="50vh";
        inventoryPage.style.bottom="0vh";
        pause=true;
        document.getElementById("pauseButton").style.backgroundColor="rgb(243, 149, 13)";
    }
    transitionSound();
});
const settings=document.getElementById("settings");
const settingPage=document.getElementById("settingPage");
settings.addEventListener("click",function(){
    if(settings.style.top=="24vh"){
        settings.style.top="0vh";
        settingPage.style.top="-26vh";
    } else{
        settings.style.top="24vh";
        settingPage.style.top="0vh";
    }
    transitionSound();
});
document.getElementById("pauseButton").addEventListener("mouseover",function(){
    if(document.getElementById("pauseButton").style.backgroundColor!="rgb(243, 149, 13)")
    document.getElementById("pauseButton").style.backgroundColor="rgb(243, 149, 13)";
});
document.getElementById("pauseButton").addEventListener("mouseleave",function(){
    if(!pause)
    document.getElementById("pauseButton").style.backgroundColor="rgb(244, 225, 133)";
});
function pauseGame(){
    if(pause){
        pause=false;
        document.getElementById("pauseButton").style.backgroundColor="rgb(244, 225, 133)";
    } else{
        pause=true;
        document.getElementById("pauseButton").style.backgroundColor="rgb(243, 149, 13)";
    }
}
//Adding sounds to the game from https://mixkit.co/free-sound-effects/game/
function transitionSound(){
    let audio=new Audio("notificationSound.mp3");
    if(volume){
        audio.play();
    }
}
function playGameOver(){
    let audio=new Audio("gameoverSound.mp3");
    audio.loop=false;
    if(volume){
        audio.play();
    }
}
var audioIntro=new Audio("introMusic.mp3");
function introMusic(){
    audioIntro.loop=true;
    if(volume){
        audioIntro.play();
    }
}
//Stops intro music when game starts
function introMusicStop(){
    audioIntro.pause();
}
function removeMeteor(){
    let audio=new Audio("removeMeteor.mp3");
    if(volume){
        audio.play();
    }
}
function volumeChange(){
    if(volume){
        document.getElementById("volume").className="fa fa-volume-off";
        volume=false;
        introMusicStop();
    } else{
        document.getElementById("volume").className="fa fa-volume-up";
        volume=true;
        introMusic();
    }
}

const itemUsed=document.getElementById("itemUsed");
var wrongInput=false;
var keyInput="";
//Get player keyboard inputs
document.addEventListener("keydown",function(key){
    if(key.code=="ShiftLeft"){
        holdShift=true;
    }
    if(key.code=="ShiftRight"){
        holdShiftRight=true;
    }
});
document.addEventListener("keyup",function(key){
    if(!pause&&!dead){
        drawInput.style.opacity="1";
        if(key.code.includes("Key")||key.code.includes("Digit")){
            drawInput.innerHTML="<strong>"+key.code.substring(key.code.length-1)+"</strong>";
            keyInput=key.code.substring(key.code.length-1);
        } else if(key.code=="Comma"||key.code=="Period"||key.code=="Slash"||key.code=="Backslash"||key.code=="Semicolon"||key.code=="Quote"||key.code=="Equal"||key.code=="Minus"){
            drawInput.innerHTML="<strong>"+key.code+"</strong>";
            switch(key.code){
                case "Comma":
                    keyInput=",";
                    break;
                case "Period":
                    keyInput=".";
                    break;
                case "Slash":
                    keyInput="/";
                    break;
                case "Backslash":
                    keyInput="\\";
                    break;
                case "Semicolon":
                    keyInput=";";
                    break;
                case "Quote":
                    keyInput="'";
                    break;
                case "Equal":
                    keyInput="=";
                    break;
                default:
                    keyInput="-";
                    break;
            }
        } else if(key.code=="BracketLeft"){
            drawInput.innerHTML="<strong>Left Bracket</strong>";
            keyInput="[";
        } else if(key.code=="BracketRight"){
            drawInput.innerHTML="<strong>Right Bracket</strong>";
            keyInput="]";
        } else if(key.code.includes("Arrow")){
            drawInput.innerHTML="<strong>"+key.code.substring(5)+"</strong>";
            switch(key.code.substring(5)){
                case "Up":
                    keyInput="???";
                    break;
                case "Left":
                    keyInput="???";
                    break;
                case "Right":
                    keyInput="???";
                    break;
                default:
                    keyInput="???";
                    break;
            }
        } else{
            drawInput.style.opacity="0";
            keyInput="";
        }
        //Cancels input display after a while
        setTimeout(cancelInputDraw,1500);
        wrongInput=true;
        //Player won't die if press space or shift
        if(key.code=="Space"){
            wrongInput=false;
        } else if(key.code=="ShiftLeft"){
            holdShift=false;
            wrongInput=false;
        } else if(key.code=="ShiftRight"){
            holdShiftRight=true;
            wrongInput=false;
        }
        //Activates the item power selected
        if(key.code=="Space"){
            switch(inventory[idIndex]){
                case 0:
                    floor.y+=25;
                    floor.height-=25;
                    itemUsed.innerHTML="Lower Elevation";
                    break;
                case 1:
                    removeMeteor();
                    for(let i=0;i<allMeteors.length;i++){
                        if(!allMeteors[i].dead&&!(allMeteors[i].level>=17&&allMeteors[i].level<=21)){
                            allMeteors[i].resolved();
                            //Add score
                            score++;
                            bonus++;
                            levelTime++;
                            addLevel();
                            if(bonus==100){
                                //Provide a random item to the inventory for every 100 points
                                if(inventory.length<10){
                                    inventory.push(Math.floor(Math.random()*20));
                                }
                                bonus=0;
                            }
                        }
                        setTimeout(function(){
                            allMeteors[i].shouldDraw=false;
                        },1000);
                    }
                    itemUsed.innerHTML="Magical Eraser";
                    break;
                case 2:
                    //Need to stop the production of meteors as well
                    for(let i=0;i<allMeteors.length;i++){
                        if(!(allMeteors[i].level>=17&&allMeteors[i].level<=21)){
                            allMeteors[i].speed=0;
                        }
                    }
                    itemUsed.innerHTML="Time Quiescence";
                    break;
                case 3:
                    meteorTime+=100;
                    itemUsed.innerHTML="Meteor Reduction";
                    break;
                case 4:
                    //Think about how to stop repeating and using up immunity when immuned already
                    immune=true;
                    itemUsed.innerHTML="Immunity";
                    break;
                case 5:
                    let luck=Math.floor(Math.random()*100);
                    //20% chance
                    if(luck<19&&randomLuck!=50){
                        randomLuck+=2;
                    }
                    itemUsed.innerHTML="Luky Charm";
                    break;
                case 6:
                    //Does not affect the points added by other gadgets(eg. immunity and magical eraser)
                    hotStreak=true;
                    setTimeout(function(){
                        hotStreak=false;
                    },10000);
                    itemUsed.innerHTML="Hot Streak";
                    break;
                case 7:
                    //Randomize juggernaut position
                    juggernaut.x=Math.floor(Math.random()*(grid.offsetWidth-50));
                    juggernaut.y=Math.floor(Math.random()*(grid.offsetHeight-floor.height-50));
                    juggernaut.on=true;
                    setTimeout(function(){
                        juggernaut.on=false;
                    },20000);
                    itemUsed.innerHTML="Juggernaut";
                    break;
                case 8:
                    omnipitent=true;
                    setTimeout(function(){
                        omnipitent=false;
                    },5000);
                    itemUsed.innerHTML="Omnipotent";
                    break;
                case 9:
                    //Add 5 points for every item
                    for(let i=0;i<inventory.length;i++){
                        score+=5;
                    } 
                    //Delete all item
                    inventory=[];
                    itemUsed.innerHTML="All-In Gambit";
                    break;
                case 10:
                    if(inventory.length!=10){
                        floor.y-=25;
                        floor.height+=25;
                        inventory.push(Math.floor(Math.random()*20));
                    }
                    itemUsed.innerHTML="Equal Trade";
                    break;
                case 11:
                    for(let i=0;i<inventory.length;i++){
                        inventory[i]=Math.floor(Math.random()*20);
                    }
                    itemUsed.innerHTML="Shuffle";
                    break;
                case 12:
                    for(let i=0;i<allMeteors.length;i++){
                        if(!(allMeteors[i].level>=17&&allMeteors[i].level<=21)){
                            allMeteors[i].y-=200;
                        }
                    }
                    itemUsed.innerHTML="Time Rewind";
                    break;
                case 13:
                    for(let i=0;i<allMeteors.length;i++){
                        if(!(allMeteors[i].level>=17&&allMeteors[i].level<=21)){
                            allMeteors[i].level=1;
                            allMeteors[i].lives=1;
                            //Leaves only the first letter of each meteor symbol
                            allMeteors[i].symbol=allMeteors[i].symbol.substring(0,1);
                            allMeteors[i].inputCheck=[];
                        }
                    }
                    itemUsed.innerHTML="Primitive Meteors";
                    break;
                case 14:
                    numOnly=true;
                    arrowOnly=false;
                    letterOnly=false;
                    symbolOnly=false;
                    setTimeout(function(){
                        numOnly=false;
                    },10000);
                    itemUsed.innerHTML="Digits Only";
                    break;
                case 15:
                    letterOnly=true;
                    numOnly=false;
                    arrowOnly=false;
                    symbolOnly=false;
                    setTimeout(function(){
                        letterOnly=false;
                    },10000);
                    itemUsed.innerHTML="Letters Only";
                    break;
                case 16:
                    symbolOnly=true;
                    numOnly=false;
                    letterOnly=false;
                    arrowOnly=false;
                    setTimeout(function(){
                        symbolOnly=false;
                    },10000);
                    itemUsed.innerHTML="Symbols Only";
                    break;
                case 17:
                    arrowOnly=true;
                    numOnly=false;
                    letterOnly=false;
                    symbolOnly=false;
                    setTimeout(function(){
                        arrowOnly=false;
                    },10000);
                    itemUsed.innerHTML="Arrows Only";
                    break;
                case 18:
                    restrict.x=Math.floor(Math.random()*(grid.offsetWidth-100));
                    restrict.on=true;
                    setTimeout(function(){
                        restrict.on=false;
                    },15000);
                    itemUsed.innerHTML="Restricted Area";
                    break;
                case 19:
                    for(let i=0;i<allMeteors.length;i++){
                        if(!(allMeteors[i].level>=17&&allMeteors[i].level<=21)){
                            allMeteors[i].speed=0.25;
                        }
                    }
                    itemUsed.innerHTML="Infinity Barrier";
                    break;
                default: 
                    itemUsed.innerHTML="No Item Selected";
                    break;
            }
            if(idIndex!=-1)
            inventory.splice(idIndex,1);
            //Reset the index selection
            idIndex=-1;
            //Redraws the color of the selected box
            for(let i=0;i<box.length;i++){
                box[i].style.backgroundColor="transparent";
            }
            //Shows which item is being used
            itemUsed.style.opacity="1";
            setTimeout(function(){
                itemUsed.style.opacity="0";
            },1500);
        }
    }
});

function cancelInputDraw(){
    drawInput.style.opacity="0";
}

//IDK why hover won't won't with callInventory, so have to code hover effect this way
const box=document.getElementsByClassName("box");
box[0].addEventListener("mouseover",function(){
    if(box[0].style.backgroundColor!="rgb(243, 149, 13)"){
        box[0].style.backgroundColor="rgba(243, 149, 13, 0.4)";
    }
});
box[0].addEventListener("mouseleave",function(){
    if(box[0].style.backgroundColor!="rgb(243, 149, 13)"){
        box[0].style.backgroundColor="transparent";
    }
});
box[1].addEventListener("mouseover",function(){
    if(box[1].style.backgroundColor!="rgb(243, 149, 13)"){
        box[1].style.backgroundColor="rgba(243, 149, 13, 0.4)";
    }
});
box[1].addEventListener("mouseleave",function(){
    if(box[1].style.backgroundColor!="rgb(243, 149, 13)"){
        box[1].style.backgroundColor="transparent";
    }
});
box[2].addEventListener("mouseover",function(){
    if(box[2].style.backgroundColor!="rgb(243, 149, 13)"){
        box[2].style.backgroundColor="rgba(243, 149, 13, 0.4)";
    }
});
box[2].addEventListener("mouseleave",function(){
    if(box[2].style.backgroundColor!="rgb(243, 149, 13)"){
        box[2].style.backgroundColor="transparent";
    }
});
box[3].addEventListener("mouseover",function(){
    if(box[3].style.backgroundColor!="rgb(243, 149, 13)"){
        box[3].style.backgroundColor="rgba(243, 149, 13, 0.4)";
    }
});
box[3].addEventListener("mouseleave",function(){
    if(box[3].style.backgroundColor!="rgb(243, 149, 13)"){
        box[3].style.backgroundColor="transparent";
    }
});
box[4].addEventListener("mouseover",function(){
    if(box[4].style.backgroundColor!="rgb(243, 149, 13)"){
        box[4].style.backgroundColor="rgba(243, 149, 13, 0.4)";
    }
});
box[4].addEventListener("mouseleave",function(){
    if(box[4].style.backgroundColor!="rgb(243, 149, 13)"){
        box[4].style.backgroundColor="transparent";
    }
});
box[5].addEventListener("mouseover",function(){
    if(box[5].style.backgroundColor!="rgb(243, 149, 13)"){
        box[5].style.backgroundColor="rgba(243, 149, 13, 0.4)";
    }
});
box[5].addEventListener("mouseleave",function(){
    if(box[5].style.backgroundColor!="rgb(243, 149, 13)"){
        box[5].style.backgroundColor="transparent";
    }
});
box[6].addEventListener("mouseover",function(){
    if(box[6].style.backgroundColor!="rgb(243, 149, 13)"){
        box[6].style.backgroundColor="rgba(243, 149, 13, 0.4)";
    }
});
box[6].addEventListener("mouseleave",function(){
    if(box[6].style.backgroundColor!="rgb(243, 149, 13)"){
        box[6].style.backgroundColor="transparent";
    }
});
box[7].addEventListener("mouseover",function(){
    if(box[7].style.backgroundColor!="rgb(243, 149, 13)"){
        box[7].style.backgroundColor="rgba(243, 149, 13, 0.4)";
    }
});
box[7].addEventListener("mouseleave",function(){
    if(box[7].style.backgroundColor!="rgb(243, 149, 13)"){
        box[7].style.backgroundColor="transparent";
    }
});
box[8].addEventListener("mouseover",function(){
    if(box[8].style.backgroundColor!="rgb(243, 149, 13)"){
        box[8].style.backgroundColor="rgba(243, 149, 13, 0.4)";
    }
});
box[8].addEventListener("mouseleave",function(){
    if(box[8].style.backgroundColor!="rgb(243, 149, 13)"){
        box[8].style.backgroundColor="transparent";
    }
});
box[9].addEventListener("mouseover",function(){
    if(box[9].style.backgroundColor!="rgb(243, 149, 13)"){
        box[9].style.backgroundColor="rgba(243, 149, 13, 0.4)";
    }
});
box[9].addEventListener("mouseleave",function(){
    if(box[9].style.backgroundColor!="rgb(243, 149, 13)"){
        box[9].style.backgroundColor="transparent";
    }
});
//Use the clicks of div element to determine which item is selected
var idIndex=-1;
function callInventory(id){
    for(let i=0;i<box.length;i++){
        if(i==parseInt(id.substring(id.length-1))){
            if(box[i].style.backgroundColor=="rgb(243, 149, 13)"){
                box[i].style.backgroundColor="transparent";
                idIndex=-1;
            } else{
                box[i].style.backgroundColor="rgb(243, 149, 13)";
                idIndex=i;
            }
        } else{
            box[i].style.backgroundColor="transparent";
        }
    }
}

//Used to see if should give bonus or not
var bonus=0;
//Used to see the current level of each meteor
var currentLevel=1;
//Makes the meteors fall and create new objects
function game(){
    //Used to see if can terminate the non-priority blocks
    let shouldTerminate=true;
    for(let i=0;i<allMeteors.length;i++){
        //Terminate meteor with luck
        if(!allMeteors[i].dead&&Math.floor(Math.random()*100)+1<=randomLuck&&!(allMeteors[i].level>=17&&allMeteors[i].level<=21)){
            removeMeteor();
            allMeteors[i].resolved();
            setTimeout(function(){
                allMeteors[i].shouldDraw=false;
            },1000);
            score++;
            bonus++;
            levelTime++;
            addLevel();
            if(bonus==100){
                //Provide a random item to the inventory for every 100 points
                if(inventory.length<10){
                    inventory.push(Math.floor(Math.random()*20));
                }
                bonus=0;
            }
        }
        //Terminate meteor if it touches the juggernaut block
        if(!allMeteors[i].dead&&(allMeteors[i].x<=juggernaut.x+50&&allMeteors[i].x+allMeteors[i].symbol.length*blockWidth>=juggernaut.x)&&(allMeteors[i].y<=juggernaut.y+50&&allMeteors[i].y+blockHeight>=juggernaut.y)&&!(allMeteors[i].level>=17&&allMeteors[i].level<=21)&&juggernaut.on){
            removeMeteor();
            allMeteors[i].resolved();
            setTimeout(function(){
                allMeteors[i].shouldDraw=false;
            },1000);
            score++;
            bonus++;
            levelTime++;
            addLevel();
            if(bonus==100){
                //Provide a random item to the inventory for every 100 points
                if(inventory.length<10){
                    inventory.push(Math.floor(Math.random()*20));
                }
                bonus=0;
            }
        }
        //Terminate meteor if it touches the restricted area
        if(!allMeteors[i].dead&&(allMeteors[i].x<=restrict.x+100&&allMeteors[i].x+allMeteors[i].symbol.length*blockWidth>=restrict.x)&&!(allMeteors[i].level>=17&&allMeteors[i].level<=21)&&restrict.on){
            removeMeteor();
            allMeteors[i].resolved();
            setTimeout(function(){
                allMeteors[i].shouldDraw=false;
            },1000);
            score++;
            bonus++;
            levelTime++;
            addLevel();
            if(bonus==100){
                //Provide a random item to the inventory for every 100 points
                if(inventory.length<10){
                    inventory.push(Math.floor(Math.random()*20));
                }
                bonus=0;
            }
        }
        //Cancels termination if priority block is not terminated
        if(allMeteors[i].level>=10&&allMeteors[i].level<=14&&!allMeteors[i].dead){
            shouldTerminate=false;
        }
        //Fast block speed adjustment
        if(allMeteors[i].level==15){
            allMeteors[i].speed=6;
        }
        //Slow block speed adjustment
        if(allMeteors[i].level==16){
            allMeteors[i].speed=0.1;
        }
    }
    for(let i=0;i<allMeteors.length;i++){
        //Colors each meteor based on level
        if(allMeteors[i].level<=5){
            allMeteors[i].color="black";
        } else if(allMeteors[i].level>=6&&allMeteors[i].level<=9){
            allMeteors[i].color="grey";
        } else if(allMeteors[i].level<=14){
            allMeteors[i].color="orange";
        } else if(allMeteors[i].level==15){
            allMeteors[i].color="blue";
        } else if(allMeteors[i].level==16){
            allMeteors[i].color="black";
        } else if(allMeteors[i].level<=21){
            allMeteors[i].color="green";
        } else if(allMeteors[i].level<=25){
            allMeteors[i].color="black";
        } else if(allMeteors[i].level<=30){
            allMeteors[i].color="brown";
        } else if(allMeteors[i].level<=35){
            allMeteors[i].color="gold";
        } else{
            allMeteors[i].color="purple";
        }
        //Only when its not touching floor would it fall
        if(allMeteors[i].y+allMeteors[i].height<floor.y){
            allMeteors[i].fall();
        } else{
            //Only when meteor is not dead will it end the game when touch floor
            if(!allMeteors[i].dead){
                if(immune){
                    removeMeteor();
                    allMeteors[i].resolved();
                    setTimeout(function(){
                        allMeteors[i].shouldDraw=false;
                    },1000);
                    immune=false;
                    score++;
                    bonus++;
                    levelTime++;
                    addLevel();
                    if(bonus==100){
                        //Provide a random item to the inventory for every 100 points
                        if(inventory.length<10){
                            inventory.push(Math.floor(Math.random()*20));
                        }
                        bonus=0;
                    }
                } else{
                    dead=true;
                    playGameOver();
                }
            }
        }
        if(!allMeteors[i].dead){
            if(keyInput!=""&&omnipitent){
                allMeteors[i].levelResolved();
            } else if(!omnipitent){
                if(keyInput!=""&&allMeteors[i].symbol.includes(keyInput)){
                    wrongInput=false;
                    if(shouldTerminate){
                        if(!allMeteors[i].inputCheck.includes(keyInput)&&(allMeteors[i].level<=5||allMeteors[i].level==15||(allMeteors[i].level>=26&&allMeteors[i].level<=30))){
                            allMeteors[i].inputCheck.push(keyInput);
                            allMeteors[i].levelResolved();
                        }
                        if(!allMeteors[i].inputCheck.includes(keyInput)&&((allMeteors[i].level>5&&allMeteors[i].level<=9)||(allMeteors[i].level>=22&&allMeteors[i].level<=25))){
                            if(keyInput==allMeteors[i].symbol[allMeteors[i].inputCheck.length]){
                                allMeteors[i].inputCheck.push(keyInput);
                                 allMeteors[i].levelResolved();
                            }
                        }
                        if(allMeteors[i].level==16){
                            allMeteors[i].clickNum--;
                            if(allMeteors[i].clickNum==0){
                                allMeteors[i].resolved();
                            }
                        }
                        if(holdShift&&!allMeteors[i].inputCheck.includes(keyInput)&&(allMeteors[i].level>30&&allMeteors[i].level<=35)){
                            allMeteors[i].inputCheck.push(keyInput);
                            allMeteors[i].levelResolved();
                        }
                        if(holdShiftRight&&!allMeteors[i].inputCheck.includes(keyInput)&&(allMeteors[i].level>35&&allMeteors[i].level<=40)){
                            allMeteors[i].inputCheck.push(keyInput);
                            allMeteors[i].levelResolved();
                        }
                    } else{
                        if(allMeteors[i].level>=10&&allMeteors[i].level<=14&&(!allMeteors[i].inputCheck.includes(keyInput))){
                            allMeteors[i].inputCheck.push(keyInput);
                            allMeteors[i].levelResolved();
                        }
                    }
                    if(allMeteors[i].lives==0){
                        //Plays meteor terminated sound
                        removeMeteor();
                        allMeteors[i].resolved();
                        setTimeout(function(){
                            allMeteors[i].shouldDraw=false;
                        },1000);
                        if(hotStreak){
                            score+=2;
                        } else{
                            score++;
                        }
                        bonus++;
                        levelTime++;
                        addLevel();
                        if(bonus==100){
                            //Provide a random item to the inventory for every 100 points
                            if(inventory.length<10){
                                inventory.push(Math.floor(Math.random()*20));
                            }
                            bonus=0;
                        }
                        //Create two new meteors for levels 26~30
                        if(allMeteors[i].level>=26&&allMeteors[i].level<=30){
                            //Use for loop to create two meteors
                            for(let j=0;j<2;j++){
                                blockSymbol="";
                                let randomSymbol=0;
                                let repeatSymbol=[];
                                currentLevel=Math.floor(Math.random()*5)+1;
                                let symbolNum=currentLevel;
                                blockLives=symbolNum;
                                let n=0;
                                let addN=0;
                                //Symbol number depends on level number
                                for(let i=0;i<symbolNum;i++){
                                    if(numOnly){
                                        n=10;
                                        addN=0;
                                    } else if(letterOnly){
                                        n=26;
                                        addN=10;
                                    } else if(symbolOnly){
                                        n=10;
                                        addN=36;
                                    } else if(arrowOnly){
                                        n=4;
                                        addN=46;
                                    } else{
                                        n=50;
                                        addN=0;
                                    }
                                    randomSymbol=Math.floor(Math.random()*n)+addN;
                                    while(repeatSymbol.includes(randomSymbol)){
                                        randomSymbol=Math.floor(Math.random()*n)+addN;
                                    }
                                    repeatSymbol.push(randomSymbol);
                                    //Randomize the symbols for the meteors
                                    switch(randomSymbol){
                                        case 10:
                                        case 11:
                                        case 12:
                                        case 13:
                                        case 14:
                                        case 15:
                                        case 16:
                                        case 17:
                                        case 18:
                                        case 19:
                                        case 20:
                                        case 21:
                                        case 22:
                                        case 23:
                                        case 24:
                                        case 25:
                                        case 26:
                                        case 27:
                                        case 28:
                                        case 29:
                                        case 30:
                                        case 31:
                                        case 32:
                                        case 33:
                                        case 34:
                                        case 35:
                                            //Changing number to letter
                                            blockSymbol+=String.fromCharCode(randomSymbol+55);
                                            break;
                                        case 36:
                                            blockSymbol+=",";
                                            break;
                                        case 37:
                                            blockSymbol+=".";
                                            break;
                                        case 38:
                                            blockSymbol="/";
                                            break;
                                        case 39:
                                            blockSymbol+=";";
                                            break;
                                        case 40:
                                            blockSymbol+="'";
                                            break;
                                        case 41:
                                            blockSymbol+="[";
                                            break;
                                        case 42:
                                            blockSymbol+="]";
                                            break;
                                        case 43:
                                            blockSymbol+="\\";
                                            break;
                                        case 44:
                                            blockSymbol+="-";
                                            break;
                                        case 45:
                                            blockSymbol+="=";
                                            break;
                                        case 46:
                                            blockSymbol+="???";
                                            break;
                                        case 47:
                                            blockSymbol+="???";
                                            break;
                                        case 48:
                                            blockSymbol+="???";
                                            break;
                                        case 49:
                                            blockSymbol+="???";
                                            break;
                                        default:
                                            blockSymbol+=randomSymbol.toString();
                                            break;
                                    }
                                }
                                allMeteors.push(new Meteor(Math.random()*(window.innerWidth-blockWidth*currentLevel),allMeteors[i].y));
                            }
                        }
                    }
                }
            }
        }
    }
    //Game ends if the input is not on any of the meteors
    if(wrongInput){
        dead=true;
        playGameOver();
    }
    //Clear input to avoid clearing meteor too early
    keyInput="";
}

//Adds new level based on score
function addLevel(){
    switch(score){
        case 5:
        case 10:
        case 25:
        case 50:
        case 100:
        case 125:
        case 150:
        case 175:
        case 250:
        case 275:
        case 300:
        case 325:
        case 350:
        case 400:
        case 500:
        case 525:
        case 550:
        case 575:
        case 600:
        case 625:
        case 800:
        case 850:
        case 900:
        case 950:
        case 1200:
        case 1300:
        case 1400:
        case 1500:
        case 2000:
        case 2250:
        case 2500:
        case 2750:
        case 3000:
        case 5000:
        case 5500:
        case 6000:
        case 6500:
        case 7000:
            blockLevel++;
            break;
        default:
            break;
    }
}
//Draws all inventory items(change how current item works, should be when selected)
function drawItem(){
    let item=document.getElementsByClassName("itemName");
    for(let i=0;i<inventory.length;i++){
        switch(inventory[i]){
            case 0:
                item[i].innerHTML="Lower Elevation";
                document.getElementById("icon"+i).className="fa fa-cloud-download";
                break;
            case 1:
                item[i].innerHTML="Magical Eraser";
                document.getElementById("icon"+i).className="fa fa-magic";
                break;
            case 2:
                item[i].innerHTML="Time Quiescence";
                document.getElementById("icon"+i).className="fa fa-hourglass-half";
                break;
            case 3:
                item[i].innerHTML="Meteor Reduction";
                document.getElementById("icon"+i).className="fa fa-ban";
                break;
            case 4:
                item[i].innerHTML="Immunity";
                //maybe fa fa-medkit
                document.getElementById("icon"+i).className="fa fa-shield";
                break;
            case 5:
                item[i].innerHTML="Lucky Charm";
                document.getElementById("icon"+i).className="fa fa-star";
                break;
            case 6:
                item[i].innerHTML="Hot Streak";
                document.getElementById("icon"+i).className="fa fa-fire";
                break;
            case 7:
                item[i].innerHTML="Juggernaut";
                document.getElementById("icon"+i).className="fa fa-rocket";
                break;
            case 8:
                item[i].innerHTML="Omnipotent";
                document.getElementById("icon"+i).className="fa fa-universal-access";
                break;
            case 9:
                item[i].innerHTML="All-In Gambit";
                //maybe fa fa-money
                document.getElementById("icon"+i).className="fa fa-bitcoin";
                break;
            case 10:
                item[i].innerHTML="Equal Trade";
                document.getElementById("icon"+i).className="fa fa-balance-scale";
                break;
            case 11:
                item[i].innerHTML="Shuffle";
                document.getElementById("icon"+i).className="fa fa-refresh";
                break;
            case 12:
                item[i].innerHTML="Time Rewind";
                document.getElementById("icon"+i).className="fa fa-fast-backward";
                break;
            case 13:
                item[i].innerHTML="Primitive Meteors";
                document.getElementById("icon"+i).className="fa fa-history";
                break;
            case 14:
                item[i].innerHTML="Digits Only";
                document.getElementById("icon"+i).className="fa fa-sort-numeric-asc";
                break;
            case 15:
                item[i].innerHTML="Letters Only";
                document.getElementById("icon"+i).className="fa fa-sort-alpha-asc";
                break;
            case 16:
                item[i].innerHTML="Symbols Only";
                document.getElementById("icon"+i).className="fa fa-hashtag";
                break;
            case 17:
                item[i].innerHTML="Arrows Only";
                //or can do fa fa-toggle-up
                document.getElementById("icon"+i).className="fa fa-sort";
                break;
            case 18:
                item[i].innerHTML="Restricted Area";
                document.getElementById("icon"+i).className="fa fa-warning";
                break;
            case 19:
                item[i].innerHTML="Infinity Barrier";
                document.getElementById("icon"+i).className="fa fa-tachometer";
                break;
            default:
                break;
        }
    }
    //Input no item if there is no item in the slot
    if(inventory.length<10){
        for(let i=10;i>inventory.length;i--){
            item[i-1].innerHTML="No Item";
            document.getElementById("icon"+(i-1)).className="fa fa-times-circle";
        }
    }
}
//inventory=[1,2,3,9,18,10,15,16,7];
var num=0;
var levelTime=0;
//Create meteor objects
setInterval(function(){
    if(!pause&&!dead){
        //Changing levels based on scores(every 50 minus 50)
        if(meteorTime>50){
            if(levelTime==50){
                meteorTime-=50;
                levelTime=0;
            }
        }
        num++;
        if(num>=meteorTime/4){
            //There are a total of 50 possible symbols
            let randomSymbol=0;
            //Reset blocksymbol
            blockSymbol="";
            //Used to avoid repeating symbols
            let repeatSymbol=[];
            //See how many symbol each meteor symbol should have
            let symbolNum=0;
            //Randomize the level of each meteor
            currentLevel=Math.floor(Math.random()*blockLevel)+1;
            if(currentLevel==15||currentLevel==16){
                symbolNum=1;
            } else{
                if(currentLevel/5==1){
                    symbolNum=5;
                } else if(currentLevel/5==4){
                    symbolNum=4;
                } else if(currentLevel/5==5){
                    symbolNum=5;
                } else if(currentLevel/5==6){
                    symbolNum=5;
                } else if(currentLevel/5==7){
                    symbolNum=5;
                } else if(currentLevel/5==8){
                    symbolNum=5;
                } else if(currentLevel<5){
                    symbolNum=currentLevel%5;
                } else{
                    symbolNum=currentLevel%5;
                }
            }
            //Changes the lives of all meteors based on level/symbol num
            blockLives=symbolNum;
            let n=0;
            let addN=0;
            //Symbol number depends on level number
            for(let i=0;i<symbolNum;i++){
                if(numOnly){
                    n=10;
                    addN=0;
                } else if(letterOnly){
                    n=26;
                    addN=10;
                } else if(symbolOnly){
                    n=10;
                    addN=36;
                } else if(arrowOnly){
                    n=4;
                    addN=46;
                } else{
                    n=50;
                    addN=0;
                }
                randomSymbol=Math.floor(Math.random()*n)+addN;
                while(repeatSymbol.includes(randomSymbol)){
                    randomSymbol=Math.floor(Math.random()*n)+addN;
                }
                repeatSymbol.push(randomSymbol);
                //Randomize the symbols for the meteors
                switch(randomSymbol){
                    case 10:
                    case 11:
                    case 12:
                    case 13:
                    case 14:
                    case 15:
                    case 16:
                    case 17:
                    case 18:
                    case 19:
                    case 20:
                    case 21:
                    case 22:
                    case 23:
                    case 24:
                    case 25:
                    case 26:
                    case 27:
                    case 28:
                    case 29:
                    case 30:
                    case 31:
                    case 32:
                    case 33:
                    case 34:
                    case 35:
                        //Changing number to letter
                        blockSymbol+=String.fromCharCode(randomSymbol+55);
                        break;
                    case 36:
                        blockSymbol+=",";
                        break;
                    case 37:
                        blockSymbol+=".";
                        break;
                    case 38:
                        blockSymbol="/";
                        break;
                    case 39:
                        blockSymbol+=";";
                        break;
                    case 40:
                        blockSymbol+="'";
                        break;
                    case 41:
                        blockSymbol+="[";
                        break;
                    case 42:
                        blockSymbol+="]";
                        break;
                    case 43:
                        blockSymbol+="\\";
                        break;
                    case 44:
                        blockSymbol+="-";
                        break;
                    case 45:
                        blockSymbol+="=";
                        break;
                    case 46:
                        blockSymbol+="???";
                        break;
                    case 47:
                        blockSymbol+="???";
                        break;
                    case 48:
                        blockSymbol+="???";
                        break;
                    case 49:
                        blockSymbol+="???";
                        break;
                    default:
                        blockSymbol+=randomSymbol.toString();
                        break;
                }
            }
            allMeteors.push(new Meteor(Math.random()*(window.innerWidth-blockWidth*currentLevel),-blockHeight));
            num=0;
        }
    }
    //document.getElementById("hi").innerHTML=inventory+"       "+idIndex;
});

setInterval(function(){
    document.getElementById("points").innerHTML="Score: "+score;
    let currentItem=document.getElementById("currentItem");
    let currentItemImg=document.getElementById("currentItemImg");
    if(dead){
        grid.style.backgroundColor="rgb(205, 24, 24)";
    } else{
        grid.style.backgroundColor="rgb(15, 44, 103)";
        switch(inventory[idIndex]){
            case 0:
                currentItem.innerHTML="Lower Elevation";
                currentItemImg.className="fa fa-cloud-download";
                break;
            case 1:
                currentItem.innerHTML="Magical Eraser";
                currentItemImg.className="fa fa-magic";
                break;
            case 2:
                currentItem.innerHTML="Time Quiescence";
                currentItemImg.className="fa fa-hourglass-half";
                break;
            case 3:
                currentItem.innerHTML="Meteor Reduction";
                currentItemImg.className="fa fa-ban";
                break;
            case 4:
                currentItem.innerHTML="Immunity";
                currentItemImg.className="fa fa-shield";
                break;
            case 5:
                currentItem.innerHTML="Lucky Charm";
                currentItemImg.className="fa fa-star";
                break;
            case 6:
                currentItem.innerHTML="Hot Streak";
                currentItemImg.className="fa fa-fire";
                break;
            case 7:
                currentItem.innerHTML="Juggernaut";
                currentItemImg.className="fa fa-rocket";
                break;
            case 8:
                currentItem.innerHTML="Omnipotent";
                currentItemImg.className="fa fa-universal-access";
                break;
            case 9:
                currentItem.innerHTML="All-In Gambit";
                currentItemImg.className="fa fa-bitcoin";
                break;
            case 10:
                currentItem.innerHTML="Equal Trade";
                currentItemImg.className="fa fa-balance-scale";
                break;
            case 11:
                currentItem.innerHTML="Shuffle";
                currentItemImg.className="fa fa-refresh";
                break;
            case 12:
                currentItem.innerHTML="Time Rewind";
                currentItemImg.className="fa fa-fast-backward";
                break;
            case 13:
                currentItem.innerHTML="Primitive Meteors";
                currentItemImg.className="fa fa-history";
                break;
            case 14:
                currentItem.innerHTML="Digits Only";
                currentItemImg.className="fa fa-sort-numeric-asc";
                break;
            case 15:
                currentItem.innerHTML="Letters Only";
                currentItemImg.className="fa fa-sort-alpha-asc";
                break;
            case 16:
                currentItem.innerHTML="Symbols Only";
                currentItemImg.className="fa fa-hashtag";
                break;
            case 17:
                currentItem.innerHTML="Arrows Only";
                currentItemImg.className="fa fa-sort";
                break;
            case 18:
                currentItem.innerHTML="Restricted Area";
                currentItemImg.className="fa fa-warning";
                break;
            case 19:
                currentItem.innerHTML="Infinity Barrier";
                currentItemImg.className="fa fa-tachometer";
                break;
            default:
                currentItem.innerHTML="No Item Selected";
                currentItemImg.className="fa fa-times-circle";
                break;
        }
    }
    if(!pause&&!dead){
        drawInput.style.top=(window.innerHeight-drawInput.offsetHeight-floor.height)/2+"px";
        drawInput.style.left=(window.innerWidth-drawInput.offsetWidth)/2+"px";
        itemUsed.style.top=(window.innerHeight-itemUsed.offsetHeight-floor.height)/2+"px";
        itemUsed.style.left=(window.innerWidth-itemUsed.offsetWidth)/2+"px";
        drawBackground();
        drawGame();
        drawItem();
        game();
    }
},gameTime);
/*
Can have width=number of symbols
Height can be an extra line of symbols where player has to click the things in the rows together to get rid of them
Inventory can reduce floor height: extra time to clear meteors
Inventory can add power up but also bring consequences, such as increasing floor height
Player can have 3 lives, if press wrong keys then minus 1 so they can't keep clicking

Inventory Item Ideas:
1. Lower Elevation: lowers floor height
2. Eraser: clears all meteors on the screen
3. Stop(new name): stops all meteor, speed to 0
4. Less Meteor(new name): increase meteortime, less meteor appear
5. Immunity: one death doesn't count(only can activate one at a time)
6. Helper(new name): 20%(or another %) chance of getting rid of one meteor
7. Hot Streak: plus 2 points each time a meteor is removed in duration of 5 seconds
8. Juggernaut: create a smashing block that keeps moving slowly(or fast) from one end to another, touch meteors die
9. Omnipitent: all keys work on everything
10. Sacrificial Lamb(new name): throw away all inventory, each adding 5 points to the score
11. Equal Trade: increase floor height but random gets one more item
12. Shuffle: shuffles and changes all items in the inventory to new ones
13. Rewind: pushes all meteor upwards
14. Primitives: decrease all meteor to having only one symbol
15. Digits Only: only digit symbols for 10s
16. Letters Only: only letter symbols for 10s
17. Symbols Only: only symbols for 10s
18. Arrows Only: only arrow symbols for 10s
19. Restricted Area: a random area of about 100px gets blocked, every meteor that forms there dies instantly
20. Infinity Barrier: slows down meteor speed

Levels:
1~5. Different numbers(1 to 5) of symbols 
6~9. Different numbers(2 to 5) of symbols that have to be terminated in the given sequence
10~14. Different numbers(1 to 5) of symbols that have to be terminated first before terminating others
15. One fast falling meteor of one symbol
16. One slow moving meteor of one symbol, but requires 100 clicks of the symbol to terminate
17~21. Different numbers(1 to 5) of symbols that are not affected by any power ups/gadgets
22~25. Different numbers(2 to 5) of symbols in which only the previous symbol is revealed while others are not shown until the previous is terminated
26~30. Different numbers(1 to 5) of symbols where its termination produces two level 1~5 meteors
31~35. Different numbers(1 to 5) of symbols where you have to hold shift(shift=true&&other key=true) and press key to terminate meteor
36~40. Different numbers(1 to 5) of symbols where you have to hold shiftright(shiftright=true&&other key=true) and press key to terminate meteor

Surprise meteor where items drop out when defeated?
*/