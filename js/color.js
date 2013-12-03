var layers = d3.selectAll('.layers li');

var map = d3.select('#map');
var w = parseInt(map.style('width'));
var h = parseInt(map.style('height'));
var colorEditor = false;
var hVal, sVal, lVal, newColor, abbrColor;
var helper = d3.select('#helper');
var format = d3.format('.4g');

var svg = map.append('svg')
  .attr('width', w).attr('height', h);

var preview = svg.append('rect')
  .attr('class', 'preview')
  .attr('width', w).attr('height', h)
  .attr('fill', '#fff');

var saturation = d3.behavior.zoom()
  .translate([0, 0])
  .scale(50)
  .scaleExtent([1, 100])
  .on('zoom', function() { if (colorEditor) previewColor(hVal, lVal); });

function previewColor(h,l) {
  newColor = 'hsl('+h+','+saturation.scale()+'%,'+l+'%)';
  preview.attr('fill', newColor);
  
  abbrColor = 'hsl('+format(h)+', '+format(saturation.scale())+'%, '+format(l)+'%)';
  helper.select('h2').text(abbrColor);
}

var workspace = svg.append('g')
  .attr('transform', 'translate(200,0)');
var overlay = workspace.append('rect')
  .attr('width', w-200).attr('height', h)
  .attr('fill', 'none')
  .attr('pointer-events', 'all')
  .on('mousemove', function() {
    if (colorEditor) {
      var mouse = d3.mouse(this);
      hVal = hue(mouse[0]);
      lVal = luminosity(mouse[1]);

      previewColor(hVal,lVal);
      xSlider.attr('transform', 'translate('+x((mouse[0]/(w-200))*360)+',0)');
      ySlider.attr('transform', 'translate(0,'+y(lVal)+')');

    }
  })
  .call(saturation);

var defs = svg.append('svg:defs');
var hueGradient = defs.append('svg:linearGradient')
  .attr('id', 'hue-gradient')
  .attr('x1', '0%').attr('y1', '0%')
  .attr('x2', '100%').attr('y2', '0%')
  .attr('spreadMethod', 'pad');
hueGradient.append('svg:stop')
    .attr('offset', '0%').attr('stop-color', 'hsl(0,50%,50%)');
hueGradient.append('svg:stop')
    .attr('offset', '10%').attr('stop-color', 'hsl(36,50%,50%)');
hueGradient.append('svg:stop')
    .attr('offset', '20%').attr('stop-color', 'hsl(72,50%,50%)');
hueGradient.append('svg:stop')
    .attr('offset', '30%').attr('stop-color', 'hsl(108,50%,50%)');
hueGradient.append('svg:stop')
    .attr('offset', '40%').attr('stop-color', 'hsl(144,50%,50%)');
hueGradient.append('svg:stop')
    .attr('offset', '50%').attr('stop-color', 'hsl(180,50%,50%)');
hueGradient.append('svg:stop')
    .attr('offset', '60%').attr('stop-color', 'hsl(216,50%,50%)');
hueGradient.append('svg:stop')
    .attr('offset', '70%').attr('stop-color', 'hsl(252,50%,50%)');
hueGradient.append('svg:stop')
    .attr('offset', '80%').attr('stop-color', 'hsl(288,50%,50%)');
hueGradient.append('svg:stop')
    .attr('offset', '90%').attr('stop-color', 'hsl(324,50%,50%)');
hueGradient.append('svg:stop')
    .attr('offset', '100%').attr('stop-color', 'hsl(360,50%,50%)');

var hue = d3.scale.linear()
  .domain([0, w-200])
  .range([0, 360]);

var luminosityGradient = defs.append('svg:linearGradient')
    .attr('id', 'luminosity-gradient')
    .attr('x1', '0%').attr('y1', '0%')
    .attr('x2', '0%').attr('y2', '100%')
    .attr('spreadMethod', 'pad');
luminosityGradient.append('svg:stop')
    .attr('offset', '0%').attr('stop-color', 'hsl(0,0%,0%)');
luminosityGradient.append('svg:stop')
    .attr('offset', '100%').attr('stop-color', 'hsl(0,0%,100%)');

var luminosity = d3.scale.linear()
  .domain([0, h])
  .range([0, 100]);


// hue axis (x)
var x = d3.scale.linear()
  .domain([0, 360]).range([0, w-280]);

var xAxis = d3.svg.axis()
  .scale(x)
  .orient('top')
  .tickSize(4)
  .tickPadding(8)
  .tickValues([0, 36, 72, 108, 144, 180, 216, 252, 288, 324, 360])
  .tickFormat(function(d) { return d + '°'; });

var hueAxis = workspace.append('g')
  .attr('class', 'hue axis')
  .attr('transform', 'translate(40, 26)')
  .attr('opacity', 0);
hueAxis.call(xAxis);
hueAxis.append('text')
  .attr('transform', 'translate(0,-11)')
  .attr('class', 'label')
  .text('hue');

var xSlider = hueAxis.append('circle')
  .attr('class', 'slider')
  .attr('cy', -2)
  .attr('r', 4);
  

// luminosity axis (y)
var y = d3.scale.linear()
  .domain([0, 100]).range([0, h-80]);

var yAxis = d3.svg.axis()
  .scale(y)
  .orient('left')
  .tickSize(4)
  .tickPadding(8)
  .tickValues([0, 25, 50, 75, 100])
  .tickFormat(function(d) { return d + '%'; });

var luminosityAxis = workspace.append('g')
  .attr('class', 'luminosity axis')
  .attr('transform', 'translate(26, 40)')
  .attr('opacity', 0);
luminosityAxis.call(yAxis);
luminosityAxis.selectAll('text')
  .attr('transform', 'translate(-14,-26)rotate(-90)')
  .attr('opacity', function(d) { return d === 100 ? 0 : 1; });
luminosityAxis.append('text')
  .attr('transform', 'translate(-11,'+(h-80)+')rotate(-90)')
  .attr('class', 'label')
  .text('luminosity');

var ySlider = luminosityAxis.append('circle')
  .attr('class', 'slider')
  .attr('cx', -2)
  .attr('r', 4);

function setColor() {
  d3.selectAll('.layers li span').style('background-color', function() { 
    return d3.hsl(d3.select(this).attr('data-color')).toString(); 
  });
}

layers.on('click', function() { 
  var color = d3.select(this).select('.swatch').attr('data-color');

  layers.classed('active', false);
  d3.select(this).classed('active', true);

  preview.transition().duration(200).attr('fill', color);

  saturation.scale(d3.hsl(color).s*100);

  xSlider.transition().duration(200)
    .attr('transform', 'translate('+x(d3.hsl(color).h)+',0)');
  ySlider.transition().duration(200)
    .attr('transform', 'translate(0,'+y(d3.hsl(color).l*100)+')');
  helper.select('h2').text(color);

  setEditor(true);
});

workspace.on('click', function() {
  if (colorEditor) {
    d3.select('.layers li.active').select('.swatch').attr('data-color', newColor);
    setColor();
    setEditor(false);
    layers.classed('active', false);
  }
});

function setEditor(active) {
  if (active) {
    hueAxis.transition().duration(100).attr('opacity', 1);
    luminosityAxis.transition().duration(100).attr('opacity', 1);
    helper.style('opacity', 1);
    colorEditor = true;
  } else {
    hueAxis.transition().duration(100).attr('opacity', 0);
    luminosityAxis.transition().duration(100).attr('opacity', 0);
    helper.style('opacity', 0);
    colorEditor = false;
  }
}

document.onkeydown = function(evt) {
  if (evt.keyCode == 27) setEditor(false);
};

setColor();
