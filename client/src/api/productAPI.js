import axios from "axios";

const API_URL = "https://thebrightrose.com/api/v1/product/filtered-products";


export const getFilteredProducts = async (filters) => {
  try {
    const params = new URLSearchParams(filters);
    const response = await axios.get(`${API_URL}?${params.toString()}`);
    return response.data.products;
  } catch (error) {
    console.error("Error fetching filtered products:", error);
    return [];
  }
};
