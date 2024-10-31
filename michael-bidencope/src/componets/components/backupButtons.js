import { Button, Box } from "@mui/material";


function BackupButton({children, onButton, type, height}){
    return(
        <Button color="backup" variant="contained" sx={{mr:1, mb:1, height}} onClick={onButton} type={type}>
            <b>{children}</b>
        </Button>
    );
}

export {BackupButton}