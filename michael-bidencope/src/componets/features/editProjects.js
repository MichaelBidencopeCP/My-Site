import { useState, useEffect, useRef, useContext, useMemo } from 'react';

import { Dialog, DialogTitle, Box, FormControl, InputLabel, Input, Table, TableContainer, TableHead, TableCell, TableBody, TableRow, Tab, TableFooter, IconButton, Tooltip } from '@mui/material';

import { BackupButton } from '../components/backupButtons';
import { getProjectsFromLocal, setProjectsInLocal, setUpdateValue } from '../../localStorage';
import { deleteProjects, getProjects, setUpdateValueAPI } from '../../api';
import { DeleteButtonIcon, SelectAllDeleteButton } from '../components/deleteBtn';
import { EditButtonIcon } from '../components/editButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { LoginContext, UpdateContext } from '../../App';
import { ProjectEditTable } from '../components/projectEditTable';
import { red } from '@mui/material/colors';



function EditProject({modalShowing, setModalShowing, reloadTags}) {
    //projects is an objects
    //{'id':{id: 1, name: 'project1', description:'aboutproject1', technologies:[{name:'docker', image:'path'}], clicked:bool, edit:bool},...}
    const [projects, setProjects] = useState({});
    const {update, setUpdate} = useContext(UpdateContext);
    const {login,} = useContext(LoginContext);
    const open = modalShowing === 4? true:false;
    const [projectSelected, setProjectSelected] = useState(false);

    const handleSelected = (id) => {

        let hold = {...projects};
        hold[id].clicked = !hold[id].clicked;
        setProjects(hold);
        if(!hold[id].clicked){
            if(Object.keys(hold).every((item) => hold[item].clicked == false)){
                setProjectSelected(false);
            }
        }
        else{
            setProjectSelected(true);
        }

    }
    useEffect(() => {
        console.log('updateActive');
    }, []);

    const hadnleAllSelect = () =>{
        let hold = {...projects};
        if (Object.keys(projects).every((item) => projects[item].clicked === true)){
            Object.keys(hold).forEach((key) => {
                hold[key].clicked = false;
            });
            setProjectSelected(false);
        }
        else{
            Object.keys(hold).forEach((key) => {
                hold[key].clicked = true;
            });
            setProjectSelected(true);
        }
        setProjects(hold);
    }

    const handleClose = () => {
        setModalShowing(0);
    }
    
    useMemo(() => {
        let localResponse = getProjectsFromLocal();
        if (localResponse){
            //Change from array of projects to object with id as key
            let projects = {};
            localResponse.forEach((project) => {
                project.clicked =  false
                project.edit = false
                projects[project.id] = project;
            });  
            setProjects(projects);
        }
        else{
            getProjects().then((response) => {
                
                setProjectsInLocal(Object.values(response));
                let projects = {};
                response.forEach((project) => {
                    project.clicked =  false
                    project.edit = false
                    projects[project.id] = project;
                });
                setProjects(projects);
            })
              
        }        
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        
        handleClose();
    }
    
    const deleteSelected = () => {
        let selectedProjects = [];
        Object.keys(projects).forEach((key) => {
            if(projects[key].clicked === true){
                selectedProjects.push(parseInt(key));
            }
        });
        deleteProjects(selectedProjects, login.token).then((response) => {
            if(!response){
                console.log('error deleting projects');
            }
            else{
                setUpdateValueAPI(login.token);
                let projectHold = projects;
                selectedProjects.forEach((id) => {
                    delete projectHold[id];
                });
                setProjects(projectHold);
                //set updateActive to true
                let hold = {...update};
                hold.activeUpdate = true;
                hold.updatedProjects = true;
                setUpdate(hold);
                setProjectSelected(false);
            }
        });

    }

    const handleEditSubmit = () => {
        console.log('submitted');
    }
    return (
        <Dialog  onClose={handleClose} open={open} maxWidth={'md'} fullWidth={true} > 
            
            <DialogTitle >Edit Projects</DialogTitle>
            
                <Box  sx={{
                    margin: 2,
                    marginRight: 0,
                    paddingRight:2,
                    overflowY: 'scroll',

                }}>
                    
                        
                            
                    <TableContainer >
                        <Table >
                            
                            <TableHead >
                                <TableCell width={"15%"} scope='row'>
                                    <SelectAllDeleteButton onClick={hadnleAllSelect} allSelected={Object.keys(projects).every((item) => projects[item].clicked === true)}></SelectAllDeleteButton>
                                </TableCell>

                                <TableCell width={"15%"} scope='row'>
                                    ID
                                </TableCell>
                                <TableCell width={"40%"} scope='row'>
                                    Name
                                </TableCell>
                                <TableCell width={"50%"} scope='row' align="right">
                                    <Tooltip title="Delete Selected Projects">
                                        <IconButton onClick={deleteSelected} >
                                            <DeleteIcon sx={{color:[projectSelected?red[500]:null]}}></DeleteIcon>
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                                
                                
                            </TableHead>
                            <TableBody overflowY="scroll">            
                                <ProjectEditTable 
                                    projects={projects} 
                                    handleSelected={handleSelected} 
                                    setProjects={setProjects}
                                    reloadTags={reloadTags}
                                />
                                
                            </TableBody>
                            <TableFooter>
                                <TableRow >
                                    <TableCell colSpan={12} style={{borderBottom:'unset'}}>
                                       
                                    </TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </TableContainer>

                </Box>

        </Dialog>

    )
}

export { EditProject }