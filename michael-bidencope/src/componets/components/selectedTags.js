import { Box } from "@mui/material";
import { TagElement } from "./tags.js";

function SelectedTags({selectedTags = [{name: '', svg: ''}], handleSetSelectedTags}) {
    const onClickDo = (tag) => {
        handleSetSelectedTags(tag);
    }

    return (
        <Box>
            {
                selectedTags.map(tag => (
                        <TagElement key={tag.id} hoverText={tag.name} svgIcon={tag.svg} id={tag.id} onClick={onClickDo} />
                    )
                )
            }
        </Box>
    )
}


export {SelectedTags}