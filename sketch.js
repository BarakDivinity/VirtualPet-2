//Create variables here
var dog,happydog,database,foodS,foodStock,dogImg,feed,addFood,fedTime,lastFed,foodObj,bedDog,gardenDog;
var washRoomDog,readState,changeState,gameState,currentTime;

function preload()
{
	//load images here
  happydog=loadImage("Images/Happy.png");
  dogImg=loadImage("Images/Dog.png");
  bedDog=loadImage("Images/BedRoom.png");
  gardenDog=loadImage("Images/Garden.png");
  washRoomDog=loadImage("Images/WashRoom.png");
}

function setup() {
	createCanvas(500, 500);

  dog=createSprite(250,400,30,30)
  dog.addImage(dogImg);
  dog.scale=0.4;

  database=firebase.database();

  foodStock=database.ref('Food');
  foodStock.on('value',readStock);

  readState=database.ref('gameState');
  readState.on('value',function(data){
    gameState=data.val();
  })
  
  foodS=20

  feed=createButton("Feed The Dog");
  feed.position(550,80);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(550,120);
  addFood.mousePressed(addFoods);

  foodObj=new Food();

}


function draw() {  
  background(46,139,87);

  fedTime=database.ref(('feedTime'));
  fedTime.on("value",function(data){
    lastFed=data.val();
  });

  fill(255,255,254);
  textSize(15);
  if(lastFed>=12){
    text("Last Fed : "+lastFed%12 + "PM",350,30);
  }else if(lastFed===0){
    text("Last Fed : 12 AM",350,30);
  }else{
    text("Last Fed : "+lastFed + "AM",350,30);
  }

   if(gameState!="Hungry"){
     feed.hide();
     addFood.hide();
     dog.remove();
   }else{
     feed.show();
     addFood.show();
     dog.addImage(dogImg);
   }

   currentTime=hour();
   if(currentTime==(lastFed+1)){
     update("Playing");
     foodObj.garden();
   }else if(currentTime==(lastFed+2)){
     update("Sleeping")
     foodObj.bedroom();
   }else if(currentTime>(lastFed+2)&& currentTime<=(lastFed+4)){
      update("Bathing");
      foodObj.washroom();
   }else{
     update("Hungry");
     foodObj.display();
   }

  drawSprites();
  //add styles here
  fill("white");
  strokeWeight(2);
  stroke("black");
  textSize(20);
  text("FOOD:"+foodS,190,250);

}

function readStock(data){
  foodS=data.val();
}

function writeStock(x){

  if(x<=0){
    x=0;
  }else{
    x=x-1
  }

  database.ref('/').update({
    Food:x
  })
}

function feedDog(){
  dog.addImage(happydog);

  if(foodS>0){
  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodS-1,
    feedTime:hour()
  })
}

}

function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

function update(state){
  database.ref('/').update({
    gameState:state
  });
}