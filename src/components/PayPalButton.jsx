import React from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import api from "../services/api";

const PayPalButton = () => {
  return (
    <PayPalScriptProvider options={{ "client-id": "YOUR_SANDBOX_CLIENT_ID", currency: "USD" }}>
      <PayPalButtons
        style={{ layout: "vertical" }}
        createOrder={async () => {
          // Call backend to create PayPal order
          try {
            const res = await api.post("/payments/create-order", { amount: "10.00" });
            return res.data.id;
          } catch (err) {
            console.error("PayPal Create Order Error:", err);
            throw err;
          }
        }}
        onApprove={async (data) => {
          // Capture the order
          try {
            const res = await api.post(`/payments/capture-order/${data.orderID}`);
            alert("✅ Payment successful! " + JSON.stringify(res.data));
          } catch (err) {
            console.error("PayPal Capture Error:", err);
            alert("❌ Payment failed.");
          }
        }}
      />
    </PayPalScriptProvider>
  );
};

export default PayPalButton;
