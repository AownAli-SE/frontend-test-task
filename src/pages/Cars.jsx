import { Button, Pagination, Popconfirm, Select, Space, Table } from "antd";
import { useContext, useEffect, useState } from "react";
import { networkCall } from "../utilities/networkCall";
import { ENDPOINTS } from "../constants/endpoints";
import { METHODS } from "../constants/httpMethods";
import CreateCarModal from "../features/addCar/CarModal";
import { alertContext } from "../context/useAlert";
import { useSearchParams } from "react-router-dom";

export default function Categories() {
  // States and effects
  const [cars, setCars] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [dropdownValue, setDropdownValue] = useState("all_cars");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [carToEdit, setCarToEdit] = useState(null);
  const [isView, setIsView] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const message = useContext(alertContext);

  useEffect(() => {
    const pageLimit = searchParams.get("limit") || 10;
    const page = searchParams.get("page") || 1;
    const selfCreated = searchParams.get("selfCreated");

    setCurrentPage(page);
    setPageSize(pageLimit);
    setDropdownValue(selfCreated ? "my_cars" : "all_cars");

    fetchCars(page, pageLimit, selfCreated);
    fetchCategories();
  }, []);

  // Http calls
  const fetchCars = async (page = 1, pageSize = 10, selfCreated = false) => {
    const params = {
      page,
      limit: pageSize,
    };
    if (selfCreated) params["selfCreated"] = true;

    setSearchParams(params);
    const response = await networkCall(METHODS.GET, ENDPOINTS.READ_WRITE_CARS, null, true, params);

    if (response.status === 200) {
      const dataSource = response.data.data.cars.map((c) => ({
        key: c._id,
        make: c.make,
        model: c.model,
        releasedYear: c.releasedYear,
        transmission: c.transmission,
        seatCapacity: c.seatCapacity,
        color: c.color,
        isMyCar: c.user.isMyCar,
        registrationNumber: c.registrationNumber,
        categoryId: c.categoryId,
        description: c.description,
      }));
      setCars(dataSource);
      setTotalCount(response.data.data.totalCount);
    }
  };

  const fetchCategories = async () => {
    const params = {
      page: 1,
      limit: 999999,
    };
    const response = await networkCall(METHODS.GET, ENDPOINTS.READ_WRITE_CATEGORIES, null, true, params);
    if (response.status === 200) {
      const mappedCategories = response.data.data.categories.map((c) => ({
        label: c.name,
        value: c._id,
      }));

      setCategories(mappedCategories);
    }
  };

  // Event handlers
  const handleSelectChange = (value) => {
    setDropdownValue(value);
    if (value === "my_cars") {
      fetchCars(1, pageSize, true);
    } else {
      fetchCars(1, pageSize, false);
    }
  };

  const handleEdit = async (categoryId) => {
    const category = cars.find((c) => c.key === categoryId);
    setIsModalOpen(true);
    setCarToEdit(category);
  };

  const handleDelete = async (categoryId) => {
    const url = ENDPOINTS.READ_WRITE_CARS_BY_ID.replace(":id", categoryId);
    const response = await networkCall(METHODS.DELETE, url, {}, true);
    if (response.status === 204) {
      const filteredCars = cars.filter((c) => c.key !== categoryId);
      setCars(filteredCars);
    } else {
      message.error(response.response.data.message);
    }
  };

  const handleView = (categoryId) => {
    const category = cars.find((c) => c.key === categoryId);
    setIsModalOpen(true);
    setCarToEdit(category);
    setIsView(true);
  };

  const handlePaginationChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
    fetchCars(page, pageSize);
  };

  // Table columns
  const columns = [
    {
      title: "Make",
      dataIndex: "make",
      key: "make",
      render: (text, { key }) => <a onClick={() => handleView(key)}>{text}</a>,
      sorter: (a, b) => a.make.localeCompare(b.make),
    },
    {
      title: "Model",
      dataIndex: "model",
      key: "model",
      sorter: (a, b) => a.model.localeCompare(b.model),
    },
    {
      title: "Released Year",
      key: "releasedYear",
      dataIndex: "releasedYear",
      sorter: (a, b) => new Date(a.releasedYear) - new Date(b.releasedYear),
    },
    {
      title: "Transmission",
      key: "transmission",
      dataIndex: "transmission",
      sorter: (a, b) => a.transmission.localeCompare(b.transmission),
    },
    {
      title: "Seat Capacity",
      key: "seatCapacity",
      dataIndex: "seatCapacity",
      sorter: (a, b) => a.seatCapacity - b.seatCapacity,
    },
    {
      title: "Color",
      key: "color",
      dataIndex: "color",
      sorter: (a, b) => a.color.localeCompare(b.color),
    },
    {
      title: "Action",
      key: "action",
      render: (data) => {
        return data.isMyCar ? (
          <Space size="middle">
            <a onClick={() => handleEdit(data.key)}>Edit</a>
            <Popconfirm
              title="Delete the car"
              description="Are you sure to delete this car?"
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
              label: "All Cars",
              value: "all_cars",
            },
            {
              label: "My Cars",
              value: "my_cars",
            },
          ]}
        />
        <Button color="primary" variant="filled" onClick={() => setIsModalOpen(true)}>
          Add Car
        </Button>
      </div>
      <Table columns={columns} pagination={false} dataSource={cars} />
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
      <CreateCarModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        editCar={carToEdit}
        setCarToEdit={setCarToEdit}
        refetchCars={fetchCars}
        isView={isView}
        setIsView={setIsView}
        categories={categories}
      />
    </>
  );
}
