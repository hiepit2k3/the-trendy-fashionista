import axios from "../../config/axios";
import { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../../redux/features/authSlice";
import { Option, Select } from "@material-tailwind/react";
import DialogEditTypeOrder from "./DialogEditTypeOrder";
import { toast } from "react-toastify";
import Pagination from "../../components/pagination/Pagination";

const OrderManage = () => {
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState([]);
  const [selectTypeOrder, setSelectTypeOrder] = useState("");
  const token = useSelector(selectCurrentToken);
  const [isEditTypeOrder, setIsEditTypeOrder] = useState({
    show: false,
    dataToEdit: {},
  });
  const [isOrderUpdated, setIsOrderUpdated] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchData = async (url) => {
      try {
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const totalPages = Math.ceil(response["all-item"] / response.size);
        setTotalPages(totalPages);
        setOrderData(response.data);
        setIsOrderUpdated(false);
      } catch (error) {
        setOrderData([]);
      }
    };
    if (selectTypeOrder !== "") {
      fetchData(`/order?type=${selectTypeOrder}`);
    } else {
      fetchData(`/order?page=${currentPage}`);
    }
  }, [selectTypeOrder, token, isOrderUpdated, currentPage]);
  const handleChangeSelect = (value) => {
    setSelectTypeOrder(value);
  };
  const handleChangePage = (page) => {
    setCurrentPage(page);
  };

  const handleOpenEdit = (data) => {
    setIsEditTypeOrder({
      show: true,
      dataToEdit: data,
    });
  };

  const handleChangeTypeOrder = async (data) => {
    try {
      setLoading(true);
      await axios.put(`/order/update/${data.id}?typeOrder=${data.typeOrder}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Order updated successfully", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setIsOrderUpdated(true);
      setLoading(false);
    } catch (error) {
      if (error) {
        toast.error("Failed to update order. Please try again.", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditTypeOrder({
      show: false,
      dataToEdit: {},
    });
  };
  const statusColorMap = {
    PENDING: "orange",
    WAIT_TO_PAY: "green",
    PROCESSING: "blue",
    DELIVERING: "blue",
    SUCCESSFUL: "green",
    CANCELLED: "red",
    RETURNED: "gray",
  };
  return (
    <>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col items-end justify-center gap-3">
          <div className="mr-10">
            <Select
              label="Select Type Order"
              value={selectTypeOrder}
              onChange={handleChangeSelect}
            >
              <Option value="PENDING">PENDING</Option>
              <Option value="WAIT_TO_PAY">TO PAY</Option>
              <Option value="PROCESSING">PROCESSING</Option>
              <Option value="DELIVERING">DELIVERING</Option>
              <Option value="SUCCESSFUL">SUCCESSFUL</Option>
              <Option value="CANCELLED">CANCELLED</Option>
              <Option value="RETURNED">RETURNED</Option>
            </Select>
          </div>
          <table className="w-full table-auto">
            <thead className="text-xs font-semibold text-gray-400 uppercase bg-gray-100">
              <tr>
                <th className="px-6 py-4 font-medium text-gray-900">
                  Customer
                </th>
                <th className="px-6 py-4 font-medium text-gray-900">Items</th>
                <th className="px-6 py-4 font-medium text-gray-900">Price</th>
                <th className="px-6 py-4 font-medium text-gray-900">
                  Purchase Date
                </th>
                <th className="px-6 py-4 font-medium text-gray-900">Status</th>
                <th className="px-6 py-4 font-medium text-gray-900"></th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
              {orderData &&
                orderData?.map((item, index) => (
                  <tr key={index}>
                    <td className="rc-table-cell">
                      <div className="flex items-center justify-center gap-3">
                        <img
                          src={item.accountDto.image}
                          alt="avatar"
                          className="object-cover w-10 h-10 rounded-full "
                          loading="lazy"
                        />
                        <div className="grid gap-0.5">
                          <p className="text-sm font-medium text-gray-900 font-lexend dark:text-gray-700">
                            {item.accountDto.fullName}
                          </p>
                          <p className="text-[13px] text-gray-500">
                            {item.accountDto.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <p className="flex items-center justify-center font-medium text-gray-700">
                        {item.orderDetailsDto.length}
                      </p>
                    </td>
                    <td className="p-3">
                      <p className="flex items-center justify-center font-medium text-gray-700">
                        {item.orderDto.total}
                      </p>
                    </td>
                    <td className="p-3">
                      <p className="flex items-center justify-center font-medium text-gray-700">
                        {item.orderDto.purchaseDate}
                      </p>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-center">
                        <span
                          className={`inline-flex items-center justify-center w-2 h-2 font-semibold leading-none text-white bg-${
                            statusColorMap[item.orderDto.typeOrder]
                          }-500 rounded-full rizzui-badge color`}
                        ></span>
                        <p
                          className={`font-medium text-${
                            statusColorMap[item.orderDto.typeOrder]
                          }-500 ms-2`}
                        >
                          {item.orderDto.typeOrder}
                        </p>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-center gap-3">
                        <span
                          onClick={() => handleOpenEdit(item)}
                          className="p-3 text-2xl cursor-pointer hover:text-blue-500"
                        >
                          <CiEdit className="w-8" />
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-center gap-3">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onChange={handleChangePage}
          ></Pagination>
        </div>
      </div>
      <DialogEditTypeOrder
        show={isEditTypeOrder.show}
        dataToEdit={isEditTypeOrder.dataToEdit}
        handleCancelClick={handleCancelEdit}
        handleChangeTypeOrder={handleChangeTypeOrder}
        loading={loading}
      />
    </>
  );
};

export default OrderManage;
