import React, {Component} from "react";
import {Chip} from "@material-ui/core";
import {createMuiTheme, ThemeProvider} from "@material-ui/core/styles";

const color = {
    Easy: "#5CB85C",
    Medium: "#F0AD4E",
    Hard: "#D9534F"
}

class DifficultCell extends Component {
    render() {
        const theme = createMuiTheme({
            palette: {
                primary: {
                    main: color[this.props.difficulty]
                },
            },
        });

        return (
            <div>
                <ThemeProvider theme={theme}>
                    <Chip color="primary" variant="outlined"
                          label={this.props.difficulty}/>
                </ThemeProvider>
            </div>

        )
    }
}

export default DifficultCell