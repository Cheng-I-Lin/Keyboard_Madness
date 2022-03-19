//Use this.attribute for the attributes
class Meteor{
    constructor(x,symbol,speed,level,lives,color,width=50,height=50,dead=false) {
        this.x=x;
        this.y=-height;
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
        this.falling=true;
        this.speed=speed;
    }
    falling(){
        this.y+=this.speed;
    }
    //Becomes dead if symbol is clicked
    resolved(){
        this.dead=true;
    }
}

//Intro transitions
setTimeout(function(){
    document.getElementById("img").style.opacity=0;
    document.getElementById("transition").style.opacity=1;
},2000);
setTimeout(function(){
    document.getElementById("introImg").style.opacity=0;
},7000);
//Hides this page so hover button will work
setTimeout(function(){
    document.getElementById("introImg").style.display="none";
},8000);

var gameTime=20;
const grid=document.getElementById("grid");
var pause=false;
var dead=false;
var allMeteors=[];
//Use magic items to slow time, break meteors, etc(access them by using 1,2,3,4,5,6,7,8,9, 0 can be used to throw away things to create space)
var inventory=[];
//Used to determine the position of the red selection box
var invX=0;
var invY=0;
//Use to store the inputs player made
var inputKeys=[];

/*Can use this to create meteors
allMeteors.push(new Meteor(0,"s",1,1,"black"));
allMeteors.push(new Meteor(100,"s",1,1,"black"));

var p1=new Meteor(1,"s")
document.getElementById("hi").innerHTML=p1.dead;
*/

//Use two variables, one for x and one for symbol


function drawBackground(){
    let canvas=document.getElementById("background");
    let ds=canvas.getContext("2d");
    canvas.style.left=grid.offsetLeft+"px";
    canvas.style.top=grid.offsetTop+"px";
    canvas.width = grid.offsetWidth;
    canvas.height = grid.offsetHeight;
    ds.clearRect(canvas.left,canvas.top,canvas.width,canvas.height);
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
    if(!dead){
        for(let i=0;i<allMeteors.length;i++){
            //Draws meteor only if it's not dead
            if(!allMeteors[i].dead){
                dp.fillStyle=allMeteors[i].color;
                dp.fillRect(allMeteors[i].x,allMeteors[i].y,allMeteors[i].width,allMeteors[i].height);
            }
        }
    } 
}

function next(){
    document.getElementById("intro").style.bottom="100vh";
}
function back(){
    document.getElementById("intro").style.bottom="0vh";
}
function startGame(){
    next();
    //Unpause game
}

//Draws the inventory
function drawInventory(){

}

//Use this to compare to the object's symbol
document.addEventListener("keyup", function(key){
    let control=key.code;
    if(control.includes("Digit")){
        callInventory(control[control.length-1])
        //document.getElementById("hi").innerHTML+=control[control.length-1]
    }
    //Updates the screen with a huge sign of what was clicked

    //Checks if the input symbol matches the meteor symbol
    for(let i=0;i<allMeteors.length;i++){
        if(!allMeteors[i].dead){
            if(control==allMeteors[i].symbol){
                allMeteors[i].resolved();
                //Removes the object so it won't be drawn
                allMeteors.splice(allMeteors[i]);
            }
        }
    }
});

//Get player keyboard inputs
document.addEventListener("keydown",function(key){
    
});
document.addEventListener("keyup",function(key){
    
});

//Use the index from eventlistener to call inventory items
function callInventory(index){
    // Use the thing from spacesurvivor, use space bar to activarte?
    switch(index){
        case 1:
            invX=0;
            invY=0;
            break;
        case 2:
            invX=0;
            invY=0;
            break;
        case 3:
            invX=0;
            invY=0;
            break;
        case 4:
            invX=0;
            invY=0;
            break;
        case 5:
            invX=0;
            invY=0;
            break;
        case 6:
            invX=0;
            invY=0;
            break;
        case 7:
            invX=0;
            invY=0;
            break;
        case 8:
            invX=0;
            invY=0;
            break;
        case 9:
            invX=0;
            invY=0;
            break;
        case 0:
            //Cancels selection box and removes item
            invX=0;
            invY=0;
            break;
        default:
            break;
    }
}

//Makes the meteors fall and create new objects
function game(){

}

setInterval(function(){
    if(!pause){
        drawGame();
        drawInventory();
        game();
    }
},gameTime);
/*
Can have width=number of symbols
Height can be an extra line of symbols where player has to click the things in the rows together to get rid of them
*/