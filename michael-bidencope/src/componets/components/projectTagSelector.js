import { Grid, Hidden } from '@mui/material';

import { SelectedTags } from "./selectedTags";
import { PrimarySmallHeader } from './pirmaryHeader';

import { useEffect, useState } from 'react';
import { getProejectTags } from '../../api.js';
//used for admin page to add a tag to a project when editing or creating a project.
function AddTagsToProject({selectedTags, setSelectedTags}) {
    
    const [unselectedTags, setUnselectedTags] = useState([]);

    //get all tags
    useEffect(() => {
        getProejectTags(0).then((data) => {
            setUnselectedTags(data.tags);
        })
    }, [])
    
    //when a tag is selected move it to opposite list
    const handleTagSelection = (tag) => {
        let selected = [...selectedTags];
        let unselected = [...unselectedTags];
        let item = unselected.find((element) => element.id === tag);
        if(item){
            unselected.splice(unselected.indexOf(item), 1);
            selected.push(item);
            setSelectedTags(selected);
            setUnselectedTags(unselected);
        }
        else{
            item = selected.find((element) => element.id === tag);
            selected.splice(selected.indexOf(item), 1);
            unselected.push(item);
            setSelectedTags(selected);
            setUnselectedTags(unselected);
        }
    }
    return (
        <Grid container spacing={0} >
            <Grid item xs={12} md={6} sx={{}} height={'90px'} className=''>
                <div className='contianerContinaer'>
                    <div className='scrollContainer'>
                        <div className='scrollCard'>
                            <PrimarySmallHeader>Tags</PrimarySmallHeader>
                            <SelectedTags selectedTags={unselectedTags} handleSetSelectedTags={handleTagSelection} />
                        </div>
                    </div>
                </div>
            </Grid>
            <Grid item xs={12} md={6}>
                <PrimarySmallHeader>Selected Tags</PrimarySmallHeader>
                <SelectedTags selectedTags={selectedTags} handleSetSelectedTags={handleTagSelection}/>
            </Grid>
        </Grid>

    )
}

export { AddTagsToProject }
