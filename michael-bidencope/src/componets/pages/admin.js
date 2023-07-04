
import { Grid } from '@mui/material';

import { EditBio } from '../features/editBio.js';
import { AddProject } from '../features/addProjects.js';

import { PageComponent } from '../components/pageComponent.js'; 
import { BackupButton } from '../components/backupButtons.js';
import { EditPersonalInfo } from '../features/editPersonInfo.js';
import { EditThemeControler } from '../features/editTheme.js';

import React from 'react';


function AdminPage({info, handleInfoChange, user, setUserHandler}){
    // no modal = 0, edit personal info modal = 1, add skill modal = 2, add education modal = 3, add work experience modal = 4
    const [modalShowing, setModalShowing] = React.useState(0);
    React.useEffect(() => {
        console.log(modalShowing);
    }, [modalShowing]);
    const setModal = (modal) => {
        setModalShowing(modal);
    }

    return(
        <PageComponent>
            <EditPersonalInfo modalShowing={modalShowing} setModalShowing={setModal} user={user} setUser={setUserHandler}/>
            <BackupButton onButton={() => {setModal(1)}}>Edit Personal Info</BackupButton>
            <br/>
            <BackupButton >Add Skill</BackupButton>
            <BackupButton >Add Education</BackupButton>
            <BackupButton >Add Work Experience</BackupButton>
                

            <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                    <EditBio info={ info } handleInfoChange={ handleInfoChange } />
                </Grid>
                <Grid item xs={12} md={8}>
                    <AddProject />
                </Grid>
            </Grid>
            <br></br>
            <EditThemeControler />


                    

        </PageComponent>
    );
}

export {AdminPage}