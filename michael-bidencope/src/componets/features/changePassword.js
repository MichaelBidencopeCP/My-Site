import { DialogTitle, FormControl, Input, InputLabel, Modal, Dialog, Alert, Box } from "@mui/material";
import { BackupButton } from "../components/backupButtons";
import { useState,useContext } from "react";
import { ChangePasswordPost } from "../../api";
import { LoginContext } from "../../App";


function ChangePassword({modalShowing, setModalShowing}) {
    //to open and close the modal
    const open = modalShowing === 5? true:false
    const [alerts, setAlerts] = useState(-1);
    const {login,} = useContext(LoginContext); 
    const handleClose = () => {
        setModalShowing(0);
        setAlerts(-1);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if(event.target.newPassword.value === event.target.confirmPassword.value){
            if(event.target.newPassword.value.length >= 8){

                let response = ChangePasswordPost(event.target.newPassword.value, login.token);
                if(response){
                    setAlerts(0);
                    event.target.newPassword.value = '';
                    event.target.confirmPassword.value = '';

                }
                else{
                    setAlerts(1);
                }
                
            }
            else{
                setAlerts(2);
            }
        }
        else{
            setAlerts(3);
        }
    }

    return (
        <Dialog onClose={handleClose} open={open} maxWidth={'md'} fullWidth={true}>
            <DialogTitle>Change Password</DialogTitle>
            {alerts === 0 && <Alert sx={{mb:2}} severity="success">Password Changed</Alert>}
            {alerts === 1 && <Alert sx={{mb:2}} severity="error">Error Saving Changes</Alert>}
            {alerts === 2 && <Alert sx={{mb:2}} severity="info">Password must be at least 8 characters long</Alert>}
            {alerts === 3 && <Alert sx={{mb:2}} severity="info">Passwords do not match</Alert>}
            <form onSubmit={handleSubmit}>
                
                <FormControl fullWidth sx={{mb:2}}>
                    <InputLabel htmlFor="newPassword">New Password</InputLabel>
                    <Input id="newPassword" type="password"/>
                </FormControl>
                <FormControl fullWidth sx={{mb:2}}>
                    <InputLabel htmlFor="confirmPassword">Confirm Password</InputLabel>
                    <Input id="confirmPassword" type="password"/>
                </FormControl>
                <Box sx={{m:2}}>
                    <BackupButton type={'submit'}>Save</BackupButton>
                    <BackupButton onButton={handleClose}>Cancel</BackupButton> 
                </Box>
            </form>
            
        </Dialog>
        

    );

}

export {ChangePassword};