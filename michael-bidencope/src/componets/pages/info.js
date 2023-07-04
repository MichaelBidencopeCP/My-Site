import {PageComponent} from '../components/pageComponent.js'; 
import { Box } from '@mui/system';
function InfoPage({info}){
    return(
        <PageComponent> <Box>Information:<br/> {info.bio}</Box> </PageComponent>
    );
}

export {InfoPage}