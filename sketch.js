
var database;
var dog, dogImg, happyDog,sadDogimg;
var foodS = 20;
var lastFed = 0;
var foodObj = null;
var feedButton, addButton;
var changingGState,readingGState;
var gardenimg,bedroomimg,washroomimg;
var fstockimg,vacschimg,vaccimg;
var gameState;

function preload()
{
  backgroundImg = loadImage("images/bg.png");
  dogImg = loadImage("images/Dog.png");
  happyDog = loadImage("images/happydog.png");
  gardenimg = loadImage("images/imgs/Garden.png");
  bedroomimg = loadImage("images/imgs/BedRoom.png");
  washroomimg = loadImage("images/imgs/WashRoom.png");
  sadDogimg = loadImage("images/imgs/LivingRoom.png");
  fstockimg = loadImage("images/imgs/FoodStock.png");
  vacschimg = loadImage("images/imgs/dogVaccination.png");
  vaccimg = loadImage("images/imgs/Vaccination.jpg");
}


function setup() {

  createCanvas(800, 800);

  database = firebase.database();

   var greeting = createElement('h3');
   var greeting1 = createElement('h3');

  readingGState = database.ref("gameState");
  readingGState.on("value" , function(data){
    gameState = data.val();
  });
  
  feedButton = createButton("Feed your dog");
  feedButton.position(700, 95);
  feedButton.mousePressed(feedDog);

  input = createInput ("Fill your Dog's Name"); 
  input.position (500, 95); 

  var name = input.value();

  input1 = createInput ("Fill opinion about your dog"); 
  input1.position (900, 450);
  var opinion = input1.value();

  var button = createButton("Submit");
  button.position(850, 800);
  
  var buttonfs = createButton("Check Food Stock");
  buttonfs.position(750,650);

  var buttonvs = createButton("View Vaccine Schedule");
  buttonvs.position(400,650);
  
  addButton = createButton("Buy Milk Bottles");
  addButton.position(820, 95);
  addButton.mousePressed(addFood);

  button.mousePressed(function(){
    input.hide();
    addButton.hide();
    feedButton.hide();
    button.hide();
    input1.hide();
    buttonfs.hide();
    buttonvs.hide();
    greeting.html("Thank you!!");
    greeting.position(800, 150);
    greeting1.html("Meet you soon");
    greeting1.position(805, 195);
 })

 buttonfs.mousePressed(function(){
   var fstock = createSprite(650,600);
   fstock.scale=0.2;
   fstock.addImage("fStock",fstockimg);    
   var done1 = createButton("Done");
   done1.position(1080,650);
   done1.mousePressed(function(){
    done1.hide();
    fstock.remove();
   })
 })

 buttonvs.mousePressed(function(){
   buttonvs.hide();
   var vs = createSprite(150,650);
   vs.scale=0.3;
   vs.addImage("VaccineSchedule", vacschimg);
   var vacc = createButton("Proceed For Vaccination");
   vacc.position(400,550);
   vacc.mousePressed(function(){
     vs.remove();
     vacc.hide();
     var vac = createSprite(150,650);
     vac.scale=0.3;
     vac.addImage("Vaccination", vaccimg);
     var done2 = createButton("Done");
     done2.position(400,550);
     done2.mousePressed(function(){
       vac.remove();
       done2.hide();
       buttonvs.show();
     })
   })
 })


  foodObj = new Food();

  dog = createSprite(650, 280);
  dog.scale = 0.3;
  dog.addImage("dog1", dogImg);
  dog.addImage("dog2", happyDog);

  
}


function draw() {  

  background(backgroundImg);

  fill("white");
  textSize(15);
  if(lastFed>=12){
    text("Last Fed (approx timing) : "+ lastFed%12 + " PM", 350,30);
   }else if(lastFed==0){
     text("Last Fed (approx timing) : 12 AM",350,30);
   }else{
     text("Last Fed (approx timing) : "+ lastFed + " AM", 350,30);
   }

   currentTime = hour();
   if(currentTime==(lastFed+1)){
     update("Playing");
     foodObj.garden();
   }else if(currentTime==(lastFed+2)){
     update("Sleeping");
     foodObj.bedRoom();
   }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
     update("Bathing");
     foodObj.washRoom();
   }else if(currentTime===lastFed){
     update("Fed");
     background(sadDogimg,400,400);
   }else{
     update("Hungry");
     foodObj.display();
   }

   if(gameState!="Hungry"){
     feedButton.hide();
     addButton.hide();
     dog.remove();
   }else{
     feedButton.show();
     addButton.show();
     dog.addImage(sadDogimg);
   }



  drawSprites();

  strokeWeight(3);
  stroke("black")
  fill("white");
  textSize(20);
  text("Milk bottles left in stock : " + foodS, 30, 775);

  strokeWeight(3);
  stroke("blue")
  fill("white");
  textSize(15);
  text("*To be filled only after you finshed playing the game ", 450, 740);

  foodObj.display();

  console.log(lastFed);

}


function addFood(){
  foodS++;
  foodObj.updateFoodStock(foodS);
}


function feedDog(){
  if(foodS > 0){
    dog.changeAnimation("dog2", happyDog);
    foodS--;
    foodObj.updateFoodStock(foodS);
    lastFed = hour();
    foodObj.updateLastFed(lastFed);
  }
}

function update(state){
  database.ref("/").update({
    gameState:state
  })
}
