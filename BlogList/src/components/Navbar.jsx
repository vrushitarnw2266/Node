import { Link } from "react-router-dom";

function Navbar() {
    return(
        <>
        <div>
            <h2>News Geek</h2>

            <Link to="/">Home</Link>
            <Link to="/add">Add Blog</Link>
        </div>
        </>
    )
}

export default Navbar;