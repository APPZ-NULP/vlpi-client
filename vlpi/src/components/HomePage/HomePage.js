import React, { Component } from 'react';
import {DataGrid, RowsProp, ColDef} from '@material-ui/data-grid';
import './HomePage.css';
import axios from "axios";
import Fab from '@material-ui/core/Fab';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import history from "../../history";

class HomePage extends Component {

    state = {
        modules: [],
        formattedModules: []
    }

    componentDidMount() {
        let user = JSON.parse(localStorage.getItem('user'));
        axios.get(`http://127.0.0.1:8000/api/modules/?user=${user.pk}`, {
            // withCredentials: true,
        })
            .then(res => {
                const modules = res.data;

                let formattedModules = []
                let link = "/#"

                for (const module of modules) {
                    if (module.name === "Modelling") {
                        link = "/tasks/"
                    }
                    formattedModules.push({
                        id: module.pk,
                        name: module.name,
                        tasks_all: module.tasks_all,
                        tasks_done: module.tasks_done,
                        tasks_in_progress: module.tasks_in_progress,
                        link: link
                    })
                }
                this.setState({modules: modules, formattedModules: formattedModules})
				
            })
    }

    render() {
        console.log(this.state)
        return (
            <div style={{
                display: 'flex', height: '93vh'
            }}>
                <div style={{flexGrow: 1}}>
                    <DataGrid   showToolbar 
                                density="comfortable" 
                                autoPageSize={true}
                                disableSelectionOnClick
                                columns={[
                                    {field: 'name', headerName: 'Module name', flex: 4,},
                                    {field: 'tasks_all', headerName: 'All', flex: 1,},
                                    {field: 'tasks_done', headerName: 'Done', flex: 1},
                                    {field: 'tasks_in_progress', headerName: 'In Progress', flex: 1},
                                    {field: 'link', headerName: 'Link', flex: 1, 
                                    renderCell: (params) => (
                                        <Fab color="primary" aria-label="add" size="small" onClick={() => {
                                            history.push(params.value)
                                        }}>
                                            <ArrowForwardIosIcon />
                                        </Fab>
                                        )} ]}
                                rows={this.state.formattedModules} />
                </div>
            </div>
        );
    }
}

export default HomePage;