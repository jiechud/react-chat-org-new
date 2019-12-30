const d3 = require('d3')
const { collapse, wrapText, helpers } = require('../utils')
const defineBoxShadow = require('../defs/box-shadow')
const defineAvatarClip = require('../defs/avatar-clip')
const render = require('./render')
const renderUpdate = require('./render-update')
const defaultConfig = require('./config')
const zoom = require('./zoom')

module.exports = {
  init
}

window.orgChart = {};

function init(options) {
  // Merge options with the default config
  const config = {
    ...defaultConfig,
    ...options,
    treeData: options.data
  }

  if (!config.id) {
    console.error('react-org-chart: missing id for svg root')
    return
  }

  const {
    id,
    treeData,
    lineType,
    margin,
    nodeWidth,
    directionVal,
    nodeHeight,
    nodeSpacing,
    shouldResize
  } = config

  // Calculate how many pixel nodes to be spaced based on the
  // type of line that needs to be rendered
  if (lineType == 'angle') {
    config.lineDepthY = nodeHeight + 40
  } else {
    config.lineDepthY = nodeHeight + 60
  }

  // Get the root element
  const elem = document.querySelector(id)

  if (!elem) {
    console.error(`react-org-chart: svg root DOM node not found (id: ${id})`)
    return
  }

  // Reset in case there's any existing DOM
  elem.innerHTML = ''

  const elemWidth = elem.offsetWidth
  const elemHeight = elem.offsetHeight

  let nodeSpace = null
  if (directionVal === '2' || directionVal === '4') {
    nodeSpace = [nodeHeight + nodeSpacing, nodeWidth + nodeSpacing]
  } else {
    nodeSpace = [nodeWidth + nodeSpacing, nodeHeight + nodeSpacing]
  }

  // Setup the d3 tree layout
  config.tree = d3.layout
    .tree()
    .nodeSize(nodeSpace)

  // Calculate width of a node with expanded children
  const childrenWidth = parseInt(treeData.children.length * nodeWidth / 2)

  // Add svg root for d3
  const svgroot = d3
    .select(id)
    .append('svg')
    .attr('width', elemWidth)
    .attr('height', elemHeight)

  // Add our base svg group to transform when a user zooms/pans
  const svg = svgroot
    .append('g')
    .attr(
      'transform',
      'translate(' +
        parseInt(elemWidth / 2  - config.nodeWidth/2) +
        ',' +
        20 +
        ')'
    )

  // Define box shadow and avatar border radius
  defineBoxShadow(svgroot, 'boxShadow')
  defineAvatarClip(svgroot, 'avatarClip', {
    borderRadius: 40
  })

  // Center the viewport on initial load
  treeData.x0 = 0
  treeData.y0 = elemHeight / 2

  // Collapse all of the children on initial load
  const collapseFiltered = function(node) {
    if(!options.initiallyExpanded || options.initiallyExpanded.indexOf(node.id) === -1) {
      collapse(node);
    }
    if(node.children) {
      node.children.forEach(collapseFiltered);
    }
  };
  treeData.children.forEach(collapseFiltered)

  // Connect core variables to config so that they can be
  // used in internal rendering functions
  config.svg = svg
  config.svgroot = svgroot
  config.render = render

  zoom.on('zoom', renderUpdate(config))
  // Defined zoom behavior
  // const zoom = d3.behavior
  //   .zoom()
  //   // Define the [zoomOutBound, zoomInBound]
  //   .scaleExtent([0.4, 2])
  //   .duration(50)
  //   .on('zoom', renderUpdate(config))

  // Attach zoom behavior to the svg root
  svgroot.call(zoom)
  .on("dblclick.zoom", null)
  // .on("wheel.zoom", null);

  // Define the point of origin for zoom transformations
  zoom.translate([
    parseInt(elemWidth / 2  - defaultConfig.nodeWidth/2),
    20
  ])

  // Add listener for when the browser or parent node resizes
  const resize = () => {
    if (!elem) {
      global.removeEventListener('resize', resize)
      return
    }

    svgroot.attr('width', elem.offsetWidth).attr('height', elem.offsetHeight)
  }

  if (shouldResize) {
    global.addEventListener('resize', resize)
  }

  // Start initial render
  render(config)


  const zoomed = () => {
    svg.attr("transform",
        "translate(" + zoom.translate() + ")" +
        "scale(" + zoom.scale() + ")"
    );
}

  const interpolateZoom = (translate, scale) => {
      var self = this;
      return d3.transition().duration(350).tween("zoom", function () {
          var iTranslate = d3.interpolate(zoom.translate(), translate),
              iScale = d3.interpolate(zoom.scale(), scale);
          return function (t) {
              zoom
                  .scale(iScale(t))
                  .translate(iTranslate(t));
              zoomed();
          };
      });
  }

  const zoomClick = (key) => {
      var clicked = window.d3 && window.d3.event && window.d3.event.target || null,
          direction = 1,
          factor = 0.2,
          target_zoom = 1,
          center = [elemWidth / 2, elemHeight / 2],
          extent = zoom.scaleExtent(),
          translate = zoom.translate(),
          translate0 = [],
          l = [],
          view = {x: translate[0], y: translate[1], k: zoom.scale()};

      window.d3 && window.d3.event && window.d3.event.preventDefault();
      direction = (key === 'zoom_in') ? 1 : -1;
      target_zoom = zoom.scale() * (1 + factor * direction);

      if (target_zoom < extent[0] || target_zoom > extent[1]) { return false; }

      translate0 = [(center[0] - view.x) / view.k, (center[1] - view.y) / view.k];
      view.k = target_zoom;
      l = [translate0[0] * view.k + view.x, translate0[1] * view.k + view.y];

      view.x += center[0] - l[0];
      view.y += center[1] - l[1];

      interpolateZoom([view.x, view.y], view.k);
  }


  // Update DOM root height
  d3.select(id).style('height', elemHeight + margin.top + margin.bottom)
  if (window.orgChart) {
    window.orgChart[id] =  { svgroot,
      config,
      zoom,
      resize,
      zoomClick
    }
  }
 
  
  return {
    svgroot,
    config,
    zoom,
    resize,
  };
}
