"use client";
import { useEffect, useState } from "react";
import { useUser } from "@/context/UserProvider";
import { supabase } from "@/lib/supabase";
import { useParams } from "next/navigation";
import generateQrCodes from "@/utils/generateQrCodes";

export default function CreateEventPage() {
  const { user, storeData, eventsData } = useUser();
  const { event_id } = useParams();

  const [eventDetails, setEventDetails] = useState({
    title: "",
    start_date: "",
    end_date: "",
    prizes: {},
  });

  const [currentEventId, setCurrentEventId] = useState(null);
  const [prizes, setPrizes] = useState(eventDetails.prizes);
  const [dateTime, setDateTime] = useState({
    start_date: eventDetails.start_date || "",
    start_time: "00:00",
    end_date: eventDetails.end_date || "",
    end_time: "00:00",
  });
const [qrQuanitity, setQrQuantity] = useState(0)

  useEffect(() => {
    if (event_id === "new") return;
    const currentEvent = eventsData.find((event) => event.event_id == event_id);
    if (currentEvent) {
      setEventDetails({ ...currentEvent, event_id });
    }
  }, [event_id, eventsData]);


  useEffect(() => {
    if (eventDetails.prizes) {
      setPrizes(eventDetails.prizes);
    }
  }, [eventDetails.prizes]);


  useEffect(() => {
    if (eventDetails.start_date) {
      const start = new Date(eventDetails.start_date);
      setDateTime((prev) => ({
        ...prev,
        start_date: start.toISOString().split("T")[0],
        start_time: start.toTimeString().slice(0, 5),
      }));
    }
    if (eventDetails.end_date) {
      const end = new Date(eventDetails.end_date);
      setDateTime((prev) => ({
        ...prev,
        end_date: end.toISOString().split("T")[0],
        end_time: end.toTimeString().slice(0, 5),
      }));
    }
  }, [eventDetails.start_date, eventDetails.end_date]);


  function handleChange(e) {
    setEventDetails({ ...eventDetails, [e.target.name]: e.target.value });
  }

  function handleDateTimeChange(e) {
    setDateTime({ ...dateTime, [e.target.name]: e.target.value });
  }

  function handlePrizeChange(position, value) {
    setPrizes((prev) => ({
      ...prev,
      [position]: value,
    }));
  }

  function addPrize() {
    const newPosition = Object.keys(prizes)?.length + 1;
    setPrizes((prev) => ({
      ...prev,
      [`${newPosition}st`]: "",
    }));
  }

  function removePrize(position) {
    const updatedPrizes = { ...prizes };
    delete updatedPrizes[position];
    setPrizes(updatedPrizes);
  }

  async function handleCreateOrUpdateEvent() {
    if (!user || !storeData?.store_id) {
      alert("You must be logged in and associated with a store.");
      return;
    }

    const startTimestamp = new Date(`${dateTime.start_date}T${dateTime.start_time}`).getTime();
    const endTimestamp = new Date(`${dateTime.end_date}T${dateTime.end_time}`).getTime();

    const updatedEventDetails = {
      ...eventDetails,
      start_date: startTimestamp,
      end_date: endTimestamp,
      prizes,
      store_id: storeData.store_id,
    };

    const { data, error } = await supabase.from("event").upsert([updatedEventDetails]).select("event_id").single();

    if (error) {
      console.error("Error creating event:", error);
      alert("Failed to create event.");
    } else {
      setCurrentEventId(data.event_id);
      alert(`Event created successfully! Event ID: ${data.event_id}`);
    }
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">
        {event_id === "new" ? "Create New Event" : "Edit Event"}
      </h1>

      <input
        type="text"
        name="title"
        placeholder="Event Title"
        value={eventDetails.title}
        onChange={handleChange}
        className="border p-2 w-full mb-2"
      />

      {/* Start Date & Time */}
      <label className="block">Start Date</label>
      <input
        type="date"
        name="start_date"
        value={dateTime.start_date}
        onChange={handleDateTimeChange}
        className="border p-2 w-full mb-2"
      />
      <label className="block">Start Time</label>
      <input
        type="time"
        name="start_time"
        value={dateTime.start_time}
        onChange={handleDateTimeChange}
        className="border p-2 w-full mb-2"
      />

      {/* End Date & Time */}
      <label className="block">End Date</label>
      <input
        type="date"
        name="end_date"
        value={dateTime.end_date}
        onChange={handleDateTimeChange}
        className="border p-2 w-full mb-2"
      />
      <label className="block">End Time</label>
      <input
        type="time"
        name="end_time"
        value={dateTime.end_time}
        onChange={handleDateTimeChange}
        className="border p-2 w-full mb-2"
      />

      {/* Prizes Section */}
      <h3 className="text-lg font-semibold mt-4">Prizes</h3>
      {Object.keys(prizes).map((position) => (
        <div key={position} className="flex items-center gap-2 mb-2">
          <input
            type="text"
            placeholder={`Prize for ${position}`}
            value={prizes[position]}
            onChange={(e) => handlePrizeChange(position, e.target.value)}
            className="border p-2 w-full"
          />
          <button type="button" onClick={() => removePrize(position)} className="bg-red-500 text-white p-1">
            ❌
          </button>
        </div>
      ))}

      <button type="button" onClick={addPrize} className="bg-green-500 text-white p-2 mt-2">
        + Add Prize
      </button>

      <button type="button" onClick={handleCreateOrUpdateEvent} className="bg-blue-500 text-white p-2 mt-2">
        Save Event
      </button>

    <input 
    type="number"
    value={qrQuanitity}
    onChange={(e)=>{setQrQuantity(e.target.value)}}
    className="bg-gray-300"></input>
          <button type="button" onClick={()=>{generateQrCodes(qrQuanitity,currentEventId,storeData.store_domain)}} className="bg-blue-500 text-white p-2 mt-2">
        Generate-preview-PDF
      </button>
    </div>
  );
}
