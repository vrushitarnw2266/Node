import { useEffect,useState } from "react";
import { getBlogs } from "../services/api";
import BlogCard from "../components/BlogCard";

function Home(){
    const [blogs, setBlogs] = useState([]);

    useEffect(() =>{
        getBlogs().then((res)=>{
            setBlogs(res.data);
        })
    },[]);

    return(
       <div>
       {
        blogs.map((blog)=>{
            <BlogCard key={blog.id} blog={blog} />
        })
       }
       </div>
    )
}

export default Home;