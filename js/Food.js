class Food {
    constructor(){

        this.foodStock = 20;
        this.lastFed = 0;
        this.image = loadImage("images/Milk.png");

        database = firebase.database();
    }

    //updating value of food in database and foodstock with food parameter
    updateFoodStock(food){
        this.foodStock = food;
        database.ref("/").update({Food: food});
    }

    bedRoom(){
        background(bedroomimg,550,500);
    }

    washRoom(){
        background(washroomimg,550,500);
    }

    garden(){
        background(gardenimg,550,500);
    }

    display(){

     var x = 80, y = 100;
     imageMode(CENTER);
     if(this.foodStock != 0){
         for(var i = 0; i < this.foodStock; i++){
             if(i % 10 === 0){
                x = 80;
                y += 50;
             }
             image(this.image, x, y, 50, 50);
             x += 30;
         }
     }
    }
}

