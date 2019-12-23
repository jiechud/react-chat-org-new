const d3 = require('d3')

module.exports = renderUpdate

// Update the rendered node positions triggered by zoom
function renderUpdate({ svg }) {
  console.warn('d3-event', d3.event);
  return () => {
    svg.attr(
      'transform',
      `translate(${d3.event.translate})
     scale(${d3.event.scale.toFixed(1)})`
    )
  }
}
