"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { Form, Input, Button, DatePicker, TimePicker, Card, Row, Col, Carousel, Image, Typography, Space, message, Spin, Divider } from "antd";
import { PlusOutlined, DeleteOutlined, SaveOutlined, ArrowLeftOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
const { Title, Text, Paragraph } = Typography;


export default function CreateEventPage() {
  const { user, events, setEvents } = useAuth();
  const { event_id } = useParams();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [eventDetails, setEventDetails] = useState({
    title: "",
    description: "",
    start_date: "",
    start_time: "00:00",
    end_date: "",
    end_time: "00:00",
  });
  const [prizes, setPrizes] = useState([]);
  const [carouselRef, setCarouselRef] = useState(null);

  const [eventForm] = Form.useForm()
  const [messageApi,messageHolder] = message.useMessage()

  useEffect(() => {
    if (event_id === "new") return;
    const currentEvent = events.find((event) => event.event_id == event_id);
    if (currentEvent) {
      setEventDetails({
        title: currentEvent.title,
        description: currentEvent.description,
        start_date: currentEvent.start_date ? dayjs(currentEvent.start_date).format("YYYY-MM-DD") : "",
        start_time: currentEvent.start_date ? dayjs(currentEvent.start_date).format("HH:mm") : "00:00",
        end_date: currentEvent.end_date ? dayjs(currentEvent.end_date).format("YYYY-MM-DD") : "",
        end_time: currentEvent.end_date ? dayjs(currentEvent.end_date).format("HH:mm") : "00:00",
      });
      loadPrizes();

      eventForm.setFieldsValue({
        title: currentEvent.title,
        startDate: currentEvent.start_date ? dayjs(currentEvent.start_date) : null
      })
    }

  }, [event_id, events]);

  function handleChange(e) {
    setEventDetails((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleDateTimeChange(_, dateString, type) {
    setEventDetails((prev) => ({ ...prev, [type]: dateString }));
  }

  function handlePrizeChange(index, key, value) {
    if (key === "position" && (isNaN(value) || parseInt(value) <= 0)) {
      message.error("Position must be a positive number");
      return;
    }
    setPrizes((prev) => {
      const updatedPrizes = [...prev];
      updatedPrizes[index] = { ...updatedPrizes[index], [key]: value };
      return updatedPrizes;
    });
  }

  function addPrize() {
    setPrizes((prev) => [...prev, { position: prizes.length + 1, name: "", description: "", img_url: "" }]);
    setTimeout(() => carouselRef?.goTo(prizes.length), 100);
  }

  async function removePrize(index) {
    const prizeToDelete = prizes[index];
    if (prizeToDelete.prize_id) {
      // If the prize exists in the database, delete it
      const { error } = await supabase.from("prize").delete().eq("prize_id", prizeToDelete.prize_id);
      if (error) {
        console.log("Error deleting prize", error);
        return;
      }
    }
    // Remove the prize from the local state
    setPrizes((prev) => prev.filter((_, idx) => idx !== index));
    messageApi.success("Prize deleted successfully!");
  }

  async function deleteEvent() {
    if (event_id === "new") return;
    // Delete all prizes associated with the event
    const { error: prizeError } = await supabase.from("prize").delete().eq("event_id", event_id);
    if (prizeError) {
      console.log("Error deleting prizes", prizeError);
      return;
    }
    // Delete the event
    const { error: eventError } = await supabase.from("event").delete().eq("event_id", event_id);
    if (eventError) {
      console.log("Error deleting event", eventError);
      return;
    }
    message.success("Event and associated prizes deleted successfully!");
    router.push("/events"); // Navigate back to the events list
  }

  async function saveEvent() {
try{
    await eventForm.validateFields()

    setSaving(true);

    // Convert date and time to milliseconds
    const startTimestamp = eventDetails.start_date && eventDetails.start_time
      ? dayjs(`${eventDetails.start_date} ${eventDetails.start_time}`, "YYYY-MM-DD HH:mm").valueOf()
      : null;
    const endTimestamp = eventDetails.end_date && eventDetails.end_time
      ? dayjs(`${eventDetails.end_date} ${eventDetails.end_time}`, "YYYY-MM-DD HH:mm").valueOf()
      : null;

    const overlappingEvent = events.find((event)=>{
      return ((startTimestamp >= event.start_date && startTimestamp <= event.end_date) || (endTimestamp >= event.start_date && endTimestamp <= event.end_date))
    })

    if(overlappingEvent){
      setSaving(false)

      return alert(`overlaps with.. ${overlappingEvent.title}`)
    }

    let eventPayload = {
      title: eventDetails.title,
      description: eventDetails.description,
      created_by: user.email,
      start_date: startTimestamp, // Store as milliseconds
      end_date: endTimestamp, // Store as milliseconds
    };
    if (event_id !== "new") {
      eventPayload.event_id = event_id;
    }
    const { data: storedEvent, error } = await supabase.from("event").upsert([eventPayload]).select("*").single();
    if (error) {
      setSaving(false);
      console.log("Error adding event", error);
      return;
    }

    setEvents((p)=>{
      if(event_id == 'new'){
        return [...p,storedEvent]
      }
      return [...p.filter(e=>e.event_id !== event_id), storedEvent]
    })
    // Save prizes linked to the event
    const prizesWithEventIds = prizes.map((prize) => ({
      event_id: storedEvent.event_id,
      ...prize,
    }));
    const { error: err1 } = await supabase.from("prize").upsert(prizesWithEventIds.filter((p) => p.prize_id));
    const { error: err2 } = await supabase.from("prize").insert(prizesWithEventIds.filter((p) => !p.prize_id));
    if (err1 || err2) {
      setSaving(false);
      console.log("Error storing prizes", err1, err2);
      return;
    }
    setSaving(false);
    message.success("Event saved successfully!");
    router.push("/admin/manage-events"); // Navigate back to events list
  }catch(error){
    setSaving(false)
    console.log('error in event form ',error)
  }
  }

  async function loadPrizes() {
    if (event_id === "new") return;
    const { data: fetchedPrizes, error } = await supabase.from("prize").select("*").eq("event_id", event_id);
    if (error) return console.log("Error loading prizes", error);
    setPrizes(fetchedPrizes || []);
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
    {messageHolder}
      <Row gutter={24} justify="center">
        {/* Left Section - Event Details */}
        <Col span={14}>
          <Card title={<Title level={4} >Event Details</Title>} bordered={false} className="shadow-lg">
            <Form form={eventForm} layout="vertical">
              <Form.Item rules={[{ required: true, message: 'Event title is required!' }]} name={"title"} label="Event Title">
                <Input name="title" placeholder="Enter event title" value={eventDetails.title} onChange={handleChange} className="placeholder-gray-600" />
              </Form.Item>
              <Form.Item label="Event Description">
                <Input.TextArea style={{resize:'none'}} name="description" placeholder="Enter details..." value={eventDetails.description} onChange={handleChange} rows={4} class="placeholder-gray-600" />
              </Form.Item>
              {/* Date & Time Inputs */}
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name={"startDate"} rules={[{ required: true, message: 'required!' }]} label="Start Date">
                    <DatePicker style={{ width: "100%" }} value={eventDetails.start_date ? dayjs(eventDetails.start_date) : null} onChange={(date, dateString) => handleDateTimeChange(date, dateString, "start_date")} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name={"startTime"} rules={[{ required: true, message: 'required!' }]} label="Start Time">
                    <TimePicker style={{ width: "100%" }} format="HH:mm" value={eventDetails.start_time ? dayjs(eventDetails.start_time, "HH:mm") : null} onChange={(_, timeString) => handleDateTimeChange(null, timeString, "start_time")} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name={"endDate"} rules={[{ required: true, message: 'required!' }]} label="End Date">
                    <DatePicker style={{ width: "100%" }} value={eventDetails.end_date ? dayjs(eventDetails.end_date) : null} onChange={(date, dateString) => handleDateTimeChange(date, dateString, "end_date")} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name={"endTime"} rules={[{ required: true, message: 'required!' }]} label="End Time">
                    <TimePicker style={{ width: "100%" }} format="HH:mm" value={eventDetails.end_time ? dayjs(eventDetails.end_time, "HH:mm") : null} onChange={(_, timeString) => handleDateTimeChange(null, timeString, "end_time")} />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
        </Col>
        {/* Right Section - Prizes */}
        <Col span={10}>
          <Card
            title={
              <div className=" flex flex-row justify-between items-center">
                <Title level={4}>Prizes</Title>
                <Button type="dashed" icon={<PlusOutlined />} onClick={addPrize} className="mb-2">
                  Add Prize
                </Button>
              </div>
            }
            bordered={false}
            className="shadow-lg"
          >
            {prizes.length > 0 ? (
              <>
                <Carousel dots={false} ref={setCarouselRef}>
                  {prizes.map((prize, index) => (
                    <div key={index} className="p-4 text-center">
                      <Title level={4} className="mb-4">{`Prize ${prize.position}`}</Title>
                      <Form.Item label="Position" className="text-left">
                        <Input placeholder="Position" value={prize.position} onChange={(e) => handlePrizeChange(index, "position", e.target.value)} class="placeholder-gray-600 mb-4" />
                      </Form.Item>
                      <Form.Item label="Prize Name" className="text-left">
                        <Input placeholder="Prize Name" value={prize.name} onChange={(e) => handlePrizeChange(index, "name", e.target.value)} className="placeholder-gray-600 mb-4" />
                      </Form.Item>
                      <Form.Item label="Description" className="text-left">
                        <Input.TextArea style={{resize:'none'}} placeholder="Description" value={prize.description} onChange={(e) => handlePrizeChange(index, "description", e.target.value)} rows={2} class="placeholder-gray-600 mb-4" />
                      </Form.Item>
                      <Form.Item label="Image URL" className="text-left">
                        <Input placeholder="Image URL" value={prize.img_url} onChange={(e) => handlePrizeChange(index, "img_url", e.target.value)} class="placeholder-gray-600 mb-4" />
                      </Form.Item>
                      <Button icon={<DeleteOutlined />} danger onClick={() => removePrize(index)} className="mt-2">
                        Remove Prize
                      </Button>
                    </div>
                  ))}
                </Carousel>
                <div className="flex justify-center gap-5 mt-4">
                  <Button onClick={() => carouselRef?.prev()}>
                     <LeftOutlined className="mt-0.5" ></LeftOutlined> Previous
                  </Button>
                  <Button onClick={() => carouselRef?.next()}>
                    Next <RightOutlined className="mt-0.5"></RightOutlined>
                  </Button>
                </div>
              </>
            ) : (
              <Paragraph className="text-gray-500 text-center">No prizes added yet.</Paragraph>
            )}
          </Card>
        </Col>
      </Row>
      <div className="fixed flex flex-row justify-around px-36 bottom-0 left-0 w-full bg-white border-t shadow-lg p-4">
        <Space>
          <Button onClick={() => router.push("/admin/manage-events")} icon={<ArrowLeftOutlined />}>Cancel</Button>
          {event_id !== "new" && (
            <Button danger icon={<DeleteOutlined />} onClick={deleteEvent}>
              Delete Event
            </Button>
          )}
        </Space>
        <Button type="primary" htmlType="submit" icon={<SaveOutlined />} onClick={saveEvent} loading={saving} className="ml-4">
          Save Event
        </Button>
      </div>
    </div>
  );
}