import React, { useEffect } from "react";

interface Props {
  onClose: () => void;
  onSuccess?: () => void;
  onCancel?: () => void;
  paymentWindowRef: Window | null;
}

const PaymentListener: React.FC<Props> = ({ onClose, onSuccess, onCancel }) => {
  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (typeof event.data === "string") {
        if (event.data.includes("payment-success")) {
          onSuccess?.();
          onClose();
        } else if (event.data.includes("payment-cancel")) {
          onCancel?.();
          onClose();
        }
      }
    }
    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [onClose, onSuccess, onCancel]);

  if (!open) return null;

  return null;
};

export default PaymentListener;
