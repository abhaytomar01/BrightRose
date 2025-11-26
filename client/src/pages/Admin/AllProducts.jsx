// src/pages/Admin/AllProducts.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "../../components/Spinner";
import { useAuth } from "../../context/auth";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import Rating from "@mui/material/Rating";
import Actions from "./Actions";
import SeoData from "../../SEO/SeoData";

const AllProducts = () => {
  const { authAdmin } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products (public endpoint but we still can add token)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/v1/products`, {
          headers: authAdmin?.token ? { Authorization: `Bearer ${authAdmin.token}` } : {}
        });

        // backend likely returns 200
        if (res?.data?.products) {
          setProducts(res.data.products);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error loading products");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [authAdmin?.token]);

  const updateDeletedProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p._id !== id));
  };

  const columns = [
    { field: "id", headerName: "Product ID", minWidth: 120, flex: 0.6 },
    {
      field: "name",
      headerName: "Name",
      minWidth: 200,
      flex: 1,
      renderCell: (params) => (
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <img src={params.row.image} alt={params.row.name} className="w-full h-full object-cover" />
          </div>
          <span>{params.row.name}</span>
        </div>
      ),
    },
    { field: "category", headerName: "Category", minWidth: 110, flex: 0.3 },
    {
      field: "stock",
      headerName: "Stock",
      minWidth: 80,
      flex: 0.2,
      renderCell: (params) => (params.row.stock < 10 ? <span className="text-red-600 font-semibold">{params.row.stock}</span> : <span>{params.row.stock}</span>)
    },
    {
      field: "price",
      headerName: "Price",
      minWidth: 110,
      flex: 0.3,
      renderCell: (params) => <span>₹{params.row.price?.toLocaleString()}</span>
    },
    {
      field: "discount_price",
      headerName: "Discount",
      minWidth: 140,
      flex: 0.3,
      renderCell: (params) => <span>₹{params.row.discount_price?.toLocaleString()}</span>
    },
    {
      field: "rating",
      headerName: "Rating",
      minWidth: 110,
      flex: 0.25,
      renderCell: (params) => <Rating readOnly value={params.row.rating} size="small" precision={0.5} />
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 160,
      flex: 0.5,
      sortable: false,
      renderCell: (params) => <Actions name={params.row.name} updateDeletedProduct={updateDeletedProduct} id={params.row.id} />
    }
  ];

  const rows = products.map((item) => ({
    id: item._id,
    name: item.name,
    image: item.images?.[0]?.url || "",
    category: item.category,
    stock: item.stock,
    price: item.price,
    discount_price: item.discountPrice,
    rating: item.ratings || 0
  }));

  return (
    <div className="relative p-2 min-h-[70vh]">
      <SeoData title="All Products - Admin" />
      {loading ? <Spinner /> : (
        <div className="h-full">
          <div className="flex justify-between items-center p-2">
            <h1 className="text-[16px] font-[600] uppercase">Products</h1>
            <Link to="/admin/dashboard/add-product" className="py-2 px-4 rounded shadow font-[500] text-black bg-primaryBlue hover:shadow-lg">New Product</Link>
          </div>

          <div className="h-[70vh]">
            <DataGrid
              rows={rows}
              columns={columns}
              initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
              pageSizeOptions={[10]}
              disableRowSelectionOnClick
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AllProducts;
