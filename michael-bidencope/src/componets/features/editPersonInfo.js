import { useState, useEffect, useRef } from 'react';

import { Dialog, DialogTitle, Box, FormControl, InputLabel, Input } from '@mui/material';

import { BackupButton } from '../components/backupButtons';

function EditPersonalInfo({modalShowing, setModalShowing, user, setUser}) {
            
    const handleClose = () => {
        setModalShowing(0);
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        let name = (event.target.elements.name.value === '') ? user.name : event.target.elements.name.value;
        let title = (event.target.elements.title.value === '') ? user.title : event.target.elements.title.value;
        let email = (event.target.elements.email.value === '') ? user.email : event.target.elements.email.value;
        let city = (event.target.elements.city.value === '') ? user.city : event.target.elements.city.value;
        let state = (event.target.elements.state.value === '') ? user.state : event.target.elements.state.value;
        setUser({name: name, title: title, email: email, city: city, state: state});
        handleClose();
    }
    const open = modalShowing === 1? true:false

    return (
        <Dialog  onClose={handleClose} open={open} maxWidth={'md'} fullWidth={true}>
            
            <DialogTitle >Site Author Information</DialogTitle>
                <Box  sx={{
                    margin: 2

                }}>
                    <form onSubmit={handleSubmit}>
                        <FormControl fullWidth sx={{mb:2}}>
                            <InputLabel fullWidth htmlFor="name">Name</InputLabel>
                            <Input id="name" aria-describedby="Name" placeholder={user.name}/>    
                        </FormControl>
                        <br/>
                        <FormControl fullWidth sx={{mb:2}}>
                            <InputLabel htmlFor="title">Title</InputLabel>
                            <Input id="title" aria-describedby="Title" placeholder={user.title} />
                        </FormControl>
                        <br/>
                        <FormControl fullWidth sx={{mb:2}}>
                            <InputLabel htmlFor="email" >Email address</InputLabel>
                            <Input  id="email" aria-describedby="Email Adress" placeholder={user.email} />
                        </FormControl>
                        <br/>
                        <FormControl fullWidth sx={{mb:2}}>
                            <InputLabel htmlFor="city" >City</InputLabel>
                            <Input  id="city" aria-describedby="City" placeholder={user.city}/>
                        </FormControl>
                        <br/>
                        <FormControl fullWidth sx={{mb:2}}>
                            <InputLabel htmlFor="state" >State</InputLabel>
                            <Input  id="state" aria-describedby="State" placeholder={user.state} />
                        </FormControl>
                        <br/>
                        <BackupButton type={'submit'}>Save</BackupButton>
                        <BackupButton onButton={handleClose}>Cancel</BackupButton>
                    </form>
                </Box>

        </Dialog>

    )
}

export { EditPersonalInfo }