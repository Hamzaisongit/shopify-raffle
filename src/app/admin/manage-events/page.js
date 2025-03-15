"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { Card, Button, Typography, Menu } from "antd";
import { ArrowLeft, EditIcon, Plus } from "lucide-react";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const ManageEventsPage = () => {
  const { events } = useAuth();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100 text-black">
      <div className="max-w-6xl mx-auto p-8">
        {/* Header: Back Arrow + Title + Add Button */}
        <div className="flex items-center justify-between mb-8">
          {/* Back Button */}
          <Button
            icon={<ArrowLeft size={27} />}
            onClick={() => router.push("/admin")}
            type="text"
            className="hover:bg-gray-200 rounded-full p-2"
          />

          {/* Title */}
          <Title level={2} className="text-gray-800 relative left-10">
            Manage Events
          </Title>

          {/* Add Event Button */}
          <Button
            type="primary"
            icon={<Plus size={18} />}
            onClick={() => router.push("/admin/manage-events/edit/new")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 mb-3"
          >
            Add Event
          </Button>
        </div>

        {/* Event Cards in Flex Wrap */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {events.length > 0 ? (
    events.map((event) => (
      <Card
  key={event.event_id}
  hoverable
  className="h-40 shadow-md rounded-xl overflow-hidden border border-gray-200 transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 relative p-4"
>
  {/* Styled Menu - Minimal Dropdown */}
  <Menu
    mode="vertical"
    className=" absolute top-3 right-3 bg-white rounded-md shadow-md overflow-hidden"
    onClick={(e) =>{
      e.key == 'edit' ? router.push(`/admin/manage-events/edit/${event.event_id}`) : null
      e.key == 'entries' ? router.push(`/admin/manage-events/event-entries/${event.event_id}`) : null
    }}
    items={[
      {
        key: 'menu',
        children: [
          {
            key: 'edit',
            label: <span className="text-gray-700 text-sm pt-2 block hover:bg-gray-100">Edit</span>,
          },{
            key: 'entries',
            label: <span className="text-gray-700 text-sm pt-2 block hover:bg-gray-100">Event entries</span>,
          }
        ],
      },
    ]}
  >
  </Menu>

  {/* Event Title */}
  <Title level={4} className="mb-1 text-gray-900 truncate">
    {event.title}
  </Title>

  {/* Event Dates */}
  <div className="text-gray-500 text-sm mt-auto mb-3">
    <p>Start: {event.start_date ? dayjs(event.start_date).format("MMM DD, YYYY") : "N/A"}</p>
    <p>End: {event.end_date ? dayjs(event.end_date).format("MMM DD, YYYY") : "N/A"}</p>
  </div>

  {/* Event Description */}
  <Text className="text-gray-600 block mb-2 line-clamp-2 text-justify h-24 whitespace-nowrap overflow-ellipsis">
    {event.description}
  </Text>
</Card>

    ))
  ) : (
    <div className="text-gray-500 text-lg mt-12">
      No events found. Start by creating one!
    </div>
  )}
</div>

      </div>
    </div>
  );
};

export default ManageEventsPage;
