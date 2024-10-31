import { Box, FormControl, Grid2, InputLabel, Select, TextField, Typography } from "@mui/material";
import { useContext, useMemo, useState } from "react";
import { BackupButton } from "./backupButtons";
import { getClients, getPayments, postPayment } from "../../api";
import { LoginContext } from "../../App";



function PaymentsList({clients}) {
    let [payment, setPayment] = useState([]);
    let [newClient, setNewClient] = useState(0);
    let [newAmount, setNewAmount] = useState(0);
    let {login,} = useContext(LoginContext);
    let submitPayment = () => {
        
        let client = clients.find((x) => {
            return x.id === parseInt(newClient);
        });
        //change amount from fromat 0.00 or 0 to 000
        let parsedAmount = parseFloat(newAmount).toFixed(2) * 100;
        let newPayment = {
            id: null,
            client: {
                id: client.id,
                name: client.name
            },
            amount: parsedAmount,
            status: "pending"
        }
        postPayment(newPayment, login.token).then((data) => {
            //add payment to list of payments
            let hold = payment;
            hold.push(data);
            setPayment(hold);
        });
    }
    useMemo(() => {
        //fetch payments
        getPayments(login.token).then((data) => {
            setPayment(data);
        }).catch((error) => {
            console.error(error);
        });
    }, []);

    return (
        <Grid2 spacing={2}>
            <Grid2 size={12}>
                Add Payment
                <br/>
                <select id="new-payment-client" value={newClient} onChange={(e) => {setNewClient(e.target.value)}}>
                    <option value={0}>Select Client</option>
                    {clients.map((client) => {
                        return (
                            <option value={client.id} onSelect={(e)=>{setNewClient(client.id)}}>{client.name}</option>
                        )
                    })}
                </select>
                <input id="new-payment-amount" value={newAmount} onChange={(e) =>{setNewAmount(e.target.value)}} type="number" placeholder="Amount" style={{margin:"2rem"}}/>
                <BackupButton onButton={submitPayment}>Add Payment</BackupButton>
            </Grid2>
            <Grid2 size={12}>
                <Typography variant="h4">Pending Payments</Typography>
                {
                    payment.filter(obj => obj.status === "pending").map((payment) => {
                            return (
                                <Box sx={{padding:2, border:"solid", borderWidth:2, borderColor:"primary.main", borderRadius: 1}}>
                                        <div style={{width:"100%", height:"100%", display:"flex", justifyContent:"space-between"}}>
                                            {payment.client.name}
                                        
                                            <Typography>{payment.amount}</Typography>
                                            <div>
                                                <Box sx={{display:"flex", justifyContent:"center", borderRadius:2, '&:hover': {bgcolor: '#999999',},}}>

                                                    {payment.id}
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48">
                                                        <path d="M 18.5 5 C 15.480226 5 13 7.4802259 13 10.5 L 13 32.5 C 13 35.519774 15.480226 38 18.5 38 L 34.5 38 C 37.519774 38 40 35.519774 40 32.5 L 40 10.5 C 40 7.4802259 37.519774 5 34.5 5 L 18.5 5 z M 18.5 8 L 34.5 8 C 35.898226 8 37 9.1017741 37 10.5 L 37 32.5 C 37 33.898226 35.898226 35 34.5 35 L 18.5 35 C 17.101774 35 16 33.898226 16 32.5 L 16 10.5 C 16 9.1017741 17.101774 8 18.5 8 z M 11 10 L 9.78125 10.8125 C 8.66825 11.5545 8 12.803625 8 14.140625 L 8 33.5 C 8 38.747 12.253 43 17.5 43 L 30.859375 43 C 32.197375 43 33.4465 42.33175 34.1875 41.21875 L 35 40 L 17.5 40 C 13.91 40 11 37.09 11 33.5 L 11 10 z"></path>
                                                    </svg>
                                                </Box>
                                            </div>
                                            </div>
                                </Box>
                            )
                        
                    })
                }
                <div class="bg-blue-500"></div>
            </Grid2>
            <Grid2 size={12}>
                <Typography variant="h4">Completed Payments</Typography>
                {payment.map((payment) => {
                    if(payment.status === "completed") {
                        return (
                            <Box sx={{ padding: 2, border: "solid", borderWidth: 2, borderColor: "primary.main", borderRadius: 1 }}>
                                <div style={{ width: "100%", height: "100%", display: "flex", justifyContent: "space-between" }}>
                                    {payment.client.name}

                                    <Typography>{payment.amount}</Typography>
                                    <div>
                                        <Box sx={{ display: "flex", justifyContent: "center", borderRadius: 2, '&:hover': { bgcolor: '#999999', }, }}>
                                            {payment.id}
                                        </Box>
                                    </div>
                                </div>
                            </Box>
                        )
                    }
                })}
                <div class="bg-blue-500"></div>
            </Grid2>
        </Grid2>
    )
}

export {PaymentsList};
