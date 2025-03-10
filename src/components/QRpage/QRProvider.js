import { createContext, useContext, useState } from "react";

const QRContext = createContext();

export function QRProvider({ children }) {
  // const [startDate, setStartDate] = useState("");
  // const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [redeemAnytime, setRedeemAnytime] = useState(false);
  const [quantity, setQuantity] = useState(1);

  return (
    <QRContext.Provider value={{ 
      // startDate, setStartDate, startTime, setStartTime, 
      endDate, setEndDate, endTime, setEndTime, 
      redeemAnytime, setRedeemAnytime, quantity, setQuantity 
    }}>
      {children}
    </QRContext.Provider>
  );
}

export function useQR() {
  return useContext(QRContext);
}
