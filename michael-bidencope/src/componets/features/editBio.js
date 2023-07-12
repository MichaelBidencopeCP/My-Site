import { Alert, Box , TextareaAutosize } from '@mui/material';
import { styled } from '@mui/system';
import { PrimaryHeader } from '../components/pirmaryHeader';
import { BackupButton } from '../components/backupButtons.js';
import { useRef, useState } from 'react';


function EditBio({info, handleInfoChange}) {
    const [saved, setSaved] = useState(0)    
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
    const inputRef = useRef(null);
    //on backup button click, change the info state
    const onButton = () => {  
        
        handleInfoChange( inputRef.current.value).then((res) => {
            if (res){
                setSaved(1)
            }else{
                setSaved(2)
            }
        });
    };

    return (
        <Box>
            <PrimaryHeader>Edit Bio</PrimaryHeader>
            {saved === 1 && <Alert sx={{mb:1}} severity="success">Bio Saved</Alert>}
            {saved === 2 && <Alert sx={{mb:2}} severity="error">Error Saving Bio</Alert>}
            <StyledTextarea 
                aria-label="minimum height" 
                minRows={6} 
                defaultValue={info.bio} 
                style={{width:'100%'}}
                backgroundcolor="primary.main"
                ref={ inputRef}
        
            />
            <BackupButton onButton={() => {onButton()}}>Save Bio</BackupButton>
            
        </Box>
    )
}

export {EditBio}
