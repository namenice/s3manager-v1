// frontend/src/components/Logo.jsx
import React from 'react';
import '../assets/styles/Logo.css'; // เราจะสร้างไฟล์นี้

const Logo = () => {
  return (
    <div className="logo-container">
      {/* สมมติว่าคุณมีไฟล์ SVG หรือรูปภาพโลโก้ของคุณ */}
      {/* ถ้าไม่มีตอนนี้ ก็ใช้แค่ข้อความ หรือใช้ Placeholder SVG ก่อน */}
      <svg
        width="100"
        height="100"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="app-logo"
      >
        {/* Placeholder for your actual logo path or image */}
        {/* Example: A simple circle for now */}
        <circle cx="50" cy="50" r="40" fill="#6CC24A" />
        <circle cx="65" cy="50" r="40" fill="#8ED96C" />
      </svg>
      <span className="logo-text">openlandscape</span>
    </div>
  );
};

export default Logo;
