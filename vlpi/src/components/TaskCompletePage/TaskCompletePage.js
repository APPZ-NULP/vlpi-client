import React, { Component } from 'react';
import './TaskCompletePage.css';
import axios from "axios";
import { Button } from '@material-ui/core';
import history from "../../history"

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import * as go from 'gojs';
import {
    makePort,
    textStyle,
    nodeStyle,
    showLinkLabel,
    convertIsTreeLink,
    convertFromArrow,
    convertToArrow,
    convertVisibility,
    animateFadeDown,
    handleModelChange
} from '../GoJsDemo/GoJsHelpers';
import { ReactDiagram, ReactPalette } from 'gojs-react';
import { blueGrey, grey } from '@material-ui/core/colors';


// Я можу якось дістати які компоненти, зв'язки на поточній канві ?











const $ = go.GraphObject.make;
var palette;
var diagram;

function initDiagram() {
    diagram = $(go.Diagram, {
        'undoManager.isEnabled': true,
        'clickCreatingTool.archetypeNodeData': {
            text: 'new node',
            color: 'lightblue'
        },
        LinkDrawn: showLinkLabel, // this DiagramEvent listener is defined below
        LinkRelinked: showLinkLabel,
        'draggingTool.dragsLink': true,
        'draggingTool.isGridSnapEnabled': true,
        model: $(go.GraphLinksModel, {
            linkKeyProperty: 'key'
        })
    });
    diagram.scrollMode = go.Diagram.DocumentScroll;

    diagram.nodeTemplateMap.add(
        '', // the default category
        $(
            go.Node,
            'Table',
            nodeStyle(),
            { locationObjectName: 'TB', locationSpot: go.Spot.Center },
            $(
                go.Panel,
                'Auto',
                $(
                    go.Shape,
                    'Rectangle',
                    { fill: '#282c34', stroke: '#00A9C9', strokeWidth: 3.5 },
                    new go.Binding('figure', 'figure')
                ),
                $(
                    go.TextBlock,
                    textStyle(),
                    {
                        margin: 8,
                        maxSize: new go.Size(160, NaN),
                        wrap: go.TextBlock.WrapFit,
                        editable: true
                    },
                    new go.Binding('text').makeTwoWay()
                )
            ),
            makePort('T', go.Spot.Top, go.Spot.TopSide, false, true),
            makePort('L', go.Spot.Left, go.Spot.LeftSide, true, true),
            makePort('R', go.Spot.Right, go.Spot.RightSide, true, true),
            makePort('B', go.Spot.Bottom, go.Spot.BottomSide, true, false)
        )
    );

    diagram.nodeTemplateMap.add(
        'Conditional',
        $(
            go.Node,
            'Table',
            nodeStyle(),
            { locationObjectName: 'TB', locationSpot: go.Spot.Center },
            $(
                go.Panel,
                'Auto',
                $(
                    go.Shape,
                    'Diamond',
                    { fill: '#282c34', stroke: '#00A9C9', strokeWidth: 3.5 },
                    new go.Binding('figure', 'figure')
                ),
                $(
                    go.TextBlock,
                    textStyle(),
                    {
                        margin: 8,
                        maxSize: new go.Size(160, NaN),
                        wrap: go.TextBlock.WrapFit,
                        editable: true
                    },
                    new go.Binding('text').makeTwoWay()
                )
            ),
            makePort('T', go.Spot.Top, go.Spot.Top, false, true),
            makePort('L', go.Spot.Left, go.Spot.Left, true, true),
            makePort('R', go.Spot.Right, go.Spot.Right, true, true),
            makePort('B', go.Spot.Bottom, go.Spot.Bottom, true, false)
        )
    );

    diagram.nodeTemplateMap.add(
        'Start',
        $(
            go.Node,
            'Table',
            nodeStyle(),
            $(
                go.Panel,
                'Spot',
                $(go.Shape, 'Circle', {
                    desiredSize: new go.Size(70, 70),
                    fill: '#282c34',
                    stroke: '#09d3ac',
                    strokeWidth: 3.5
                }),
                $(go.TextBlock, 'Start', textStyle(), new go.Binding('text'))
            ),
            makePort('L', go.Spot.Left, go.Spot.Left, true, false),
            makePort('R', go.Spot.Right, go.Spot.Right, true, false),
            makePort('B', go.Spot.Bottom, go.Spot.Bottom, true, false)
        )
    );

    diagram.nodeTemplateMap.add(
        'End',
        $(
            go.Node,
            'Table',
            nodeStyle(),
            $(
                go.Panel,
                'Spot',
                $(go.Shape, 'Circle', {
                    desiredSize: new go.Size(60, 60),
                    fill: '#282c34',
                    stroke: '#DC3C00',
                    strokeWidth: 3.5
                }),
                $(go.TextBlock, 'End', textStyle(), new go.Binding('text'))
            ),
            makePort('T', go.Spot.Top, go.Spot.Top, false, true),
            makePort('L', go.Spot.Left, go.Spot.Left, false, true),
            makePort('R', go.Spot.Right, go.Spot.Right, false, true)
        )
    );

    go.Shape.defineFigureGenerator('File', function(shape, w, h) {
        var geo = new go.Geometry();
        var fig = new go.PathFigure(0, 0, true); // starting point
        geo.add(fig);
        fig.add(new go.PathSegment(go.PathSegment.Line, 0.75 * w, 0));
        fig.add(new go.PathSegment(go.PathSegment.Line, w, 0.25 * h));
        fig.add(new go.PathSegment(go.PathSegment.Line, w, h));
        fig.add(new go.PathSegment(go.PathSegment.Line, 0, h).close());
        var fig2 = new go.PathFigure(0.75 * w, 0, false);
        geo.add(fig2);
        // The Fold
        fig2.add(new go.PathSegment(go.PathSegment.Line, 0.75 * w, 0.25 * h));
        fig2.add(new go.PathSegment(go.PathSegment.Line, w, 0.25 * h));
        geo.spot1 = new go.Spot(0, 0.25);
        geo.spot2 = go.Spot.BottomRight;
        return geo;
    });

    diagram.nodeTemplateMap.add(
        'Comment',
        $(
            go.Node,
            'Auto',
            nodeStyle(),
            $(go.Shape, 'File', {
                fill: '#282c34',
                stroke: '#DEE0A3',
                strokeWidth: 3
            }),
            $(
                go.TextBlock,
                textStyle(),
                {
                    margin: 8,
                    maxSize: new go.Size(200, NaN),
                    wrap: go.TextBlock.WrapFit,
                    textAlign: 'center',
                    editable: true
                },
                new go.Binding('text').makeTwoWay()
            )
        )
    );

    

    var propertyTemplate = $(
        go.Panel,
        'Horizontal',
        // property visibility/access
        $(
            go.TextBlock,
            { isMultiline: false, editable: false, width: 12 },
            new go.Binding('text', 'visibility', convertVisibility)
        ),
        // property name, underlined if scope=="class" to indicate static property
        $(
            go.TextBlock,
            { isMultiline: false, editable: true },
            new go.Binding('text', 'name').makeTwoWay(),
            new go.Binding('isUnderline', 'scope', function(s) {
                return s[0] === 'c';
            })
        ),
        // property type, if known
        $(
            go.TextBlock,
            '',
            new go.Binding('text', 'type', function(t) {
                return t ? ': ' : '';
            })
        ),
        $(go.TextBlock, { isMultiline: false, editable: true }, new go.Binding('text', 'type').makeTwoWay()),
        // property default value, if any
        $(
            go.TextBlock,
            { isMultiline: false, editable: false },
            new go.Binding('text', 'default', function(s) {
                return s ? ' = ' + s : '';
            })
        )
    );

    // the item template for methods
    var methodTemplate = $(
        go.Panel,
        'Horizontal',
        // method visibility/access
        $(
            go.TextBlock,
            { isMultiline: false, editable: false, width: 12 },
            new go.Binding('text', 'visibility', convertVisibility)
        ),
        // method name, underlined if scope=="class" to indicate static method
        $(
            go.TextBlock,
            { isMultiline: false, editable: true },
            new go.Binding('text', 'name').makeTwoWay(),
            new go.Binding('isUnderline', 'scope', function(s) {
                return s[0] === 'c';
            })
        ),
        // method parameters
        $(
            go.TextBlock,
            '()',
            // this does not permit adding/editing/removing of parameters via inplace edits
            new go.Binding('text', 'parameters', function(parr) {
                var s = '(';
                for (var i = 0; i < parr.length; i++) {
                    var param = parr[i];
                    if (i > 0) s += ', ';
                    s += param.name + ': ' + param.type;
                }
                return s + ')';
            })
        ),
        // method return type, if any
        $(
            go.TextBlock,
            '',
            new go.Binding('text', 'type', function(t) {
                return t ? ': ' : '';
            })
        ),
        $(go.TextBlock, { isMultiline: false, editable: true }, new go.Binding('text', 'type').makeTwoWay())
    );

    // this simple template does not have any buttons to permit adding or
    // removing properties or methods, but it could!
    diagram.nodeTemplateMap.add(
        'Class',
        $(
            go.Node,
            'Auto',
            // {
            //     locationSpot: go.Spot.Center,
            //     fromSpot: go.Spot.AllSides,
            //     toSpot: go.Spot.AllSides
            // },
            nodeStyle(),
            $(go.Shape, { fill: 'lightyellow' }),
            $(
                go.Panel,
                'Table',
                { defaultRowSeparatorStroke: 'black' },
                // header
                $(
                    go.TextBlock,
                    {
                        row: 0,
                        columnSpan: 2,
                        margin: 10,
                        alignment: go.Spot.Center,
                        font: 'bold 12pt sans-serif',
                        isMultiline: false,
                        editable: true
                    },
                    new go.Binding('text', 'name').makeTwoWay()
                ),
                // properties
                $(
                    go.TextBlock,
                    'Properties',
                    { row: 1, font: 'italic 10pt sans-serif' },
                    new go.Binding('visible', 'visible', function(v) {
                        return !v;
                    }).ofObject('PROPERTIES')
                ),
                $(go.Panel, 'Vertical', { name: 'PROPERTIES' }, new go.Binding('itemArray', 'properties'), {
                    row: 1,
                    margin: 3,
                    stretch: go.GraphObject.Fill,
                    defaultAlignment: go.Spot.Left,
                    background: 'lightyellow',
                    itemTemplate: propertyTemplate
                }),
                $(
                    'PanelExpanderButton',
                    'PROPERTIES',
                    { row: 1, column: 1, alignment: go.Spot.TopRight, visible: false },
                    new go.Binding('visible', 'properties', function(arr) {
                        return arr.length > 0;
                    })
                ),
                // methods
                $(
                    go.TextBlock,
                    'Methods',
                    { row: 2, font: 'italic 10pt sans-serif' },
                    new go.Binding('visible', 'visible', function(v) {
                        return !v;
                    }).ofObject('METHODS')
                ),
                $(go.Panel, 'Vertical', { name: 'METHODS' }, new go.Binding('itemArray', 'methods'), {
                    row: 2,
                    margin: 3,
                    stretch: go.GraphObject.Fill,
                    defaultAlignment: go.Spot.Left,
                    background: 'lightyellow',
                    itemTemplate: methodTemplate
                }),
                $(
                    'PanelExpanderButton',
                    'METHODS',
                    { row: 2, column: 1, alignment: go.Spot.TopRight, visible: false },
                    new go.Binding('visible', 'methods', function(arr) {
                        return arr.length > 0;
                    })
                )
            ),
            makePort('T', go.Spot.Top, go.Spot.Top, true, true),
            makePort('L', go.Spot.Left, go.Spot.Left, true, true),
            makePort('R', go.Spot.Right, go.Spot.Right, true, true),
            makePort('B', go.Spot.Bottom, go.Spot.Bottom, true, true)
        )
    );

    // replace the default Link template in the linkTemplateMap
    diagram.linkTemplateMap.add('', $(
        go.Link, // the whole link panel
        {
            routing: go.Link.AvoidsNodes,
            curve: go.Link.JumpOver,
            corner: 5,
            toShortLength: 4,
            relinkableFrom: true,
            relinkableTo: true,
            reshapable: true,
            resegmentable: true,
            // mouse-overs subtly highlight links:
            mouseEnter: function(e, link) {
                link.findObject('HIGHLIGHT').stroke = 'rgba(30,144,255,0.2)';
            },
            mouseLeave: function(e, link) {
                link.findObject('HIGHLIGHT').stroke = 'transparent';
            },
            selectionAdorned: false
        },
        new go.Binding('points').makeTwoWay(),
        $(
            go.Shape, // the highlight shape, normally transparent
            {
                isPanelMain: true,
                strokeWidth: 8,
                stroke: 'transparent',
                name: 'HIGHLIGHT'
            }
        ),
        $(
            go.Shape, // the link path shape
            { isPanelMain: true, stroke: 'gray', strokeWidth: 2 },
            new go.Binding('stroke', 'isSelected', function(sel) {
                return sel ? 'dodgerblue' : 'gray';
            }).ofObject()
        ),
        $(
            go.Shape, // the arrowhead
            { toArrow: 'standard', strokeWidth: 0, fill: 'gray' }
        ),
        $(
            go.Panel,
            'Auto', // the link label, normally not visible
            { visible: true, name: 'LABEL', segmentIndex: 2, segmentFraction: 0.5 },
            new go.Binding('visible', 'visible').makeTwoWay(),
            $(
                go.Shape,
                'RoundedRectangle', // the label shape
                { fill: '#F8F8F8', strokeWidth: 0 }
            ),
            $(
                go.TextBlock,
                '', // the label
                {
                    textAlign: 'center',
                    font: '10pt helvetica, arial, sans-serif',
                    stroke: '#333333',
                    editable: true,
                    visible: false
                },
                new go.Binding('visible', 'text',  function(s) { if (s) return true; else return false; }).makeTwoWay()
                , new go.Binding("text", "text")
            )
        )
    ));

    diagram.linkTemplate= $( go.Link, // the whole link panel
      {
          routing: go.Link.AvoidsNodes,
          curve: go.Link.JumpOver,
          corner: 5,
          toShortLength: 4,
          relinkableFrom: true,
          relinkableTo: true,
          reshapable: true,
          resegmentable: true,
          // mouse-overs subtly highlight links:
          mouseEnter: function(e, link) {
              link.findObject('HIGHLIGHT').stroke = 'rgba(30,144,255,0.2)';
          },
          mouseLeave: function(e, link) {
              link.findObject('HIGHLIGHT').stroke = 'transparent';
          },
          selectionAdorned: false
      },
      new go.Binding('points').makeTwoWay(),
      
      new go.Binding("isLayoutPositioned", "relationship", convertIsTreeLink),
      $(
        go.Shape, // the highlight shape, normally transparent
        {
            isPanelMain: true,
            strokeWidth: 8,
            stroke: 'transparent',
            name: 'HIGHLIGHT'
        }
    ),
    $(
        go.Shape, // the link path shape
        { isPanelMain: true, stroke: 'gray', strokeWidth: 2 },
        new go.Binding('stroke', 'isSelected', function(sel) {
            return sel ? 'dodgerblue' : 'gray';
        }).ofObject(),
        new go.Binding("fromArrow", "relationship", convertFromArrow)
    ),
    $(
        go.Shape, // the arrowhead
        { toArrow: 'standard', strokeWidth: 4, fill: '#909091', stroke: '#909091' },
        new go.Binding("toArrow", "relationship", convertToArrow)
    )
    );

    // temporary links used by LinkingTool and RelinkingTool are also orthogonal:
    diagram.toolManager.linkingTool.temporaryLink.routing = go.Link.Orthogonal;
    diagram.toolManager.relinkingTool.temporaryLink.routing = go.Link.Orthogonal;

    return diagram;
}

