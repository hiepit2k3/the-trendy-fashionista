import React, { useEffect, useState } from "react";
import Button from "../../components/button/Button";
import DialogDelete from "../../components/dialog/DialogDelete.jsx";
import axios from "../../config/axios.js";
import { toast } from "react-toastify";
import { CiEdit } from "react-icons/ci";
import { BsTrash3 } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { selectCurrentToken } from "../../redux/features/authSlice.jsx";
import { useSelector } from "react-redux";
import Pagination from "../../components/pagination/Pagination.jsx";

const ProductManage = () => {
  const token = useSelector(selectCurrentToken);
  const [productData, setProductData] = useState([]);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0); // Thêm state trang hiện tại
  const [totalPages, setTotalPages] = useState(0); // Thêm state tổng số trang
  const [showDialog, setShowDialog] = useState({
    show: false,
    id: null,
  });

  //Call api
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/product?page=${currentPage}`);
        setProductData(response.data || response.content);
        const totalPages = Math.ceil(response["all-item"] / response.size);
        setTotalPages(totalPages); // Cập nhật tổng số trang
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [currentPage]);

  const handleChangePage = (page) => {
    setCurrentPage(page);
  };

  const handleCloseDialog = () => {
    setShowDialog({
      show: false,
      id: null,
    });
  };

  const handleDeleteTrue = (id) => {
    setShowDialog({
      show: true,
      id: id,
    });
  };

  const handleDelete = async () => {
    try {
      if (showDialog.show && showDialog.id) {
        await axios.delete(`/product/delete/${showDialog.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProductData(productData.filter((item) => item.id !== showDialog.id));
        handleCloseDialog();
        toast.success("Delete product successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    } catch (response) {
      handleCloseDialog();
      toast.error(response.response.data.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  return (
    <>
      <Link to="/admin/product/add">
        <Button
          className="cursor-pointer float-right mr-2 mb-2 bg-light-green-500"
          // onClick={handleCreateTrue}
        >
          Add new product
        </Button>
      </Link>
      <table className="w-full table-auto text-center">
        <thead className="bg-gray-100 text-xs font-semibold uppercase text-gray-400">
          <tr>
            <th className="px-6 py-4 font-medium text-gray-900">Image</th>
            <th className="px-6 py-4 font-medium text-gray-900">Name</th>
            <th className="px-6 py-4 font-medium text-gray-900">Min Price</th>
            <th className="px-6 py-4 font-medium text-gray-900">Max Price</th>
            <th className="px-6 py-4 font-medium text-gray-900">Quantity</th>
            <th className="px-6 py-4 font-medium text-gray-900">Discount</th>
            <th className="px-6 py-4 font-medium text-gray-900">Order Count</th>
            <th className="px-6 py-4 font-medium text-gray-900">Rate</th>
            <th className="px-6 py-4 font-medium text-gray-900">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-sm">
          {productData.length > 0 &&
            productData.map((item) => (
              <tr key={item.id}>
                <td className="w-12">
                  <img src={item.main_image} alt="" />
                </td>
                <td className="w-1/4 font-medium text-gray-800">{item.name}</td>
                <td className="">{item.min_price}</td>
                <td className="">{item.max_price}</td>
                <td className="">{item.quantity}</td>
                <td className="">{item.discount}</td>
                <td className="">{item.order_count}</td>
                <td className="">{item.rate}</td>
                <td className="p-2">
                  <span className="flex items-center justify-center gap-3">
                    <a
                      className="p-3 text-2xl hover:text-blue-500 cursor-pointer"
                      onClick={() => navigate(`/admin/product/edit/${item.id}`)}
                    >
                      <CiEdit />
                    </a>
                    <a
                      className="ml-2 p-2 text-2xl  hover:text-blue-500 cursor-pointer"
                      onClick={() => handleDeleteTrue(item.id)}
                    >
                      <BsTrash3 />
                    </a>
                  </span>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <div className="flex items-center justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onChange={handleChangePage}
        ></Pagination>
      </div>
      <DialogDelete
        show={showDialog.show}
        title="Product"
        confirm={handleDelete}
        cancel={handleCloseDialog}
      />
    </>
  );
};

export default ProductManage;
