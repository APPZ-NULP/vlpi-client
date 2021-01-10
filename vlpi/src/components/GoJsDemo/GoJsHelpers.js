import * as go from 'gojs';

const $ = go.GraphObject.make;

export function makePort(name, align, spot, output, input) {
    var horizontal = align.equals(go.Spot.Top) || align.equals(go.Spot.Bottom);
    // the port is basically just a transparent rectangle that stretches along the side of the node,
    // and becomes colored when the mouse passes over it
    return $(go.Shape, {
        fill: 'transparent', // changed to a color in the mouseEnter event handler
        strokeWidth: 0, // no stroke
        width: horizontal ? NaN : 8, // if not stretching horizontally, just 8 wide
        height: !horizontal ? NaN : 8, // if not stretching vertically, just 8 tall
        alignment: align, // align the port on the main Shape
        stretch: horizontal ? go.GraphObject.Horizontal : go.GraphObject.Vertical,
        portId: name, // declare this object to be a "port"
        fromSpot: spot, // declare where links may connect at this port
        fromLinkable: output, // declare whether the user may draw links from here
        toSpot: spot, // declare where links may connect at this port
        toLinkable: input, // declare whether the user may draw links to here
        cursor: 'pointer', // show a different cursor to indicate potential link point
        mouseEnter: function(e, port) {
            // the PORT argument will be this Shape
            if (!e.diagram.isReadOnly) port.fill = 'rgba(255,0,255,0.5)';
        },
        mouseLeave: function(e, port) {
            port.fill = 'transparent';
        }
    });
}

export function textStyle() {
    return {
        font: 'bold 11pt Lato, Helvetica, Arial, sans-serif',
        stroke: '#F8F8F8'
    };
}

export function nodeStyle() {
    return [
        // The Node.location comes from the "loc" property of the node data,
        // converted by the Point.parse static method.
        // If the Node.location is changed, it updates the "loc" property of the node data,
        // converting back using the Point.stringify static method.
        new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
        {
            // the Node.location is at the center of each node
            locationSpot: go.Spot.Center
        }
    ];
}

export function showLinkLabel(e) {
    var label = e.subject.findObject('LABEL');
    if (label !== null) label.visible = e.subject.fromNode.data.category === 'Conditional';
}

export function convertIsTreeLink(r) {
    return r === 'generalization';
}

export function convertFromArrow(r) {
    switch (r) {
        case 'generalization':
            return '';
        default:
            return '';
    }
}

export function convertToArrow(r) {
    switch (r) {
        case 'generalization':
            return 'Triangle';
        case 'aggregation':
            return 'StretchedDiamond';
        default:
            return '';
    }
}

export function convertVisibility(v) {
    switch (v) {
        case 'public':
            return '+';
        case 'private':
            return '-';
        case 'protected':
            return '#';
        case 'package':
            return '~';
        default:
            return v;
    }
}

// This is a re-implementation of the default animation, except it fades in from downwards, instead of upwards.
export function animateFadeDown(e) {
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

export function handleModelChange(data) {
    const insertedNodeKeys = data.insertedNodeKeys;
    const modifiedNodeData = data.modifiedNodeData;
    const removedNodeKeys = data.removedNodeKeys;
    const insertedLinkKeys = data.insertedLinkKeys;
    const modifiedLinkData = data.modifiedLinkData;
    const removedLinkKeys = data.removedLinkKeys;

    // ... make state changes
}