function initPalette() {
    palette = $(
        go.Palette, // must name or refer to the DIV HTML element
        {
            // Instead of the default animation, use a custom fade-down
            'animationManager.initialAnimationStyle': go.AnimationManager.None,
            InitialAnimationStarting: animateFadeDown, // Instead, animate with this function

            nodeTemplateMap: diagram.nodeTemplateMap, // share the templates used by diagram
            maxSelectionCount: 1,
            // simplify the link template, just in this Palette
            linkTemplate: diagram.linkTemplate,
            model: new go.GraphLinksModel(
                [
                    // specify the contents of the Palette
                    { category: 'Start', text: 'Start' },
                    { text: 'Step' },
                    { category: 'Conditional', text: '???' },
                    { category: 'End', text: 'End' },
                    { category: 'Comment', text: 'Comment' },
                    { category: 'Class', text: 'Class', name: 'ClassName' }
                ],
                [
                    // the Palette also has a disconnected Link, which the user can drag-and-drop
                    {
                        points: new go.List().addAll([
                            new go.Point(0, 0),
                            new go.Point(30, 0),
                            new go.Point(30, 40),
                            new go.Point(60, 40)
                        ])
                    },
                    {
                      points: new go.List().addAll([
                          new go.Point(0, 0),
                          new go.Point(30, 0),
                          new go.Point(30, 40),
                          new go.Point(60, 40)
                      ])
                      , relationship: 'aggregation'
                  }
                    ,
                    {
                      points: new go.List().addAll([
                          new go.Point(0, 0),
                          new go.Point(30, 0),
                          new go.Point(30, 40),
                          new go.Point(60, 40)
                      ])
                      , relationship: 'generalization'
                  }
                ]
            ),
            allowHorizontalScroll: false,
            allowVerticalScroll: false
        }
    );
    palette.contentAlignment = go.Spot.Center;
    return palette;
}




















