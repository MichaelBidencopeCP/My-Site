import { Dialog, DialogTitle, FormControl, InputLabel, Input, Alert } from '@mui/material';
import { BackupButton } from '../components/backupButtons';

import { useContext, useState } from 'react';

import { postNewTag } from '../../api';
import { LoginContext } from '../../App';

function AddTagsToSite({modalShowing, setModalShowing, reloadTags}) {
    const [alert, setAlert ] = useState(0);

    const {login,} = useContext(LoginContext)
    const token = login.token
    
    const handleClose = () => {
        setModalShowing(0);
    }
    const handleSubmit = (event) => {
        let flag = false;
        let tag  = {name: '', image: ''}
        event.preventDefault();

        tag.name = event.target.elements.name.value;
        tag.image = event.target.elements.image.value;
        if(event.target.elements.name.value == '' || event.target.elements.image.value == '') { flag = true;}
        if(flag){
            setAlert(1)
            return;
        }
        
        postNewTag(tag, token).then(async (res) =>{
            if(await res == true){
                setAlert(2);
                reloadTags[1]();
            }
            if(await res == false){
                setAlert(1);
            }
        });

        
    }
    const open = modalShowing === 2? true:false

    return (
        <Dialog onClose={handleClose} open={open} maxWidth={'md'} fullWidth={true}>
            
            <DialogTitle>Add Technology Tag</DialogTitle>
            {alert === 2 && <Alert sx={{mb:0}} severity="success">Saved</Alert>}
            {alert === 1 && <Alert sx={{mb:0}} severity="error">Error Saving Tag</Alert>}
                <form onSubmit={handleSubmit} style={{padding:'2%', paddingTop:'0'}}>
                    
                    <FormControl fullWidth sx={{mb:2}}>
                        <InputLabel fullWidth htmlFor="name">Name</InputLabel>
                        <Input id="name" aria-describedby="Name" placeholder={'Name'}/>    
                    </FormControl>
                    <br/>
                    <FormControl fullWidth sx={{mb:2}}>
                        <InputLabel fullWidth htmlFor="image">SVG</InputLabel>
                        <Input id="image" aria-describedby="Image" placeholder={'Image'}/>    
                    </FormControl>
                    <br/>
                    <BackupButton type={'submit'}>Save</BackupButton>
                    <BackupButton onButton={handleClose}>Close</BackupButton>
                </form>
        </Dialog>
    )
}

export { AddTagsToSite }