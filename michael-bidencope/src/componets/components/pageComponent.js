import {Box } from '@mui/material';
import {Card} from '@mui/material'

function PageComponent({children}){
    return(
        <Box p={2} m={0} sx={{'backgroundColor':'#282c34', 'height':'100%'}}>
            <Card sx={{'backgroundColor':'secondary.main', 'height':'100%', p:2}} >
                {children}
            </Card>
        </Box>
    );
}
export {PageComponent}