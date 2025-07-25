import { useEffect, useRef, useState } from "react";
import { useSubscribeMutation } from "../services/api";

const SubscribeNowButton = () => {
  const [feedback, setFeedback] = useState<string | null>(null);
  const [subscribe, { isLoading: isBuying }] = useSubscribeMutation();
  const paymentWindowRef = useRef<Window | null>(null);
  const paymentPollRef = useRef<number | null>(null);

  const handleSubscribe = async () => {
    try {
      const res = await subscribe({ product_id: 1, type_of_item: 1 }).unwrap();
      if (res.data?.payment_url) {
        paymentWindowRef.current = window.open(res.data.payment_url, "_blank");
      }
    } catch (error) {
      console.error("Subscription error:", error);
      setFeedback("Failed to initiate purchase.");
    }
  };
  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      // Optionally check event.origin for security
      if (typeof event.data === "string") {
        if (event.data.includes("payment-success")) {
          setFeedback("Subscription successful!");
        } else if (event.data.includes("payment-cancel")) {
          setFeedback("Subscription cancelled.");
        }
      }
    }
    window.addEventListener("message", handleMessage);

    // Fallback: poll for window.closed
    paymentPollRef.current = window.setInterval(() => {
      if (paymentWindowRef.current && paymentWindowRef.current.closed) {
        // Optionally, check payment status via API here
        setFeedback("Subscription cancelled.");
        paymentWindowRef.current = null;
        if (paymentPollRef.current) {
          clearInterval(paymentPollRef.current);
          paymentPollRef.current = null;
        }
      }
    }, 1000);

    return () => {
      window.removeEventListener("message", handleMessage);
      if (paymentPollRef.current) {
        clearInterval(paymentPollRef.current);
      }
    };
  }, []);
  return (
    <div className="flex items-center justify-center mt-8">
      <button
        className="px-8 py-3 rounded-full font-bold text-white relative overflow-hidden shadow-2xl transition disabled:opacity-60 backdrop-blur-xl border border-white/30 hover:scale-105 cursor-pointer"
        style={{
          background: "linear-gradient(90deg, #38bdf8 0%, #0ea5e9 100%)", // sky-400 to sky-500
          boxShadow: "0 8px 32px 0 rgba(14,165,233,0.15)",
          border: "1.5px solid rgba(255,255,255,0.25)",
          position: "relative",
          zIndex: 1,
        }}
        disabled={isBuying}
        onClick={handleSubscribe}
      >
        <span
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(120deg, #fff 0%, #a7f3d0 100%)",
            opacity: 0.18,
            filter: "blur(8px)",
            zIndex: 0,
          }}
        ></span>
        <span className="relative z-10 flex items-center gap-2">
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
            <rect
              x="2"
              y="7"
              width="20"
              height="13"
              rx="3"
              fill="#fff"
              fillOpacity="0.15"
            />
            <rect
              x="2"
              y="7"
              width="20"
              height="13"
              rx="3"
              stroke="#fff"
              strokeWidth="1.5"
            />
            <path
              d="M7 11h10M7 15h6"
              stroke="#fff"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          {isBuying ? "Processing..." : "Subscribe Now"}
        </span>
      </button>
      {feedback && (
        <span className="ml-4 text-sm font-semibold text-sky-700">
          {feedback}
        </span>
      )}
    </div>
  );
};

export default SubscribeNowButton;
