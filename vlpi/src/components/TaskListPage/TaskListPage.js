import React, {Component} from 'react'
import {DataGrid, RowsProp, ColDef} from '@material-ui/data-grid';
import DifficultCell from "./DifficultyCell";


class TaskListPage extends Component {

    getColumns = () => {
        return
    }
    render() {
        return (
            <div style={{
                display: 'flex', height: '93vh'
            }}>
                <div style={{flexGrow: 1}}>
                    <DataGrid showToolbar density="standard" autoPageSize={true}
                              columns={
                                  [
                                      {field: 'Title', flex: 4,},
                                      {field: 'Progress', flex: 2,},
                                      {field: 'Difficulty', flex: 2,
                                          renderCell: (params) => (
                                                <DifficultCell difficulty={params.value}/>
                                                )},
                                      {field: 'Type', flex: 2}]}
                              rows={[
                                  {
                                      id: 1,
                                      Title: 'Modelling task title 1',
                                      Progress: 'Done',
                                      Difficulty: 'Easy',
                                      Type: "Use Case"
                                  },
                                  {
                                      id: 2,
                                      Title: 'Modelling task title 2',
                                      Progress: 'In Progress',
                                      Difficulty: 'Medium',
                                      Type: "Class"
                                  },
                                  {
                                      id: 3,
                                      Title: 'Modelling task title 3',
                                      Progress: 'Done',
                                      Difficulty: 'Hard',
                                      Type: "Sequence"
                                  },
                                  {
                                      id: 4,
                                      Title: 'Modelling task title 4',
                                      Progress: '-',
                                      Difficulty: 'Easy',
                                      Type: "Communication"
                                  },
                                  {
                                      id: 5,
                                      Title: 'Modelling task title 1',
                                      Progress: 'Done',
                                      Difficulty: 'Easy',
                                      Type: "Use Case"
                                  },
                                  {
                                      id: 6,
                                      Title: 'Modelling task title 2',
                                      Progress: 'In Progress',
                                      Difficulty: 'Medium',
                                      Type: "Class"
                                  },
                                  {
                                      id: 7,
                                      Title: 'Modelling task title 3',
                                      Progress: 'Done',
                                      Difficulty: 'Hard',
                                      Type: "Sequence"
                                  },
                                  {
                                      id: 8,
                                      Title: 'Modelling task title 4',
                                      Progress: '-',
                                      Difficulty: 'Easy',
                                      Type: "Communication"
                                  },
                                  {
                                      id: 9,
                                      Title: 'Modelling task title 1',
                                      Progress: 'Done',
                                      Difficulty: 'Easy',
                                      Type: "Use Case"
                                  },
                                  {
                                      id: 10,
                                      Title: 'Modelling task title 2',
                                      Progress: 'In Progress',
                                      Difficulty: 'Medium',
                                      Type: "Class"
                                  },
                                  {
                                      id: 11,
                                      Title: 'Modelling task title 3',
                                      Progress: 'Done',
                                      Difficulty: 'Hard',
                                      Type: "Sequence"
                                  },
                                  {
                                      id: 12,
                                      Title: 'Modelling task title 4',
                                      Progress: '-',
                                      Difficulty: 'Easy',
                                      Type: "Communication"
                                  },
                                  {
                                      id: 13,
                                      Title: 'Modelling task title 4',
                                      Progress: '-',
                                      Difficulty: 'Easy',
                                      Type: "Communication"
                                  },
                                  {
                                      id: 14,
                                      Title: 'Modelling task title 4',
                                      Progress: '-',
                                      Difficulty: 'Easy',
                                      Type: "Communication"
                                  },
                                  {
                                      id: 15,
                                      Title: 'Modelling task title 4',
                                      Progress: '-',
                                      Difficulty: 'Easy',
                                      Type: "Communication"
                                  }
                              ]}/>
                </div>
            </div>
        )
    }
}

export default TaskListPage