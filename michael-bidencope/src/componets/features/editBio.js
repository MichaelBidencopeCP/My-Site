import { Box , TextareaAutosize } from '@mui/material';
import { styled } from '@mui/system';
import { PrimaryHeader } from '../components/pirmaryHeader';
import { BackupButton } from '../components/backupButtons.js';
import { useRef } from 'react';

function EditBio({info, handleInfoChange}) {
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
        if(handleInfoChange( inputRef.current.value)){
            console.log('success');
        }else{
            console.log('failure');
        }
    };

    return (
        <Box>
            <PrimaryHeader>Edit Bio</PrimaryHeader>
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

//<Card 
//            sx={{
//                'backgroundColor': 'secondary.main',
//                'height': '100%',
//                p: 2
//            }}
//        ></Card>