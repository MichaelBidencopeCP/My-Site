import { useContext } from "react";
import { LoginContext } from "../../App";
import { PageComponent } from "../components/pageComponent";
import { PrimaryHeader, PrimarySmallHeader } from "../components/pirmaryHeader";
import { titleCase } from "../../utils";
import { BackupButton } from "../components/backupButtons";
import { EditThemeControler } from "../features/editTheme";



function UserPage({currentTheme, handleThemeChange}) {
    let {login, setLogin} = useContext(LoginContext);

    return (
        <PageComponent>
            <PrimaryHeader> Welcome {titleCase(login.username)} </PrimaryHeader>
            <PrimarySmallHeader>This is the user dashboard, you can change your password and theme for the site</PrimarySmallHeader>
            <BackupButton>Change Password</BackupButton>
            <EditThemeControler currentTheme={currentTheme} handleThemeChange={handleThemeChange}/>


        </PageComponent>
    )
}

export { UserPage }