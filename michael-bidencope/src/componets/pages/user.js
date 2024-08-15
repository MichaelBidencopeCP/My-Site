import { useContext, useState } from "react";
import { LoginContext } from "../../App";
import { PageComponent } from "../components/pageComponent";
import { PrimaryHeader, PrimarySmallHeader } from "../components/pirmaryHeader";
import { titleCase } from "../../utils";
import { BackupButton } from "../components/backupButtons";
import { EditThemeControler } from "../features/editTheme";
import { ChangePassword } from "../features/changePassword";



function UserPage({currentTheme, handleThemeChange}) {
    let {login, setLogin} = useContext(LoginContext);
    let [modalShowing, setModalShowing] = useState(0);
    const openModal = () => {
        setModalShowing(5);
    }
    return (
        <PageComponent>
            <PrimaryHeader> Welcome {titleCase(login.username)} </PrimaryHeader>
            <PrimarySmallHeader>This is the user dashboard, you can change your password and theme for the site</PrimarySmallHeader>
            <BackupButton onButton={openModal}>Change Password</BackupButton>
            <ChangePassword modalShowing={modalShowing} setModalShowing={setModalShowing}/>

        </PageComponent>
    )
}

export { UserPage }