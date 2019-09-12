// globals

var text_new_game = 'New Game'
var text_settings = "Settings"
var text_back = "Back"
var text_score = "Score: ";

var fnt = "40px Tahoma";
var speedo = "60px Tahoma";
var gameTick = 0;

var Key = {
    _pressed: {},
    W: 87,
    A: 65,
    D: 68,
    S: 83,
    isDown: function(keyCode) {
        return this._pressed[keyCode];
      },
      
    onKeydown: function(event) {
    this._pressed[event.keyCode] = true;
    },
    
    onKeyup: function(event) {
    delete this._pressed[event.keyCode];
      }
}

/** Styles for game */



function getGrad(x,x1,y1,x2,y2,c0,c1)
{
    

    var dash1 = x.createLinearGradient(x1, y1, x2, y2);
    dash1.addColorStop(0, c0);
    dash1.addColorStop(1, c1);
    return dash1
}


window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);

// global gamestate

var position = 0;
var car_x = 0;
var car_y = 0;
var car_speed = 0;
var score = 0;
var car_max_speed = 120;
var tdy = 0;
var tdx = 0;
//var tdx = (Math.random()*200)-100;
//var tdy = (Math.random()*a.height*0.6)+a.height*0.2;

// direction of road -50 == left. 50 == right. 
// -1,0,1
var current_road = 0;
//direction road curves
var road_direction = 0;
var health = 0;
var fuel = 100;
var text_gameover = "";
var speed_colors = [
    "#1f1",

    "#fb0",
    "#f00"
];
var cactus_green = "#292"
var cactus_low = "#2a2";
var cactus_high = "#5e5";
var direction = 0;
var sand = "#DA2";
var sand = "#DA2"
var stone = "#333"
var concrete = "#666"
var forest = "#262"

//This is our js for the game

/** Are we inside the bounds?  */
function checkBounds(e,x,y,z,r)
{
    px = e.pageX
    py = e.pageY
    
    if ((px>x && px<z) && (py>y && py<r)) return true
    return false
}

/** gets the approximate height of the current font. */
function getLineHeight(e)
{
    e.save()
    
    var lineHeight=e.measureText('M').width
    e.restore()
    return lineHeight
}

/** resets all variables required to bring game back to its base state */
function resetGamestate()
{
    position = 0
    car_x = 0
    car_speed = 0
    score = 0
    car_x = a.width/2
    car_max_speed = 120
    health = 100;
    fuel = 100;
    direction = 0;
    tdx = a.width*0.2;
    tdy = (Math.random()*a.height*0.5)+a.height*0.2
    
}

/** This function builds a 7 segment display from individual elements based on which number I want to render */
function drawDigit(cx,x,y,value,size)
{
    
    switch(value)
    {
    case 0:
        drawTop(cx,x,y,size)
        drawBottom(cx,x,y,size)
        drawLeft(cx,x,y,size)
        drawLeft(cx,x,y+size,size)
        drawRight(cx,x,y,size)
        drawRight(cx,x,y+size,size)
        break
    case 1:
        drawRight(cx,x,y,size)
        drawRight(cx,x,y+size,size)
        break
    case 2:
        drawRight(cx,x,y,size)
        drawLeft(cx,x,y+size,size)
        drawTop(cx,x,y,size)
        drawBottom(cx,x,y,size)
        drawMiddle(cx,x,y,size)
        break
    case 3:
        drawTop(cx,x,y,size)
        drawBottom(cx,x,y,size)
        drawMiddle(cx,x,y,size)
        drawRight(cx,x,y,size)
        drawRight(cx,x,y+size,size)
        break
    case 4:
        drawMiddle(cx,x,y,size)
        drawLeft(cx,x,y,size)
        drawRight(cx,x,y,size)
        drawRight(cx,x,y+size,size)
        break
    case 5:
        drawRight(cx,x,y+size,size)
        drawLeft(cx,x,y,size)
        drawTop(cx,x,y,size)
        drawBottom(cx,x,y,size)
        drawMiddle(cx,x,y,size)
        break
    case 6:
        drawTop(cx,x,y,size)
        drawBottom(cx,x,y,size)
        drawMiddle(cx,x,y,size)
        drawLeft(cx,x,y,size)
        drawLeft(cx,x,y+size,size)
        drawRight(cx,x,y+size,size)
        break
    case 7:
        drawTop(cx,x,y,size)
        drawRight(cx,x,y,size)
        drawRight(cx,x,y+size,size)
        break
    case 8:
        drawTop(cx,x,y,size)
        drawBottom(cx,x,y,size)
        drawLeft(cx,x,y,size)
        drawLeft(cx,x,y+size,size)
        drawRight(cx,x,y,size)
        drawRight(cx,x,y+size,size)
        drawMiddle(cx,x,y,size)
        break
    case 9:
        drawTop(cx,x,y,size)
        drawBottom(cx,x,y,size)
        drawLeft(cx,x,y,size)
        drawRight(cx,x,y,size)
        drawRight(cx,x,y+size,size)
        drawMiddle(cx,x,y,size)
        

    }
}

