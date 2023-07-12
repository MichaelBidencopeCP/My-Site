import { SvgIcon, Tooltip } from '@mui/material';

function TagElement( {hoverText, svgIcon, id=0, onClick= ()=>{}}){



    return (
        <Tooltip title={hoverText}>
            <SvgIcon onClick={() =>{onClick(id)}} sx={{width:'30px', height:'30px', ml:1}}>
                <path d= {svgIcon} />
            </SvgIcon>

        </Tooltip>
    )

}

export { TagElement }