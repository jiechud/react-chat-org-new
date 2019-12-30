const d3 = require('d3')

module.exports = renderLines
function renderLines(config = {}) {
  const {
    svg,
    links,
    margin,
    nodeWidth,
    nodeHeight,
    lineDepthY,
    lineDepthX,
    borderColor,
    sourceNode,
    treeData,
    lineType,
    directionVal,
    animationDuration
  } = config

  const parentNode = sourceNode || treeData

  // Select all the links to render the lines
  const link = svg
    .selectAll('path.link')
    .data(links.filter(link => link.source.id), d => d.target.id)

  // Define the curved line function
  const curve = d3.svg
    .diagonal()
    .projection(d => {
      if (directionVal === '1' || directionVal === '3') {
       return [d.x + nodeWidth / 2, d.y + nodeHeight / 2]
      } else {
        return [d.x + nodeHeight / 2, d.y + nodeWidth / 2]
      }
    })
    // .projection(d => [d.y + nodeHeight / 2, (d.x + nodeWidth / 2) / 180 * Math.PI])

  // Define the angled line function
  const angle = d3.svg
    .line()
    .x(d => d.x)
    .y(d => d.y)
    .interpolate('linear')
  if (lineType === 'angle') {
    // Enter any new links at the parent's previous position.
    link
      .enter()
      .insert('path', 'g')
      .attr('class', 'link')
      .attr('fill', 'none')
      .attr('stroke', borderColor)
      .attr('stroke-opacity', 0.5)
      .attr('stroke-width', 1.25)
      .attr('d', d => {
        const linePoints = [
          {
            x: d.source.x0 + parseInt(nodeWidth / 2),
            y: d.source.y0 + nodeHeight + 2
          },
          {
            x: d.source.x0 + parseInt(nodeWidth / 2),
            y: d.source.y0 + nodeHeight + 2
          },
          {
            x: d.source.x0 + parseInt(nodeWidth / 2),
            y: d.source.y0 + nodeHeight + 2
          },
          {
            x: d.source.x0 + parseInt(nodeWidth / 2),
            y: d.source.y0 + nodeHeight + 2
          }
        ]
        return angle(linePoints)
      })

    // Transition links to their new position.
    link
      .transition()
      .duration(animationDuration)
      .attr('d', d => {
        // 增加的
        let linePoints
        switch (directionVal)  {
          case '1':
            linePoints = [
              {
                x: d.source.x + parseInt(nodeWidth / 2),
                y: d.source.y + nodeHeight
              },
              {
                x: d.source.x + parseInt(nodeWidth / 2),
                y: d.target.y - margin.top
              },
              {
                x: d.target.x + parseInt(nodeWidth / 2),
                y: d.target.y - margin.top
              },
              {
                x: d.target.x + parseInt(nodeWidth / 2),
                y: d.target.y
              }
            ]
            break
          case '2': 
            linePoints = [
              {
                x: d.source.x + nodeWidth,
                y: d.source.y + nodeHeight / 2
              },
              {
                x: d.source.x + nodeWidth + margin.left,
                y: d.source.y + nodeHeight / 2
              },
              {
                x: d.target.x - margin.left,
                y: d.target.y + nodeHeight / 2
              },
              {
                x: d.target.x,
                y: d.target.y + nodeHeight / 2
              }
            ]
            break
          case '3': 
            linePoints = [
              {
                x: d.source.x + parseInt(nodeWidth / 2),
                y: d.source.y
              },
              {
                x: d.source.x + parseInt(nodeWidth / 2),
                y: d.source.y - margin.top
              },
              {
                x: d.target.x + parseInt(nodeWidth / 2),
                y: d.source.y - margin.top
              },
              {
                x: d.target.x + parseInt(nodeWidth / 2),
                y: d.target.y
              }
            ]
            break
          case '4': 
            linePoints = [
              {
                x: d.source.x,
                y: d.source.y + nodeHeight / 2
              },
              {
                x: d.target.x + nodeWidth + margin.right,
                y: d.source.y + nodeHeight / 2
              },
              {
                x: d.target.x + nodeWidth + margin.right,
                y: d.target.y + nodeHeight / 2
              },
              {
                x: d.target.x,
                y: d.target.y + nodeHeight / 2
              }
            ]
            break
        }

        return angle(linePoints)
      })

    // Animate the existing links to the parent's new position
    link
      .exit()
      .transition()
      .duration(animationDuration)
      .attr('d', d => {
        // 增加的
        let linePoints
        switch (directionVal)  {
          case '1':
            linePoints = [
              {
                x: config.callerNode.x + parseInt(nodeWidth / 2),
                y: config.callerNode.y + nodeHeight + 2
              },
              {
                x: config.callerNode.x + parseInt(nodeWidth / 2),
                y: config.callerNode.y + nodeHeight + 2
              },
              {
                x: config.callerNode.x + parseInt(nodeWidth / 2),
                y: config.callerNode.y + nodeHeight + 2
              },
              {
                x: config.callerNode.x + parseInt(nodeWidth / 2),
                y: config.callerNode.y + nodeHeight + 2
              }
            ]
            break
          case '2': 
            linePoints = [
              {
                x: config.callerNode.x + nodeWidth,
                y: config.callerNode.y + nodeHeight / 2
              },
              {
                x: config.callerNode.x + nodeWidth,
                y: config.callerNode.y + nodeHeight / 2
              },
              {
                x: config.callerNode.x + nodeWidth,
                y: config.callerNode.y + nodeHeight / 2
              },
              {
                x: config.callerNode.x + nodeWidth,
                y: config.callerNode.y + nodeHeight / 2
              }
            ]
            break
          case '3': 
            linePoints = [
              {
                x: config.callerNode.x + nodeWidth / 2 ,
                y: config.callerNode.y
              },
              {
                x: config.callerNode.x + nodeWidth / 2 ,
                y: config.callerNode.y
              },
              {
                x: config.callerNode.x + nodeWidth / 2 ,
                y: config.callerNode.y
              },
              {
                x: config.callerNode.x + nodeWidth / 2 ,
                y: config.callerNode.y
              }
            ]
            break
          case '4': 
            linePoints = [
              {
                x: config.callerNode.x ,
                y: config.callerNode.y + nodeHeight / 2
              },
              {
                x: config.callerNode.x ,
                y: config.callerNode.y + nodeHeight / 2
              },
              {
                x: config.callerNode.x ,
                y: config.callerNode.y + nodeHeight / 2
              },
              {
                x: config.callerNode.x ,
                y: config.callerNode.y + nodeHeight / 2
              }
            ]
            break
        }
        // const linePoints = [
        //   {
        //     x: config.callerNode.x + parseInt(nodeWidth / 2),
        //     y: config.callerNode.y + nodeHeight + 2
        //   },
        //   {
        //     x: config.callerNode.x + parseInt(nodeWidth / 2),
        //     y: config.callerNode.y + nodeHeight + 2
        //   },
        //   {
        //     x: config.callerNode.x + parseInt(nodeWidth / 2),
        //     y: config.callerNode.y + nodeHeight + 2
        //   },
        //   {
        //     x: config.callerNode.x + parseInt(nodeWidth / 2),
        //     y: config.callerNode.y + nodeHeight + 2
        //   }
        // ]

        return angle(linePoints)
      })
      .each('end', () => {
        config.callerNode = null
      })
  } else if (lineType === 'curve') {
    link
      .enter()
      .insert('path', 'g')
      .attr('class', 'link')
      .attr('stroke', borderColor)
      .attr('fill', 'none')
      .attr('x', nodeWidth / 2)
      .attr('y', nodeHeight / 2)
      .attr('d', d => {
        const source = {
          x: parentNode.x0,
          y: parentNode.y0
        }

        return curve({
          source,
          target: source
        })
      })

    // Transition links to their new position.
    link
      .transition()
      .duration(animationDuration)
      .attr('d', curve)

    // Transition exiting nodes to the parent's new position.
    link
      .exit()
      .transition()
      .duration(animationDuration)
      .attr('d', function(d) {
        const source = {
          x: parentNode.x,
          y: parentNode.y
        }
        return curve({
          source,
          target: source
        })
      })
      .remove()
  }
}
