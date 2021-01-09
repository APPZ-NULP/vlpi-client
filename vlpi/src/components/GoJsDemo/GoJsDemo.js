import React, { Component } from 'react';
import Routers from './routers'
import {createMuiTheme, ThemeProvider} from "@material-ui/core/styles";
import './GoJsDemo.css';
import * as go from 'gojs';
import { ReactDiagram, ReactPalette} from 'gojs-react';


const $ = go.GraphObject.make;
var palette;
var diagram;
/**
 * Diagram initialization method, which is passed to the ReactDiagram component.
 * This method is responsible for making the diagram and initializing the model and any templates.
 * The model's data should not be set here, as the ReactDiagram component handles that via the other props.
 */
function makePort(name, align, spot, output, input) {
    var horizontal = align.equals(go.Spot.Top) || align.equals(go.Spot.Bottom);
    // the port is basically just a transparent rectangle that stretches along the side of the node,
    // and becomes colored when the mouse passes over it
    return $(go.Shape,
        {
            fill: "transparent",  // changed to a color in the mouseEnter event handler
            strokeWidth: 0,  // no stroke
            width: horizontal ? NaN : 8,  // if not stretching horizontally, just 8 wide
            height: !horizontal ? NaN : 8,  // if not stretching vertically, just 8 tall
            alignment: align,  // align the port on the main Shape
            stretch: (horizontal ? go.GraphObject.Horizontal : go.GraphObject.Vertical),
            portId: name,  // declare this object to be a "port"
            fromSpot: spot,  // declare where links may connect at this port
            fromLinkable: output,  // declare whether the user may draw links from here
            toSpot: spot,  // declare where links may connect at this port
            toLinkable: input,  // declare whether the user may draw links to here
            cursor: "pointer",  // show a different cursor to indicate potential link point
            mouseEnter: function (e, port) {  // the PORT argument will be this Shape
                if (!e.diagram.isReadOnly) port.fill = "rgba(255,0,255,0.5)";
            },
            mouseLeave: function (e, port) {
                port.fill = "transparent";
            }
        });
}

function textStyle() {
    return {
        font: "bold 11pt Lato, Helvetica, Arial, sans-serif",
        stroke: "#F8F8F8"
    }
}

function nodeStyle() {
    return [
        // The Node.location comes from the "loc" property of the node data,
        // converted by the Point.parse static method.
        // If the Node.location is changed, it updates the "loc" property of the node data,
        // converting back using the Point.stringify static method.
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
        {
            // the Node.location is at the center of each node
            locationSpot: go.Spot.Center
        }
    ];
}

function showLinkLabel(e) {
    var label = e.subject.findObject("LABEL");
    if (label !== null) label.visible = (e.subject.fromNode.data.category === "Conditional");
}

