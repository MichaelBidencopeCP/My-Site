import { Box } from '@mui/material';
import { PrimaryHeader } from '../components/pirmaryHeader';
import { ColorPicker } from '../components/colorPicker';


function EditThemeControler() {

    return (
        <Box mx={{xs:0, sm:0, md:3, width:"100%"}}>
            <PrimaryHeader>Edit Theme</PrimaryHeader>
            <ColorPicker />

            
            

        </Box>
    );
}

export {EditThemeControler}