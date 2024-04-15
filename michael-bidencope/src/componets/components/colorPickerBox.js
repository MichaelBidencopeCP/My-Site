import { Box } from '@mui/material';

function ColorPickerBox({id , bgcolor, onClick  = ()=>{}, inline, selector = false, selectedElement = false}){
    return (
        <Box className={`colorBox ${selectedElement ? 'selected' : ''}`} id={id} key={'colorpickerS-'+id} sx={{width:30, height:30, bgcolor:bgcolor,m:0, display:inline, border: selector? 'solid 1px black':''  }} onClick={(e) => {onClick(e)}}></Box>
    )
}

export {ColorPickerBox}