class TaskCompletePage extends Component {

    state = {
        task: {
            pk: undefined,
            title: undefined,
            description: undefined,
            difficulty: undefined,
            type: undefined,
            max_mark: undefined
        },
        module: {
            pk: undefined,
            name: undefined
        },
        etalon: {
            nodes: undefined,
            links: undefined
        },
        diagram: undefined
        // title: 
        // modules: [],
        // formattedModules: []
    }

    componentDidMount() {
        const id = this.props.match.params.id;

        axios.get(`http://127.0.0.1:8000/api/tasks/${id}/`, {
            // withCredentials: true,
        })
            .then(res => {
                console.log(res);
                const task = res.data;
                this.setState({ task },
                    () => {
                        this.getModule(task.module);
                        this.getEtalon(task.etalon);
                    }
                );
            })
    }

    getModule(moduleId) {
        axios.get(`http://127.0.0.1:8000/api/modules/${moduleId}/`, {
        })
            .then(res => {
                // console.log(res);
                const module = res.data;
                this.setState({ module });
            })
    }

    getEtalon(etalonId) {
        axios.get(`http://127.0.0.1:8000/api/etalons/${etalonId}/`, {
        })
            .then(res => {
                // console.log(res);
                const etalon = res.data;
                this.setState({ etalon });
            })
    }

