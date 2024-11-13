import { useContext, useEffect, useState } from "react";
import { Button, Form, Input, Row, Col, DatePicker, Space, Card, Popover, List } from "antd";
import dayjs from "dayjs";

import { networkCall } from "../utilities/networkCall";
import { METHODS } from "../constants/httpMethods";
import { ENDPOINTS } from "../constants/endpoints";
import { alertContext } from "../context/useAlert";

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const [basicInfoForm] = Form.useForm();
  const [changePasswordForm] = Form.useForm();
  const messageApi = useContext(alertContext);

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    const response = await networkCall(METHODS.GET, ENDPOINTS.ME, {}, true);
    if (response.status === 200) {
      const user = response.data.data;
      basicInfoForm.setFieldsValue({
        firstname: user.firstname,
        lastname: user.lastname,
        dateOfBirth: dayjs(user.dateOfBirth),
      });
    } else {
      messageApi.error("Error fetching user details");
    }
  };

  const passwordRequirements = [
    "Atleast 6 characters long",
    "Atleast 1 uppercase letter",
    "Atleast 1 lowercase letter",
    "Atleast 1 special character",
    "Atleast 1 numeric value",
  ];

  const passwordRequirementsJsx = (
    <div>
      <List
        size="small"
        bordered
        dataSource={passwordRequirements}
        renderItem={(item) => <List.Item>{item}</List.Item>}
      />
    </div>
  );

  const handleBasicInfoUpdate = async (values) => {
    setLoading(true);
    const payload = { ...values, dateOfBirth: dayjs(values.dateOfBirth).format("YYYY-MM-DD") };
    const response = await networkCall(METHODS.PUT, ENDPOINTS.UPDATE_ME, payload, true);
    if (response.status === 200) {
      messageApi.success(response.data.message);
    } else {
      messageApi.error(response.response.data.message);
    }
    setLoading(false);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleChangePassword = async () => {
    setLoading(true);
    const payload = changePasswordForm.getFieldValue();
    const response = await networkCall(METHODS.POST, ENDPOINTS.CHANGE_PASSWORD, payload, true);

    if (response.status === 200) {
      messageApi.success(response.data.message);
    } else {
      messageApi.error(response.response.data.message);
    }
    setLoading(false);
  };

  return (
    <Space style={{ width: "100%" }} direction="vertical" size={16}>
      <Card
        title="Basic Information"
        style={{
          width: "100%",
        }}
      >
        <Form
          name="basic"
          form={basicInfoForm}
          layout="vertical"
          style={{}}
          onFinish={handleBasicInfoUpdate}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Firstname"
                name="firstname"
                rules={[
                  {
                    required: true,
                    message: "Please input your firstname!",
                  },
                ]}
              >
                <Input disabled={loading} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Lastname"
                name="lastname"
                rules={[
                  {
                    required: true,
                    message: "Please input your lastname!",
                  },
                ]}
              >
                <Input disabled={loading} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
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
            </Col>
          </Row>

          <Form.Item style={{ display: "flex", justifyContent: "flex-end" }} label={null}>
            <Button color="primary" variant="filled" htmlType="submit" loading={loading}>
              Update
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <Card
        size="small"
        title="Change Password"
        style={{
          width: "100%",
        }}
      >
        <Form
          name="basic"
          form={changePasswordForm}
          layout="vertical"
          style={{}}
          onFinish={handleChangePassword}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Current Password"
                name="currentPassword"
                rules={[
                  {
                    required: true,
                    message: "Please input your current password!",
                  },
                ]}
              >
                <Input.Password disabled={loading} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Popover content={passwordRequirementsJsx} title="Password Requirements">
                <Form.Item
                  label="New Password"
                  name="newPassword"
                  rules={[
                    {
                      required: true,
                      message: "Please input your new pasword!",
                    },
                    { min: 6, message: "Minimum 6 characters are required" },
                    {
                      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_-]).{8,}$/,
                      message: "Password is not strong enough",
                    },
                  ]}
                >
                  <Input.Password disabled={loading} />
                </Form.Item>
              </Popover>
            </Col>
          </Row>

          <Form.Item style={{ display: "flex", justifyContent: "flex-end" }} label={null}>
            <Button color="danger" variant="filled" htmlType="submit" disabled={loading}>
              Change Password
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Space>
  );
};

export default Profile;
