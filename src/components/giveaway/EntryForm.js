"use client"
import React, { useState } from 'react';
import { 
  Form, 
  Input, 
  Button, 
  InputNumber, 
  Card, 
  Collapse, 
  notification, 
  Spin 
} from 'antd';
import { 
  UserOutlined, 
  MailOutlined, 
  HomeOutlined, 
  PhoneOutlined, 
  EnvironmentOutlined, 
  NumberOutlined,
  GiftOutlined,
  QrcodeOutlined
} from '@ant-design/icons';
import { supabase } from '@/lib/supabase';

const { Panel } = Collapse;

export default function GiveawayEntryForm({ eventId, qr_code_id }) {
  const [form] = Form.useForm();
  const [savingResponse, setSavingResponse] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const onSubmit = async (values) => {
    try {
      setSavingResponse(true);
      
      // Get all values from the form
      const formValues = form.getFieldsValue();
      
      const res = await fetch("https://api64.ipify.org?format=json");
      const ip_data = await res.json();

      // Add browser info and additional data to the form values
      const formData = {
        ...formValues,
        request_user_agent: navigator.userAgent,
        request_ip_address: ip_data.ip,
        qr_code_id
      };
      
      console.log('Submitting form data:', formData);
      
      // Make the API call to submit the form data
      const {error} = await supabase.from("event_entry").insert([formData])
      
      if (error) {
        console.log("while submitting form",error)
        setSavingResponse(false)
        return;
      }
      
      // Show success notification
      notification.success({
        message: 'Entry Submitted!',
        description: 'Your giveaway entry has been successfully submitted.',
        placement: 'topRight',
      });
      
      setFormSubmitted(true);
      form.resetFields();
      
    } catch (error) {
      console.error('Error submitting form:', error);
      
      // Show error notification
      notification.error({
        message: 'Submission Failed',
        description: 'There was an error submitting your entry. Please try again.',
        placement: 'topRight',
      });
      
    } finally {
      setSavingResponse(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <Collapse 
        defaultActiveKey={[]} 
        className="bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden mb-8"
        expandIconPosition="end"
        ghost
      >
        <Panel 
          header={
            <div className="text-white font-semibold text-lg">
              Enter Giveaway
            </div>
          } 
          key="1"
          className="border-0"
        >
          <Card 
            bordered={false} 
            className="bg-white/5 backdrop-blur-sm rounded-lg border-0 text-white"
          >
            {formSubmitted ? (
              <div className="text-center py-6">
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-xl font-bold mb-2">Thank You for Entering!</h3>
                <p className="text-indigo-200 mb-4">Your entry has been successfully submitted.</p>
                <Button 
                  type="primary" 
                  onClick={() => setFormSubmitted(false)}
                  className="bg-gradient-to-r from-pink-500 to-indigo-600 border-0"
                >
                  Submit Another Entry
                </Button>
              </div>
            ) : (
              <Form
                form={form}
                name="giveawayEntryForm"
                layout="vertical"
                onFinish={onSubmit}
                requiredMark={false}
                className="text-white"
                initialValues={{
                  event_id: eventId,
                }}
              >
                <Form.Item
                  name="name"
                  label={<span className="text-white">Full Name</span>}
                  rules={[
                    { required: true, message: 'Please enter your full name' },
                    { min: 2, message: 'Name must be at least 2 characters' }
                  ]}
                >
                  <Input 
                    prefix={<UserOutlined className="text-indigo-300" />} 
                    placeholder="John Doe"
                    className="bg-white/10 border-indigo-400 text-white placeholder:text-indigo-300"
                  />
                </Form.Item>

                <Form.Item
                  name="email"
                  label={<span className="text-white">Email Address</span>}
                  rules={[
                    { type: 'email', message: 'Please enter a valid email' },
                    { required: true, message: 'Email is required' }
                  ]}
                >
                  <Input 
                    prefix={<MailOutlined className="text-indigo-300" />} 
                    placeholder="email@example.com"
                    className="bg-white/10 border-indigo-400 text-white placeholder:text-indigo-300"
                  />
                </Form.Item>

                <Form.Item
                  name="whatsapp_number"
                  label={<span className="text-white">WhatsApp Number</span>}
                  rules={[
                    { required: true, message: 'WhatsApp number is required' },
                    { type: 'number', message: 'Please enter a valid number' }
                  ]}
                >
                  <InputNumber 
                    prefix={<PhoneOutlined className="text-indigo-300" />} 
                    placeholder="9876543210"
                    className="w-full bg-white/10 border-indigo-400 text-white placeholder:text-indigo-300"
                    controls={false}
                    min={1000000000}
                    max={9999999999}
                  />
                </Form.Item>

                <Form.Item
                  name="address"
                  label={<span className="text-white">Address</span>}
                  rules={[
                    { required: true, message: 'Please enter your address' }
                  ]}
                >
                  <Input.TextArea 
                    placeholder="Your complete address"
                    className="bg-white/10 border-indigo-400 text-white placeholder:text-indigo-300"
                    rows={3}
                  />
                </Form.Item>

                <div className="flex gap-4">
                  <Form.Item
                    name="city"
                    label={<span className="text-white">City</span>}
                    className="flex-1"
                    rules={[
                      { required: true, message: 'City is required' }
                    ]}
                  >
                    <Input 
                      prefix={<EnvironmentOutlined className="text-indigo-300" />} 
                      placeholder="Your city"
                      className="bg-white/10 border-indigo-400 text-white placeholder:text-indigo-300"
                    />
                  </Form.Item>

                  <Form.Item
                    name="pincode"
                    label={<span className="text-white">Pincode</span>}
                    className="flex-1"
                    rules={[
                      { required: true, message: 'Pincode is required' },
                      { type: 'number', message: 'Please enter a valid pincode' },
                      { len: 6, message: 'Pincode must be 6 digits', transform: (val) => val?.toString() }
                    ]}
                  >
                    <InputNumber 
                      prefix={<NumberOutlined className="text-indigo-300" />} 
                      placeholder="123456"
                      className="w-full bg-white/10 border-indigo-400 text-white placeholder:text-indigo-300"
                      controls={false}
                      min={100000}
                      max={999999}
                    />
                  </Form.Item>
                </div>

                {/* Hidden fields */}
                <Form.Item name="event_id" hidden>
                  <Input />
                </Form.Item>

                <Form.Item name="qr_code_id" hidden>
                  <Input />
                </Form.Item>

                <Form.Item name="request_ip_address" hidden>
                  <Input />
                </Form.Item>

                <Form.Item name="request_user_agent" hidden>
                  <Input />
                </Form.Item>

                <Form.Item className="mb-0">
                  <Button 
                    type="primary" 
                    htmlType="submit"
                    className="w-full h-12 bg-gradient-to-r from-pink-500 to-indigo-600 border-0 font-medium text-lg"
                    disabled={savingResponse}
                  >
                    {savingResponse ? <Spin /> : 'Submit Entry'}
                  </Button>
                </Form.Item>
              </Form>
            )}
          </Card>
        </Panel>
      </Collapse>
    </div>
  );
}