import React, { useEffect, useState } from "react";
import { getProperties } from "helpers/apiHelper"; // Ensure correct import path
import { Table, Typography, Spin, Alert, Button, Modal, Form, Input } from "antd";
import "antd/dist/reset.css";

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProperty, setCurrentProperty] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getProperties();
        console.log("Fetched Properties:", data);
        setProperties(Array.isArray(data.results) ? data.results : []);
      } catch (err) {
        console.error("Error fetching properties:", err);
        setError("Failed to fetch properties");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Open modal for adding a new property
  const handleAdd = () => {
    setIsEditing(false);
    setCurrentProperty(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  // Open modal for editing a property
  const handleEdit = (record) => {
    setIsEditing(true);
    setCurrentProperty(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  // Handle delete property
  const handleDelete = (id) => {
    setProperties((prev) => prev.filter((item) => item.id !== id));
  };

  // Handle form submission (Add or Edit)
  const handleFormSubmit = (values) => {
    if (isEditing) {
      // Edit logic (for now, just updating UI)
      setProperties((prev) =>
        prev.map((item) => (item.id === currentProperty.id ? { ...item, ...values } : item))
      );
    } else {
      // Add logic (for now, just adding to UI)
      const newProperty = { id: properties.length + 1, ...values };
      setProperties([...properties, newProperty]);
    }
    setIsModalOpen(false);
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Location", dataIndex: "location", key: "location" },
    { title: "Price", dataIndex: "price", key: "price" },
    { title: "Type", dataIndex: "type", key: "type" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={handleAdd} style={{ marginBottom: 16 }}>
        Add Property
      </Button>
      {error && <Alert message={error} type="error" showIcon />}
      {loading ? (
        <Spin size="large" />
      ) : (
        <Table dataSource={properties} columns={columns} rowKey="id" />
      )}

      {/* Modal for Add/Edit */}
      <Modal
        title={isEditing ? "Edit Property" : "Add Property"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          <Form.Item name="title" label="Property Title" rules={[{ required: true, message: "Please enter property title" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="location" label="Location" rules={[{ required: true, message: "Please enter location" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="price" label="Price" rules={[{ required: true, message: "Please enter price" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="type" label="Type" rules={[{ required: true, message: "Please enter property type" }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Properties;
