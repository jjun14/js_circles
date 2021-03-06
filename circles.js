// added rfactor to the circle constructor parameters to scale the circle radius
function Circle(cx, cy, rfactor, html_id)
{
  console.log('rfactor: ' + rfactor * 10);
  // when creating a circle use 10 as a base and multiple by the rfactor divided by 1000
  // this changes the size of a circle when it is created!
  this.info = { cx: cx,  cy: cy, r: 10 * rfactor/100, html_id: html_id };
  
  //private function that generates a random number
  var randomNumberBetween = function(min, max){
    return Math.random()*(max-min) + min;
  }


  // private function for creating the SVG circle
  var makeSVG = function(tag, attrs) {
        var el= document.createElementNS('http://www.w3.org/2000/svg', tag);
        for (var k in attrs)
        {
            el.setAttribute(k, attrs[k]);
        }
        return el;
    }

  this.initialize = function(){
    //give a random velocity for the circle
    this.info.velocity = {
      x: randomNumberBetween(-3,3),
      y: randomNumberBetween(-3,3)
    }

    //create a circle 
    var circle = makeSVG('circle', 
      {   cx: this.info.cx,
          cy: this.info.cy,
          r:  this.info.r, // updated radius to use the varying radius sizes
          id: html_id,
          style: "fill: #"+  Math.floor(Math.random()*16777215).toString(16)
      });

    document.getElementById('svg').appendChild(circle);
  }

  this.update = function(time){
    var el = document.getElementById(html_id);

    // see if the circle is going outside the browser. if it is, reverse the velocity
    // changed the if statements to account for proper bouncing off the walls
    if( this.info.cx > document.body.clientWidth - this.info.r || this.info.cx < 0 + this.info.r)
    {
      this.info.velocity.x = this.info.velocity.x * -1;
    }
    if( this.info.cy > document.body.clientHeight - this.info.r || this.info.cy < 0 + this.info.r)
    {
      this.info.velocity.y = this.info.velocity.y * -1;
    }
    // updates the location info of the circle
    this.info.cx = this.info.cx + this.info.velocity.x*time;
    this.info.cy = this.info.cy + this.info.velocity.y*time;

    // updates the location of the actual circle html object
    el.setAttribute("cx", this.info.cx);
    el.setAttribute("cy", this.info.cy);
  }

  this.initialize();
}

// an object constructor that will hold all of our circles and update them
function PlayGround()
{
  var counter = 0;  //counts the number of circles created
  var circles = []; //array that will hold all the circles created in the app

  //a loop that updates the circle's position on the screen
  this.loop = function(){
    for(circle in circles){
      circles[circle].update(1);
    }
    collision_check();
  }

  this.createNewCircle = function(x, y, time){
    console.log(counter);
    var new_circle = new Circle(x, y, time, counter++);
    console.log(new_circle);
    circles.push(new_circle);
    console.log(circles);
    // console.log('created a new circle!', new_circle);
  }

  // define a private function to detect collisions
  function collision_check(){
    // compare each circle to every other circle
    for(var i = 0; i < circles.length; i++){
      for(var j = 0; j < circles.length; j++){
        // calculate the distance inbetween each circle
        var x = Math.pow(circles[i].info.cx - circles[j].info.cx, 2);
        var y = Math.pow(circles[i].info.cy - circles[j].info.cy, 2);
        var distance = Math.sqrt(x + y);

        // if the distance between the two circles is less than the sum of
        // the radii and circle[i] is not the same circle as circle[j]
        if(i == j){
          continue;
        }
        else if(distance <= circles[i].info.r + circles[j].info.r)
        {
          console.log('collision');
          console.log(circles[i]);
          console.log(circles[j]);
          /***** removing circles on collision *****/
          // // remove the circles from the page
          // var c1 = document.getElementById(circles[i].info.html_id);
          // var c2 = document.getElementById(circles[j].info.html_id);
          // var container = document.getElementById('svg');
          // container.removeChild(c1);
          // container.removeChild(c2);
          // // remove the circles from our list of circles
          // circles.splice(i,1);
          // if(i > j){
          //   circles.splice(j,1);
          // }
          // else
          // {
          //   circles.splice(j - 1, 1);
          // }
          // return
        }
      }
    }
  }

  // create one circle when the game starts
  // this.createNewCircle(document.body.clientWidth/2, document.body.clientHeight/2);
}

var playground = new PlayGround();
// this function call will update the location of all of the circles
setInterval(playground.loop, 20);
// in order to change the circle size based on the amount of time we clicked the mouse
// first we declare variables for the length of our click
var time;
// to find the length of the click
// we'll declare a variable that will keep of track of the date aka time when our click started
var click_start;
// next we'll declare a variable that will keep of track of the date aka time when our click ended
var click_end

// next we'll add an event listener that will get current date when we click the mouse down
document.onmousedown = function(e){
  // when we click we'll get the current date in milliseconds
  click_start = new Date().getMilliseconds();
}

// event listener that will get the date when we release our mouse click
document.onmouseup = function(e){
  // when we release our click we'll get the current date in milliseconds
  click_end = new Date().getMilliseconds();
  // we can get the length of the click by subtracting the time when we relased the click from the
  // time we start the click
  time = Math.abs(click_end - click_start);
  // we'll then create a new circle with the playground function
  // if you look above you'll see that we created the circle by passing in our time as the rfactor
  // that we defined in the circle constructor near the top
  playground.createNewCircle(e.x, e.y, time);
}
// switched from one event listener to 2 up above!
// document.onclick = function(e) {
//   playground.createNewCircle(e.x,e.y);
// }