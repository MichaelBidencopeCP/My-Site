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
                        <TagElement key={"stags-" + tag.id} hoverText={tag.name} svgIcon={tag.image} id={tag.id} onClick={onClickDo} />
                    )
                )
            }
        </Box>
    )
}


export {SelectedTags}