/* Draw a top 7-seg display element */
function drawTop(cx,x,y,size)
{
    cx.beginPath()
    cx.moveTo(x+size*0.1,y)
    cx.lineTo(x+size*0.9,y)
    cx.lineTo(x+size*0.8,y+size*0.1)
    cx.lineTo(x+size*0.2,y+size*0.1)
    cx.fill()
}

/* Draw a bottom 7-seg display element */
function drawBottom(cx,x,y,size)
{
    cx.beginPath()
    cx.moveTo(x+size*0.1,y+2*size)
    cx.lineTo(x+size*0.9,y+2*size)
    cx.lineTo(x+size*0.8,y-size*0.1+2*size)
    cx.lineTo(x+size*0.2,y-size*0.1+2*size)
    cx.fill()
}

/* Draw a middle 7-seg display element */
function drawMiddle(cx,x,y,size)
{
    cx.beginPath()
    cx.moveTo(x+size*0.1,y+size)
    cx.lineTo(x+size*0.2,y-size*0.1+size)
    cx.lineTo(x+size*0.8,y-size*0.1+size)
    cx.lineTo(x+size*0.9,y+size)
    
    cx.lineTo(x+size*0.8,y+size*0.1+size)
    cx.lineTo(x+size*0.2,y+size*0.1+size)
    
    cx.fill()
}

/* Draw a left hand 7-seg display element */
function drawLeft(cx,x,y,size)
{
    cx.beginPath()
    cx.moveTo(x,y+size*0.1)
    cx.lineTo(x,y+size*0.9)
    cx.lineTo(x+size*0.1,y+size*0.8)
    cx.lineTo(x+size*0.1,y-size*0.1+size*0.2)
    cx.lineTo(x,y+size*0.1)
    cx.fill()
}

/* Draw a right hand 7-seg display element */
function drawRight(cx,x,y,size)
{
    cx.beginPath()
    cx.moveTo(x+size,y+size*0.1)
    cx.lineTo(x+size,y+size*0.9)
    cx.lineTo(x+size-size*0.1,y+size*0.8)
    cx.lineTo(x+size-size*0.1,y-size*0.1+size*0.2)
    cx.fill()
}



/* gets the digit I want to draw */
function getdigit(value,position)
{
    for(n=1;n<position;n++)
    {
        value = value/10
        
    }
    return (Math.floor(value % 10))
    
}

/* draws the fuel icon */
function drawFuelIcon(cx,x,y)
{
    cx.fillStyle="#fff"
    cx.beginPath()
    cx.moveTo(x+5,y+10)
    cx.lineTo(x+5,y+45)
    cx.lineTo(x,y+45)
    cx.lineTo(x,y+50)
    cx.lineTo(x+25,y+50)
    cx.lineTo(x+25,y+45)
    cx.lineTo(x+20,y+45)
    cx.lineTo(x+20,y+10)
    cx.fill()


}

