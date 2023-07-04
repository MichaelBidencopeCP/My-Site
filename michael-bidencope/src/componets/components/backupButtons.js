import { Button, Box } from "@mui/material";


function BackupButton({children, onButton, type}){
    return(
        <Button variant="contained" color="backup" sx={{mr:1, mb:1}} onClick={onButton} type={type}>
            <Box sx={{ fontWeight: 'bold',  color:"backcup.contrastText", m:0 }}>{children}</Box>
        </Button>
    );
}

export {BackupButton}