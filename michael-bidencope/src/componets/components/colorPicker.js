import { Grid, Box, Typography } from '@mui/material';
import { red, pink, purple, deepPurple, indigo, blue, lightBlue, cyan, teal, green, lightGreen, lime, yellow, amber, orange, deepOrange, brown, grey, blueGrey } from '@mui/material/colors';

import { ColorPickerBox  } from './colorPickerBox.js';

import { useState, useEffect } from 'react';

function ColorPicker(){
    //-1 means no color is selected, 0 means red is selected, 1 means pink is selected, etc.
    const [selectedColor, setSelectedColor] = useState(-1);
    const colorSelect = (e) => {
        console.log(e.target.id);
    }
    const colorGroupSelect = (e) => {
        
        //take id in form of colorBoxDropdownContol + id and convert to colorBoxDropdown + id
        let id = e.target.id;
        id = id.replace('colorBoxDropdownContol', '');
        setSelectedColor(id);
        

    }
    const fillColorPicker = () => {
        let colorArray = [red, pink, purple, deepPurple, indigo, blue, lightBlue, cyan, teal, green, lightGreen, lime, yellow, amber, orange, deepOrange, brown, grey, blueGrey];
        let outputDict = {'red':[], 'pink':[], 'purple':[], 'deepPurple':[], 'indigo':[], 'blue':[], 'lightBlue':[], 'cyan':[], 'teal':[], 'green':[], 'lightGreen':[], 'lime':[], 'yellow':[], 'amber':[], 'orange':[], 'deepOrange':[], 'brown':[], 'grey':[], 'blueGrey':[]};
        let names = ['red', 'pink', 'purple', 'deepPurple', 'indigo', 'blue', 'lightBlue', 'cyan', 'teal', 'green', 'lightGreen', 'lime', 'yellow', 'amber', 'orange', 'deepOrange', 'brown', 'grey', 'blueGrey'];
        for(let x = 0; x < colorArray.length; x++){
            for(let y = 100; y < 900; y += 100){
                outputDict[names[x]].push(colorArray[x][y]);
            }
            outputDict[names[x]] = outputDict[names[x]].map((color, index) => {
                let id = "colorBoxSelect" + x +'-' + index;
                return <ColorPickerBox id={id} bgcolor={color} onClick={colorSelect} />
            });

        }
        //put each list of elements into a seperate box
        //return the boxes
        Object.keys(outputDict).forEach((key, index) => {
            let id = 'colorBoxDropdown' + index;
            outputDict[key] = selectedColor == index ? <Box id={id} >{outputDict[key]}</Box>:''
            
        });
        let returns = { colors: outputDict, names: []}
        for(let x = 0; x < names.length; x++){
            let id = 'colorBoxDropdownContol' + x;
            returns.names.push(<ColorPickerBox id={id} bgcolor={colorArray[x][500]} onClick={colorGroupSelect} />);
        }

        return returns;
        //check to make sure isnt running whole function every time state changes
    }
    

    const colorDict = fillColorPicker();
    

    const placeHolderTiles = () => {
        let output = [];
        let loopFor = selectedColor;
        if (selectedColor > colorDict['names'].length/2){
            loopFor = selectedColor - colorDict['names'].length/2 -1 ;
        }
        for(let x = 0; x < loopFor; x++){
            output.push(<ColorPickerBox key={x} bgcolor={'transparent'}/>);
        }
        console.log(selectedColor);
        return output;
    };

    
    return (
        <Box>
            
            <Box sx={{width:"100%", display:'inline-flex', mb:0, gap:0 }}>
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
            <Box sx={{width:"100%", height:"100%", display:'inline-flex', m:0}}>
                {
                    //print array of elements from colorDict['names']
                    colorDict['names'].map((element, index) => {
                        //print element if in first half of array
                    
                        if(index >= colorDict['names'].length / 2){
                            return element;
                        }
                    })
                }
                
            </Box>

             
            <Box sx={{display:'inline-flex' }}>
                {placeHolderTiles()}
                
                {
                    Object.keys(colorDict['colors']).map((key) => {
                        return colorDict['colors'][key];
                    })
                }
                

            </Box>
            
        </Box>    

        
        
    )
}

export {ColorPicker}