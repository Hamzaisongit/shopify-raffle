"use client";
import { supabase } from "@/lib/supabase";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Table, Spin, ConfigProvider } from "antd";

export default function Active() {
  const { event_id } = useParams();
  const [participations, setParticipations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function populateEntries(active_event_id) {
      setLoading(true);
      const { data: active_event_entries, error } = await supabase
        .from("event_entry")
        .select("*")
        .eq("event_id", active_event_id);

      if (error) {
        console.error("Error fetching entries:", error);
        setLoading(false);
        return;
      }

      setParticipations(active_event_entries);
      setLoading(false);
    }

    populateEntries(event_id);
  }, [event_id]);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "WhatsApp Number",
      dataIndex: "whatsapp_number",
      key: "whatsapp_number",
      sorter: (a, b) => a.whatsapp_number - b.whatsapp_number,
    },
    {
      title: "Pincode",
      dataIndex: "pincode",
      key: "pincode",
      sorter: (a, b) => a.pincode - b.pincode,
    },
    {
      title: "Participant ID",
      dataIndex: "part_id",
      key: "part_id",
      render: (text) => <span className="font-mono text-gray-600">{text}</span>,
    },
  ];

  return (
    <ConfigProvider
      theme={{
        components: {
          Table: {
            colorBgContainer: "#ffffff",
            colorText: "#333333",
            colorBorderSecondary: "gray",
            colorTextHeading: "#333333",
            borderRadius: 12,
            padding: 16,
          },
        },
      }}
    >

        <div className="max-w-6xl mx-auto bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Giveaway Participations</h2>

          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Spin size="large" />
            </div>
          ) : (
            <Table
              columns={columns}
              dataSource={participations}
              rowKey="part_id"
              bordered
              pagination={{ pageSize: 10 }}
              className="rounded-lg overflow-hidden"
            />
          )}
        </div>

    </ConfigProvider>
  );
}
