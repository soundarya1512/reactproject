import React, { useEffect, useState } from "react";
import { getCountries } from "helpers/apiHelper"; // Ensure correct import path
import { Table, Typography, Spin, Alert, Button, Modal, Form, Input } from "antd";
import "antd/dist/reset.css";

const Countries = () => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCountry, setCurrentCountry] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchCountries = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getCountries();
        console.log("Fetched Countries:", data);
        setCountries(Array.isArray(data.results) ? data.results : []);
      } catch (err) {
        console.error("Error fetching countries:", err);
        setError("Failed to fetch countries");
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  // Open modal for adding a new country
  const handleAdd = () => {
    setIsEditing(false);
    setCurrentCountry(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  // Open modal for editing a country
  const handleEdit = (record) => {
    setIsEditing(true);
    setCurrentCountry(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  // Handle delete country
  const handleDelete = (id) => {
    setCountries((prev) => prev.filter((item) => item.id !== id));
  };

  // Handle form submission (Add or Edit)
  const handleFormSubmit = (values) => {
    if (isEditing) {
      // Edit logic (for now, just updating UI)
      setCountries((prev) =>
        prev.map((item) => (item.id === currentCountry.id ? { ...item, ...values } : item))
      );
    } else {
      // Add logic (for now, just adding to UI)
      const newCountry = { id: countries.length + 1, ...values };
      setCountries([...countries, newCountry]);
    }
    setIsModalOpen(false);
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Code", dataIndex: "code", key: "code" },
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
        Add Country
      </Button>
      {error && <Alert message={error} type="error" showIcon />}
      {loading ? (
        <Spin size="large" />
      ) : (
        <Table dataSource={countries} columns={columns} rowKey="id" />
      )}

      {/* Modal for Add/Edit */}
      <Modal
        title={isEditing ? "Edit Country" : "Add Country"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          <Form.Item name="name" label="Country Name" rules={[{ required: true, message: "Please enter country name" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="code" label="Country Code" rules={[{ required: true, message: "Please enter country code" }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Countries;