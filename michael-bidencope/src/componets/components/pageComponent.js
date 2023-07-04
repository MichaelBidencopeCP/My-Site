import {Box, Card } from '@mui/material';

function PageComponent({children}){
    return(
        <Box p={2} m={0} sx={{'backgroundColor':'background.default', 'height':'100%'}}>
            <Card sx={{'backgroundColor':'secondary.main', 'height':'100%', p:2}} >
                {children}
            </Card>
        </Box>
    );
}
export {PageComponent}