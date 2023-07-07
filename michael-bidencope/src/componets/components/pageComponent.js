import {Box, Card } from '@mui/material';

function PageComponent({children}){
    return(
        <Box p={2} m={0} sx={{'backgroundColor':'background.default', display:'block', minHeight:'90vh', maxHeight:'fit-content'}} className={'screenHeightFix'}>
            
            <Card sx={{'backgroundColor':'secondary.main', p:2, overflow:'visible', height:'100%'}}  >

                {children}

            </Card>
        </Box>
    );
}
export {PageComponent}