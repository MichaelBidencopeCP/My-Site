import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import { CheckoutForm } from "../components/checkoutForm";


const stripePromise = ""


function StripePayment({payment, paymentId, setStatus}) {

    return (
        <>
            <Elements stripe={stripePromise} options={{clientSecret:payment.client_secret}} >
                <CheckoutForm payment={payment} paymentId={paymentId} setStatus={setStatus}/>
            </Elements>
        </>
    );
}

export { StripePayment };