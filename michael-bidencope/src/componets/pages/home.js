import {PageComponent} from '../components/pageComponent.js'; 
import { Box } from '@mui/system';
import { DispalyProjects } from '../features/displayProjects.js';
function HomePage(){
    return(
        <PageComponent> 
            <DispalyProjects/>
        </PageComponent>
    );
}

export {HomePage}