import axios from "axios";

const api = axios.create({
    baseURL:  "http://localhost:3000",
});

export const getBlogs = () => api.get("/blogs");

export const addBlog = (blog) => api.post("/blogs", blog);

export const getBlog = (id) => api.get(`/blogs/${id}`);