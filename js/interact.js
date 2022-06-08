
/* CLICK N' DRAG PROCEDURAL ART GENERATOR CODE:*/
/* 
Interactive Exampe 1 - Home page 
Created by: Kyle Coulon 2021
*
*
*
*
*/
//CANVAS VARIABLES
var canvas = document.getElementById("myCanvas");
var context = canvas.getContext("2d");

//CLICK AND HOLD VARIABLES
var start_click_x = 0;
var start_click_y = 0;
var mouse_hold = 0;

//DRAW STEP VARIABLES
var point_x = 0;
var point_y = 0;
var point_speed_x = 0;
var point_speed_y = 0;
//used to run draw step on interval
var point_draw_step = 0;
//used to randomize drawing
var canv_slice_x = canvas.width / 2;
var canv_slice_y = canvas.height / 2;
//every once and a while the pattern changes
var switchituptimer = 0;

const random_slice_x_list = [canvas.width/2,canvas.width/4,(canvas.width/4)*3];
const random_slice_y_list = [canvas.height/2,canvas.height/4,(canvas.height/4)*3];

//start with a clear canvas
$(document).ready(clearCanvas()); 
 context.fillStyle = "#FFFFFF";
context.fillText("Click and drag!", canv_slice_x-25,canv_slice_y);
 context.fillStyle = "#11232C";

//arrow drawing function from stackoverflow.com
//https://stackoverflow.com/questions/808826/draw-arrow-on-canvas-tag
function canvas_arrow(context, fromx, fromy, tox, toy) {
  var headlen = 10; // length of head in pixels
  var dx = tox - fromx;
  var dy = toy - fromy;
  var angle = Math.atan2(dy, dx);
  context.moveTo(fromx, fromy);
  context.lineTo(tox, toy);
  context.lineTo(
    tox - headlen * Math.cos(angle - Math.PI / 6),
    toy - headlen * Math.sin(angle - Math.PI / 6)
  );
  context.moveTo(tox, toy);
  context.lineTo(
    tox - headlen * Math.cos(angle + Math.PI / 6),
    toy - headlen * Math.sin(angle + Math.PI / 6)
  );
}


//call on mouse move event
document.onmousemove = handleMouseMove;

//clear canvas to default color
function clearCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#11232C";
  context.rect(0,0,canvas.width,canvas.height);
  context.fill();
  context.beginPath();
}

function handleMouseMove() {
  if (mouse_hold) {
    var e = window.event;
    var pos = getMousePos(canvas, e);
    clearCanvas();
    context.beginPath();
    //draw an arrow showing the user where he is clicking and dragging
    canvas_arrow(context, start_click_x, start_click_y, pos.x, pos.y);
    context.stroke();
  }
}

function point_drawing() {
  switchituptimer += 1;
  if(switchituptimer > 1000){
    canv_slice_x = random_slice_x_list[Math.floor(Math.random() * random_slice_x_list.length)];
    canv_slice_y = random_slice_y_list[Math.floor(Math.random() * random_slice_y_list.length)];
  }
  var steps = 10;

  for (let i = 0; i < steps; i++) {
  
    var prev_x = point_x;
    var prev_y = point_y;

    context.beginPath();
    
    context.moveTo(point_x, point_y);
    
    point_x += point_speed_x;
    point_y += point_speed_y;
    
    //EACH QUADRANT GETS A DIFFERENT COLOR
    if(point_x < canv_slice_x){
      if(point_y < canv_slice_y){
        if(point_speed_x > 0){ context.strokeStyle = "#F2B3E1";}else{context.strokeStyle = "#A0F5F3";}
      }else{
         if(point_speed_x > 0){context.strokeStyle = "#A3D177";}else{context.strokeStyle = "#FFEE7D";}
      }
    }else{
      if(point_y < canv_slice_y){
          if(point_speed_x > 0){context.strokeStyle = "	#ffb3ba";}else{context.strokeStyle = "#baffc9";}
      }else{
          if(point_speed_x > 0){context.strokeStyle = "#bae1ff";}else{context.strokeStyle = "#B0B1E6";}
      }
    }
    
    //draw the line
    context.lineTo(point_x, point_y);
    context.stroke();

    var wrapped = 0;

    if (point_x > canvas.width) {
      point_x = 0;
      wrapped = 1;
    }
    if (point_x < 0) {
      point_x = canvas.width;
      wrapped = 1;
    }
    if (point_y > canvas.height) {
      point_y = 0;
      wrapped = 1;
    }
    if (point_y < 0) {
      point_y = canvas.height;
      wrapped = 1;
    }

    if (wrapped) {
      context.beginPath();
      context.moveTo(point_x, point_y);
    }

    if (!wrapped) {
      if (prev_x < canv_slice_x && point_x > canv_slice_x) {
        point_speed_x = -point_speed_x;
        point_x = canv_slice_x;
      } else {
        if (prev_x > canv_slice_x && point_x < canv_slice_x) {
          point_speed_x = -point_speed_x;
          point_x = canv_slice_x;
        } else {
          if (prev_y < canv_slice_y && point_y > canv_slice_y) {
            point_speed_y = -point_speed_y;
            point_y = canv_slice_y;
          } else {
            if (prev_y > canv_slice_y && point_y < canv_slice_y) {
              point_speed_y = -point_speed_y;
              point_y = canv_slice_y;
            }
          }
        }
      }
    }
  }
}

