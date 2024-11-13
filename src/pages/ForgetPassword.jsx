import { Button, Card, Form, Input, Layout } from "antd";
import { networkCall } from "../utilities/networkCall";
import { METHODS } from "../constants/httpMethods";
import { ENDPOINTS } from "../constants/endpoints";
import { useContext, useState } from "react";
import { alertContext } from "../context/useAlert";
import { Link, useNavigate } from "react-router-dom";

const { Content } = Layout;

const ForgetPassword = () => {
  const [loading, setLoading] = useState(false);
  const messageApi = useContext(alertContext);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    const { email } = values;
    const response = await networkCall(METHODS.POST, ENDPOINTS.FORGET_PASSWORD, { email });
    if (response.status === 200) {
      messageApi.success(response.data.message);
      navigate("/login", { replace: true });
    } else {
      messageApi.error(response.response.data.message);
    }
    setLoading(false);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
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
          <Card title="Forget Password" size="small">
            <Form
              name="forget-password-form"
              layout="vertical"
              style={{
                width: "20rem",
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
                    message: "Please input your username!",
                  },
                  {
                    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Email is not valid",
                  },
                ]}
              >
                <Input disabled={loading} />
              </Form.Item>

              <Form.Item style={{ display: "flex", justifyContent: "center" }} label={null}>
                <Button color="primary" variant="filled" htmlType="submit" loading={loading}>
                  Submit
                </Button>
              </Form.Item>
            </Form>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <a disabled={loading}>
                <Link to="/login" replace>
                  Login to account
                </Link>
              </a>
            </div>
          </Card>
        </Content>
      </Layout>
    </>
  );
};
export default ForgetPassword;
