import { Dialog, DialogTitle, FormControl, InputLabel, Input, Alert } from '@mui/material';
import { BackupButton } from '../components/backupButtons';

import { useContext, useEffect, useState } from 'react';

import { postNewTag, setUpdateValueAPI } from '../../api';
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
        
        postNewTag(tag, token).then( (res) =>{
            if( res == true){
                setAlert(2);
                reloadTags[1]();
                setUpdateValueAPI(login.token);
                event.target.elements.name.value = '';
                event.target.elements.image.value = '';
            }
            if( res == false){
                setAlert(1);
            }
        });

        
    }

    useEffect(() => { 
        //wait 5 seconds then hide the alert
        if(alert > 0){
            setTimeout(() => {
                setAlert(0);
            }, 3000);
        }
    }, [alert]);

    const open = modalShowing === 2? true:false

    return (
        <Dialog onClose={handleClose} open={open} maxWidth={'md'} fullWidth={true}>
            {alert === 2 && <Alert sx={{mb:0}} severity="success">Saved</Alert>}
            {alert === 1 && <Alert sx={{mb:0}} severity="error">Error Saving Tag</Alert>}
            <DialogTitle>Add Technology Tag</DialogTitle>
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