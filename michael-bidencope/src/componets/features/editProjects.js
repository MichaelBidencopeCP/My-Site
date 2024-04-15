import { useState, useEffect, useRef, useContext } from 'react';

import { Dialog, DialogTitle, Box, FormControl, InputLabel, Input, Table, TableContainer, TableHead, TableCell, TableBody, TableRow, Tab } from '@mui/material';

import { BackupButton } from '../components/backupButtons';
import { getProjectsFromLocal, setProjectsInLocal, setUpdateValue } from '../../localStorage';
import { deleteProjects, getProjects, setUpdateValueAPI } from '../../api';
import { DeleteButtonIcon, SelectAllDeleteButton } from '../components/deleteBtn';
import { EditButtonIcon } from '../components/editButton';

import { LoginContext, UpdateContext } from '../../App';



function EditProject({modalShowing, setModalShowing}) {
    const [projects, setProjects] = useState([]);
    //selected {index: index, clicked: false, edit:false, id: project.id}
    const [selected, setSelected] = useState([]);
    const [allSelected, setAllSelected] = useState(false);
    const {update, setUpdate} = useContext(UpdateContext);

    const {login,} = useContext(LoginContext);


    
    const handleSelected = (index) => {
        let newSelected = [...selected];
        newSelected[index].clicked = !newSelected[index].clicked;
        setSelected(newSelected);
        setAllSelected(false);
    }
    const hadnleAllSelect = () =>{
        let newSelected = [...selected];
        //if all are selected, unselect all 
        if (newSelected.every((item) => item.clicked === true)){
            newSelected.forEach((item) => item.clicked = false);
        }
        //else select all
        else{
            newSelected.forEach((item) => item.clicked = true);
        }
        setSelected(newSelected);
        let hold = !allSelected;
        setAllSelected(hold);
    }

    const handleClose = () => {
        setModalShowing(0);
    }
    
    useEffect(() => {
        let localResponse = getProjectsFromLocal();
        if (localResponse){
            setProjects(Object.values(localResponse));
        }
        else{
            getProjects().then((response) => {
                setProjects(Object.values(response));
                setProjectsInLocal(Object.values(response));
            });
        }

    }, []);

    useEffect(() => {
        setSelected(projects.map((project, index) => { return {index: index, clicked: false, edit: false, id: project.id}}));
    }, [projects]);

    const handleSubmit = (event) => {
        event.preventDefault();
        
        handleClose();
    }
    const open = modalShowing === 4? true:false
    const fields = [
        {id:'id', label: 'ID', width: 70},
        {name: 'name', label: 'Name'},
    ]
    const deleteSelected = () => {
        //get all selected projects
        let selectedProjects = selected.filter((project) => project.clicked === true);
        selectedProjects = selectedProjects.map((project) => project.id);
        //make api call to delete selected projects
        deleteProjects(selectedProjects,login.token ).then((response) => {
            if(!response){
                console.log('error deleting projects');
            }
            else{
                setUpdateValueAPI(login.token);
                //set updateActive to true
                let hold = {...update};
                hold.update = true;
                setUpdate(hold);
            }
        });

    }
    const handleEdit = (index) => {
        let newSelected = [...selected];
        newSelected[index].edit = !newSelected[index].edit;
        setSelected(newSelected);
    }
    const handleEditSubmit = () => {
        console.log('submitted');
    }
    //{selected[index].edit ? project.name : <><Input value={project.name} style={{marginRight:'20px'}}></Input><BackupButton onButton={()=>{handleEditSubmit()}} >Save</BackupButton></>}
    return (
        <Dialog  onClose={handleClose} open={open} maxWidth={'md'} fullWidth={true}>
            
            <DialogTitle >Edit Projects</DialogTitle>
            
                <Box  sx={{
                    margin: 2
                }}>
                    
                        <Box sx={{width:'100%'}}>
                            <BackupButton onButton={deleteSelected} >Delete Projects</BackupButton>
                        </Box>
                            
                    <TableContainer >
                        <Table >
                            
                            <TableHead >
                                <TableCell width={90}>
                                    <SelectAllDeleteButton onClick={hadnleAllSelect} allSelected={allSelected}></SelectAllDeleteButton>
                                </TableCell>

                                <TableCell width={90}>
                                    ID
                                </TableCell>
                                <TableCell >
                                    Name
                                </TableCell>
                                
                            </TableHead>
                            <TableBody>            
                                            
                                {
                                    selected ? projects.map((project, index) => {
                                        return (
                                            <TableRow
                                                key={project.id}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 }, width: 100 }}
                                            >
                                                <TableCell component="th" scope="row">
                                                    <DeleteButtonIcon selected={selected[index]} handleSelect={handleSelected}></DeleteButtonIcon>
                                                    <EditButtonIcon selected={selected[index]} handleEdit={handleEdit}></EditButtonIcon>
                                                </TableCell>
                                                
                                                <TableCell component="th" scope="row">
                                                    {project.id}
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    {project.name}
                                                </TableCell>
                                                
                                            </TableRow>
                                        )
                                    }) : <div>loading</div>

                                }
                                
                            </TableBody>
                        </Table>
                    </TableContainer>

                </Box>

        </Dialog>

    )
}

export { EditProject }