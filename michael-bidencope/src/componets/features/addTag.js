import { useRef } from 'react';

import { Dialog, DialogTitle, Box, FormControl, InputLabel, Input } from '@mui/material';

import { BackupButton } from '../components/backupButtons';

import { SelectedTags } from '../components/selectedTags.js'



function AddTagsToSite({modalShowing, setModalShowing}) {
    
    
    const handleClose = () => {
        setModalShowing(0);
    }
    const handleSubmit = (event) => {
        let flag = false;
        let tag  = {tooltip: '', svgIcon: ''}
        event.preventDefault();
        (event.target.elements.tooltip.value === '') ? tag.tooltip = event.target.elements.tooltip.value :flag = true;
        (event.target.elements.svgIcon.value === '') ? tag.svgIcon = event.target.elements.svgIcon.value :flag = true;
        if(flag){
            alert('Please fill out all fields');
            return;
        }

        handleClose();
    }
    const open = modalShowing

    return (
        <Dialog  onClose={handleClose} open={open} maxWidth={'md'} fullWidth={true}>
            
            <DialogTitle >Site Author Information</DialogTitle>
                <Box  sx={{
                    margin: 2

                }}>
                    <form onSubmit={handleSubmit}>
                        <FormControl fullWidth sx={{mb:2}}>
                            <InputLabel fullWidth htmlFor="tooltip">ToolTip</InputLabel>
                            <Input id="tooltip" aria-describedby="ToolTip" placeholder={'teting'}/>    
                        </FormControl>
                        <br/>
                        
                        <SelectedTags />
                        
                        <br/>
                        <BackupButton type={'submit'}>Save</BackupButton>
                        <BackupButton onButton={handleClose}>Cancel</BackupButton>
                    </form>
                </Box>

        </Dialog>

    )
}

export { AddTagsToSite }