function byId(id) {return document.getElementById(id);}
function create(tag) {return document.createElement(tag);}
function createSvg(tag) {return document.createElementNS("http://www.w3.org/2000/svg", tag);}
function attr(elem, name, value) {elem.setAttribute(name,value);}
function append(parent, children) {
  if(!Array.isArray(children)) children = [children];
  children.map(function(child){ parent.appendChild(child); })
}
function svgTag() {
  var svg = createSvg("svg");
  attr(svg,"xmlns", "http://www.w3.org/2000/svg");
  attr(svg,"xmlns:xlink", "http://www.w3.org/1999/xlink");
  attr(svg,"version","1.1");
  return svg;
}

// function svgLine(a, b) {
//   var l = createSvg("line");
//   attr(l, "x1", a.x);
//   attr(l, "y1", a.y);
//   attr(l, "x2", b.x);
//   attr(l, "y2", b.y);
//   return l;
// }

function svgPath(d) {
  var p = createSvg("path");
  attr(p, "d", d);
  return p;
}

function lineD(a, b) {
    return "M "+a.x+" "+a.y+" L "+b.x+" "+b.y;
}

function svgCircle(center, radius) {
  var p = createSvg("circle");
  attr(p, "cx", center.x);
  attr(p, "cy", center.y);
  attr(p, "r", radius);
  return p;
}

function drawable(path) {
    path.style.transition = "stroke-dashoffset 0.3s linear";
    path.style.strokeDasharray = path.getTotalLength();
    path.style.strokeDashoffset = path.getTotalLength();
    return path;
}

function draw(path) { path.style.strokeDashoffset = parseInt(path.style.strokeDashoffset) -path.getTotalLength(); }
function erase(path) { path.style.strokeDashoffset = parseInt(path.style.strokeDashoffset) -path.getTotalLength(); }

function circleCoords(center, radius, n) {
    var a = 2*Math.PI/n;
    var coords = [];
    for(var i = 0; i < n; i++)
        coords.push({
            x: center.x + Math.cos(i*a)*radius,
            y: center.y + Math.sin(i*a)*radius
        });
    return coords;
}

function rand(min, max) {return Math.floor(Math.random()*(max-min)+min);}
function randElem(array) {return array[rand(0,array.length)];}
function randPair(array) {
    var first = randElem(array);
    var second = randElem(array.filter(function(e){return e != first}));
    return [first, second];
}

//////////////////////////////////////



var svg = byId("lodium").appendChild(svgTag());
attr(svg, "class", "lodium");


var edge = drawable(svgPath("M 0 0 L 100 0"));
edge.style.stroke = "#A041FF";
edge.style.strokeWidth = "10";

var nodeCoords = circleCoords({x:70, y:70},50,5);
var nodes = nodeCoords.map(function(coords){
    var circle = svgCircle(coords, 10);
    circle.style.fill = "#CCC";
    return circle;
});


var edges = [1,2,3].map(function(i) {
    var ns = randPair(nodeCoords);
    var p = drawable(svgPath(lineD(ns[0], ns[1])));
    // p.style.stroke = "#A041FF";
    p.style.strokeWidth = "5";
    return p;
});

append(svg, edges);
append(svg, nodes);

var nextDraw = edges.length - 2;
var nextErase = edges.length - 1;
function drawNext() {
    var ns = randPair(nodeCoords);
    attr(edges[nextDraw],"d", lineD(ns[0], ns[1]));
    drawable(edges[nextDraw]); // refresh animation lenght information
    draw(edges[nextDraw]);
    edges[nextDraw].style.stroke = "hsl("+rand(0,360)+", 80%, 50%)";

    draw(edges[nextErase]);
    nextDraw = (nextDraw + 1) % edges.length;
    nextErase = (nextErase + 1) % edges.length;
}

setInterval(drawNext, 500);














