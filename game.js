//Use this.attribute for the attributes
class Meteor{
    constructor(x,y,symbol=blockSymbol,speed=blockSpeed,level=1,lives=1,color="black",width=blockWidth,height=blockHeight,dead=false) {
        this.x=x;
        this.y=y;
        //Color determines the lives, like how jumps changes color in justaplatformer
        if(lives>5){

        }
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
    }
    fall(){
        this.y+=this.speed;
    }
    //Becomes dead if symbol is clicked
    resolved(){
        this.dead=true;
    }
}

var blockSpeed=0.5;
var blockWidth=50;
var blockHeight=50;
var blockSymbol="";
var meteorTime=5000;
var score=0;

//Intro transitions, 2000, 7000, and 8000
setTimeout(function(){
    document.getElementById("img").style.opacity=0;
    document.getElementById("transition").style.opacity=1;
},2);
setTimeout(function(){
    document.getElementById("introImg").style.opacity=0;
},7);
//Hides this page so hover button will work
setTimeout(function(){
    document.getElementById("introImg").style.display="none";
},8);

var gameTime=20;
const grid=document.getElementById("grid");
const drawInput=document.getElementById("drawInput");
var pause=true;
var dead=false;
var allMeteors=[];
//Use magic items to slow time, break meteors, etc(access them by using 1,2,3,4,5,6,7,8,9, 0 can be used to throw away things to create space)
var inventory=[];
//Use to store the inputs player made
var inputKeys=[];
//Background floor
var floor={
    height:150,
    y:0
}
//Initialize y position for floor
floor.y=window.innerHeight-floor.height;

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
    //Draws all meteors as long as game not over
    for(let i=0;i<allMeteors.length;i++){
        //Draws meteor only if it's not dead
        if(!allMeteors[i].dead){
            dp.fillStyle=allMeteors[i].color;
        } else{
            dp.fillStyle="rgb(205, 24, 24)";
        }
        if(allMeteors[i].shouldDraw){
            dp.fillRect(allMeteors[i].x,allMeteors[i].y,allMeteors[i].width,allMeteors[i].height);
            dp.fillStyle="white";
            dp.font="30px Arial";
            dp.fillText(allMeteors[i].symbol,allMeteors[i].x+17,allMeteors[i].y+35);
        }
    }
}

