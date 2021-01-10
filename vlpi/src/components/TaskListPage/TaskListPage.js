import React, {Component} from 'react'
import {DataGrid, RowsProp, ColDef} from '@material-ui/data-grid';
import DifficultCell from "./DifficultyCell";
import axios from "axios";

const taskDifficulty = {
	EASY: "Easy",
	MEDIUM: "Medium",
	HARD: "Hard"
}

const taskType = {
	CLASS: "Class",
	USE_CASE: "Use Case",
}


class TaskListPage extends Component {

    state = {
        tasks: [],
		formatedRows: []
    }

   componentDidMount() {
        axios.get(`http://127.0.0.1:8000/api/tasks/`, {
            // withCredentials: true,
        })
            .then(res => {
                const tasks = res.data;
				
				let formatedRows = []
				for (var task of tasks) {
					let taskProgress = NaN
					
					if (task.users_progress.length === 0) {
						taskProgress = "To Do"
					}
					else {
						taskProgress = "In Progress"
						
						for (var userProgress of task.users_progress) {
							if (userProgress.is_completed) {
								taskProgress = "Done"
								break;
							}
						}
					}
					
					formatedRows.push({
						id: task.pk,
						title: task.title,
						progress: taskProgress,
						difficulty: taskDifficulty[task.difficulty],
						type: taskType[task.type]
					})
				} 
                this.setState({tasks: tasks, formatedRows: formatedRows})
				
            })
    };
	

    render() {
        console.log(this.state)
        return (
            <div style={{
                display: 'flex', height: '93vh'
            }}>
                <div style={{flexGrow: 1}}>
                    <DataGrid showToolbar density="standard" autoPageSize={true}
                              columns={
                                  [
                                      {field: 'title', headerName: 'Title', flex: 4,},
                                      {field: 'progress', headerName: 'Progress', flex: 2,},
                                      {field: 'difficulty', headerName: 'Difficulty', flex: 2,
                                         renderCell: (params) => (
                                               <DifficultCell difficulty={params.value}/>
                                               )},
                                      {field: 'type', headerName: 'Type', flex: 2}]}
                              rows={this.state.formatedRows}/>
                </div>
            </div>
        )
    }
}

export default TaskListPage