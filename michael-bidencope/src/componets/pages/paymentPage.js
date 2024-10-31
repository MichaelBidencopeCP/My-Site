import { useEffect, useState } from "react";
import { PageComponent } from "../components/pageComponent";
import { StripePayment } from "../features/stripePayment";
import { PaymentLookup } from "../features/paymentLookup";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { BackupButton } from "../components/backupButtons";


function PaymentPage() {
    let [payment, setPayment] = useState(0);
    let [paymentId, setPaymentId] = useState(0);
    let [status, setStatus] = useState(0);

    useEffect(() => {
        if(status === 1){
            setPayment(0);
            setPaymentId(0);
        }
    }, [status]);

    return (
        <PageComponent>
            <Dialog open={status === 1} onClose={() => {setStatus(0)}}>
                <DialogTitle>Payment Successful</DialogTitle>
                <DialogContent>
                    Your payment was successful
                </DialogContent>
            </Dialog>
            <Dialog open={status === 2} onClose={() => {setStatus(0)}}>
                <DialogTitle>Payment Failed</DialogTitle>
                <DialogContent>
                    Your payment failed, please try again later.
                </DialogContent>
            </Dialog>
            <Dialog open={status === 3} onClose={() => {setStatus(0)}}>
                <DialogTitle>Payment Has Already Been Paid</DialogTitle>
                <DialogContent>
                    This payment has already been paid. Please contact me if you believe this is an error.
                </DialogContent>
            </Dialog>
            <Dialog open={status === 4} onClose={() => {setStatus(0)}}>
                <DialogTitle>Payment Not Found</DialogTitle>
                <DialogContent>
                    This payment was not found. Please check the payment id and try again.
                </DialogContent>
            </Dialog>

            {payment === 0 ? <PaymentLookup setPayment={setPayment} setPaymentId={setPaymentId} setStatus={setStatus}/> : <StripePayment payment={payment} paymentId={paymentId} setStatus={setStatus} />}
        </PageComponent>
    )
}

export { PaymentPage };