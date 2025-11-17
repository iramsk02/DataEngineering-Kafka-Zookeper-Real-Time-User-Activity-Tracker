import React, { useEffect, useCallback, useState } from 'react';

const API_URL = "http://localhost:3000/events";

const containerStyle = {
  fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  padding: '50px',
  maxWidth: '600px',
  margin: '40px auto',
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
  borderTop: '5px solid #007bff',
};

const headerStyle = {
  fontSize: '2em',
  color: '#333',
  marginBottom: '10px',
  borderBottom: '1px solid #eee',
  paddingBottom: '10px',
};

const infoStyle = {
  color: '#666',
  fontSize: '1em',
  lineHeight: '1.6',
  backgroundColor: '#f8f9fa',
  padding: '15px',
  borderRadius: '4px',
  marginTop: '20px',
  marginBottom: '30px',
};

const buttonContainerStyle = {
  display: 'flex',
  gap: '15px',
  marginTop: '20px',
};

const buttonStyle = {
  padding: '12px 25px',
  fontSize: '1em',
  fontWeight: '600',
  color: '#ffffff',
  backgroundColor: '#007bff',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  transition: 'background-color 0.2s',
};

const selectStyle = {
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '1em',
    marginLeft: '10px',
};

const generateUniqueId = () => {
  return 'USER_' + Math.random().toString(16).slice(2, 10);
};


const sendEvent = async (type, page, userId) => {
  const eventData = {
    userId: userId, 
    eventType: type,
    page: page, 
    timestamp: Date.now()
  };

  console.log(`[Tracker] Sending event: ${type} on page: ${page} by ${userId}`);

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(eventData)
    });

    const result = await response.json();
    console.log(`[Tracker] API Response: ${result.status}`);
  } catch (error) {
    console.error("[Tracker] Failed to send event:", error);
  }
};

const ActivityTracker = () => {
  const [currentPage, setCurrentPage] = useState('/'); 
  const [userId, setUserId] = useState(''); 

  useEffect(() => {
    let currentId = localStorage.getItem('activity_tracker_user_id');

    if (!currentId) {
      currentId = generateUniqueId();
      localStorage.setItem('activity_tracker_user_id', currentId);
      console.log(`[Tracker] New User ID generated and saved: ${currentId}`);
    } else {
      console.log(`[Tracker] Existing User ID loaded: ${currentId}`);
    }
    setUserId(currentId);
  }, []); 
  useEffect(() => {
    if (userId) { 
        sendEvent("page_view", currentPage, userId);
    }
  }, [currentPage, userId]); 

  const handleClick = useCallback(() => {
    if (userId) {
        sendEvent("click", currentPage, userId);
    }
  }, [currentPage, userId]); 

  useEffect(() => {
  
    document.addEventListener("click", handleClick);

   
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [handleClick]); 

  const handlePageChange = (event) => {
    setCurrentPage(event.target.value);
  };

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>Activity Tracker Client</h1>
      
      <div style={infoStyle}>
        <p style={{ fontWeight: 'bold' }}>
            Current User ID: <span style={{ color: '#007bff' }}>{userId || 'Loading...'}</span>
        </p>
      

        <label htmlFor="page-select" style={{ fontWeight: 'bold', color: '#000', display: 'block', marginTop: '15px' }}>
            Simulate Current Page:
        </label>
        <select id="page-select" value={currentPage} onChange={handlePageChange} style={selectStyle}>
            <option value="/">Home Page </option>
            <option value="/dashboard">Dashboard</option>
            <option value="/products">Products</option>
            <option value="/settings">User Settings</option>
        </select>
      </div>

      <h2>Test Interaction Zone</h2>
      <p style={{ color: '#999', fontSize: '0.9em' }}>Click the buttons below to generate a click event on the current page ({currentPage}).</p>
      
      <div style={buttonContainerStyle}>
        <button style={buttonStyle} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0056b3'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#007bff'}>
          Generate Click Event A
        </button>
        <button style={buttonStyle} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0056b3'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#007bff'}>
          Generate Click Event B
        </button>
      </div>
    </div>
  );
};

export default ActivityTracker;