    handleSaveClick = () => {
        console.log("Save");
    }

    handleSaveAndSubmitClick = () => {
        console.log("Save and Submit");
        console.log(diagram.model.toJson());

        // const isValid = this.validateResults();
        // if (isValid) {
        //     const results = this.getResultsToSubmit();
        //     const token = String(this.props.match.params.token);

        //     axios.post(`${API_URL}/${API_VERSION}/tokens/${token}/answers`, {
        //         answers: results,
        //     }, {
        //         withCredentials: true,
        //     }).then(res => {
        //         this.props.history.push(`${this.props.history.location.pathname}/response`);
        //     }).catch(error => {
        //         console.log(error);
        //     });
        // }
    }

    

    render() {
        console.log(this.state)
        if (diagram) {
            // this.setState({ diagram });
            console.log();
            console.log(diagram);
            console.log(diagram.model.toJson());
        }
        return (
            // style={{ display: 'flex', height: '93vh'}}>
            <div className="completionPage">
                <div style={{ flexGrow: 1 }}>
                    {this.state.task.pk}, 
                    {this.state.task.title}, 
                    {this.state.module.name} 
                    {/* {this.state.etalon.nodes},
                    {this.state.etalon.links} */}
                    YURA
                    
                    <Button variant="contained" color='primary' onClick={this.handleSaveClick}>
                        Save
                    </Button>
                    <Button variant="contained" color='primary' onClick={this.handleSaveAndSubmitClick}>
                        Save and Submit
                    </Button>
                </div>



            <div className="canvas">
                <ReactDiagram
                    initDiagram={initDiagram}
                    divClassName="completionDiagram"
                    nodeDataArray={ 
                    // [
                        // []
                        this.state.etalon.nodes
                    //     {
                    //         category: 'Comment',
                    //         loc: '360 -10',
                    //         text: 'Kookie Brittle',
                    //         key: -13
                    //     },
                    //     { key: -1, category: 'Start', loc: '175 0', text: 'Start' },
                    //     { key: 0, loc: '-5 75', text: 'Preheat oven to 375 F' },
                    //     {
                    //         key: 1,
                    //         loc: '175 100',
                    //         text: 'In a bowl, blend: 1 cup margarine, 1.5 teaspoon vanilla, 1 teaspoon salt'
                    //     },
                    //     {
                    //         key: 2,
                    //         loc: '175 200',
                    //         text: 'Gradually beat in 1 cup sugar and 2 cups sifted flour'
                    //     }
                    // ]
                    }
                    linkDataArray={
                        [

                        ]
                        // this.state.etalon.links
                        // [
                        // { from: 1, to: 2, fromPort: 'B', toPort: 'T' },
                        // { from: 0, to: 10, fromPort: 'B', toPort: 'T', relationship: "generalization" },
                        // { from: 1, to: 10, fromPort: 'B', toPort: 'T', relationship: "aggregation" }
                        // ]
                    }
                    onModelChange={handleModelChange}
                />
                <ReactPalette 
                    initPalette={initPalette}
                    divClassName="completionPalette" 
                />
            </div>



            

            </div>
        );
    }
}

export default TaskCompletePage;