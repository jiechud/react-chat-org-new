const d3 = require('d3')

const zoom = d3.behavior
.zoom()
// Define the [zoomOutBound, zoomInBound]
.scaleExtent([0.2, 4])
.duration(50)

module.exports = zoom