function initDiagram() {

    diagram =
        $(go.Diagram,
            {
                'undoManager.isEnabled': true,
                'clickCreatingTool.archetypeNodeData': { text: 'new node', color: 'lightblue' },
                "LinkDrawn": showLinkLabel,  // this DiagramEvent listener is defined below
                "LinkRelinked": showLinkLabel,
                model: $(go.GraphLinksModel,
                    {
                        linkKeyProperty: 'key'
                    })
            });
    diagram.scrollMode = go.Diagram.DocumentScroll;


    diagram.nodeTemplateMap.add("",  // the default category
        $(go.Node, "Table", nodeStyle(),
            // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
            { locationObjectName: "TB", locationSpot: go.Spot.Center },
            $(go.Panel, "Auto",
                $(go.Shape, "Rectangle",
                    { fill: "#282c34", stroke: "#00A9C9", strokeWidth: 3.5 },
                    new go.Binding("figure", "figure")),
                $(go.TextBlock, textStyle(),
                    {
                        margin: 8,
                        maxSize: new go.Size(160, NaN),
                        wrap: go.TextBlock.WrapFit,
                        editable: true
                    },
                    new go.Binding("text").makeTwoWay())
            ),
            // four named ports, one on each side:
            makePort("T", go.Spot.Top, go.Spot.TopSide, false, true),
            makePort("L", go.Spot.Left, go.Spot.LeftSide, true, true),
            makePort("R", go.Spot.Right, go.Spot.RightSide, true, true),
            makePort("B", go.Spot.Bottom, go.Spot.BottomSide, true, false)
        ));

    diagram.nodeTemplateMap.add("Conditional",
        $(go.Node, "Table", nodeStyle(),
            // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
            { locationObjectName: "TB", locationSpot: go.Spot.Center },
            $(go.Panel, "Auto",
                $(go.Shape, "Diamond",
                    { fill: "#282c34", stroke: "#00A9C9", strokeWidth: 3.5 },
                    new go.Binding("figure", "figure")),
                $(go.TextBlock, textStyle(),
                    {
                        margin: 8,
                        maxSize: new go.Size(160, NaN),
                        wrap: go.TextBlock.WrapFit,
                        editable: true
                    },
                    new go.Binding("text").makeTwoWay())
            ),
            // four named ports, one on each side:
            makePort("T", go.Spot.Top, go.Spot.Top, false, true),
            makePort("L", go.Spot.Left, go.Spot.Left, true, true),
            makePort("R", go.Spot.Right, go.Spot.Right, true, true),
            makePort("B", go.Spot.Bottom, go.Spot.Bottom, true, false)
        ));

    diagram.nodeTemplateMap.add("Start",
        $(go.Node, "Table", nodeStyle(),
            $(go.Panel, "Spot",
                $(go.Shape, "Circle",
                    { desiredSize: new go.Size(70, 70), fill: "#282c34", stroke: "#09d3ac", strokeWidth: 3.5 }),
                $(go.TextBlock, "Start", textStyle(),
                    new go.Binding("text"))
            ),
            // three named ports, one on each side except the top, all output only:
            makePort("L", go.Spot.Left, go.Spot.Left, true, false),
            makePort("R", go.Spot.Right, go.Spot.Right, true, false),
            makePort("B", go.Spot.Bottom, go.Spot.Bottom, true, false)
        ));

    diagram.nodeTemplateMap.add("End",
        $(go.Node, "Table", nodeStyle(),
            $(go.Panel, "Spot",
                $(go.Shape, "Circle",
                    { desiredSize: new go.Size(60, 60), fill: "#282c34", stroke: "#DC3C00", strokeWidth: 3.5 }),
                $(go.TextBlock, "End", textStyle(),
                    new go.Binding("text"))
            ),
            // three named ports, one on each side except the bottom, all input only:
            makePort("T", go.Spot.Top, go.Spot.Top, false, true),
            makePort("L", go.Spot.Left, go.Spot.Left, false, true),
            makePort("R", go.Spot.Right, go.Spot.Right, false, true)
        ));

    go.Shape.defineFigureGenerator("File", function (shape, w, h) {
        var geo = new go.Geometry();
        var fig = new go.PathFigure(0, 0, true); // starting point
        geo.add(fig);
        fig.add(new go.PathSegment(go.PathSegment.Line, .75 * w, 0));
        fig.add(new go.PathSegment(go.PathSegment.Line, w, .25 * h));
        fig.add(new go.PathSegment(go.PathSegment.Line, w, h));
        fig.add(new go.PathSegment(go.PathSegment.Line, 0, h).close());
        var fig2 = new go.PathFigure(.75 * w, 0, false);
        geo.add(fig2);
        // The Fold
        fig2.add(new go.PathSegment(go.PathSegment.Line, .75 * w, .25 * h));
        fig2.add(new go.PathSegment(go.PathSegment.Line, w, .25 * h));
        geo.spot1 = new go.Spot(0, .25);
        geo.spot2 = go.Spot.BottomRight;
        return geo;
    });

    diagram.nodeTemplateMap.add("Comment",
        $(go.Node, "Auto", nodeStyle(),
            $(go.Shape, "File",
                { fill: "#282c34", stroke: "#DEE0A3", strokeWidth: 3 }),

            $(go.TextBlock, textStyle(),
                {
                    margin: 8,
                    maxSize: new go.Size(200, NaN),
                    wrap: go.TextBlock.WrapFit,
                    textAlign: "center",
                    editable: true
                },
                new go.Binding("text").makeTwoWay()),

            // no ports, because no links are allowed to connect with a comment
        ));



    // replace the default Link template in the linkTemplateMap
    diagram.linkTemplate =
        $(go.Link,  // the whole link panel
            {
                routing: go.Link.AvoidsNodes,
                curve: go.Link.JumpOver,
                corner: 5, toShortLength: 4,
                relinkableFrom: true,
                relinkableTo: true,
                reshapable: true,
                resegmentable: true,
                // mouse-overs subtly highlight links:
                mouseEnter: function (e, link) { link.findObject("HIGHLIGHT").stroke = "rgba(30,144,255,0.2)"; },
                mouseLeave: function (e, link) { link.findObject("HIGHLIGHT").stroke = "transparent"; },
                selectionAdorned: false
            },
            new go.Binding("points").makeTwoWay(),
            $(go.Shape,  // the highlight shape, normally transparent
                { isPanelMain: true, strokeWidth: 8, stroke: "transparent", name: "HIGHLIGHT" }),
            $(go.Shape,  // the link path shape
                { isPanelMain: true, stroke: "gray", strokeWidth: 2 },
                new go.Binding("stroke", "isSelected", function (sel) { return sel ? "dodgerblue" : "gray"; }).ofObject()),
            $(go.Shape,  // the arrowhead
                { toArrow: "standard", strokeWidth: 0, fill: "gray" }),
            $(go.Panel, "Auto",  // the link label, normally not visible
                { visible: false, name: "LABEL", segmentIndex: 2, segmentFraction: 0.5 },
                new go.Binding("visible", "visible").makeTwoWay(),
                $(go.Shape, "RoundedRectangle",  // the label shape
                    { fill: "#F8F8F8", strokeWidth: 0 }),
                $(go.TextBlock, "Yes",  // the label
                    {
                        textAlign: "center",
                        font: "10pt helvetica, arial, sans-serif",
                        stroke: "#333333",
                        editable: true
                    },
                    new go.Binding("text").makeTwoWay())
            )
        );



    // temporary links used by LinkingTool and RelinkingTool are also orthogonal:
    diagram.toolManager.linkingTool.temporaryLink.routing = go.Link.Orthogonal;
    diagram.toolManager.relinkingTool.temporaryLink.routing = go.Link.Orthogonal;

    return diagram;
}