/* draws the oil can icon */
function drawOilIcon(cx,x,y)
{
    cx.fillStyle="#fff"
    cx.beginPath()
    cx.moveTo(x+5,y+10)
    cx.lineTo(x+29,y+10)
    cx.lineTo(x+29,y+5)
    cx.lineTo(x+25,y+5)
    cx.lineTo(x+25,y+2)
    cx.lineTo(x+35,y+2)
    cx.lineTo(x+35,y+5)
    cx.lineTo(x+31,y+5)
    cx.lineTo(x+31,y+10)
    cx.lineTo(x+40,y+10)
    cx.lineTo(x+45,y+15)
    cx.lineTo(x+50,y+12)
    cx.lineTo(x+55,y+16)
    cx.lineTo(x+55,y+18)
    cx.lineTo(x+45,y+14)
    cx.lineTo(x+40,y+30)
    cx.lineTo(x+15,y+30)
    cx.lineTo(x+15,y+7)
    cx.lineTo(x+8,y+7)
    cx.lineTo(x+8,y+17)
    cx.lineTo(x+5,y+17)
    cx.fill()


}

/** Draws the Guage for oil(health) and fuel */
function drawGuage(cx,x,y,state)
{
    //console.log('guage')
    cx.fillStyle = "#fff"
    //draw the guage at x,y with the current % (state)
    //cx.fillRect(100,100,100,100)
    cx.fillRect(x,y+32,100,4)
    cx.fillRect(x+24,y,2,28)
    cx.fillRect(x+49,y,2,28)
    cx.fillRect(x+74,y,2,28)
    cx.fillRect(x+92,y,8,28)
    cx.fillStyle ='#f11'
    cx.fillRect(x,y,8,28)
    cx.fillStyle = "#fff"

    //cx.beginPath()
    // x: x + 50 
    //cx.moveTo(x+50,y+50)
    //cx.lineTo(x,y+size*0.9)
    //cx.fill()
    cx.fillRect(x+state,y-4,4,32)
    
}

/** This function resets the background for non-game screens */
function resetUI()
{
    x.fillStyle = "#f00"
    x.fillRect(0,0,a.width,a.height);
    x.font = fnt;
    x.fillStyle = "#fff";
}

function drawCar(cx,x,y,skew,size,speed)
{
    //draw wheels
    
    cx.fillStyle = "#222"    
    cx.fillRect(x+size*0.1+skew*0.05*size,y+size*0.8,size*0.2,size*0.2)
    cx.fillRect(x+size*0.7+skew*0.05*size,y+size*0.8,size*0.2,size*0.2)
    if (skew)
    {
        //draw side of wheel
        if (skew >0)
        {
            
        }
    }
    //draw speed lines

    
    //draw back
    cx.fillStyle = "#c22"
    cx.fillRect(x+skew*0.05*size,y+size*0.5,size,size*0.3)
    cx.fillRect(x+size*0.1+skew*0.05*size,y+size*0.2,size*0.8,size*0.3)
    //window
    cx.fillStyle = "#622"
    cx.fillRect(x+size*0.2+skew*0.05*size,y+size*0.25,size*0.6,size*0.2)
    cx.fillStyle = "#f00"
    cx.beginPath();
    cx.arc(x+size*0.15, y+size*0.65, size*0.1, 0, 2 * Math.PI);
    cx.fill();
    cx.beginPath();
    cx.arc(x+size*0.85, y+size*0.65, size*0.1, 0, 2 * Math.PI);
    cx.fill();
    //draw optional side(left or right)

}

function drawMiniVan(cx,x,y,skew,size)
{

}

function drawLorry(cx,x,y,skew,size)
{

}

function drawBus(cx,x,y,skew,size)
{

}

function drawBike(cx,x,y,skew,size)
{
    
}

/**
 * We draw the horizon as a long thin strip that sits on the horizon line. city scape, mountains, forests. as much as we have time to design. 
 */
