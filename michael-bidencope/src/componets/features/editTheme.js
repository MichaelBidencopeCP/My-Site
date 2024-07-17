import { Box, Alert } from '@mui/material';
import { PrimaryHeader } from '../components/pirmaryHeader';
import { ColorPicker } from '../components/colorPicker';
import { SetThemeSelector } from '../components/setThemeSelector';
import { PrimarySmallHeader } from '../components/pirmaryHeader';

import { red, pink, purple, deepPurple, indigo, blue, lightBlue, cyan, teal, green, lightGreen, lime, yellow, amber, orange, deepOrange, brown, grey, blueGrey } from '@mui/material/colors';

import { useState, useEffect, useContext } from 'react';
import { BackupButton } from '../components/backupButtons';

import { postThemeForSite, setUpdateValueAPI } from '../../api'

import { LoginContext, UpdateContext } from '../../App';

function EditThemeControler({currentTheme, handleThemeChange}) {
    const [selectedThemeColor, setSelectedThemeColor] = useState(-1);
    const [colorInput, setColorInput] = useState('');
    const [resFlag, setResFlag] = useState(0); 
    const [holdCurrentTheme, setHoldCurrentTheme] = useState(0);

    const {login, } = useContext(LoginContext)
    const {update, setUpdate } = useContext(UpdateContext);
    const token = login.token;
    
    const handleColorInput = (id) =>
    {
        setColorInput(id);
    }
    const handleSelectedThemeColorChange = (color) => {
        if (selectedThemeColor == color) {
            setSelectedThemeColor(-1);
        }
        else {
            setSelectedThemeColor(color);
        }
    }
    useEffect(() => { 
        let colorArray = [red, pink, purple, deepPurple, indigo, blue, lightBlue, cyan, teal, green, lightGreen, yellow, amber, orange, deepOrange, brown, grey, blueGrey];
        if (colorInput == '') {
            return;
        }
        //not best way of doing it 
        let holdColorInput;
        if (colorInput.startsWith('custom')){
            colorArray[20]= [colorInput.replace('custom', '')];
            holdColorInput = [20, 0];
        }
        else{
            holdColorInput = colorInput.split('-'); 
            holdColorInput[0] = holdColorInput[0].replace('color', '');
        }
        let holdState =  {...currentTheme}
        if(selectedThemeColor != -1){           
            switch(parseInt(selectedThemeColor)){
                case 1:
                    holdState.background_default = colorArray[holdColorInput[0]][holdColorInput[1]];
                    break;
                    
                case 2:
                    holdState.primary_main = colorArray[holdColorInput[0]][holdColorInput[1]];
                    break;
                case 3:
                    holdState.primary_contrast = colorArray[holdColorInput[0]][holdColorInput[1]];
                    break;
                case 4:
                    holdState.backup_main = colorArray[holdColorInput[0]][holdColorInput[1]];
                    break;
                case 5:
                    holdState.backup_contrast = colorArray[holdColorInput[0]][holdColorInput[1]];
                    break;
                case 6:
                    holdState.secondary_main = colorArray[holdColorInput[0]][holdColorInput[1]];
                    break;
                case 7:
                    holdState.error = colorArray[holdColorInput[0]][holdColorInput[1]];
                    break;
            }
            handleThemeChange(holdState);
        }
    }, [colorInput])
    useEffect(() => {
        setHoldCurrentTheme({...currentTheme});
    }, [])

    const resetTheme = () => {
        handleThemeChange({...holdCurrentTheme});
    }

    const saveTheme = () => {
        postThemeForSite(currentTheme, token).then((res) => {
            if (res) {
                setResFlag(1);
                setUpdateValueAPI(login.token);
                let hold = {...update};
                hold.activeUpdate = true;
                setUpdate(hold);
            }
            else {
                setResFlag(2);
            }
        });
    }

    return (
        <Box  sx={{ p:2, pl:0,ml:0 ,width:'fit-content', borderRadius:2 }}>
            <PrimaryHeader>Edit Theme</PrimaryHeader>
            <BackupButton onButton={saveTheme} >Save</BackupButton>
            <BackupButton onButton={() =>{resetTheme()}} >Reset</BackupButton>
            
            <PrimarySmallHeader>Current Theme</PrimarySmallHeader>
            {resFlag === 1 ? <Alert severity="error" sx={{mb:2, mt:1}} >Failed to save</Alert>: ''}
            {resFlag === 2 ? <Alert severity="success" sx={{mb:2, mt:1}} >Saved</Alert>: ''}
            
            <SetThemeSelector currentTheme={currentTheme} handleSelectedThemeColorChange={handleSelectedThemeColorChange} selectedThemeColor={selectedThemeColor}/>
            <PrimarySmallHeader>Color Groups</PrimarySmallHeader>
            <ColorPicker ouputTo={handleColorInput} />

        </Box>
    );
}

export {EditThemeControler}