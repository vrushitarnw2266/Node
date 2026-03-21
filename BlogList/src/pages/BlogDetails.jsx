import { useParams } from "react-router-dom";
import { useEffect,useState } from "react";
import { getBlog } from "../services/api";

function BlogDetails(){
    const {id} = useParams();
    const [blog, setBlog] = useState(null);

    useEffect(() => {
        getBlog(id).then((res) => {
            setBlog(res.data);
        });
    },[]);
  

    return(
        <div style={{width:"600px", margin:"auto"}}>
            <img src={blog.image} width="100%" alt="" />
            <h1>{blog.title}</h1>
            <p>{blog.description}</p>
        </div>
    )
}
export default BlogDetails;