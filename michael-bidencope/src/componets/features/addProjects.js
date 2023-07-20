import { Box, FormControl, Input, InputLabel, TextareaAutosize } from '@mui/material';
import { PrimaryHeader } from '../components/pirmaryHeader';
import { styled } from '@mui/system';
import { AddTagsToProject } from '../components/projectTagSelector';
import { useEffect, useState } from 'react';
import { useRef } from 'react';
import { BackupButton } from '../components/backupButtons';
import { postProjectInfo } from '../../api'; 
import { useContext } from 'react';
import { LoginContext } from '../../App';

function AddProject({reloadTags}) {
    const [selectedTags, setSelectedTags] = useState([]);
    const {login,} = useContext(LoginContext);
    
    
    const discription = useRef();
    const name = useRef();

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
        console.log(event.target.elements.name.value);
        let flag = false;
        let project = {};
        (event.target.elements.name.value !== '') ? project.name = event.target.elements.name.value :flag = true;
        (discription.value !== '') ? project.discription = discription.value :flag = true;
        if(flag){
            alert('Please fill out all fields');
            return;
        }
        project.tags = selectedTags.map((tag) => tag.id);
        //submit threw api
        postProjectInfo(project, localStorage.getItem('token')).then((response) => { console.log(response) });
    }
    return (
        <Box mx={{xs:0, sm:0}}>
            <PrimaryHeader>Add Project</PrimaryHeader>
            <form onSubmit={(event) => submitProject(event)}>
                <Box sx={{width:{xs:'100%'}}}>
                    <FormControl fullWidth sx={{mb:2}}>
                        <InputLabel htmlFor="Name" >Name</InputLabel>
                        <Input  id="name" aria-describedby="name" placeholder="Project Name"/>
                    </FormControl>
                
                    <br/>
                
                
                    <AddTagsToProject selectedTags={selectedTags} setSelectedTags={handleSetSelectedTags} reloadTags={reloadTags}/>
                        
                    
                    <FormControl fullWidth sx={{mb:2}}>
                        <StyledTextarea 
                            aria-label="minimum height" 
                            minRows={6} 
                            defaultValue="Project Description" 
                            style={{width:'100%'}}
                            backgroundcolor="primary.main"
                            htmlFor = "discription"
                            ref={ discription}
                    
                        />
                    </FormControl>
                </Box>
                <BackupButton type="submit">Submit</BackupButton>
        </form>
            

        </Box>    
        
    )
}


export {AddProject}