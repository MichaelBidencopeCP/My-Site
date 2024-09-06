

import { IconButton, SvgIcon } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';


function EditButtonIcon({selected, handleEdit})
{
    
    return (
        <IconButton onClick={() => {handleEdit(selected.index);}} style={{marginLeft:'6px'}}>
            <EditIcon />
        </IconButton>
        
    );
}

export { EditButtonIcon }