import { Box } from '@mui/material';

function ColorPickerBox({id , bgcolor, onClick}){

    
    return (
        <Box className='colorBox' id={id} sx={{width:30, height:30, bgcolor:bgcolor,mb:0  }} onClick={(e) => {onClick(e)}}></Box>
    )
}

export {ColorPickerBox}