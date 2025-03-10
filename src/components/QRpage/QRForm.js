"use client";
import { useQR } from "@/components/QRpage/QRProvider";

export default function QRForm() {
  const { endDate, setEndDate, endTime, setEndTime, redeemAnytime } = useQR();

  return (
    <div className={`bg-gray-50 p-6 rounded-lg shadow-sm border ${redeemAnytime ? "opacity-50 pointer-events-none" : "opacity-100"}`}>
      <h2 className="text-lg font-medium text-gray-900 mb-4">QR Code Details</h2>

       <div className="grid grid-cols-2 gap-4">
       {/* <div>
          <label className="block text-gray-700 font-medium mb-1">Start Date</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2 text-gray-500 focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Start Time</label>
          <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2 text-gray-500 focus:ring-2 focus:ring-blue-500 outline-none" />
        </div> */}

        <div>
          <label className="block text-gray-700 font-medium mb-1">Expiry Date</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2 text-gray-500 focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Expiry Time</label>
          <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2 text-gray-500 focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
      </div>
    </div>
  );
}
