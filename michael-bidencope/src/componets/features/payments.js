import { Collapse, Dialog, DialogContent, DialogTitle, FormControl, Grid2, Icon, InputLabel, List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader, TextField } from "@mui/material";
import { useContext, useEffect, useMemo, useState } from "react";
import { getClients, newClient, setInvoiceNumber } from "../../api";
import { LoginContext } from "../../App";
import { BackupButton } from "../components/backupButtons";
import { PaymentsList } from "../components/paymentList";


function Payments({modalShowing, setModalShowing} ) {
    let [clients, setClients] = useState([]);
    let [invoice, setInvoice] = useState(0);
    let [addClientDrop, setAddClientDrop] = useState(false);
    let {login,} = useContext(LoginContext);



    useMemo(() => {
        //fetch clients
        getClients(login.token).then((data) => {
            setClients(data);
        }).catch((error) => {
            console.error(error);
        });
        //fetch payments
    }, []);

    let addClient = () => {
        let clientName = document.getElementById("add-client-name").value;
        newClient(login.token, clientName).then((data) => {
            let hold = clients;
            hold.push(data);
            setClients(hold);
            setAddClientDrop(false);
            document.getElementById("add-client-name").value = "";
        });
       
    }

    let addClientTrigger = () => {
        setAddClientDrop(!addClientDrop);
    }
    let updateInvoiceNumber = () => {

        setInvoiceNumber(invoice).then((data) => {
            setInvoice(data);
        });
    }


    return (
        <Dialog onClose={() => {setModalShowing(0)}} open={modalShowing === 6? true:false} maxWidth={'md'} fullWidth={true}>
        <DialogTitle><h1>Payments</h1></DialogTitle>
            <DialogContent>

                <TextField id="new-payment-amount" label="invoice #" variant="standard" type = "number" onChange={e => setInvoice(e.target.value)} value={invoice}/>
                <BackupButton onButton={updateInvoiceNumber}>Submit</BackupButton>
                <Grid2 container spacing={2}>
                    <Grid2 item size={4}>
                        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }} subheader={<ListSubheader component={'div'} id={"client-list-header"}><h2>Clients</h2></ListSubheader>}>
                            <ListItemButton onClick={addClientTrigger}>
                                <ListItemIcon>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                </ListItemIcon>
                                
                                <ListItemText primary="Add Client" />
                            </ListItemButton>
                            <Collapse in={addClientDrop}>
                                <TextField id="add-client-name" label="Client Name" variant="standard" />
                                <BackupButton onButton={addClient}>Add Client</BackupButton>
                            </Collapse>
                            { clients.map((client) => {
                                    return (
                                            <ListItemButton key={client.id}>
                                                <ListItemText primary={client.name} />
                                            </ListItemButton>
                                    );
                                })
                            }
                        </List>
                    </Grid2>
                    <Grid2 item size={8}>
                        <div className="flex flex-col">
                            <h1>Payments</h1>
                        </div>
                        <PaymentsList clients={clients}/>
                    </Grid2>
                </Grid2>
            </DialogContent>
        </Dialog>

    );
}

export {Payments};
