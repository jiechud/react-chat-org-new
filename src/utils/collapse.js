module.exports = function collapseNode(node) {
  // console.log('--node---', node);
  // Check if this node has children
  if (node.children) {
    node._children = node.children
    node._children.forEach(collapseNode)
    node.children = null
    node.collapse = true;
  }
}
