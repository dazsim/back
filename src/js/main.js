// globals

var ng = 'New Game'
var se = "Settings"
var bk = "Back"
var sc = "Score: ";

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
var current_road = 0;
var health = 0;
var fuel = 100;
var text_gameover = "";
var speed_colors = [
    "#1f1",

    "#fb0",
    "#f00"
];


//This is our js for the game
function checkBounds(e,x,y,z,r)
{
    px = e.pageX
    py = e.pageY
    
    if ((px>x && px<z) && (py>y && py<r)) return true
    return false
}

function getLineHeight(e)
{
    e.save()
    
    var lineHeight=e.measureText('M').width
    e.restore()
    return lineHeight
}

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
    
}

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

function drawTop(cx,x,y,size)
{
    cx.beginPath()
    cx.moveTo(x+size*0.1,y)
    cx.lineTo(x+size*0.9,y)
    cx.lineTo(x+size*0.8,y+size*0.1)
    cx.lineTo(x+size*0.2,y+size*0.1)
    cx.fill()
}

function drawBottom(cx,x,y,size)
{
    cx.beginPath()
    cx.moveTo(x+size*0.1,y+2*size)
    cx.lineTo(x+size*0.9,y+2*size)
    cx.lineTo(x+size*0.8,y-size*0.1+2*size)
    cx.lineTo(x+size*0.2,y-size*0.1+2*size)
    cx.fill()
}

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
function drawRight(cx,x,y,size)
{
    cx.beginPath()
    cx.moveTo(x+size,y+size*0.1)
    cx.lineTo(x+size,y+size*0.9)
    cx.lineTo(x+size-size*0.1,y+size*0.8)
    cx.lineTo(x+size-size*0.1,y-size*0.1+size*0.2)
    cx.fill()
}

function drawBar(cx,x,y,width,height,color)
{
    cx.fillStyle = color;
    cx.beginPath()
    cx.moveTo(x,y)
    cx.moveTo(x+width,y)
    cx.moveTo(x+width,y+height)
    cx.moveTo(x,y+height)
    cx.fill()
}

function getdigit(value,position)
{
    for(n=1;n<position;n++)
    {
        value = value/10
        
    }
    
    return (Math.floor(value % 10))
    
}

function drawFuelIcon(cx,x,y)
{

}

function drawOilIcon(cx,x,y)
{

}

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


