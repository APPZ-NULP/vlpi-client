import React from 'react';
import Routers from './routers'
import {createMuiTheme, ThemeProvider} from "@material-ui/core/styles";
import './App.css';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#0E111B'
        },
        secondary: {
            main: '#E5E5E5'
        }
    },
});


function App() {
    return (
        <div className="App">
            <ThemeProvider theme={theme}>
                <Routers/>
            </ThemeProvider>
        </div>
    );
}

export default App;