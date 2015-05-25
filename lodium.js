function byId(id) {return document.getElementById(id);}
function create(tag) {return document.createElement(tag);}
function createSvg(tag) {return document.createElementNS("http://www.w3.org/2000/svg", tag);}
function attr(elem, name, value) {elem.setAttribute(name,value);}
function append(parent, children) {
  if(!Array.isArray(children)) children = [children];
  children.map(function(child){ parent.appendChild(child); })
}
function remove(node) {
    node.parentNode.removeChild(node);
}
function svgTag() {
  var svg = createSvg("svg");
  attr(svg,"xmlns", "http://www.w3.org/2000/svg");
  attr(svg,"xmlns:xlink", "http://www.w3.org/1999/xlink");
  attr(svg,"version","1.1");
  return svg;
}

function svgPath(d) {
  var p = createSvg("path");
  attr(p, "d", d);
  return p;
}

function lineD(a, b) {
    return "M "+a.x+" "+a.y+" L "+b.x+" "+b.y;
}

function svgCircle(center, radius) {
  var c = createSvg("circle");
  attr(c, "cx", center.x);
  attr(c, "cy", center.y);
  attr(c, "r", radius);
  return c;
}

function drawable(path) {
    path.style.transition = "stroke-dashoffset 0.3s linear";
    path.style.strokeDasharray = path.getTotalLength();
    path.style.strokeDashoffset = path.getTotalLength();
    return path;
}

function toggleDraw(path) { path.style.strokeDashoffset = parseInt(path.style.strokeDashoffset) -path.getTotalLength(); }

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

function randomCoords(a,b,n) {
    var coords = [];
    for(var i = 0; i < n; i++)
        coords.push({
            x: rand(a.x, b.x),
            y: rand(a.y, b.y)
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

///////////////////////////////////////
function isFreePair(pair) {
    for(var i = 0; i < edgeG.children.length; i++) {
        var edge = edgeG.children[i];
        if((edge.pair[0].x === pair[0].x && edge.pair[0].y === pair[0].y &&
                    edge.pair[1].x === pair[1].x && edge.pair[1].y === pair[1].y) ||
                (edge.pair[0].x === pair[1].x && edge.pair[0].y === pair[1].y &&
                 edge.pair[1].x === pair[0].x && edge.pair[1].y === pair[0].y) ) {
            return false;
        }
    }
    return true;
}
//////////////////////////////////////



var svg = byId("lodium").appendChild(svgTag());
attr(svg, "class", "lodium");

var edgeG = createSvg("g");
var nodeG = createSvg("g");
svg.appendChild(edgeG);
svg.appendChild(nodeG);

var nodeCount = 7;
var nodeCoords = circleCoords({x:70, y:70},50,nodeCount);
// var nodeCoords = randomCoords({x:10, y:10},{x:120, y:120},6);
var nodei = 0;
var nodes = nodeCoords.map(function(coords){
    var circle = svgCircle(coords, 8);
    circle.style.transition = "opacity 1s "+(nodei/nodeCount)+"s linear";
    circle.style.fill = "#EEE";
    circle.style.stroke = "#BBB";
    circle.style.strokeWidth = "2";
    circle.style.opacity = "0";
    nodei++;
    return circle;
});
append(nodeG, nodes);

function drawNext() {
    var pair;
    var tries = 0;
    do {
        tries++;
        if(tries > 10) return;
        pair = randPair(nodeCoords);
    } while( !isFreePair(pair) )

    var edge = drawable(svgPath(lineD(pair[0], pair[1])));
    edge.pair = pair;
    edge.style.stroke = "hsl("+rand(0,360)+", 100%, 70%)";
    edge.style.strokeWidth = "3";
    append(edgeG, edge);

    setTimeout(function() {toggleDraw(edge)}, 100);
}

function removeNext() {
    for(var i = 0; i < edgeG.children.length; i++) {
        var edge = edgeG.children[i];
        if( edge.trash !== true ) {
            toggleDraw(edge);
            edge.trash = true;
            setTimeout(function() {remove(edge);}, 1000);
            break;
        }
    }
}

function showNodes() {
    nodes.map(function(n) {
        n.style.opacity = 100;
    });
}

setTimeout(showNodes, 100);
setTimeout(function(){setInterval(drawNext, 500);},1200);
setTimeout(function(){setInterval(removeNext, 500);},3100);