function nextInstruct(){
    document.getElementById("intro").style.bottom="100vh";
    document.getElementById("gadgetPage").style.bottom="100vh";
}
function nextGadget(){
    document.getElementById("intro").style.bottom="100vh";
    document.getElementById("instructionPage").style.bottom="100vh";
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
}
function startGame(){
    nextInstruct();
    nextGadget();
    //Unpause game
    pause=false;
    document.getElementById("pauseButton").style.backgroundColor="rgb(244, 225, 133)";
}
function restartGame(){
    num=0;
    dead=false;
    keyInput="";
    allMeteors=[];
    wrongInput=false;
    score=0;
    grid.style.backgroundColor="rgb(15, 44, 103)";
    for(let i=0;i<box.length;i++){
        box[i].style.backgroundColor="transparent";
    }
    idIndex=-1;
    bonus=0;
}
const showInventory=document.getElementById("showInventory");
const inventoryPage=document.getElementById("inventory");
showInventory.addEventListener("click",function(){
    if(showInventory.style.bottom=="50vh"){
        showInventory.style.bottom="0vh";
        inventoryPage.style.bottom="-50vh";
    } else{
        showInventory.style.bottom="50vh";
        inventoryPage.style.bottom="0vh";
    } 
    pauseGame();
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

var wrongInput=false;
var keyInput="";
//Get player keyboard inputs
document.addEventListener("keydown",function(key){

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
                    keyInput="''";
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
                    keyInput="↑";
                    break;
                case "Left":
                    keyInput="←";
                    break;
                case "Right":
                    keyInput="→";
                    break;
                default:
                    keyInput="↓";
                    break;
            }
        } else{
            drawInput.style.opacity="0";
            keyInput="";
        }
        //Cancels input display after a while
        setTimeout(cancelInputDraw,1500);
        wrongInput=true;
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
//Makes the meteors fall and create new objects
function game(){
    //There are a total of 50 possible symbols
    let randomSymbol=Math.floor(Math.random()*50);
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
            blockSymbol=String.fromCharCode(randomSymbol+55);
            break;
        case 36:
            blockSymbol=",";
            break;
        case 37:
            blockSymbol=".";
            break;
        case 38:
            blockSymbol="/";
            break;
        case 39:
            blockSymbol=";";
            break;
        case 40:
            blockSymbol="''";
            break;
        case 41:
            blockSymbol="[";
            break;
        case 42:
            blockSymbol="]";
            break;
        case 43:
            blockSymbol="\\";
            break;
        case 44:
            blockSymbol="-";
            break;
        case 45:
            blockSymbol="=";
            break;
        case 46:
            blockSymbol="↑";
            break;
        case 47:
            blockSymbol="←";
            break;
        case 48:
            blockSymbol="↓";
            break;
        case 49:
            blockSymbol="→";
            break;
        default:
            blockSymbol=randomSymbol.toString();
            break;
    }
    for(let i=0;i<allMeteors.length;i++){
        //Only when its not touching floor would it fall
        if(allMeteors[i].y+allMeteors[i].height<floor.y){
            allMeteors[i].fall();
        } else{
            //Only when meteor is not dead will it end the game when touch floor
            if(!allMeteors[i].dead){
                dead=true;
            }
        }
        if(!allMeteors[i].dead){
            if(keyInput==allMeteors[i].symbol){
                wrongInput=false;
                allMeteors[i].resolved();
                setTimeout(function(){
                    allMeteors[i].shouldDraw=false;
                },1000);
                score++;
                bonus++;
                if(bonus==100){
                    //Provide a random item to the inventory for every 100 points
                    if(inventory.length<10){
                        inventory.push(Math.random()*20);
                    }
                    bonus=0;
                }
            } 
        }
    }
    //Game ends if the input is not on any of the meteors
    if(wrongInput){
        dead=true;
    }
}

//Draws all inventory items
function drawItem(){
    let currentItem=document.getElementById("currentItem");
    let currentItemImg=document.getElementById("currentItemImg");
    for(let i=0;inventory.length;i++){
        switch(inventory[i]){
            case 0:
                break;
            case 1:
                break;
            case 2:
                break;
            case 3:
                break;
            case 4:
                break;
            case 5:
                break;
            case 6:
                break;
            case 7:
                break;
            case 8:
                break;
            case 9:
                break;
            case 10:
                break;
            case 11:
                break;
            case 12:
                break;
            case 13:
                break;
            case 14:
                break;
            case 15:
                break;
            case 16:
                break;
            case 17:
                break;
            case 18:
                break;
            case 19:
                break;
            default:
                break;
        }
    }
}

var num=0;
//Create meteor objects
setInterval(function(){
    if(!pause&&!dead){
        //Changing levels based on scores
        if(score>10){
            meteorTime=4000;
        }
        num++;
        if(num>=meteorTime/4){
            allMeteors.push(new Meteor(Math.random()*(window.innerWidth-blockWidth),-blockHeight));
            num=0;
        }
    }
});

setInterval(function(){
    document.getElementById("points").innerHTML="Score: "+score;
    if(dead){
        grid.style.backgroundColor="rgb(205, 24, 24)";
    } else{
        grid.style.backgroundColor="rgb(15, 44, 103)";
    }
    if(!pause&&!dead){
        drawInput.style.top=(window.innerHeight-drawInput.offsetHeight-floor.height)/2+"px";
        drawInput.style.left=(window.innerWidth-drawInput.offsetWidth)/2+"px";
        drawBackground();
        drawGame();
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
10. Sacrificial Lamb(new name): throw away all inventory, each adding 2 points to the score
11. Positive Trade: increase floor height but random gets one more item
12. Shuffle: shuffles and changes all items in the inventory to new ones
13. Rewind: pushes all meteor upwards
14. Primitives: decrease all meteor to having only one symbol
15. Digits Only: only digit symbols for 10s
16. Letters Only: only letter symbols for 10s
17. Symbols Only: only symbols for 10s
18. Arrows Only: only arrow symbols for 10s
19. Restricted Area: a random area of about 100px gets blocked, every meteor that forms there dies instantly
20. Infinity Barrier: slows down meteor speed
*/