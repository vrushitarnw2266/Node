import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getRecords, deleteRecord } from '../api';

const Home = () => {
    const [records, setRecords] = useState([]);
    const [search, setSearch] = useState('');
    const [pageSize, setPageSize] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadRecords();
    }, []);

    const loadRecords = async () => {
        try {
            setIsLoading(true);
            const data = await getRecords();
            // Reverse array to show newest first, assuming IDs increment
            setRecords(data.reverse());
        } catch (error) {
            console.error('Failed to fetch records:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this record?')) {
            await deleteRecord(id);
            loadRecords();
        }
    };

    // 1. Filter based on Search (Name, Email, Phone)
    const filteredRecords = records.filter((r) => {
        const term = search.toLowerCase();
        return (
            r.name.toLowerCase().includes(term) ||
            r.email.toLowerCase().includes(term) ||
            r.phone.includes(term)
        );
    });

    // 2. Pagination Math
    const totalPages = Math.ceil(filteredRecords.length / pageSize);

    // Ensure we don't end up on an empty page after filtering
    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        }
    }, [totalPages, currentPage]);

    const startIndex = (currentPage - 1) * pageSize;
    const currentRecords = filteredRecords.slice(startIndex, startIndex + pageSize);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    return (
        <div className="page-container glass-panel fade-in" style={{ padding: '2rem' }}>
            <div className="controls-header">
                <h2 className="gradient-text">Data Overview</h2>

                <input
                    type="text"
                    placeholder="Search by name, email, or phone..."
                    className="form-control search-bar"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setCurrentPage(1); // Reset to page 1 on new search
                    }}
                />

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Show:</span>
                    <select
                        className="select-control"
                        value={pageSize}
                        onChange={(e) => {
                            setPageSize(Number(e.target.value));
                            setCurrentPage(1);
                        }}
                    >
                        <option value={5}>5 Records</option>
                        <option value={10}>10 Records</option>
                        <option value={15}>15 Records</option>
                    </select>
                    <Link to="/add" className="btn btn-primary">
                        + Add New
                    </Link>
                </div>
            </div>

            <div className="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>Avatar</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center', padding: '3rem' }}>
                                    <div style={{ color: 'var(--accent-secondary)' }}>Loading data...</div>
                                </td>
                            </tr>
                        ) : currentRecords.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                                    No records found matching your criteria.
                                </td>
                            </tr>
                        ) : (
                            currentRecords.map((record) => (
                                <tr key={record.id}>
                                    <td>
                                        <img src={record.image} alt={record.name} className="avatar" />
                                    </td>
                                    <td style={{ fontWeight: 500, color: '#fff' }}>{record.name}</td>
                                    <td style={{ color: 'var(--text-secondary)' }}>{record.email}</td>
                                    <td style={{ fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{record.phone}</td>
                                    <td className="actions-cell">
                                        <Link to={`/edit/${record.id}`} className="btn btn-secondary btn-sm">Edit</Link>
                                        <button onClick={() => handleDelete(record.id)} className="btn btn-danger btn-sm">Delete</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="pagination">
                    <button
                        className="page-btn"
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                    >
                        &laquo;
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                            key={page}
                            className={`page-btn ${currentPage === page ? 'active' : ''}`}
                            onClick={() => handlePageChange(page)}
                        >
                            {page}
                        </button>
                    ))}

                    <button
                        className="page-btn"
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                    >
                        &raquo;
                    </button>
                </div>
            )}
        </div>
    );
};

export default Home;
