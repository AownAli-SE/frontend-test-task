import { Button, Card, Form, Input, Layout } from "antd";
import { useContext, useState } from "react";
import { alertContext } from "../context/useAlert";
import axios from "axios";
import { ENDPOINTS } from "../constants/endpoints";
import { encrypt } from "../utilities/encryption";
import { Link, useNavigate } from "react-router-dom";
const { Content } = Layout;

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const mesageApi = useContext(alertContext);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post(ENDPOINTS.LOGIN, values);
      const token = response.data.data.token;
      localStorage.setItem("test_token", encrypt(token));
      setLoading(false);
      navigate("../dashboard");
    } catch (error) {
      console.log(error);
      const message = error.response.data.message;
      mesageApi.error(message);
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
        <Card title="Login" size="small">
          <Form
            name="login-form"
            form={form}
            layout="vertical"
            style={{ width: "20rem" }}
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
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

            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
            >
              <Input.Password disabled={loading} />
            </Form.Item>

            <Form.Item style={{ display: "flex", justifyContent: "center" }}>
              <Button color="primary" variant="filled" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <a disabled={loading}>
              <Link to="/forget-password" replace>
                Forget Password
              </Link>
            </a>
            <a disabled={loading}>
              <Link to="/signup" replace>
                Create new account
              </Link>
            </a>
          </div>
        </Card>
      </Content>
    </Layout>
  );
}
