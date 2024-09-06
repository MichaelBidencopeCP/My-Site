import { IconButton, SvgIcon } from "@mui/material";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
import { red } from "@mui/material/colors";

function DeleteButtonIcon({selected, handleSelect}){
    
    
    const path = !selected.clicked ? <CheckBoxOutlineBlankIcon/>  : <IndeterminateCheckBoxIcon sx={{color:red[500]}}/>;
    return (
        <IconButton onClick={()=>{handleSelect(selected.index)}}>
            {path}
        </IconButton>
    );
}

function SelectAllDeleteButton({ onClick, allSelected}){
    const path = allSelected ? <IndeterminateCheckBoxIcon sx={{color:red[500]}}/> : <CheckBoxOutlineBlankIcon/>;
    return(
        <IconButton onClick={()=>{onClick()}}>
            {path}
        </IconButton>
    )
}

export { DeleteButtonIcon, SelectAllDeleteButton}