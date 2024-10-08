import { Alert, Box, FormControl, Input, InputLabel, TextareaAutosize, useTheme } from '@mui/material';
import { PrimaryHeader } from '../components/pirmaryHeader';
import { styled } from '@mui/system';
import { AddTagsToProject } from '../components/projectTagSelector';
import { useEffect, useState } from 'react';
import { useRef } from 'react';
import { BackupButton } from '../components/backupButtons';
import { postProjectInfo, setUpdateValueAPI } from '../../api'; 
import { useContext } from 'react';
import { LoginContext, UpdateContext } from '../../App';
import { setUpdateValue } from '../../localStorage';

function AddProject({reloadTags}) {
    const [selectedTags, setSelectedTags] = useState([]);
    const {login,} = useContext(LoginContext);
    const theme = useTheme();
    const {update, setUpdate} = useContext(UpdateContext);
    const [saved, setSaved] = useState(0);

    useEffect(() => {
        if(saved===1){
            setTimeout(() => {
                setSaved(0);
            }, 5000);
        }
        if(saved===2){
            setTimeout(() => {
                setSaved(0);
            }, 5000);
        }
    }, [saved]);


    const StyledTextarea = styled(TextareaAutosize)(
        ({ theme }) => `
            width: 100%;
            background-color: ${theme.palette.secondary.main};
            max-width: 100%;
            border: solid 1px ${theme.palette.primary.main};
            border-radius: 5px;
            padding: 5px;
            font-family: 'Roboto', sans-serif;
        `
    );
    const handleSetSelectedTags = (tags) => {
        setSelectedTags(tags);
    }
    const submitProject = (event) => {
        event.preventDefault();
        let flag = false;
        let project = {};
        (event.target.elements.name.value !== '') ? project.name = event.target.elements.name.value :flag = true;
        (event.target.elements.description.value !== '') ? project.description = event.target.elements.description.value :flag = true;
        if(flag){
            alert('Please fill out all fields');
            return;
        }
        project.tags = selectedTags.map((tag) => tag.id);
        //submit threw api
        postProjectInfo(project, login.token).then((response) => {
            if(response === false){
                setSaved(2);
                return;
            }
            setSaved(1);
            event.target.elements.name.value = '';
            event.target.elements.description.value = '';
            reloadTags[1]()
            setUpdateValueAPI(login.token).then((response) => {
                if(response === false){
                    alert('Error updating cache');
                    return;
                }
            });
            //set local update to true, so that the page will data will reload
            let updateHold = {...update};
            updateHold.activeUpdate = true;
            updateHold.updatedProjects = true;
            setUpdate(updateHold);
        });

        
    }
    return (
        <Box mx={{xs:0, sm:0}}>
            <PrimaryHeader>Add Project</PrimaryHeader>
            {saved === 1 && <Alert sx={{mb:1}} severity="success">Project Saved</Alert>}
            {saved === 2 && <Alert sx={{mb:2}} severity="error">Error Saving Project</Alert>}
            <form onSubmit={(event) => submitProject(event)}>
                <Box sx={{width:{xs:'100%'}}}>
                    <FormControl fullWidth sx={{mb:2}}>
                        <InputLabel htmlFor="Name" >Name</InputLabel>
                        <Input  id="name" aria-describedby="name" placeholder="Project Name"/>
                    </FormControl>
                
                    <br/>
                
                
                    <AddTagsToProject selectedTags={selectedTags} setSelectedTags={handleSetSelectedTags} reloadTags={reloadTags[0]}/>
                        
                    
                    <FormControl fullWidth sx={{mb:2}}>
                        <textarea 
                            aria-label="minimum height" 
                            minRows={6} 
                            defaultValue="Project Description" 
                            style={{width:'100%', backgroundColor:theme.palette.secondary.main, border:'solid 1px '+theme.palette.primary.main, borderRadius:'5px', padding:'5px', fontFamily:'Roboto, sans-serif'}}
                            backgroundcolor="primary.main"
                            name = "description"
                        />
                    </FormControl>
                </Box>
                <BackupButton type="submit">Submit</BackupButton>
        </form>
            

        </Box>    
        
    )
}


export {AddProject}