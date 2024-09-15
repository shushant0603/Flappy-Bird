//board
let board;
let boardWidth=360;
let boardHeight=690;
let context;


// bird
let birdwidth=34;
let birdheight=24;
let birdX=boardWidth/8;
let birdY=boardHeight/2;

let birdImg;

let bird={
    x:birdX,
    y:birdY,
    width:birdwidth,
    height:birdheight,
}

//pipes

let pipeArray=[];
let pipeWidth=64;
let pipeHeight=512;
let pipeX=boardWidth;
let pipeY=0;

let topPipeImg;
let bottompipeImg;

//physics
let velocityX=-3; // pipes moving left speed
let velocityY=0;
let gravity=0.4; // bird jump speed

let gameover=false;
let score=0;





window.onload =function(){
    board =document.getElementById("board");
    board.height=boardHeight;
    board.width=boardWidth;
    context = board.getContext("2d");  // use for drawing on the board

    // draw flappy bird
   // context.fillStyle ="";
   // context.fillRect(bird.x,bird.y,bird.width,bird.height);

    //load images
     
    birdImg = new Image();
    birdImg.src = "./flappybird.png";
    birdImg.onload=function(){
        context.drawImage(birdImg,bird.x,bird.y,bird.width,bird.height);
    }

    topPipeImg= new Image();
    topPipeImg.src = "./toppipe.png";
    bottompipeImg=new Image();
    bottompipeImg.src="./bottompipe.png";

    requestAnimationFrame(update);
    setInterval(placePipes,1500);//every 1.5 sec
    document.addEventListener("keydown",moveBird);
    document.addEventListener("click",moveBird);
    document.addEventListener("touchstart", moveBird);
}

function update(){
requestAnimationFrame(update);
if (gameover){
    return;
}
context.clearRect(0,0,boardWidth,boardHeight);

//bird
velocityY +=gravity;
bird.y = Math.max(bird.y + velocityY,0);
context.drawImage(birdImg,bird.x,bird.y,bird.width,bird.height);

if(bird.y > board.height){
    gameover=true;
}

//pipes
for(let i=0;i<pipeArray.length;i++){
    let pipe=pipeArray[i];
    pipe.x +=velocityX;
    context.drawImage(pipe.img,pipe.x,pipe.y,pipe.width,pipe.height);
     if(!pipe.passed && bird.x > pipe.x + pipe.width){
        score +=0.5;
        pipe.passed=true;
     }
    if(detectCollision(bird,pipe)){
        gameover=true;
    }
    
}
//clear pipes
while(pipeArray.length >0 && pipeArray[0].x<-pipeWidth){
    pipeArray.shift();//removes first element from the array
}
//score
context.fillStyle="white";
context.font="45px sans-serif";
context.fillText("Score: "+ Math.floor(score),5,45);
if(gameover){
 context.fillText("GAME OVER",50,380);   
}

}

function placePipes(){
    if(gameover){
        return;
    }
    let randomPipeY=pipeY-pipeHeight/4 - Math.random()*(pipeHeight/3);
     let openingSpace=board.height/4;
    let topPipe={
        img: topPipeImg,
        x:pipeX,
        y:randomPipeY,
        width:pipeWidth,
        height:pipeHeight,
        passed:false
    }
    pipeArray.push(topPipe);

   let bottomPipe={
    img: bottompipeImg,
    x:pipeX,
    y:randomPipeY + pipeHeight + openingSpace,
    width:pipeWidth,
    height:pipeHeight,
    passed:false
   }
   pipeArray.push(bottomPipe);
}

function moveBird(e){
   
     if (e.type === 'click') {
        velocityY = -6;
        // reset game
        if (gameover) {
            bird.y = birdY;
            pipeArray = [];
            score = 0;
            gameover = false;
        }
    } else if(e.type==='keydown'){
        if(e.code =="space" || e.code =="ArrowUp" ||e.code =="keyX"){
            //jump
            velocityY=-6;
            //reset game
            if(gameover){
             bird.y =birdY;
             pipeArray=[];
             score=0;
             gameover=false;
            }
         }
    }
    else if(e.type==='touchstart'){
        velocityY = -6;
        // reset game
        if (gameover) {
          bird.y = birdY;
          pipeArray = [];
          score = 0;
          gameover = false;
        }
    }
}

function detectCollision(a,b){
    return a.x < b.x +b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height >b.y;
}