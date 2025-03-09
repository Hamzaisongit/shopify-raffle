"use client";
import { useQR } from "@/components/QRpage/QRProvider";
import QRForm from "@/components/QRpage/QRForm";

export default function QRPage() {
  const { redeemAnytime, setRedeemAnytime, quantity, setQuantity } = useQR();

  const handleQuantityChange = (e) => {
    const value = Math.max(1, parseInt(e.target.value) || 1);
    setQuantity(value);
  };

  return (
    <div className="w-full">
      <h1 className="text-2xl font-semibold text-gray-900 mb-4">Generate QR Code</h1>

      <div className="flex items-center justify-between mb-6">
        <span className="text-gray-700 font-medium">Redeem Anytime</span>
        <button
          onClick={() => setRedeemAnytime(!redeemAnytime)}
          className={`w-10 h-6 flex items-center p-1 rounded-full transition-all ${
            redeemAnytime ? "bg-green-600" : "bg-gray-400"
          }`}
        >
          <div
            className={`w-4 h-4 bg-white rounded-full transition-transform ${
              redeemAnytime ? "translate-x-4" : "translate-x-0"
            }`}
          ></div>
        </button>
      </div>

      <QRForm />

      <div className="mt-4">
        <label className="block text-gray-700 font-medium mb-1">Quantity</label>
        <input
          type="number"
          value={quantity}
          onChange={handleQuantityChange}
          className="w-full border border-gray-300 rounded-lg p-2 text-gray-500 focus:ring-2 focus:ring-blue-500 outline-none"
          min="1"
        />
      </div>

      <button className="mt-6 w-full bg-green-600 text-white font-medium p-3 rounded-lg hover:bg-green-700 transition">
        Generate QR Code
      </button>
    </div>
  );
}
