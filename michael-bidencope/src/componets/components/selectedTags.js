import { Box } from "@mui/material";
import { TagElement } from "./tags.js";
import { useEffect } from "react";

function SelectedTags({selectedTags = [{name: '', svg: ''}], handleSetSelectedTags}) {
    const onClickDo = (tag) => {
        handleSetSelectedTags(tag);
    }
    useEffect(() => {  
        console.log(selectedTags)
    }, [selectedTags])

    return (
        <Box>
            {
                selectedTags.map(tag => (
                        <TagElement key={"s-tags-" + tag.id} hoverText={tag.name} svgIcon={tag.image} id={tag.id} onClick={()=>{onClickDo(tag.id)}} />
                    )
                )
            }
        </Box>
    )
}


export {SelectedTags}