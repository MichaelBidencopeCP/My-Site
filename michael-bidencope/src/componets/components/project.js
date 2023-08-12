import { titleCase } from '../../utils';

import { Card, CardContent, CardMedia } from "@mui/material";

import { PrimaryHeader, PrimarySmallHeader } from './pirmaryHeader';
import { TagElement } from './tags';

function Project({project}) {
    project.name = titleCase(project.name);
    project.tags = project.technologies;
    
    return (
        <Card>
            <CardContent>
                <PrimaryHeader>{project.name}</PrimaryHeader>
                
                <p>
                    {project.description}
                </p>
                {
                    project.tags.map((tag, index) => {
                        return <TagElement key={index} hoverText={tag.name} svgIcon={tag.image} />
                    })
                }
            </CardContent>
        </Card>

    )
}

export {Project}