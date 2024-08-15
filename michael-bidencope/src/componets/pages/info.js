import {PageComponent} from '../components/pageComponent.js'; 
import { Box } from '@mui/system';
import { PrimaryHeader } from '../components/pirmaryHeader.js';
import { Grid } from '@mui/material';
import { useMemo, useState } from 'react';
import { getProejectTags } from '../../api.js';
import { TagElement } from '../components/tags.js';
function InfoPage({info}){
    let [technologies, setTechnologies] = useState([]);
    useMemo(() => {
        if(technologies.length === 0){
            getProejectTags().then((response) => {
                setTechnologies(response.data);
            });
        }
    }, [setTechnologies]);
    return(
        <PageComponent>
            <Grid container spacing={2}>

                <Grid item xs={12} md={9}>
                    <Box>
                        <PrimaryHeader>Experience</PrimaryHeader>
                        {info.bio}
                    </Box>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Box>
                        <PrimaryHeader>Skills</PrimaryHeader>
                        <ul>
                            {technologies.map((tech) => {
                                return <TagElement key={tech.id} id={tech.id} hoverText={tech.name} svgIcon={tech.image} />
                            })}
                        </ul>
                        
                        
                    </Box>
                </Grid>
            </Grid>

        </PageComponent>
    );
}

export {InfoPage}