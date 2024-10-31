import { Box, TextField } from "@mui/material";
import { BackupButton } from "../components/backupButtons";
import { lookupPayment } from "../../api";


function PaymentLookup({setPayment, setPaymentId, setStatus}) {
    const handleLookup = () => {
        let payment = document.getElementById("payment-lookup").value;
        lookupPayment(payment).then((data) => {
            if("error" in data){
                if(data.error === "Payment not found"){
                    setStatus(4);
                }
                if(data.error === "Payment already completed"){
                    setStatus(3);
                }
            }
            else{
                setPaymentId(payment);
                setPayment(data);
            }
        });
    }

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', justifyContent:'center', alignItems: 'center', height:'20rem'}}>
            <div>
                <TextField id="payment-lookup" label="Payment Lookup" variant="outlined" />
                <BackupButton onButton={handleLookup} height={'100%'} >Lookup</BackupButton>
            </div>
        </Box>
    );
}

export { PaymentLookup };