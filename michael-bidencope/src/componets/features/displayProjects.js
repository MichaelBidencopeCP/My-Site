
import { useContext, useEffect, useState } from "react"
import { getProjects } from "../../api"
import { Project } from "../components/project"
import { Grid } from "@mui/material"
import { getProjectsFromLocal, setProjectsInLocal } from "../../localStorage"

import { UpdateContext } from "../../App"

function DispalyProjects(){
    const [projects, setProjects] = useState([])
    const {update, setUpdate} = useContext(UpdateContext);
    useEffect(() => {
        let localResponse = getProjectsFromLocal();
        if (localResponse && !update.update ){
            setProjects(Object.values(localResponse));
        }
        else{
            
            if(update.update == true && update.updatedProjects == true){

                getProjects().then((response) => {
                    setProjects(Object.values(response));
                    setProjectsInLocal(Object.values(response));
                })
                let updateHold = {...update};
                updateHold.updatedProjects = false;
                setUpdate(updateHold);
            }
            else if(!localResponse){
                getProjects().then((response) => {
                    setProjects(Object.values(response));
                    setProjectsInLocal(Object.values(response));
                })
            }
        }
        
    }, [update.update])


    return(
        
        <Grid container spacing={2}>
            {
                projects ? projects.map((project) => {
                    return <Grid item xs={4} key={'grid'+project.id}><Project project={project} key={'project' +project.id} /></Grid>
                }) : <div>loading</div>
            }
        </Grid>
    )
}

export {DispalyProjects}