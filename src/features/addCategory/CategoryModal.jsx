import { Button, Form, Input, Modal } from "antd";
import { useContext, useEffect, useState } from "react";
import { networkCall } from "../../utilities/networkCall";
import { METHODS } from "../../constants/httpMethods";
import { ENDPOINTS } from "../../constants/endpoints";
import { alertContext } from "../../context/useAlert";
import PropTypes from "prop-types";

// Prop-types
CreateCategoryModal.propTypes = {
  refetchCategories: PropTypes.func,
  isModalOpen: PropTypes.bool,
  setIsModalOpen: PropTypes.func,
  editCategory: PropTypes.object,
  setCategoryToEdit: PropTypes.func,
  isView: PropTypes.bool,
  setIsView: PropTypes.func,
};

// Component
export default function CreateCategoryModal({
  refetchCategories,
  isModalOpen,
  setIsModalOpen,
  editCategory,
  setCategoryToEdit,
  isView,
  setIsView,
}) {
  // Stats and effects
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const message = useContext(alertContext);

  useEffect(() => {
    if (!editCategory) return;

    const { name, description } = editCategory;
    form.setFieldsValue({
      name,
      description,
    });
  }, [editCategory]);

  // Event handlers

  const handleOk = async () => {
    setLoading(true);
    let response;
    if (!editCategory) {
      response = await networkCall(METHODS.POST, ENDPOINTS.READ_WRITE_CATEGORIES, form.getFieldValue(), true);
    } else {
      const url = ENDPOINTS.READ_WRITE_CATEGORY_BY_ID.replace(":id", editCategory.key);
      response = await networkCall(METHODS.PUT, url, form.getFieldValue(), true);
    }

    if (response.status.toString().startsWith("2")) {
      setIsModalOpen(false);
      refetchCategories();
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
    setCategoryToEdit(null);
    setIsView(false);
  };

  // JSX
  return (
    <>
      <Modal
        title="Add Category"
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
          name="add-category"
          form={form}
          layout="vertical"
          style={{ marginTop: "1rem", marginBottom: "1rem" }}
          autoComplete="off"
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Please input category name!",
              },
            ]}
          >
            <Input disabled={isView} />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input.TextArea rows={5} disabled={isView} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