function drawHorizon(x)
{
    

    // direction 0 == north. mountains stretch from -a.width/2 to a.width/2
    x.fillStyle=stone
    x.fillRect(a.width/2 - a.width*0.3+(direction*(a.width*4/360)),a.height*0.1,a.width*0.6,a.height*0.1)
    x.fillRect(a.width/2 - a.width*0.3- a.width*4+(direction*(a.width*4/360)),a.height*0.1,a.width*0.6,a.height*0.1)
    // west forest

    x.fillStyle=forest
    x.fillRect(a.width/2 - a.width*0.3+ a.width+(direction*(a.width*4/360)),a.height*0.1,a.width*0.6,a.height*0.1 )
    x.fillRect(a.width/2 - a.width*0.3-(a.width*3)+(direction*(a.width*4/360)),a.height*0.1,a.width*0.6,a.height*0.1 )
    // south sand
    x.fillStyle=sand
    x.fillRect(a.width/2 - a.width*0.3+ a.width*2+(direction*(a.width*4/360)),a.height*0.1,a.width*0.6,a.height*0.1 )
    x.fillRect(a.width/2 - a.width*0.3- a.width*2+(direction*(a.width*4/360)),a.height*0.1,a.width*0.6,a.height*0.1 )
    

    // east city
    x.fillStyle=concrete
    x.fillRect(a.width/2 - a.width*0.3+ a.width*3+(direction*(a.width*4/360)),a.height*0.1,a.width*0.6,a.height*0.1)

    // east city #2
    
    x.fillRect(a.width/2 - a.width*0.3 - a.width +(direction*(a.width*4/360)),a.height*0.1,a.width*0.6,a.height*0.1)
    if (direction>360)
    {
        direction -= 360
    }
    if (direction<0)
    {
        direction +=360
    }
}

function drawRoad()
{
    x.fillStyle = "#002"
    x.beginPath()
    
    x.moveTo(a.width*0.2,a.height*0.8)
    // bottom line
    x.lineTo(a.width*0.8,a.height*0.8)
    /*
    x.lineTo(a.width*0.75,a.height*0.75)
    x.lineTo((a.width/10)*(7+ current_road),a.height/2)*/
    x.bezierCurveTo(a.width*0.8,a.height*0.8,
                    a.width*0.8 ,a.height*0.6,
                    (a.width*0.6 + (a.width*0.009) * current_road),a.height*0.2)
    x.lineTo((a.width*0.4 + (a.width*0.009 * current_road)),a.height*0.2)
    x.bezierCurveTo((a.width*0.4 + (a.width*0.009) * current_road),a.height*0.2,
                    
                    a.width*0.2 ,a.height*0.6,
                    a.width*0.2,a.height*0.8
                    )
    x.fill()
    //Draw center line.
    //for (n=0; n++; n<5)
    //{
        x.fillStyle = "#fff"
        x.beginPath()
        
        x.moveTo(a.width*0.49,a.height*0.8)
        // bottom line
        x.lineTo(a.width*0.51,a.height*0.8)
        /*
        x.lineTo(a.width*0.75,a.height*0.75)
        x.lineTo((a.width/10)*(7+ current_road),a.height/2)*/
        x.bezierCurveTo(a.width*0.51,a.height*0.8,
                        a.width*0.51 ,a.height*0.6,
                        (a.width*0.51 + (a.width*0.009) * current_road),a.height*0.2)
        x.lineTo((a.width*0.49 + (a.width*0.009 * current_road)),a.height*0.2)
        x.bezierCurveTo((a.width*0.49 + (a.width*0.009) * current_road),a.height*0.2,
                        
                        a.width*0.49 ,a.height*0.6,
                        a.width*0.49,a.height*0.8
                        )
        x.fill()
    //}
}

