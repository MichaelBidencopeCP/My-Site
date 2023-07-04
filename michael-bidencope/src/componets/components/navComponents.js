
import MenuIcon from '@mui/icons-material/Menu';
import { Button, Icon } from '@mui/material';
function NavIcon(){
    const iconContainerStyle = {
        width : '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
    };
    const iconStyle = {
        border: "2px solid",
        borderRadius: "50%",
        borderColor: "rgba(255,255,255,0)",

        "&:hover": {
            border: "2px solid",
            borderColor: "secondary.main",
            borderRadius: "50%",


        },

    };
    return(
        <Icon color={'secondary'} sx={iconContainerStyle}>
            <MenuIcon fontSize={'large'} sx={iconStyle} />
        </Icon>
    );
}

function NavButton({children}){
    const btnStyling = {
        height: '75%',
        color: 'secondary.main',
    };
    return(

        <Button variant="text" sx={btnStyling} ><h3 style={{margin:'0px'}}>{children}</h3></Button>

    );
}

export {NavIcon, NavButton};