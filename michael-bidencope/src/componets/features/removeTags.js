

import { Dialog, DialogTitle, Box, Alert } from '@mui/material';
import { BackupButton } from '../components/backupButtons';

import { useContext, useState } from 'react';

import { removeProjectTags } from '../../api';
import { LoginContext } from '../../App';
import { AddTagsToProject } from '../components/projectTagSelector';



function RemoveTags({modalShowing, setModalShowing,reloadTags}) {
    const [alert, setAlert ] = useState(0);
    const [selectedTags, setSelectedTags] = useState([]);

    const {login,} = useContext(LoginContext)
    const token = login.token
    
    const handleClose = () => {
        setModalShowing(0);
    }
    const handleSetSelectedTags = (tags) => {
        setSelectedTags(tags);
    }

    const handleSubmit = (event) => {
        let flag = false;
        let remove = [...selectedTags.map((value)=>{return value.id})];
        let res = removeProjectTags(remove, token).then(async (value)=>{
            console.log(value);
            if(await value){
                handleClose();
                reloadTags[1]();
            }
            else{
                setAlert(1)
            }
        });

    }
    const open = modalShowing === 3? true:false

    return (
        <Dialog onClose={handleClose} open={open} maxWidth={'md'} fullWidth={true}>
            <DialogTitle>Remove Tag</DialogTitle>
            {alert === 1 && <Alert sx={{mb:2}} severity="error">Error Saving Changes</Alert>}
            <Box p={2} pt={0}>
                
                <AddTagsToProject selectedTags={selectedTags} setSelectedTags={handleSetSelectedTags} reloadTags={[true,reloadTags[1]]}/>
                <BackupButton onButton={handleSubmit}>Remove Selected</BackupButton>
                <BackupButton onButton={handleClose}>Close</BackupButton>
            </Box>
        </Dialog>
    )
}

export { RemoveTags }