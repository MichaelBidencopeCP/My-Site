import {PageComponent} from '../components/pageComponent.js'; 
import { Box } from '@mui/system';
import { PrimaryHeader } from '../components/pirmaryHeader.js';

function ContactPage({user}){
    return(
        <PageComponent>
            <Box>
                <PrimaryHeader>Contact Page</PrimaryHeader>
                {user.email ? 'Email: ' : null }{user.email}<br/>
                { user.city || user.state ? 'Location: ' : null }{user.city} {user.state}<br/>
                { user.linkedin ? 'LinkedIn: ' : null }{user.linkedin}<br/>
                { user.github ? 'GitHub: ' : null }{user.github}<br/>
            </Box>
        </PageComponent>
    );
}

export {ContactPage}