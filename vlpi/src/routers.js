import React, {Component} from 'react';
import {BrowserRouter} from 'react-router-dom';
import {Route, Switch} from 'react-router';

import HomePage from "./components/HomePage/HomePage";
import TaskListPage from "./components/TaskListPage/TaskListPage";
import Header from "./components/Header/Header";

class Routers extends Component {

    render() {
        return(
            <BrowserRouter>
                <Header />
                <Switch>
                    <Route path='/' exact
                           component={HomePage}
                    />
                    <Route path='/task-list' exact component={TaskListPage} />
                </Switch>
            </BrowserRouter>
        )
    }
}

export default Routers;