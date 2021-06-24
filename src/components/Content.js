import React from "react";
import * as go from "gojs";
import { ReactDiagram } from "gojs-react";

// https://gojs.net/latest/samples/fdLayout.html
function FDLayout() {
  go.ForceDirectedLayout.call(this);
}

go.Diagram.inherit(FDLayout, go.ForceDirectedLayout);

FDLayout.prototype.makeNetwork = function (coll) {
  let net = go.ForceDirectedLayout.prototype.makeNetwork.call(this, coll);

  net.vertexes.each(function (vertex) {
    let node = vertex.node;
    if (node !== null) vertex.isFixed = node.isSelected;
  });

  return net;
};

function initDiagram(isDirected) {
  const $ = go.GraphObject.make;

  const diagram = $(go.Diagram, {
    "undoManager.isEnabled": true,
    autoScale: go.Diagram.Uniform, // Zoom to make everything fit in the viewport.
    layout: $(go.CircularLayout),
    model: $(go.GraphLinksModel, {
      linkKeyProperty: "key",
    }),
  });

  var lay = diagram.layout;

  var spacing = 200;
  spacing = parseFloat(spacing, 200);
  lay.spacing = spacing;

  lay = go.CircularLayout.ConstantSpacing;

  diagram.nodeTemplate = $(
    go.Node,
    "Auto", // the Shape will go around the TextBlock
    new go.Binding(),
    $(
      go.Shape,
      "Circle",
      { name: "SHAPE", fill: "white", strokeWidth: 1, portId: "", },
      // Shape.fill is bound to Node.data.color
      new go.Binding("fill", "color")
    ),
    $(
      go.TextBlock,
      { margin: 10, editable: false, font: "26px Verdana" },
      new go.Binding("text").makeTwoWay()
    )
  );

  diagram.linkTemplate = $(
    go.Link,
    { curve: go.Link.Bezier },
    $(go.Shape, { stroke: "gray" }),
    $(go.Shape, { toArrow: isDirected ? "Standard" : "", stroke: "gray" }),
    $(go.Panel, "Auto",  // this whole Panel is a link label
      $(go.TextBlock, { font: "24px Verdana", margin: 3 },
        new go.Binding("text", "text"))
    )
  );

  return diagram;
}

const Content = ({ data, linksData, isDirected }) => {

  return (
    <div className="content">
      <ReactDiagram
        initDiagram={() => initDiagram(isDirected)}
        divClassName={data.length > 15 ? "diagram-xl-component" : "diagram-component"}
        linkDataArray={linksData}
        nodeDataArray = {data}
      />
    </div>
  );
};

export default Content;
