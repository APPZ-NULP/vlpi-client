import React, { Component } from "react";
import * as Recharts from "recharts/umd/Recharts";

const BarChart = Recharts.BarChart;
const Bar = Recharts.Bar;
const XAxis = Recharts.XAxis;
const YAxis = Recharts.YAxis;
const CartesianGrid = Recharts.CartesianGrid;
const Tooltip = Recharts.Tooltip;
const Legend = Recharts.Legend;
const ResponsiveContainer = Recharts.ResponsiveContainer;

class Chart extends Component {
    render() {
        return (
        <ResponsiveContainer width="100%" height={340}>
            <BarChart
            data={this.props.data}
            margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
            }}
            >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="requirements" fill="#00ba85" />
            <Bar dataKey="design" fill="#5dbd5e" />
            <Bar dataKey="modelling" fill="#94bc35" />
            <Bar dataKey="coding" fill="#c9b500" />
            <Bar dataKey="testing" fill="#ffa600" />
            </BarChart>
        </ResponsiveContainer>
        );
    }
}

export default Chart;
