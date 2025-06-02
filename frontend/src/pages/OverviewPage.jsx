// frontend/src/pages/OverviewPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import '../assets/styles/OverviewPage.css'; // ตรวจสอบให้แน่ใจว่าไฟล์นี้ถูกสร้างแล้ว

const OverviewPage = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [currentPath, setCurrentPath] = useState(''); // เพื่อแสดง path ปัจจุบัน

  useEffect(() => {
    if (isAuthenticated && user) {
      // โหลดไฟล์และโฟลเดอร์เมื่อผู้ใช้ Login
      fetchItems(currentPath);
    }
  }, [isAuthenticated, user, currentPath]); // เพิ่ม currentPath เป็น dependency

  const fetchItems = async (path) => {
    // ในอนาคต เราจะเรียก API ไปยัง Backend เพื่อดึงข้อมูลไฟล์/โฟลเดอร์จาก S3
    // สำหรับตอนนี้เราจะใช้ข้อมูลจำลอง
    setLoading(true); // เพิ่ม loading state ในหน้านี้ด้วยถ้าต้องการ
    try {
      // จำลองการดึงข้อมูล
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
      // setLoading(false);
    } catch (error) {
      console.error('Failed to fetch items:', error);
      // setLoading(false);
    }
  };

  const handleFolderClick = (folderName) => {
    setCurrentPath(folderName); // ในอนาคตจะซับซ้อนกว่านี้ (เช่น path/to/folder)
  };

  const handleBackClick = () => {
    setCurrentPath(''); // กลับไปหน้าหลักชั่วคราว
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
            <li className={currentPath === '' ? 'active' : ''} onClick={() => setCurrentPath('')}>
              <span className="icon">📂</span> My Drive
            </li>
            <li><span className="icon">⭐</span> Starred</li>
            <li><span className="icon">🕒</span> Recent</li>
            <li><span className="icon">🗑️</span> Trash</li>
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
