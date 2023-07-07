import { Box, Alert } from '@mui/material';
import { PrimaryHeader } from '../components/pirmaryHeader';
import { ColorPicker } from '../components/colorPicker';
import { SetThemeSelector } from '../components/setThemeSelector';
import { PrimarySmallHeader } from '../components/pirmaryHeader';

import { red, pink, purple, deepPurple, indigo, blue, lightBlue, cyan, teal, green, lightGreen, lime, yellow, amber, orange, deepOrange, brown, grey, blueGrey } from '@mui/material/colors';

import { useState, useEffect, useRef } from 'react';
import { BackupButton } from '../components/backupButtons';

import { postThemeForSite } from '../../api'

function EditThemeControler({currentTheme, handleThemeChange, token}) {
    const [selectedThemeColor, setSelectedThemeColor] = useState(-1);
    const [colorInput, setColorInput] = useState('');
    const [resFlag, setResFlag] = useState(false); 
    const handleColorInput = (id) =>
    {
        setColorInput(id);
    }

    const invertColor =  (currentTheme) => {
        let hex = currentTheme.primary_main;
        const padZero = (str, len) => {
            len = len || 2;
            var zeros = new Array(len).join('0');
            return (zeros + str).slice(-len);
        };
        if (hex.indexOf('#') === 0) {
            hex = hex.slice(1);
        }
        // convert 3-digit hex to 6-digits.
        if (hex.length === 3) {
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }
        if (hex.length !== 6) {
            throw new Error('Invalid HEX color.');
        }
        // invert color components
        var r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16),
            g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16),
            b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16);
        // pad each with zeros and return
        return '#' + padZero(r) + padZero(g) + padZero(b);
    };
    const handleSelectedThemeColorChange = (color) => {
        if (selectedThemeColor == color) {
            setSelectedThemeColor(-1);
        }
        else {
            setSelectedThemeColor(color);
        }
    }
    useEffect(() => { 
        let colorArray = [red, pink, purple, deepPurple, indigo, blue, lightBlue, cyan, teal, green, lightGreen, lime, yellow, amber, orange, deepOrange, brown, grey, blueGrey];
        let holdColorInput = colorInput.split('-'); 
        holdColorInput[0] = holdColorInput[0].replace('color', '');
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
            console.log(currentTheme)
        }
    }, [colorInput])
    
    useEffect(() => {
        console.log(currentTheme);
    }, [currentTheme])
    const saveTheme = () => {
        postThemeForSite(currentTheme, token).then((res) => {
        
            if (res) {
                console.log('Theme Saved');
                setResFlag(false);
            }
            else {

                setResFlag(true);
            }
        });
    }

    return (
        <Box  sx={{ p:2, pl:0,ml:0 ,width:'fit-content', borderRadius:2 }}>
            <PrimaryHeader>Edit Theme</PrimaryHeader>
            <BackupButton onButton={saveTheme} >Save</BackupButton>
            <PrimarySmallHeader>Current Theme</PrimarySmallHeader>
            {resFlag ? <Alert severity="error" sx={{mb:2, mt:1}} >Failed to save</Alert>: ''}
            
            <SetThemeSelector currentTheme={currentTheme} handleSelectedThemeColorChange={handleSelectedThemeColorChange} selectedThemeColor={selectedThemeColor}/>
            <PrimarySmallHeader>Color Gropus</PrimarySmallHeader>
            <ColorPicker ouputTo={handleColorInput} />

            


        </Box>
    );
}

export {EditThemeControler}