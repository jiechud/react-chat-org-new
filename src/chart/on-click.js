const d3 = require('d3')
const { collapse } = require('../utils')
const zoom = require('./zoom')
const defaultConfig = require('./config')
module.exports = {
  onMouseUp,
  onMouseDown,
  onClick,
  centerNode
};

let latestClick = {};

function onMouseDown() {
  latestClick = {
    x: d3.event.pageX,
    y: d3.event.pageY,
  }
}

function onMouseUp(config = {}) {
  const { treeData, loadChildren, render, onPersonClick } = config

  return datum => {
    // console.log('----ddd-d-dd', datum, d3.event)
    // console.log('onMouseUp', d3.event.pageX !== latestClick.x || d3.event.pageY !== latestClick.y);
    if(d3.event.pageX !== latestClick.x || d3.event.pageY !== latestClick.y) {
      return;
    }

    if (onPersonClick) {
      const result = onPersonClick(datum, d3.event)

      // If the `onPersonClick` handler returns `false`
      // Cancel the rest of this click handler
      if (typeof result === 'boolean' && !result) {
        return
      }
    }

    const c = d3.event.path.find(f => f.className === 'org-chat-item-collapse')
    // console.log('----c---', c);
    // if (!c) {
    //   return;
    // }
    // console.log('--debug--', 0);
    // If this person doesn't have children but `hasChild` is true,
    // attempt to load using the `loadChildren` config function
    if (!datum.children && !datum._children && datum.hasChild) {
      // console.log('--debug--', 1)
      if (!loadChildren) {
        console.error(
          'react-org-chart.onClick: loadChildren() not found in config'
        )
        // console.log('--debug--', 2)
        return
      }

      const result = loadChildren(datum)
      const handler = handleChildrenResult(config, datum)

      // Check if the result is a promise and render the children
      if (result.then) {
        // console.log('--debug--', 3)
        return result.then(handler)
      } else {
        // console.log('--debug--', 4)
        return handler(result)
      }
    }
    // console.log('--debug--', 5)
    if (datum.children) {
      // Collapse the children
      config.callerNode = datum
      config.callerMode = 0
      datum._children = datum.children
      datum.children = null
      datum.collapse = true;
    } else {
      // Expand the children
      config.callerNode = datum
      config.callerMode = 1
      datum.children = datum._children
      datum._children = null
      datum.collapse = false;
    }

    // Pass in the clicked datum as the sourceNode which
    // tells the child nodes where to animate in from
    render({
      ...config,
      sourceNode: datum
    })
    console.warn('-----mouse-up', config);
    centerNode(datum, config);
  }
}

function onClick(config = {}) {
  const { treeData, loadChildren, render, onPersonClick } = config

  return datum => {
    // console.log('onClick', onPersonClick, datum, loadChildren);
    // if(d3.event.pageX !== latestClick.x || d3.event.pageY !== latestClick.y) {
    //   return;
    // }

    if (onPersonClick) {
      const result = onPersonClick(datum, d3.event)

      // If the `onPersonClick` handler returns `false`
      // Cancel the rest of this click handler
      if (typeof result === 'boolean' && !result) {
        return
      }
    }
    console.log('--debug--', 0, !datum.children, !datum._children, datum.hasChild, datum._children)
    // If this person doesn't have children but `hasChild` is true,
    // attempt to load using the `loadChildren` config function
    if (!datum.children && !datum._children && datum.hasChild) {
      console.log('--debug--', 1)
      if (!loadChildren) {
        console.error(
          'react-org-chart.onClick: loadChildren() not found in config'
        )

        console.log('--debug--', 2)
        return
      }

      const result = loadChildren(datum)
      const handler = handleChildrenResult(config, datum)

      console.log('--debug--', 3)
      // Check if the result is a promise and render the children
      if (result.then) {
        return result.then(handler)
      } else {
        return handler(result)
      }
    }

    console.log('--debug--', 4)
    if (datum.children) {
      // Collapse the children
      config.callerNode = datum
      config.callerMode = 0
      datum._children = datum.children
      datum.children = null
    } else {
      // Expand the children
      config.callerNode = datum
      config.callerMode = 1
      datum.children = datum._children
      datum._children = null
    }

    // Pass in the clicked datum as the sourceNode which
    // tells the child nodes where to animate in from
    render({
      ...config,
      sourceNode: datum
    })
  }
}

function handleChildrenResult(config, datum) {
  const { tree, render } = config
  console.warn('tree', tree);
  return children => {
    const result = {
      ...datum,
      children
    }
    console.warn('result', result);

    // Collapse the nested children
    children.forEach(collapse)

    result.children.forEach(child => {
      if (!tree.nodes(datum)[0]._children) {
        tree.nodes(datum)[0]._children = []
      }

      child.x = datum.x
      child.y = datum.y
      child.x0 = datum.x0
      child.y0 = datum.y0

      tree.nodes(datum)[0]._children.push(child)
    })

    if (datum.children) {
      // Collapse the children
      config.callerNode = datum
      config.callerMode = 0
      datum._children = datum.children
      datum.children = null
      datum.collapse = true;
    } else {
      // Expand the children
      config.callerNode = null
      config.callerMode = 1
      datum.children = datum._children
      datum._children = null
      datum.collapse = false;
    }

    // Pass in the newly rendered datum as the sourceNode
    // which tells the child nodes where to animate in from
    render({
      ...config,
      sourceNode: result
    })
  }
}

// 点击收起或展开时 调整更合适的位置
function centerNode(source, config) { 
  if (!config) return;
    

  var viewerWidth = document.querySelector(config.id).clientWidth;
  var viewerHeight = document.querySelector(config.id).clientHeight;
  console.warn('-----------con', config, viewerWidth, viewerHeight);
  let scale = zoom.scale();
  let x = -source.x0;
  let y = -source.y0;
  x = x * scale + viewerWidth / 2 - defaultConfig.nodeWidth/2;
  y = y * scale + viewerHeight *2/ 5 - defaultConfig.nodeHeight/2;
  d3.select('g')
    .transition()
    .duration(167)
    .attr("transform", "translate(" + x + "," + y + ")scale(" + scale + ")");
  zoom.scale(scale);
  zoom.translate([x, y]);
}
