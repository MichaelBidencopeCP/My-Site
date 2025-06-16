import { Box, Collapse, Icon, IconButton, Table, TableCell, TableRow, TextField } from "@mui/material";
import Grid from '@mui/material/Grid2';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { DeleteButtonIcon } from "./deleteBtn";
import { EditButtonIcon } from "./editButton";
import { useContext, useState } from "react";
import { AddTagsToProject } from "./projectTagSelector";
import { green, red } from "@mui/material/colors";
import { setNewIndexesForProjects, setUpdateValueAPI, updateProject } from "../../api";  
import { LoginContext, UpdateContext } from "../../App";
import { create } from "@mui/material/styles/createTransitions";
import { createRoot } from "react-dom/client";
import { setProjectsIndexInLocal } from "../../localStorage";
import DragHandleIcon from '@mui/icons-material/DragHandle';
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';

function ProjectEditTable({projects,handleSelected,setProjects, reloadTags}) {
    const [edit, setEdit] = useState(0);
    const [dragPosition, setDragPosition] = useState(-1);
    const [dragging, setDragging] = useState(-1);
    //may need to get tags working
    const {login,} = useContext(LoginContext);
    const {update, setUpdate} = useContext(UpdateContext);
    //check if the project has been edited 

    //!!TODO add state to parent and remove edit if delete, probably will be fine without it but untested
    const [edited, setEdited] = useState([]);
    const [save, setSave] = useState({});
    //function that removes the project from the edited list
    const editedRemove = (id)=>{
        let hold = [...edited];
        hold.splice(hold.indexOf(id), 1);
        setEdited(hold);
        let saves = {...save};
        delete saves[id];
        setSave(saves);
    }
    //function that handles the state change to show edit form
    const handleEdit = (id) => {
        if (edit === id){
            setEdit(0);
        }
        else{
            setEdit(id);
        }
    }
    //function that handles the state change to submit the edit
    const submitEdit = (id) => {
        updateProject(projects[id], login.token).then((data) => {
            let hold = {...update};
            hold.updatedProjects = true;
            hold.activeUpdate = true;
            setUpdate(hold);
        });
        setUpdateValueAPI(login.token);
        editedRemove(id);
    }
    const handleEditTags = (tags) => {
        let saves = {...save};
        if (!saves[edit]){
            saves[edit] = {'technologies':[projects[edit].technologies]};
        }
        else{
            if (!saves[edit].technologies){
                saves[edit]['technologies'] = [projects[edit].technologies];
            }
        }
        setSave(saves);
        let hold = {...projects};
        hold[edit].technologies = tags;
        setProjects(hold);
    }
    //function that handles the state change of project when editing name
    const changeProjectName = (e) => {
        let saves = {...save};
        if (!saves[edit]){
            saves[edit] ={'name':projects[edit].name};
        }
        else{
            if (!saves[edit].name){
                saves[edit]['name'] = projects[edit].name;
            }
        }
        setSave(saves);
        let hold = {...projects};
        hold[edit].name = e.target.value;
        setProjects(hold);
        //adds the project to the edited list allows submit button to be enabled
        let edits = [...edited];
        if (!edits.includes(edit)){
            edits.push(edit);
        }
        setEdited(edits);
        
    }
    const changeProjectDescription = (e) => {
        let saves = {...save};
        if(!saves[edit]){
            saves[edit] = {'description':projects[edit].description};
        }
        else{
            if (!saves[edit].description){
                saves[edit]['description'] = projects[edit].description;
            }
        }
        setSave(saves)
        let hold = {...projects};
        hold[edit].description = e.target.value;
        setProjects(hold);
        let edits = [...edited];
        //adds the project to the edited list allows submit button to be enabled
        if (!edits.includes(edit)){
            edits.push(edit);
        }
        setEdited(edits);
    }
    //user removes edits
    const removeEdit = (id) => {
        let hold = {...projects};
        if (save[id]){
            
            hold[id].name = save[id].name?save[id].name:hold[id].name;
            hold[id].description = save[id].description?save[id].description:hold[id].description;
            //more work needed here TODO TODO
            hold[id].technologies = save[id].technologies?save[id].technologies:hold[id].technologies;
            //reloadTags[1]();
        }
        setProjects(hold);
        editedRemove(id);

    }

    const handleDragOver = (e, index) => {
        e.preventDefault();
        if(dragging > index){
            setDragPosition(index);
        }
        else if(dragging < index){
            setDragPosition(index + 1);
        }
    }
    const handleDrop = (e, index) => {
        e.preventDefault();
        if (dragging === index){
            setDragPosition(-1);
            return;
        }
        let hold = {...projects};
        console.log("original: " + dragging + " New index: " + index);
        
        let draggedObject = Object.keys(hold).filter((key) => hold[key].index === dragging);

        //draging is the orginal index of the project being dragged
        //index is the new index of the project being dragged
        if (dragging > index){
            //if new is greater than orginal then decrement all projects between the two
            Object.keys(projects).forEach((key) => {
                let project = projects[key];
                if (project.index >= index && project.index < dragging ){
                    hold[project.id].index += 1;
                }
            });
        }
        else if (dragging < index){
            //if new is less than orginal then increment all projects between the two
            Object.keys(projects).forEach((key) => {
                let project = projects[key];
                if (project.index > dragging && project.index <= index ){
                    hold[project.id].index -= 1;
                }
            });
        }
        //get key for project being dragged
        console.log("draggedObject: " + draggedObject);
        //if draggedObject is not empty then set the index of the project being dragged to the new index
        console.log("draggedObject length: " + draggedObject.length);
        if (draggedObject.length === 0){
            console.log("No project being dragged");
            return;
        }
        console.log("Setting index of dragged object to: " + index);
        console.log("id of dragged object: " + draggedObject[0]);
        //set the index of the project being dragged to the new index
        hold[draggedObject[0]].index = index;
        setProjects(hold);
        setDragPosition(-1);
        setDragging(-1);
        setDragPosition(-1);
        //new indexes for projects in format [{id: id, index: index}, ...]
        let indexes = Object.keys(hold).map((key) => {
            return {id: hold[key].id, index: hold[key].index};
        });


        setNewIndexesForProjects(indexes, login.token).then((data) => {
            let updateHold = {...update};
            updateHold.updatedProjects = true;
            updateHold.activeUpdate = true;
            setUpdate(updateHold);
            if (data){
                //do something with data
            }
            else{
                console.log("Error updating project indexes");
            }
            
        });
        setProjectsIndexInLocal(hold)
    }

    return (
        <>
            {
                Object.keys(projects).sort((a, b) => projects[a].index - projects[b].index).map((key) => {
                    let project = projects[key];
                    return (
                    <>
                        {project.index === dragPosition ? 
                            <TableRow 
                                key="blank-row" 
                                droppable="true" 
                                style={{width:'100%', marginTop:'0px', marginBottom:'0px'}}
                                onDrop={(e)=>handleDrop(e, project.index)}
                                onDragOver={(e)=>handleDragOver(e, project.index)}
                            >
                                <TableCell style={{height:'74px', paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
                                    
                                </TableCell>
                            </TableRow> : null
                        }
                        <TableRow
                            key={project.id}
                            sx={{ '& > *': { borderBottom: 'unset' }}}
                            style={{borderBottom:'unset'}}
                            draggable="true"
                            onDragEnter = {(e)=>handleDragOver(e, project.index)}
                            onDrop = {(e)=>handleDrop(e, project.index)}
                            onDragOver={(e)=>handleDragOver(e, project.index)}
                            onDragStart={(e) => {setDragging(project.index)}}
                        >
                            <TableCell width={"25%"} scope="row" style={{borderBottom:'unset'}} >
                                <DeleteButtonIcon key={project.id+'-'+project.clicked+'-dlt'} selected={{clicked:project.clicked, index:project.id}} handleSelect={()=>{handleSelected(project.id)}}></DeleteButtonIcon>
                                <EditButtonIcon selected={project.id} handleEdit={()=>{handleEdit(project.id)}}></EditButtonIcon>
                                <Icon><DragHandleIcon></DragHandleIcon></Icon>
                                
                            </TableCell>
                            {project.clicked}
                            <TableCell width={"10%"} scope="row" style={{borderBottom:'unset'}}>
                                {project.id}
                            </TableCell>
                            <TableCell width={"45%"}  scope="row" style={{borderBottom:'unset'}}>
                                {project.name}
                            </TableCell>
                            <TableCell width={"30%"} scope="row" style={{borderBottom:'unset'}} align="right">
                                {
                                    edit === project.id || edited.includes(project.id) ?
                                        <>
                                        <IconButton disabled={!edited.includes(project.id)?true:false} sx={{color:edited.includes(project.id)?green[500]:null}} onClick={()=>{submitEdit(project.id)}}>
                                            <CheckIcon></CheckIcon>
                                        </IconButton>
                                        <IconButton disabled={!edited.includes(project.id)?true:false} sx={{color:edited.includes(project.id)?red[500]:null}} onClick={()=>{removeEdit(project.id)}}>
                                            <CloseIcon></CloseIcon>
                                        </IconButton>
                                        </>
                                    : 
                                        null
                                }
                            </TableCell>
                            
                        </TableRow>
                        
                        <TableRow key={project.id + "-drop"}>
                            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
                                <Collapse in={edit === project.id} timeout="auto" unmountOnExit style={{width:'100%'}}>
                                    <Box sx={{ margin: 1 }}>
                                        <Grid container width={'100%'} spacing={2}>
                                            <Grid item size={12}>
                                                <TextField fullWidth type="text" value={project.name} onChange={changeProjectName}></TextField>
                                            </Grid>
                                            <Grid item size={12}>
                                                <TextField 
                                                    fullWidth 
                                                    multiline 
                                                    value={project.description}
                                                    rows={2} 
                                                    maxRows={4} 
                                                    type="text" 
                                                    onChange={changeProjectDescription}
                                                />
                                            </Grid>
                                            <Grid item size={12}>
                                                <AddTagsToProject selectedTags={project.technologies} setSelectedTags={handleEditTags} reloadTags={reloadTags[0]}></AddTagsToProject>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Collapse>
                            </TableCell>
                        </TableRow>
                        
                    </>
                    
                );
            })
            
            
        }
        <div style={{height:'50px', width:'100%'}} dragOver={(e)=>handleDragOver(e, projects.keys().length + 1)}></div>
        </>
    );

}

export { ProjectEditTable }