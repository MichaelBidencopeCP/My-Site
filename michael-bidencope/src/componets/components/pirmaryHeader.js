import { styled } from '@mui/system';
function PrimaryHeader({children}){
    const StyledHeader = styled('h1')(
        ({ theme }) => `
            color: ${theme.palette.primary.main};
            margin: 0px;
        `
    );

    return(
        
        <StyledHeader>{children}</StyledHeader>
        
    );
}

function PrimarySmallHeader({children}){
    const StyledHeader = styled('h4')(
        ({ theme }) => `
            color: ${theme.palette.primary.main};
            margin: 0px;
        `
    );

    return(
        
        <StyledHeader>{children}</StyledHeader>
        
    );
}

export {PrimaryHeader, PrimarySmallHeader}