
import { Grid, Box, Switch } from '@mui/material';

import { EditBio } from '../features/editBio.js';
import { AddProject } from '../features/addProjects.js';

import { PageComponent } from '../components/pageComponent.js'; 
import { BackupButton } from '../components/backupButtons.js';
import { EditPersonalInfo } from '../features/editPersonInfo.js';
import { EditThemeControler } from '../features/editTheme.js';
import { AddTagsToSite } from '../features/addTag.js';

import { RemoveTags } from '../features/removeTags.js';

import { useState } from 'react';
import { EditProject } from '../features/editProjects.js';
import { ChangePassword } from '../features/changePassword.js';
import { ExtrasSwitch } from '../components/extraPageSwitch.js';


function AdminPage({info, handleInfoChange, user, setUserHandler, currentTheme, handleThemeChange, token}){
    // no modal = 0, edit personal info modal = 1, add skill modal = 2, add education modal = 3, add work experience modal = 4
    const [modalShowing, setModalShowing] = useState(0);
    const [reloadTags, setReloadTags ] = useState(true);
    //React.useEffect(() => {
    //    
    //}, [modalShowing]);
    const setModal = (modal) => {
        setModalShowing(modal);
    }
    const handleSetReload = () =>{
        let states = reloadTags
        states = !states
        setReloadTags(states)
    }

    return(
        <PageComponent>
            <EditPersonalInfo modalShowing={modalShowing} setModalShowing={setModal} user={user} setUser={setUserHandler}/>
            <AddTagsToSite modalShowing={modalShowing} setModalShowing={setModal} reloadTags={[reloadTags,handleSetReload]} />
            <RemoveTags modalShowing={modalShowing} setModalShowing={setModal} reloadTags={[reloadTags,handleSetReload]}/>
            <EditProject modalShowing={modalShowing} setModalShowing={setModal} />
            <ChangePassword modalShowing={modalShowing} setModalShowing={setModal} />
            
            <BackupButton onButton={() => {setModal(1)}}>Edit Personal Info</BackupButton>
            <BackupButton onButton={() => {setModal(4)}}>Edit Projects</BackupButton>
            <br/>
            <BackupButton onButton={() => {setModal(2)}}>Add Tag</BackupButton>
            <BackupButton onButton={() => {setModal(3)}}>Remove Tag</BackupButton>
            <BackupButton onButton={() => {setModal(5)}}>Change Password</BackupButton>
            <BackupButton >Add Education</BackupButton>
            <br/>
            Custom Pages<ExtrasSwitch/>
            
            

            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <EditBio info={ info } handleInfoChange={ handleInfoChange } />
                    <br/>
                    <AddProject reloadTags={[reloadTags,handleSetReload]}/>
                    

                </Grid>
                <Grid item xs={12} md={6}>
                    <Box sx={{ ml:{xs:0, sm:0, md:2} }}>
                    <EditThemeControler currentTheme={currentTheme} handleThemeChange={handleThemeChange} />
                    </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                    
                </Grid>
            </Grid>
            <br></br>
            

        </PageComponent>
    );
}

export {AdminPage}