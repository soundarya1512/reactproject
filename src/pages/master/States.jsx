import React, { useEffect, useState } from "react";
import { getStates, getCountries } from "helpers/apiHelper"; // Make sure this path is correct
import { Table, Typography, Spin, Alert, Button, Modal, Form, Input, Select } from "antd";
import "antd/dist/reset.css";

const States = () => {
  const [states, setStates] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentState, setCurrentState] = useState(null);
  const [form] = Form.useForm();

  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

  const fetchStates = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const stateData = await getStates({ page });
      const countryData = await getCountries();

      setStates(Array.isArray(stateData.results) ? stateData.results : []);
      setCountries(Array.isArray(countryData.results) ? countryData.results : []);

      setPagination((prev) => ({
        ...prev,
        current: page,
        total: stateData.count || 0,
      }));
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStates();
  }, []);

  const handleTableChange = (pagination) => {
    fetchStates(pagination.current);
  };

  const handleAdd = () => {
    setIsEditing(false);
    setCurrentState(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setIsEditing(true);
    setCurrentState(record);
    form.setFieldsValue({
      ...record,
      country: record.country?.id, // Ensure country id is set
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    setStates((prev) => prev.filter((item) => item.id !== id));
  };

  const handleFormSubmit = (values) => {
    if (isEditing) {
      setStates((prev) =>
        prev.map((item) =>
          item.id === currentState.id ? { ...item, ...values, country: countries.find((c) => c.id === values.country) } : item
        )
      );
    } else {
      const newState = {
        id: states.length + 1,
        ...values,
        country: countries.find((c) => c.id === values.country),
      };
      setStates([...states, newState]);
    }
    setIsModalOpen(false);
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "State Name", dataIndex: "state", key: "state" },
    { title: "Code", dataIndex: "code", key: "code" },
    {
      title: "Country",
      dataIndex: ["country", "name"],
      key: "country",
      render: (text) => text || "N/A",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => handleEdit(record)}>Edit</Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>Delete</Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <Typography.Title level={2}>States Management</Typography.Title>

      <Button type="primary" onClick={handleAdd} style={{ marginBottom: 16 }}>
        Add State
      </Button>

      {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}

      {loading ? (
        <Spin size="large" />
      ) : (
        <Table
          dataSource={states}
          columns={columns}
          rowKey="id"
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: false,
          }}
          onChange={handleTableChange}
        />
      )}

      <Modal
        title={isEditing ? "Edit State" : "Add State"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          <Form.Item
            name="state"
            label="State Name"
            rules={[{ required: true, message: "Please enter state name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="code"
            label="State Code"
            rules={[{ required: true, message: "Please enter state code" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="country"
            label="Country"
            rules={[{ required: true, message: "Please select a country" }]}
          >
            <Select placeholder="Select a country">
              {countries.map((country) => (
                <Select.Option key={country.id} value={country.id}>
                  {country.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default States;