// this function takes a coordinate relative to the road and then calculates the actualy position it needs to be rendered on the X axis.
// x == 0 is the center of the road.
function calcActualX(ax,ay)
{
    var result = 0;
    var tmp = 0;
    console.log(ax)
    // ratio between vertical position and where on curve you should be.
    tmp = ((ay/a.height-0.2)/6)*10
    console.log('ratio : ' + tmp)
    console.log('offset : ' + ((ax*current_road)/50))
    if (ay>=a.height*0.2 && ay<=a.height*0.8)
    {
        //we have a valid set of coordinates in the y axis
        result = a.width/2 + (ax*current_road*(1-tmp)/13)
    }
    return result
    //a.width*0.51 y== height * 0.6
    //(a.width*0.51 + (a.width*0.009) * current_road) 0.2
}

function updateRoad()
{
    if (car_speed > 0 )
    {
        if (Math.random()*100<2)
        {
            //update road direction
            road_direction = Math.floor(Math.random()*3)-1;
        }
    
        switch (road_direction)
        {
            case -1:
                if (current_road>-50)
                {
                    current_road-=car_speed/60;
                }
                break;
            case 0:
                if (current_road>2)
                {
                    current_road-=car_speed/60;
                } else if (current_road<-2)
                {
                    current_road+=car_speed/60;
                }
                break;
            case 1:
                if (current_road<50)
                {
                    current_road+=car_speed/60;
                }
                break;
        }
    }

}

/**
 * We draw roadside elements using a "biome" generator based on the direction of travel. e.g. mountains north, beach south, forest east,
 * city west.  This gives us somewhere to align the horizon strip with and allows us to render appropriate elements as they pass our car.
 * each element drawn will be described as the distance travelled and the offset relative to the road.  This way we can spawn them in near 
 * the horizon and then let them grow as they get closer maintaining the correct distance from the road as they approach. we will need an array
 * of elements that have been generated and they get culled once they leave the bottom of the screen. 
 * 
 * Each element in the array will need a draw function that allows for position and scale. we will use a precomputed array to decide the size of 
 * each element so we can create bounding boxes for them to calculate collisions
 * 
 * 
 */

 function drawTree(cx,x,y,size)
 {

 }

 function drawSign(cx,x,y,size)
 {

 }

 function drawRock(cx,x,y,size)
 {

 }

 function drawCactusVertical(cx,x,y,size)
 {
    cx.fillStyle = cactus_low
    cx.beginPath()
    cx.moveTo(x+size*0.3,y+size)
    cx.lineTo(x+size*0.3,y+size*0.3)
    cx.bezierCurveTo(x+size*0.3,y+size*0.3,
        x+size*0.1,y+size*0.5,
        x+size*0.3,y+size*0.7)
    cx.lineTo(x+size*0.3,y+size*0.7)
    cx.fill();
 }
 function drawCactusHorizontal(cx,x,y,size,direction)
 {
     
 }

 function drawCactus(cx,x,y,size)
 {
    cx.fillStyle = cactus_low
    cx.beginPath()
    cx.moveTo(x+size*0.3,y+size)
    cx.lineTo(x+size*0.3,y+size*0.3)
    cx.bezierCurveTo(x+size*0.3,y+size*0.3,
        x+size*0.5,y,
        x+size*0.7,y+size*0.3)
    cx.lineTo(x+size*0.7,y+size)
    cx.fill();
        
    cx.fillStyle = cactus_green
    cx.beginPath()
    cx.moveTo(x+size*0.3+2,y+size)
    cx.lineTo(x+size*0.3+2,y+size*0.3)
    cx.bezierCurveTo(x+size*0.3+2,y+size*0.3,
        x+size*0.5,y+size*0.1+1,
        x+size*0.7,y+size*0.3)
    cx.lineTo(x+size*0.7,y+size)
    cx.fill();

    
    
    
 }

 function drawHouse(cx,x,y,size)
 {

 }

 function drawSkyScraper(cx,x,y,size)
 {

 }

 function drawHiker(cx,x,y,size)
 {

 }

 function drawCloud(cx,x,y,size,seed)
 {

 }

 function drawStreetLight(cx,x,y,size)
 {

 }

 function drawTrafficLight(cx,x,y,size)
 {

 }

 function drawStreetSign(cx,x,y,size,text1,text2)
 {

 }


