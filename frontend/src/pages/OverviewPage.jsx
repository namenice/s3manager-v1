// frontend/src/pages/OverviewPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../assets/styles/OverviewPage.css';

const OverviewPage = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [currentPath, setCurrentPath] = useState('');
  const location = useLocation();

  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchItems(currentPath);
    }
  }, [isAuthenticated, user, currentPath]);

  const fetchItems = async (path) => {
    // ... (โค้ดจำลอง fetchItems เดิม) ...
    try {
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulating API call delay

        if (path === '') { // Root directory
          setFolders([
            { name: 'My Documents', type: 'folder', id: 'f1' },
            { name: 'Photos', type: 'folder', id: 'f2' },
            { name: 'Shared with me', type: 'folder', id: 'f3' },
          ]);
          setFiles([
            { name: 'report.pdf', type: 'file', size: '1.2 MB', modified: '2023-04-01', id: 'file1' },
            { name: 'presentation.pptx', type: 'file', size: '5.5 MB', modified: '2023-03-20', id: 'file2' },
            { name: 'my_notes.txt', type: 'file', size: '0.1 MB', modified: '2023-04-05', id: 'file3' },
          ]);
        } else if (path === 'My Documents') {
          setFolders([]);
          setFiles([
            { name: 'thesis.docx', type: 'file', size: '3.0 MB', modified: '2023-01-15', id: 'file4' },
            { name: 'budget.xlsx', type: 'file', size: '0.8 MB', modified: '2023-03-10', id: 'file5' },
          ]);
        } else {
          setFolders([]);
          setFiles([]);
        }
    } catch (error) {
        console.error('Failed to fetch items:', error);
    }
  };

  const handleFolderClick = (folderName) => {
    setCurrentPath(folderName);
  };

  const handleBackClick = () => {
    setCurrentPath('');
  };

  if (loading) {
    return <div className="overview-loading">Loading Overview...</div>;
  }

  return (
    <div className="overview-container">
      <div className="sidebar">
        <button className="new-button">+ New</button>
        <nav className="sidebar-nav">
          <ul>
            {/* เมนูหลัก */}
            <li>
              <Link to="/overview" className={location.pathname === '/overview' ? 'active' : ''}>
                <span className="icon">📊</span> Overview
              </Link>
            </li>
            <li>
              <Link to="/overview" className={location.pathname === '/my-bucket' ? 'active' : ''}>
                <span className="icon">🪣</span> My Bucket
              </Link>
            </li>
            <li>
              <Link to="/trash" className={location.pathname === '/trash' ? 'active' : ''}>
                <span className="icon">🗑️</span> Trash
              </Link>
            </li>
            
            {/* --- เมนู Admin (แสดงเฉพาะ Admin) --- */}
            {user && user.role === 'admin' && (
              <li className={`admin-menu-item ${isAdminMenuOpen ? 'open' : ''}`}>
                {/* กลับไปใช้ลูกศร ▲ / ▼ และวางไว้ด้านขวา */}
                <div className="admin-menu-toggle" onClick={() => setIsAdminMenuOpen(!isAdminMenuOpen)}>
                  <span className="icon">⚙️</span> Admin
                  <span className="toggle-arrow">{isAdminMenuOpen ? '▲' : '▼'}</span> {/* ลูกศรชี้ขึ้น/ลง */}
                </div>
                {/* เมนูย่อยของ Admin */}
                {isAdminMenuOpen && (
                  <ul className="admin-submenu">
                    <li>
                      <Link to="/admin/users" className={location.pathname === '/admin/users' ? 'active' : ''}>
                        <span className="icon">👥</span> Users
                      </Link>
                    </li>
                    <li>
                      <Link to="/admin/buckets" className={location.pathname === '/admin/buckets' ? 'active' : ''}>
                        <span className="icon">🪣</span> Buckets
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
            )}
          </ul>
        </nav>
        <div className="storage-info">
          <p>Storage: 5 GB of 15 GB used</p>
          <div className="storage-bar">
            <div className="storage-fill" style={{ width: '33.33%' }}></div>
          </div>
        </div>
      </div>

      <div className="main-content">
        <div className="path-header">
          {currentPath && (
            <button className="back-button" onClick={handleBackClick}>
              &#x2190; Back
            </button>
          )}
          <h2>{currentPath || 'My Drive'}</h2>
          <div className="search-bar">
            <input type="text" placeholder="Search in Drive..." />
            <button>🔍</button>
          </div>
        </div>

        <div className="item-grid-section">
          {folders.length > 0 && (
            <>
              <h3>Folders</h3>
              <div className="item-grid folders-grid">
                {folders.map(folder => (
                  <div key={folder.id} className="item-card folder-card" onClick={() => handleFolderClick(folder.name)}>
                    <span className="icon">📁</span>
                    <p>{folder.name}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          {files.length > 0 && (
            <>
              <h3>Files</h3>
              <div className="item-grid files-grid">
                {files.map(file => (
                  <div key={file.id} className="item-card file-card">
                    <span className="icon">📄</span>
                    <p>{file.name}</p>
                    <small>{file.size} - {file.modified}</small>
                  </div>
                ))}
              </div>
            </>
          )}

          {folders.length === 0 && files.length === 0 && !loading && (
            <p className="no-items-message">No items in this folder.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;
