import { CardElement, ElementsConsumer, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { BackupButton } from "./backupButtons";
import { useEffect, useMemo, useState } from "react";
import { confirmPayment } from "../../api";
import { StripePayment } from "../features/stripePayment";


function CheckoutForm({payment, paymentId, setStatus}) {
    const stripe = useStripe();
    const elements = useElements();
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        if(!stripe || !elements){
            return;
        }
        const result = await stripe.confirmPayment( {
            elements,
            confirmParams: {
                return_url: "https://example.com/return",

            },
            redirect: "if_required"
        });

        if(result.error){
            console.error(result.error.message);
        }
        else{
            if(result.paymentIntent.status === "succeeded"){
                confirmPayment(paymentId);
                setStatus(1);
            }
        }
    }
  return (
    <>
    Please verify the amount below before proceeding.
    <br/>

    Amount: ${(payment.amount / 100).toFixed(2)}
    <ElementsConsumer>
        {({stripe, elements}) => (
            <form>
                <PaymentElement />
                <BackupButton onButton={handleSubmit}>Pay</BackupButton>
            </form>
        )}
        
    </ElementsConsumer>
    </>
  );
}

export { CheckoutForm };