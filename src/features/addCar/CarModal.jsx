import { Button, Form, Input, Modal, Row, Col, Select, InputNumber, DatePicker } from "antd";
import { useContext, useEffect, useState } from "react";
import { networkCall } from "../../utilities/networkCall";
import { METHODS } from "../../constants/httpMethods";
import { ENDPOINTS } from "../../constants/endpoints";
import { alertContext } from "../../context/useAlert";
import PropTypes from "prop-types";
import dayjs from "dayjs";

// Prop-types
CreateCarModal.propTypes = {
  refetchCars: PropTypes.func,
  isModalOpen: PropTypes.bool,
  setIsModalOpen: PropTypes.func,
  editCar: PropTypes.object,
  setCarToEdit: PropTypes.func,
  isView: PropTypes.bool,
  setIsView: PropTypes.func,
  categories: PropTypes.array,
};

// Component
export default function CreateCarModal({
  refetchCars,
  isModalOpen,
  setIsModalOpen,
  editCar,
  setCarToEdit,
  isView,
  setIsView,
  categories,
}) {
  // Stats and effects
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const message = useContext(alertContext);

  useEffect(() => {
    if (!editCar) return;

    const {
      make,
      model,
      releasedYear,
      color,
      transmission,
      description,
      seatCapacity,
      categoryId,
      registrationNumber,
    } = editCar;

    form.setFieldsValue({
      make,
      model,
      releasedYear: dayjs(releasedYear.toString()),
      color,
      transmission,
      seatCapacity,
      categoryId,
      description,
      registrationNumber,
    });
  }, [editCar]);

  // Event handlers

  const handleOk = async () => {
    const payload = { ...form.getFieldValue() };
    payload.releasedYear = parseInt(dayjs(payload.releasedYear).format("YYYY"));
    console.log(payload);

    setLoading(true);
    let response;
    if (!editCar) {
      response = await networkCall(METHODS.POST, ENDPOINTS.READ_WRITE_CARS, payload, true);
    } else {
      const url = ENDPOINTS.READ_WRITE_CARS_BY_ID.replace(":id", editCar.key);
      response = await networkCall(METHODS.PUT, url, payload, true);
    }

    if (response.status.toString().startsWith("2")) {
      setIsModalOpen(false);
      refetchCars();
    } else {
      const errorMessage = response.response.data.message?.split(":")[2] || response?.response?.data.message;
      message.error(errorMessage);
    }
    setLoading(false);
    clearModal();
  };

  const handleCancel = () => {
    clearModal();
  };

  // Helper methods
  const clearModal = () => {
    form.resetFields();
    setIsModalOpen(false);
    setCarToEdit(null);
    setIsView(false);
  };

  // JSX
  return (
    <>
      <Modal
        title="Add Car"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[
          !isView ? (
            <Button key="submit" loading={loading} type="primary" onClick={handleOk}>
              Submit
            </Button>
          ) : null,
        ]}
      >
        <Form
          name="add-car"
          form={form}
          layout="vertical"
          style={{ marginTop: "1rem", marginBottom: "1rem" }}
          autoComplete="off"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Make"
                name="make"
                rules={[
                  {
                    required: true,
                    message: "Please input make!",
                  },
                ]}
              >
                <Input disabled={isView} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Model"
                name="model"
                rules={[
                  {
                    required: true,
                    message: "Please input model!",
                  },
                ]}
              >
                <Input disabled={isView} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Released Year"
                name="releasedYear"
                rules={[
                  {
                    required: true,
                    message: "Please input released year!",
                  },
                ]}
              >
                <DatePicker
                  disabled={isView}
                  style={{ width: "100%" }}
                  minDate={dayjs("1970")}
                  maxDate={dayjs()}
                  picker="year"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Transmision"
                name="transmission"
                rules={[
                  {
                    required: true,
                    message: "Please input transmission type!",
                  },
                ]}
              >
                <Select
                  style={{
                    width: "100%",
                  }}
                  options={["Manual", "Hybrid", "Automatic", "Electric"].map((option) => ({
                    label: option,
                    value: option,
                  }))}
                  disabled={isView}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Seat Capacity"
                name="seatCapacity"
                rules={[
                  {
                    required: true,
                    message: "Please input seat capacity!",
                  },
                ]}
              >
                <InputNumber style={{ width: "100%" }} min={2} max={60} disabled={isView} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Color"
                name="color"
                rules={[
                  {
                    required: true,
                    message: "Please input color!",
                  },
                ]}
              >
                <Input disabled={isView} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Category"
                name="categoryId"
                rules={[
                  {
                    required: true,
                    message: "Please select category!",
                  },
                ]}
              >
                <Select
                  style={{
                    width: "100%",
                  }}
                  options={categories}
                  disabled={isView}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Registration Number"
                name="registrationNumber"
                rules={[
                  {
                    required: true,
                    message: "Please input registration number!",
                  },
                ]}
              >
                <Input disabled={isView} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Description" name="description">
            <Input.TextArea rows={5} disabled={isView} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
