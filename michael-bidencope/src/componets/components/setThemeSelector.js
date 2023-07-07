import { ColorPickerBox  } from './colorPickerBox.js';

import { useEffect, useState, useRef } from 'react';

function SetThemeSelector({currentTheme, handleSelectedThemeColorChange, selectedThemeColor}){

    const onSelectedColorChange = (e) => {
        let id = e.target.id;
        id = id.replace('handleSelectedColorChange', '');
        handleSelectedThemeColorChange(id);
    }
    
    

    return(
        <>
            
            <ColorPickerBox selectedElement={selectedThemeColor == 1 ? true: false} onClick={onSelectedColorChange} selector={true} inline={'inline-block'} id={'handleSelectedColorChange'+1} bgcolor={currentTheme.background_default}/>
            <ColorPickerBox selectedElement={selectedThemeColor == 2 ? true: false} onClick={onSelectedColorChange} selector={true} inline={'inline-block'} id={'handleSelectedColorChange'+2} bgcolor={currentTheme.primary_main}/>
            <ColorPickerBox selectedElement={selectedThemeColor == 3 ? true: false} onClick={onSelectedColorChange} selector={true} inline={'inline-block'} id={'handleSelectedColorChange'+3} bgcolor={currentTheme.primary_contrast}/>
            <ColorPickerBox selectedElement={selectedThemeColor == 4 ? true: false} onClick={onSelectedColorChange} selector={true} inline={'inline-block'} id={'handleSelectedColorChange'+4} bgcolor={currentTheme.backup_main}/>
            <ColorPickerBox selectedElement={selectedThemeColor == 5 ? true: false} onClick={onSelectedColorChange} selector={true} inline={'inline-block'} id={'handleSelectedColorChange'+5} bgcolor={currentTheme.backup_contrast}/>
            <ColorPickerBox selectedElement={selectedThemeColor == 6 ? true: false} onClick={onSelectedColorChange} selector={true} inline={'inline-block'} id={'handleSelectedColorChange'+6} bgcolor={currentTheme.secondary_main}/>
            <ColorPickerBox selectedElement={selectedThemeColor == 7 ? true: false} onClick={onSelectedColorChange} selector={true} inline={'inline-block'} id={'handleSelectedColorChange'+7} bgcolor={currentTheme.error}/>
        </>
    )
}

export {SetThemeSelector}