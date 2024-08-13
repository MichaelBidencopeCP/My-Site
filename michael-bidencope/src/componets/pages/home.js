import {PageComponent} from '../components/pageComponent.js'; 
import { Box } from '@mui/system';
import { DispalyProjects } from '../features/displayProjects.js';
import { Modal } from '@mui/material';
function HomePage({tokenExp}){
    return(
        <PageComponent>
            <Modal open={tokenExp? true :false} >
                    <Box>
                        <h1>Session Expired</h1>
                        <p>please log back in</p>
                    </Box>
            </Modal>
            <DispalyProjects/>
        </PageComponent>
    );
}

export {HomePage}