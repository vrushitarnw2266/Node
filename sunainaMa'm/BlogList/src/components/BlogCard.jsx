import { Link } from "react-router-dom";

function BlogCard({blog}){
    return(
        <>
        <div style={{border:"1px solid gray", padding:"10px"}}>
            <img src={blog.image} width="100%" alt="" />
            
            <h3>{blog.title}</h3>
            <p>{blog.description}</p>
            <Link to={`/blogs/${blog.id}`}>Read More</Link>
        </div>
        </>
    )
}
export default BlogCard;