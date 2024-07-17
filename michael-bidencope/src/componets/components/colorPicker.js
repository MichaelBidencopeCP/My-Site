import { Grid, Box, Typography, IconButton, TextField } from '@mui/material';
import { red, pink, purple, deepPurple, indigo, blue, lightBlue, cyan, teal, green, lightGreen, lime, yellow, amber, orange, deepOrange, brown, grey, blueGrey } from '@mui/material/colors';

import { ColorPickerBox  } from './colorPickerBox.js';

import { useState, useEffect } from 'react';

import { PrimarySmallHeader } from './pirmaryHeader.js';

import AddIcon from '@mui/icons-material/Add';

function AddButton({onClick}) {
    return (
        <IconButton onClick={onClick}>
            <AddIcon />
        </IconButton>
    )
}



function ColorPicker({ouputTo}){
    //-1 means no color is selected, 0 means red is selected, 1 means pink is selected, etc.
    const [selectedColorGroup, setSelectedColorGroup] = useState(-1);
    const [customColor, setCustomColor] = useState('');
    const [alert, setAlert] = useState(0);
    
    const submitCustomColor = () => {
        //TODO check if customColor is a valid color in hex format
        let color = customColor;
        if (!customColor.startsWith('#')){
            color = '#' + customColor;
        }
        if (customColor.length != 7){
            
            return;
        }
        color = 'custom' + customColor;
        ouputTo(color);
        setSelectedColorGroup(-1);
    }

    const colorSelect = (e) => {
        ouputTo(e.target.id);
        setSelectedColorGroup(-1);
    }
    
    const colorGroupSelect = (e) => {  
        //take id in form of colorBoxDropdownContol + id and convert to colorBoxDropdown + id
        let id = e.target.id;
        id = id.replace('colorBoxDropdownContol', '');
        if (selectedColorGroup == id){
            id = -1;
        }
        setSelectedColorGroup(id);
    }
    

    const fillColorPicker = () => {
        let colorArray = [red, pink, purple, deepPurple, indigo, blue, lightBlue, cyan, teal, green, lightGreen, yellow, amber, orange, deepOrange, brown, grey, blueGrey];
        let outputDict = {'red':[], 'pink':[], 'purple':[], 'deepPurple':[], 'indigo':[], 'blue':[], 'lightBlue':[], 'cyan':[], 'teal':[], 'green':[], 'lightGreen':[], 'yellow':[], 'amber':[], 'orange':[], 'deepOrange':[], 'brown':[], 'grey':[], 'blueGrey':[]};
        let names = ['red', 'pink', 'purple', 'deepPurple', 'indigo', 'blue', 'lightBlue', 'cyan', 'teal', 'green', 'lightGreen',  'yellow', 'amber', 'orange', 'deepOrange', 'brown', 'grey', 'blueGrey'];
        for(let x = 0; x < colorArray.length; x++){
            for(let y = 100; y <= 900; y += 100){
                outputDict[names[x]].push(colorArray[x][y]);
            }
            outputDict[names[x]] = outputDict[names[x]].map((color, index) => {
                let id =  'color' + x +'-' + (index+1)*100;
                return <ColorPickerBox id={id} bgcolor={color} onClick={colorSelect} inline={'inline-block'}/>
            });

        }
        //put each list of elements into a seperate box
        //return the boxes
        Object.keys(outputDict).forEach((key, index) => {
            let id = 'colorBoxDropdown' + index;
            outputDict[key] = selectedColorGroup == index ? <Box id={id} >{outputDict[key]}</Box>:''
            
        });
        let returns = { colors: outputDict, names: []}
        for(let x = 0; x < names.length; x++){
            let id = 'colorBoxDropdownContol' + x;
            returns.names.push(<ColorPickerBox key={'colorpicker-'+id} id={id} bgcolor={colorArray[x][500]} inline={'inline-block'} onClick={colorGroupSelect} />);
        }

        return returns;
        //check to make sure isnt running whole function every time state changes
    }
    

    const colorDict = fillColorPicker();
    

    const placeHolderTiles = () => {
        let output = [];
        let loopFor = selectedColorGroup;
        if (selectedColorGroup > colorDict['names'].length/2){
            loopFor = selectedColorGroup - colorDict['names'].length/2 -1 ;
        }
        for(let x = 0; x < loopFor; x++){
            output.push(<ColorPickerBox key={x} bgcolor={'transparent'}/>);
        }
        return output;
    };

    
    return (
        <Box sx={{height:'100%',m:0, p:0}}>
            
            <Box sx={{height:30}}>
                {
                    //print array of elements from colorDict['names']
                    colorDict['names'].map((element, index) => {
                        //print element if in first half of array
                    
                        if(index < colorDict['names'].length / 2){
                            return element;
                        }
                    })
                }
            </Box>
            <Box sx={{m:0, height:30}}>
            
                {
                    //print array of elements from colorDict['names']
                    colorDict['names'].map((element, index) => {
                        //print element if in first half of array
                    
                        if(index >= colorDict['names'].length / 2){
                            return element;
                        }
                        return '';
                    })
                }
            </Box>
            
            {selectedColorGroup!=-1? <PrimarySmallHeader>Color </PrimarySmallHeader>:''}
            <Box sx={{display:'inline-flex' }}>
                {/*{placeHolderTiles()}*/}
                
                {
                    Object.keys(colorDict['colors']).map((key) => {
                        return colorDict['colors'][key];
                    })
                }
            </Box>
            <PrimarySmallHeader>Custom Color</PrimarySmallHeader>
            {alert == 1 ? <Typography sx={{color:'red'}}>Color must be a hex value</Typography>:''}
            <TextField 
                sx={{ width:'100%'}}
                type="text" 
                id="customColorInput" 
                onChange={(e)=>{setCustomColor(e.target.value)}} 
                placeholder="#CustomColor" 
                InputProps={{endAdornment: <AddButton onClick={()=>{submitCustomColor()}}/>}}
            />

        </Box>
        
    )
}

export {ColorPicker}