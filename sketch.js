var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;

var ground, invisibleGround, groundImage;

var birdsGroup, birds;
var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4;
var powerupsGroup, flamethrower, holy_water, sword
var backgroundImg
var score=0;
var jumpSound, collidedSound;

var gameOver, restart;
var birdFlag=false
var holyFlag=false,swordFlag=false,flameFlag=false,powerupflag=false;
var flameobstacle,holyobstacles,swordobstacles;


function preload(){
  jumpSound = loadSound("assets/sounds/jump.wav")
  collidedSound = loadSound("assets/sounds/collided.wav")
  
  backgroundImg = loadImage("assets/backgroundImg.png")
  night = loadImage("assets/night.png")
  moonimg = loadImage("/assets/moon.png")
  sunAnimation = loadImage("assets/sun.png");
  
  trex_running = loadAnimation("assets/trex running.png","assets/trex running 1.png");
  trex_collided = loadImage("assets/dead trex.png");
  
  groundImage = loadImage("assets/ground.png");
  
  cloudImage = loadImage("assets/cloud.png");
  birds = loadAnimation("assets/ptero_normal_0.png","assets/ptero_normal_1.png");
  obstacle1 = loadImage("assets/obstacle1.png");
  obstacle2 = loadImage("assets/obstacle2.png");
  obstacle3 = loadImage("assets/obstacle3.png");
  obstacle4 = loadImage("assets/obstacle4.png");
  gameOverImg = loadImage("assets/gameOver.png");
  restartImg = loadImage("assets/restart.png");
  flamethrower=loadAnimation("assets/flamethrower_0.png")
  holy_water=loadAnimation("assets/holywater_0.png")
  sword=loadAnimation("assets/sword_0.png")
  flameobstacle=loadAnimation("assets/cacti2_flame_0.png","assets/cacti2_flame_1.png")
}


function setup() {
  createCanvas(windowWidth, windowHeight);
  sun = createSprite(width-50,100,10,10);
  sun.addAnimation("sun", sunAnimation);
  sun.scale = 0.1
  sun.addAnimation("moon",moonimg)
  trex = createSprite(80,height-70,20,50);
  
  
  trex.addAnimation("running", trex_running);
    trex.addImage("collided", trex_collided);
  trex.setCollider('circle',-80,20,100)
  trex.scale = 0.5
 

 // trex.debug=true

  invisibleGround = createSprite(width/2,height-10,width,125);  
  invisibleGround.shapeColor = "#f4cbaa";
  
  ground = createSprite(width/2,height,width,2);
  ground.addImage("ground",groundImage);
 // ground.x = 1000
  ground.velocityX = -(6 + 3*score/100);
//  console.log(width)

  gameOver = createSprite(width/2,height/2- 50);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.1;

  gameOver.visible = false;
  restart.visible = false;
  
 
  // invisibleGround.visible =false

  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  birdsGroup = new Group();
  powerupsGroup= new Group();
  flag="day"
  score = 0;
}
function switch_bg(){
  if(flag=="day"){
    flag="night";
  }else{
    flag="day"
  }
}

function draw() {
  //trex.debug = true;
  if(score%1000==0&&score!=0){
    switch_bg()
  }
  if(flag=="day"){
    background(backgroundImg);
    sun.changeAnimation(sunAnimation)
  }else{
    background(night);
    sun.changeAnimation("moon",moonimg)

  }
  if (score>2000){
    birdFlag=true
  }

  textSize(20);
  fill("white")
  text("Score: "+ score,30,50);
  
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
    
    if((touches.length > 0 || keyDown("SPACE")) && trex.y  >= height-140) {
      jumpSound.play( )
      trex.velocityY = -12;
       touches = [];
    }
    //console.log(trex.y,height)
    trex.velocityY = trex.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = width/2;
    }
  
    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
    spawnBirds();
    if(holyFlag==false && flameFlag==false && swordFlag==true){
      spawnpowerups();
    }
    if(powerupsGroup.isTouching(trex)){
      powerupflag=true;
      if(holyFlag){
        handleHoly();
      }
      if(flameFlag){
        handleflame();
      }
      if(swordFlag){
        handlesword();
      }
    }
    //spawnpowerups();
    if(obstaclesGroup.isTouching(trex) || birdsGroup.isTouching(trex)){
      if(holyFlag || swordFlag || flameFlag){
        
      }
      else{
        collidedSound.play()
        gameState = END;

      }
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    birdsGroup.setVelocityXEach(0);
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
     trex.scale = 0.1
     trex.y = invisibleGround.y-50
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    birdsGroup.setLifetimeEach(-1);

    if(touches.length>0 || keyDown("SPACE")) {      
      reset();
      touches = []
    }
  }
  //console.log(ground.x)
  
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 120 === 0) {
    var cloud = createSprite(width+20,height-300,40,10);
    cloud.y = Math.round(random(100,220));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 900;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth+1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnBirds() {
  //write code here to spawn the clouds
  if (frameCount % 200 === 0 && birdFlag) {
    var y= Math.round(random(height-250,height-220));
    var bird = createSprite(width+20,y,40,10);
//    bird.y = Math.round(random(100,220));
    bird.addAnimation("bird",birds);
    bird.scale = 0.5;
    bird.velocityX = -(5 + 3*score/1000);
   // bird.debug=true
    bird.setCollider("rectangle",0,0,120,80)
     //assign lifetime to the variable
    bird.lifetime = 900;
    
    //adjust the depth
    bird.depth = trex.depth;
    trex.depth = trex.depth+1;
    
    //add each cloud to the group
    birdsGroup.add(bird);
  }
  
}

function spawnObstacles() {
  if(frameCount % 160 === 0) {
    var obstacle = createSprite(width+30,height-95,20,30);
    obstacle.setCollider('circle',0,0,45)
    // obstacle.debug = true
  
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      default: break;
    }
    if(holyFlag){
      obstacle.addAnimation("holy",holyobstacles)
    }
    if(flameFlag){
      obstacle.addAnimation("flame",flameobstacle)
    }
    if(swordFlag){
      obstacle.addAnimation("sword",swordobstacles)
    }
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    obstacle.depth = trex.depth;
    trex.depth +=1;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function spawnpowerups() {
  if(frameCount % 250 === 0) {
    var powerup = createSprite(width+30,height-200,20,30);
    powerup.setCollider('circle',0,0,45)
    // powerup.debug = true
  
    powerup.velocityX = -(6 + 3*score/100);
    
    //generate random powerups
    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: powerup.addAnimation("powerup1",flamethrower);
      flameFlag=true
              break;
      case 2: powerup.addAnimation("powerup2",holy_water);
      holyFlag=true        
      break;
      case 3: powerup.addAnimation("powerup3",sword);
      swordFlag=true        
      break;

      default: break;
    }
    
    //assign scale and lifetime to the powerup           
    powerup.scale = 0.5;
    powerup.lifetime = 300;
    powerup.depth = trex.depth;
    trex.depth +=1;
    //add each powerup to the group
    powerupsGroup.add(powerup);
  }
}
function handleflame(){
  setTimeout(resetpowerup,5000)
}

function resetpowerup(){
  holyFlag=false
  flameFlag=false
  swordFlag=false
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  birdsGroup.destroyEach();
  powerupsGroup.destroyEach()  
  trex.changeAnimation("running",trex_running);
  trex.scale=0.5
  score = 0;
  
}
