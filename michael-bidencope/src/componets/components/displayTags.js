import { Box } from "@mui/material";
import { TagElement } from "./tags.js";

import { useEffect, useState } from "react";

function DispalyProjectTags({project = 0, handSetSelectedTags = (tags) => {}, selectedTags = 0}) {
    const [tags, setTags] = useState([{name: '', svg: ''}]);

    
    const addTagToProject = (tag) => {
        let temp = selectedTags;
        temp.push(tags.find((element) => element.id === tag));
        handSetSelectedTags(temp);
        temp = tags;
        //remove from tags element with id tag
        temp.splice(temp.indexOf(tag), 1);
        setTags(temp);
    }
        //handSetSelectedTags(temp);
        //temp = tags;
        //temp.splice(temp.indexOf(tag), 1);
        //setTags(temp);
    
    
    return (
        <Box>
            {
                tags.map(tag => (
                        <TagElement key={tag.id} id={tag.id} hoverText={tag.name} svgIcon={tag.svg} onClick={addTagToProject} />
                    )
                )
            }
        </Box>
    )
}


export {DispalyProjectTags}