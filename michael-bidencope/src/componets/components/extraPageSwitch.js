import { Switch } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { getExtrasEnabled, postExtras } from "../../api";
import { LoginContext, ExtrasContext } from "../../App";



function ExtrasSwitch(){
    const [checked, setChecked] = useState(false);
    const {login,} = useContext(LoginContext);
    const {extras, setExtras} = useContext(ExtrasContext);
    useEffect(() => {
        setChecked(extras);
    }, []);
    const handleSwitch = () => {
        
        
        postExtras(!checked, login.token).then((response) => {
            if(response){
                setChecked(!checked);
                setExtras(!checked);
            }
        });
    }

    return(
        <>
            <Switch onChange={handleSwitch} checked={checked} > Lable</Switch>
        </>
    )
    
}

export { ExtrasSwitch };