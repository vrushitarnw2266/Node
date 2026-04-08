import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
    const location = useLocation();

    return (
        <nav className="navbar fade-in">
            <Link to="/" className="navbar-brand gradient-text">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
                NexCrud
            </Link>
            <div className="navbar-links">
                <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Dashboard</Link>
                <Link to="/add" className={location.pathname === '/add' ? 'active' : ''}>Add Record</Link>
            </div>
        </nav>
    );
};

export default Navbar;
