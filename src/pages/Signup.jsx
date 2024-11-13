import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";

import { Button, Card, DatePicker, Form, Input, Layout } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { ENDPOINTS } from "../constants/endpoints";
import { alertContext } from "../context/useAlert";

const { Content } = Layout;

export default function Signup() {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const messageApi = useContext(alertContext);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    const payload = { ...values, dateOfBirth: dayjs(values.dateOfBirth).toISOString() };
    try {
      await axios.post(ENDPOINTS.SIGNUP, payload);
      messageApi.success("Account created! Please check you email");
      setLoading(false);
      navigate("../login");
    } catch (error) {
      const message = error.response.data.message.split(":")[2];
      messageApi.error(message);
      setLoading(false);
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Layout>
      <Content
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          height: "100vh",
        }}
      >
        <Card title="Signup" size="small">
          <Form
            name="login-form"
            form={form}
            layout="vertical"
            style={{
              width: "20rem",
            }}
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="First name"
              name="firstname"
              rules={[
                {
                  required: true,
                  message: "Please input your first name!",
                },
                {
                  pattern: /^[A-Za-z\s]+$/,
                  message: "Please enter a valid name",
                },
                {
                  min: 2,
                  message: "Minimum 2 characters required",
                },
                {
                  max: 30,
                  message: "Maximum 30 characters allowed",
                },
              ]}
            >
              <Input disabled={loading} />
            </Form.Item>
            <Form.Item
              label="Last name"
              name="lastname"
              rules={[
                {
                  required: true,
                  message: "Please input your last name!",
                },
                {
                  pattern: /^[A-Za-z\s]+$/,
                  message: "Please enter a valid name",
                },
                {
                  min: 2,
                  message: "Minimum 2 characters required",
                },
                {
                  max: 30,
                  message: "Maximum 30 characters allowed",
                },
              ]}
            >
              <Input disabled={loading} />
            </Form.Item>
            <Form.Item
              label="Date of birth"
              name="dateOfBirth"
              rules={[
                {
                  required: true,
                  message: "Please input your age!",
                },
              ]}
            >
              <DatePicker
                disabled={loading}
                style={{ width: "100%" }}
                minDate={dayjs("1900-01-01")}
                maxDate={dayjs()}
              />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please input your email!",
                },
                {
                  pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Email is not valid",
                },
              ]}
            >
              <Input disabled={loading} />
            </Form.Item>

            <Form.Item style={{ display: "flex", justifyContent: "center" }}>
              <Button color="primary" variant="filled" loading={loading} htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <a disabled={loading}>
              <Link to="/login" replace>
                Login to existing account
              </Link>
            </a>
          </div>
        </Card>
      </Content>
    </Layout>
  );
}