function mousePress(evt) {
  var pos = getMousePos(canvas, evt);

  start_click_x = pos.x;
  start_click_y = pos.y;

  mouse_hold = 1;

  window.clearInterval(point_draw_step);
  
  context.lineWidth = 2;
  context.strokeStyle = "#A3D177";
  
}

function mouseLeave() {
  if (mouse_hold) {
    clearCanvas();
    mouse_hold = 0;
  }
}

function mouseRelease(evt) {
  var pos = getMousePos(canvas, evt);

  if (mouse_hold) {
    //set up variables
    mouse_hold = 0;
    point_x = pos.x;
    point_y = pos.y;
    var speed_multiplier = 0.01;
    point_speed_x = (pos.x - start_click_x) * speed_multiplier;
    point_speed_y = (pos.y - start_click_y) * speed_multiplier;

    clearCanvas();
    
    context.lineWidth = 0.8;
    context.beginPath();
    context.moveTo(pos.x, pos.y);
    
    canv_slice_x = random_slice_x_list[Math.floor(Math.random() * random_slice_x_list.length)];
    canv_slice_y = random_slice_y_list[Math.floor(Math.random() * random_slice_y_list.length)];
    
    switchituptimer = 0;
    
    //start drawing
    point_draw_step = window.setInterval(point_drawing, 10);
    
  }
}

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}



/* PENDULUM PROCEDURAL ART GENERATOR CODE:*/
/* 
Interactive Exampe 2 - Home page 
Created by: Kyle Coulon 2021
*
*
*
*
*/

//init variables
var exm2_canvas = document.getElementById("exm2Canvas");
var exm2_context = exm2_canvas.getContext("2d");

var pstep; //used to run painstep on interval

//init drawing variables
var center_x = exm2_canvas.width/2;
var center_y = exm2_canvas.height/2;
var radToDeg = Math.PI / 180;
var color = "#F2B3E1";

//init other
var p_oval = 0.5;
var p_spin_amount = 0.2;
var p_spiral_factor = 0.01;

//init dynamic vars
var p_angle = 0;
var p_dist = 250;
var p_spin = 0;
var last_x, last_y;

// - - - - - - - - - - - - - - functions

function fillCanvas(){
    exm2_context.beginPath();
    exm2_context.rect(0, 0, exm2_canvas.width, exm2_canvas.height);
    exm2_context.fillStyle = "#11232C";
    exm2_context.fill();
}


function find_color(x,y){

  var tlrgb = [255, 28, 194];
  var trrgb = [3, 221, 255];
  var blrgb = [136, 250, 27];
  var brrgb = [252, 226, 50];
  
  var x_percent = x / exm2_canvas.width;
  var y_percent = y / exm2_canvas.height;
  
  var top_edge_color = interpolate_color(tlrgb, trrgb, x_percent);
  var bottom_edge_color = interpolate_color(blrgb, brrgb, x_percent);
  
  var new_color = interpolate_color(top_edge_color,bottom_edge_color, y_percent);
  
  return rgbToHex(new_color[0],new_color[1],new_color[2]);
}


