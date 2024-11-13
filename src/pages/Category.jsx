import { Button, Pagination, Popconfirm, Select, Space, Table, Tag } from "antd";
import { useContext, useEffect, useState } from "react";
import { networkCall } from "../utilities/networkCall";
import { ENDPOINTS } from "../constants/endpoints";
import { METHODS } from "../constants/httpMethods";
import CreateCategoryModal from "../features/addCategory/CategoryModal";
import { alertContext } from "../context/useAlert";
import { useSearchParams } from "react-router-dom";

export default function Categories() {
  // States and effects
  const [categories, setCategories] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [dropdownValue, setDropdownValue] = useState("all_categories");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState(null);
  const [isView, setIsView] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const message = useContext(alertContext);

  useEffect(() => {
    const pageLimit = searchParams.get("limit") || 10;
    const page = searchParams.get("page") || 1;
    const selfCreated = searchParams.get("selfCreated");

    setCurrentPage(page);
    setPageSize(pageLimit);
    setDropdownValue(selfCreated ? "my_categories" : "all_categories");

    fetchCategories(page, pageLimit, selfCreated);
  }, []);

  // Http calls
  const fetchCategories = async (page = 1, pageSize = 10, selfCreated = false) => {
    const params = {
      page,
      limit: pageSize,
    };
    if (selfCreated) params["selfCreated"] = true;

    setSearchParams(params);
    const response = await networkCall(METHODS.GET, ENDPOINTS.READ_WRITE_CATEGORIES, null, true, params);

    if (response.status === 200) {
      const dataSource = response.data.data.categories.map((c) => ({
        key: c._id,
        name: c.name,
        description: c.description,
        postedBy: <Tag color={c.user.isMyCategory ? "blue" : "green"}>{`${c.user.firstname} ${c.user.lastname}`}</Tag>,
        carsCount: c.cars.length,
        isMyCategory: c.user.isMyCategory,
      }));
      setCategories(dataSource);
      setTotalCount(response.data.data.totalCount);
    }
  };

  // Event handlers
  const handleSelectChange = (value) => {
    setDropdownValue(value);
    if (value === "my_categories") {
      fetchCategories(1, pageSize, true);
    } else {
      fetchCategories(1, pageSize, false);
    }
  };

  const handleEdit = async (categoryId) => {
    const category = categories.find((c) => c.key === categoryId);
    setIsModalOpen(true);
    setCategoryToEdit(category);
  };

  const handleDelete = async (categoryId) => {
    const url = ENDPOINTS.READ_WRITE_CATEGORY_BY_ID.replace(":id", categoryId);
    const response = await networkCall(METHODS.DELETE, url, {}, true);
    if (response.status === 204) {
      const filteredCategories = categories.filter((c) => c.key !== categoryId);
      setCategories(filteredCategories);
    } else {
      message.error(response.response.data.message);
    }
  };

  const handleView = (categoryId) => {
    const category = categories.find((c) => c.key === categoryId);
    setIsModalOpen(true);
    setCategoryToEdit(category);
    setIsView(true);
  };

  const handlePaginationChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
    fetchCategories(page, pageSize);
  };

  // Table columns
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, { key }) => <a onClick={() => handleView(key)}>{text}</a>,
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Posted By",
      dataIndex: "postedBy",
      key: "postedBy",
      sorter: (a, b) => a.postedBy.props.children.localeCompare(b.postedBy.props.children),
    },
    {
      title: "Total Cars",
      key: "carsCount",
      dataIndex: "carsCount",
      sorter: (a, b) => a.carsCount - b.carsCount,
    },
    {
      title: "Action",
      key: "action",
      render: (data) => {
        return data.isMyCategory ? (
          <Space size="middle">
            <a onClick={() => handleEdit(data.key)}>Edit</a>
            <Popconfirm
              title="Delete the category"
              description="Are you sure to delete this category?"
              onConfirm={() => handleDelete(data.key)}
              okText="Yes"
              cancelText="No"
            >
              <a>Delete</a>
            </Popconfirm>
          </Space>
        ) : null;
      },
    },
  ];

  // JSX
  return (
    <>
      <div style={{ marginBottom: "1rem", display: "flex", justifyContent: "space-between" }}>
        <Select
          value={dropdownValue}
          style={{
            marginBottom: "1rem",
            width: "10rem",
          }}
          onChange={handleSelectChange}
          options={[
            {
              label: "All Categories",
              value: "all_categories",
            },
            {
              label: "My Categories",
              value: "my_categories",
            },
          ]}
        />
        <Button color="primary" variant="filled" onClick={() => setIsModalOpen(true)}>
          Add Category
        </Button>
      </div>
      <Table columns={columns} pagination={false} dataSource={categories} />
      <Pagination
        style={{ marginTop: "2rem" }}
        align="end"
        current={currentPage}
        total={totalCount}
        pageSize={pageSize}
        pageSizeOptions={[10, 20, 50]}
        showSizeChanger
        showTotal={(total, range) => `${range[0]} - ${range[1]} of ${total}`}
        onChange={handlePaginationChange}
      />
      <CreateCategoryModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        editCategory={categoryToEdit}
        setCategoryToEdit={setCategoryToEdit}
        refetchCategories={fetchCategories}
        isView={isView}
        setIsView={setIsView}
      />
    </>
  );
}
