import React, {Component} from 'react';
import {BrowserRouter} from 'react-router-dom';
import {Route, Switch} from 'react-router';

import HomePage from "./components/HomePage/HomePage";

class Routers extends Component {

    render() {
        return(
            <BrowserRouter>
                {/*<Header/>*/}
                <Switch>
                    <Route path='/' exact
                           component={HomePage}
                    />
                </Switch>
            </BrowserRouter>
        )
    }
}

export default Routers;