function interpolate_color(startcolor, endcolor, percent){
    var rgb = [];
    rgb[0] = Math.round(startcolor[0] + (endcolor[0] - startcolor[0]) * percent);
    rgb[1] = Math.round(startcolor[1] + (endcolor[1] - startcolor[1]) * percent);
    rgb[2] = Math.round(startcolor[2] + (endcolor[2] - startcolor[2]) * percent);
    return rgb;
}


function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

//clear canvas on startup
function startUp(){ fillCanvas(); }
window.onload = startUp;

function resetPaintVariables(){
//reset to default values
p_dist = 250;
p_angle = 0;
last_x = undefined;
last_y = undefined;
p_spin = 0;
}

function squish(y){
return center_y + ((y - center_y) * p_oval);
}
function clamp(number, min, max) {
  return Math.max(min, Math.min(number, max));
}
function projectPosition(x,y, dir, dist){
var newx = x + dist * Math.cos(dir * radToDeg );
var newy = y + dist * Math.sin(dir * radToDeg);
return [newx, newy];
}
function point_distance(x1,y1, x2,y2){
return Math.hypot(x2-x1, y2-y1);
}
function point_direction(x1,y1, x2,y2){
return Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
}

function sliderChange(sliderID){
var val = document.getElementById(sliderID).value;
switch(sliderID) {
  case "spiral":
	p_spiral_factor = val * 0.0005;
    break;
  case "oval":
  	p_oval = (100-val)*0.01;
    break;
  case "spin":
  	p_spin_amount = val*0.01;
    break;
}
}

function spinPosition(x,y){
  var temp_dist = point_distance(center_x,center_y,x,y);
  var temp_dir = point_direction(center_x,center_y,x,y);
  var newPosition = projectPosition(center_x,center_y, temp_dir + p_spin, temp_dist);
  var returnx = newPosition[0];
  var returny = newPosition[1];
  return [returnx, returny];
}

function paintStep(){
  var newPosition = projectPosition(center_x,center_y, p_angle, p_dist);
  var spinNewPosition = spinPosition(newPosition[0], squish(newPosition[1]));

  var spinLastPosition = spinPosition(last_x,squish(last_y));

  if(last_x == undefined || last_y == undefined){
    last_x = spinNewPosition[0]; last_y = spinNewPosition[1];
  }

  exm2_context.moveTo(last_x,last_y);
  exm2_context.lineTo(spinNewPosition[0], spinNewPosition[1]);

  exm2_context.strokeStyle = find_color(spinNewPosition[0], spinNewPosition[1]);
  exm2_context.stroke();

  //update
  p_angle += 1;
  p_dist -= p_spiral_factor;
  last_x = spinNewPosition[0]; last_y = spinNewPosition[1];
  p_spin += p_spin_amount;

  if(p_dist <= 1){ //end when center is reached
    window.clearInterval(pstep);
    bake();
    resetPaintVariables();
  }

}

function drawStep(){
  for (let i = 0; i < 10; i++) {
    paintStep();
    bake();
    if(p_dist <= 2){ break; window.clearInterval(pstep); }
  }
}


function startPainting(){
  resetPainting();
  pstep = window.setInterval(drawStep,10);
}

function stopPainting(){
  window.clearInterval(pstep);
  bake();
}

function resetPainting(){
  exm2_context.clearRect(0, 0, exm2_canvas.width, exm2_canvas.height);
  bake();
  resetPaintVariables();
  fillCanvas();
}

function bake(){
    exm2_context.beginPath();
}


/* ANIMATED SPRITE BOX CODE:*/
/* 
Interactive Exampe 3 - Resources page 
Created by: Kyle Coulon 2021
*
*
*/
function updateAnimbox(val){
  // when the slider element is changed, the sprite is changed
  var element = document.getElementById("animbox");
  var img_width = 400;
  
  // the sprite sheet has two rows
  if(val >=8){
    element.style.backgroundPositionY = -(360) + "px";
    val -= 8;
  }else{
    element.style.backgroundPositionY = 0 + "px";
  }
  //apply to the element
  element.style.backgroundPositionX = -(img_width*val) + "px";
}