function initPalette() {
    palette =
        $(go.Palette,   // must name or refer to the DIV HTML element
            {
                // Instead of the default animation, use a custom fade-down
                "animationManager.initialAnimationStyle": go.AnimationManager.None,
                "InitialAnimationStarting": animateFadeDown, // Instead, animate with this function

                nodeTemplateMap: diagram.nodeTemplateMap,  // share the templates used by diagram
                model: new go.GraphLinksModel([  // specify the contents of the Palette
                    { category: "Start", text: "Start" },
                    { text: "Step" },
                    { category: "Conditional", text: "???" },
                    { category: "End", text: "End" },
                    { category: "Comment", text: "Comment" }
                ]),
                allowHorizontalScroll: false,
                allowVerticalScroll: false
            });
    palette.contentAlignment = go.Spot.Center;
    return palette;
}

// This is a re-implementation of the default animation, except it fades in from downwards, instead of upwards.
function animateFadeDown(e) {
    var diagram = e.diagram;
    var animation = new go.Animation();
    animation.isViewportUnconstrained = true; // So Diagram positioning rules let the animation start off-screen
    animation.easing = go.Animation.EaseOutExpo;
    animation.duration = 900;
    // Fade "down", in other words, fade in from above
    animation.add(diagram, 'position', diagram.position.copy().offset(0, 200), diagram.position);
    animation.add(diagram, 'opacity', 0, 1);
    animation.start();
}


function handleModelChange(data) {
    const insertedNodeKeys = data.insertedNodeKeys;
    const modifiedNodeData = data.modifiedNodeData;
    const removedNodeKeys = data.removedNodeKeys;
    const insertedLinkKeys = data.insertedLinkKeys;
    const modifiedLinkData = data.modifiedLinkData;
    const removedLinkKeys = data.removedLinkKeys;

    // ... make state changes
}

class GoJsDemo extends Component {
    render() {
        return (
            <div id="main" >
                <ReactDiagram
                    initDiagram={initDiagram}
                    divClassName='myDiagramDiv'
                    nodeDataArray={[
                        { "category": "Comment", "loc": "360 -10", "text": "Kookie Brittle", "key": -13 },
                        { "key": -1, "category": "Start", "loc": "175 0", "text": "Start" },
                        { "key": 0, "loc": "-5 75", "text": "Preheat oven to 375 F" },
                        { "key": 1, "loc": "175 100", "text": "In a bowl, blend: 1 cup margarine, 1.5 teaspoon vanilla, 1 teaspoon salt" },
                        { "key": 2, "loc": "175 200", "text": "Gradually beat in 1 cup sugar and 2 cups sifted flour" },
                        { "key": 3, "loc": "175 290", "text": "Mix in 6 oz (1 cup) Nestle's Semi-Sweet Chocolate Morsels" },
                        { "key": 4, "loc": "175 380", "text": "Press evenly into ungreased 15x10x1 pan" },
                        { "key": 5, "loc": "355 85", "text": "Finely chop 1/2 cup of your choice of nuts" },
                        { "key": 6, "loc": "175 450", "text": "Sprinkle nuts on top" },
                        { "key": 7, "loc": "175 515", "text": "Bake for 25 minutes and let cool" },
                        { "key": 8, "loc": "175 585", "text": "Cut into rectangular grid" },
                        { "key": -2, "category": "End", "loc": "175 660", "text": "Enjoy!" }
                    ]}
                    linkDataArray={[
                        { "from": 1, "to": 2, "fromPort": "B", "toPort": "T" },
                        { "from": 2, "to": 3, "fromPort": "B", "toPort": "T" },
                        { "from": 3, "to": 4, "fromPort": "B", "toPort": "T" },
                        { "from": 4, "to": 6, "fromPort": "B", "toPort": "T" },
                        { "from": 6, "to": 7, "fromPort": "B", "toPort": "T" },
                        { "from": 7, "to": 8, "fromPort": "B", "toPort": "T" },
                        { "from": 8, "to": -2, "fromPort": "B", "toPort": "T" },
                        { "from": -1, "to": 0, "fromPort": "B", "toPort": "T" },
                        { "from": -1, "to": 1, "fromPort": "B", "toPort": "T" },
                        { "from": -1, "to": 5, "fromPort": "B", "toPort": "T" },
                        { "from": 5, "to": 4, "fromPort": "B", "toPort": "T" },
                        { "from": 0, "to": 4, "fromPort": "B", "toPort": "T" }
                    ]}
                    onModelChange={handleModelChange}
                />
                <ReactPalette
                    initPalette={initPalette}
                    divClassName='myPaletteDiv'
                />
            </div>
        );
    }
}

export default GoJsDemo;