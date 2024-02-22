var margin = {
    top: 20,
    right: 120,
    bottom: 20,
    left: 120,
  },
  width = 960 - margin.right - margin.left,
  height = 800 - margin.top - margin.bottom;

var root = {
  name: "Emma",
  children: [
    {
      name: "Sophia",
      children: [
        {
          name: "Liam",
          children: [
            {
              name: "Benjamin",
              size: 3938,
            },
            {
              name: "Isabella",
              size: 743,
            },
          ],
        },
      ],
    },
    {
      name: "Michael",
    },
    {
      name: "David",
      children: [
        {
          name: "Elizabeth",
          size: 1759,
        },
        {
          name: "Sophia",
          size: 1759,
        },
        {
          name: "Emma",
          size: 2165,
        },
        {
          name: "Olivia",
          size: 586,
        },
      ],
    },
    {
      name: "William",
      children: [
        {
          name: "Nora",
          size: 8833,
        },
        {
          name: "Hazel",
          size: 1732,
        },
        {
          name: "Penelope",
          size: 3623,
        },
        {
          name: "Chloe",
          size: 10066,
        },
      ],
    },
    {
      name: "Isabella",
      children: [
        {
          name: "Chloe",
          size: 2105,
        },
        {
          name: "Lily",
          size: 1316,
        },
        {
          name: "Layla",
          size: 3151,
        },
      ],
    },
    {
      name: "James",
      children: [
        {
          name: "Aria",
          size: 8258,
        },
        {
          name: "Scarlett",
          size: 10001,
        },
        {
          name: "Nora",
          size: 8217,
        },
      ],
    },
    {
      name: "Oliver",
      children: [
        {
          name: "Michael",
          size: 17705,
        },
        {
          name: "David",
          size: 1486,
        },
        {
          name: "Ethan",
          size: 2324,
        },
        {
          name: "Benjamin",
          size: 8217,
        },
      
      ],
    },
  ],
};

var i = 0,
  duration = 750,
  rectW = 60,
  rectH = 30;

var tree = d3.layout.tree().nodeSize([70, 40]);
var diagonal = d3.svg.diagonal().projection(function (d) {
  return [d.x + rectW / 2, d.y + rectH / 2];
});

var svg = d3
  .select("#body")
  .append("svg")
  .attr("width", 1000)
  .attr("height", 1000)
  .call((zm = d3.behavior.zoom().scaleExtent([1, 3]).on("zoom", redraw)))
  .append("g")
  .attr("transform", "translate(" + 350 + "," + 20 + ")");

zm.translate([350, 20]);

root.x0 = 0;
root.y0 = height / 2;

function collapse(d) {
  if (d.children) {
    d._children = d.children;
    d._children.forEach(collapse);
    d.children = null;
  }
}

root.children.forEach(collapse);
update(root);

d3.select("#body").style("height", "800px");

function update(source) {
  var nodes = tree.nodes(root).reverse(),
    links = tree.links(nodes);

  nodes.forEach(function (d) {
    d.y = d.depth * 180;
  });

  var node = svg.selectAll("g.node").data(nodes, function (d) {
    return d.id || (d.id = ++i);
  });

  var nodeEnter = node
  .enter()
  .append("g")
  .attr("class", "node")
  .attr("transform", function (d) {
    return "translate(" + source.x0 + "," + source.y0 + ")";
  })
  .on("click", click);

  nodeEnter
  .append("rect")
  .attr("width", rectW)
  .attr("height", rectH)
  .attr("stroke", "black")
  .attr("stroke-width", 1)
  .style("fill", function (d) {
    return d._children ? "red" : "#fff"; 
  });


  nodeEnter
    .append("text")
    .attr("x", rectW / 2)
    .attr("y", rectH / 2)
    .attr("dy", ".35em")
    .attr("text-anchor", "middle")
    .text(function (d) {
      return d.name;
    });

    var nodeUpdate = node
    .transition()
    .duration(duration)
    .attr("transform", function (d) {
      return "translate(" + d.x + "," + d.y + ")";
    });

    nodeUpdate
    .select("rect")
    .attr("width", rectW)
    .attr("height", rectH)
    .attr("stroke", "black")
    .attr("stroke-width", 1)
    .style("fill", function (d) {
      return d._children ? "red" : "#fff"; 
    });

  nodeUpdate.select("text").style("fill-opacity", 1);

  var nodeExit = node
    .exit()
    .transition()
    .duration(duration)
    .attr("transform", function (d) {
      return "translate(" + source.x + "," + source.y + ")";
    })
    .remove();

  nodeExit
    .select("rect")
    .attr("width", rectW)
    .attr("height", rectH)
    .attr("stroke", "black")
    .attr("stroke-width", 1);

  nodeExit.select("text");

  var link = svg.selectAll("path.link").data(links, function (d) {
    return d.target.id;
  });

  link
    .enter()
    .insert("path", "g")
    .attr("class", "link")
    .attr("x", rectW / 2)
    .attr("y", rectH / 2)
    .attr("d", function (d) {
      var o = {
        x: source.x0,
        y: source.y0,
      };
      return diagonal({
        source: o,
        target: o,
      });
    });

  link.transition().duration(duration).attr("d", diagonal);

  link
    .exit()
    .transition()
    .duration(duration)
    .attr("d", function (d) {
      var o = {
        x: source.x,
        y: source.y,
      };
      return diagonal({
        source: o,
        target: o,
      });
    })
    .remove();

  nodes.forEach(function (d) {
    d.x0 = d.x;
    d.y0 = d.y;
  });
}

function click(d) {
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }
  update(d);
}

function redraw() {
  svg.attr(
    "transform",
    "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")"
  );
}
