import {useState} from "react";
import { addBlog } from "../services/api";

function AddBlog(){
    const [blog, setBlog] = useState({
        category:"",
        title:"",
        description:"",
        image:""
    });

    const handleChange = (e) => {
        setBlog({...blog, [e.target.name]: e.target.value});
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        addBlog(blog);
    }
    return(
        <form onSubmit={handleSubmit} style={{display:"flex", flexDirection:"column", width:"300px", margin:"auto"}}>
            <select name="category" onChange={handleChange} value={blog.category} required>
                <option value="">Select Category</option>
                <option value="Technology">Technology</option>
                <option value="Health">Health</option>
                <option value="Travel">Travel</option>
            </select>

            <input name="title" onChange={handleChange} value={blog.title} placeholder="Title" required />
            <input name="image" onChange={handleChange} value={blog.image} placeholder="Image URL" required />
            <input name="blogger" onChange={handleChange} value={blog.blogger} placeholder="Blogger Name" required />

            <textarea name="description" onChange={handleChange} value={blog.description} placeholder="Description" required /> 

            <button type="submit">Add Blog</button>
        </form> 
    )
}

export default AddBlog;