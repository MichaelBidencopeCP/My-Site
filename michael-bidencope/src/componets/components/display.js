import { Box } from '@mui/material';

function DisplayOnlySM({children}){
    return(
        <Box sx={{ display: { xs: 'block', md: 'none'} }} padding={0}>
            {children}
        </Box>
    );
}

function DisplayGreaterThanSM({children}){
    return(
        <Box sx={{ display: { xs: 'none', md: 'block'},  }} >
            {children}
        </Box>
    );
}


export {DisplayGreaterThanSM, DisplayOnlySM};