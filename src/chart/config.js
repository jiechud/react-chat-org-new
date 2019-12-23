const directionVal = '4' //'1'：向下， '2':向右， '3':向上， '4'：向左

const animationDuration = 350
const shouldResize = true

// Nodes
const nodeWidth = 240
const nodeHeight = 120
const nodeSpacing = 12
const nodePaddingX = 16
const nodePaddingY = 16
const avatarWidth = 40
const nodeBorderRadius = 4
const margin = {
  top: 20,
  right: 20,
  bottom: 20,
  left: 60
}

// Lines
const lineType = 'angle'
const lineDepthY = 120 /* Height of the line for child nodes */
const lineDepthX = 300

// Colors
const backgroundColor = '#fff'
const borderColor = '#666'
const lineColor = '#e6e8e9'
const nameColor = '#222d38'
const titleColor = '#617080'
const reportsColor = '#92A0AD'

const config = {
  directionVal,
  margin,
  animationDuration,
  nodeWidth,
  nodeHeight,
  nodeSpacing,
  nodePaddingX,
  nodePaddingY,
  nodeBorderRadius,
  avatarWidth,
  lineType,
  lineDepthY,
  lineDepthX,
  backgroundColor,
  borderColor,
  nameColor,
  titleColor,
  reportsColor,
  shouldResize
}

module.exports = config
