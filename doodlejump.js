//board
let board;
let boardwidth=600;
let boardheight=550;
let context;

//doodler
let doodlerwidth=56;
let doodlerheight=56;
let doodlerX=boardwidth/2-doodlerwidth/2;
let doodlerY=boardheight*7/8-doodlerheight;
let doodlerRightimg;
let doodlerLeftimg;

let doodler={
    img:null,
    x:doodlerX,
    y:doodlerY,
    width:doodlerwidth,
    height:doodlerheight
}

//physics
let velocityY=0;
let velocityX=0;
let intialvelocityY=-8;
let gravity=0.4;
//platform
let platformArray=[];
let platformwidth=90;
let platformheight=68;
let platformImg;

let score=0;
let maxscore=0;
let gameover=false;
window.onload=function(){
    board=document.getElementById("board");
    board.height=boardheight;
    board.width=boardwidth;
    context=board.getContext("2d");

//    context.fillStyle='blue';
  //  context.fillRect(doodler.x, doodler.y, doodler.width, doodler.height);

    doodlerRightimg=new Image();
    doodlerRightimg.src="./doodlerright.png";
    doodler.img=doodlerRightimg;
    doodlerRightimg.onload=function(){
        context.drawImage(doodler.img, doodler.x, doodler.y, doodler.width, doodler.height);
    }
    doodlerLeftimg=new Image();
    doodlerLeftimg.src="./doodlerleft.png";

    platformImg=new Image();
    platformImg.src="./platform.png";
    
    velocityY=intialvelocityY;
    placeplatform();

    requestAnimationFrame(update);
    document.addEventListener("keydown", moveDoodler);
}
function update(){
    requestAnimationFrame(update);
    if(gameover){
        return;
    }
    context.clearRect(0,0, boardwidth, board.height);
    doodler.x+=velocityX; 
    if(doodler.x> boardwidth){
        doodler.x=0;

    }else if(doodler.x +doodler.width <0){
        doodler.x=boardwidth;
    }
    velocityY+=gravity;
    doodler.y+=velocityY;
    if(doodler.y> board.height){
        gameover=true;
    }
    context.drawImage(doodler.img, doodler.x, doodler.y, doodler.width, doodler.height);

    for(let i=0; i < platformArray.length; i++){
        let platform=platformArray[i];
        if( velocityY < 0 && doodler.y < boardheight*3/4){
            platform.y-=intialvelocityY;
        }
        if( detectcollision(doodler, platform)){
            velocityY=intialvelocityY;
        }
        context.drawImage(platform.img, platform.x, platform.y, platform.width, platform.height);
    }
    while(platformArray.length > 0 && platformArray[0].y >= boardheight){
        platformArray.shift();
        newplatform();
    }
  updatescore();
  context.fillStyle="white";
  context.font="20px sans-serif";
  context.fillText(score, 5, 20) 
  if(gameover){
    context.fillText("Game Over: Press 'Space' to Restart",boardwidth/7, boardheight*7/8);
    const gameOverMessage = document.getElementById("gameOverMessage");
    const  imgShow=document.getElementById("imgShow");
    imgShow.style.display="block";
        gameOverMessage.style.display = "block";
  }
}
document.addEventListener("DOMContentLoaded", function() {
document.getElementById("moveLeft").addEventListener("click", function() {
    velocityX = -4; // Set doodler's leftward velocity
    doodler.img = doodlerLeftimg; // Change doodler image for left movement
});

document.getElementById("moveRight").addEventListener("click", function() {
    velocityX = 4; // Set doodler's rightward velocity
    doodler.img = doodlerRightimg; // Change doodler image for right movement
});
document.getElementById("Restart").addEventListener("click", function() {
    const gameOverMessage = document.getElementById("gameOverMessage");
    const  imgShow=document.getElementById("imgShow");
    imgShow.style.display="none";
    gameOverMessage.style.display = "none";
 doodler={
        img:doodlerRightimg,
        x:doodlerX,
        y:doodlerY,
        width:doodlerwidth,
        height:doodlerheight
    }
    velocityX=0;
    velocityY=intialvelocityY;
    score=0;
    maxscore=0;
    gameover=false;
    placeplatform();
});
});
function moveDoodler(e){
    if(e.code=="ArrowRight" || e.code=="keyD"){
      velocityX=4;
      doodler.img=doodlerRightimg;
    }
    else if(e.code =="ArrowLeft" || e.code=="keyA"){
        velocityX=-4;
        doodler.img= doodlerLeftimg;    
    }
    else if(e.code == "Space" && gameover){
        const gameOverMessage = document.getElementById("gameOverMessage");
        const  imgShow=document.getElementById("imgShow");
        imgShow.style.display="none";
        gameOverMessage.style.display = "none";
     doodler={
            img:doodlerRightimg,
            x:doodlerX,
            y:doodlerY,
            width:doodlerwidth,
            height:doodlerheight
        }
        velocityX=0;
        velocityY=intialvelocityY;
        score=0;
        maxscore=0;
        gameover=false;
        placeplatform();
        
    }

}
function placeplatform(){
    platformArray=[];

    let platform={
        img:platformImg,
        x:boardwidth/2,
        y:boardheight-50,
        width:platformwidth,
        height:platformheight
    }
    platformArray.push(platform);

    
    //  platform={
    //     img:platformImg,
    //     x:boardwidth/2,
    //     y:boardheight-150,
    //     width:platformwidth,
    //     height:platformheight
    // }
    // platformArray.push(platform);
    for(let i=0; i< 6; i++){
        let randomX=Math.floor(Math.random() * boardwidth*3/4);
        let platform={
            img:platformImg,
            x:randomX,
            y:boardheight - 75*i - 150,
            width:platformwidth,
            height:platformheight
        }
        platformArray.push(platform);
    
    }
}
function newplatform(){
    let randomX=Math.floor(Math.random() * boardwidth*3/4);
    let platform={
        img:platformImg,
        x:randomX,
        y:-platformheight,
        width:platformwidth,
        height:platformheight
    }
    platformArray.push(platform);
}
function detectcollision(a,b){
return a.x < b.x + b.width &&
 a.x + a.width >b.x && 
 a.y <b.y + b.height && 
 a.y + a.height > b.y;
}
function updatescore(){
    let points= Math.floor(50*Math.random());
   if(velocityY<0){
maxscore+=points;
if(score< maxscore){
    score=maxscore;
}   
}
else if(velocityY >=0){
    maxscore-=points;
}
const scoreSpan = document.getElementById("scoreDisplay");
scoreSpan.textContent = score;

}  
setInterval(updateScore, 1000);                                   
