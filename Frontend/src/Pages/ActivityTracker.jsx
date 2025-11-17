import React, { useEffect, useCallback } from 'react';

// Define the API endpoint
const API_URL = "http://localhost:3000/events";

/**
 * Sends a user activity event to the Node.js API (Kafka Producer).
 * @param {string} type - The type of event (e.g., 'page_view', 'click').
 * @param {string} page - The current page or element identifier.
 */
const sendEvent = async (type, page) => {
  const eventData = {
    userId: "REACT_USER_001", // Dynamic User ID would be used in a real app (e.g., from Auth context)
    eventType: type,
    page: page,
    timestamp: Date.now()
  };

  console.log(`[Tracker] Sending event: ${type}`);

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
  // Use useCallback to memoize the click handler function
  const handleClick = useCallback(() => {
    // Send a 'click' event along with the current path
    sendEvent("click", window.location.pathname);
  }, []);

  useEffect(() => {
    // 1. Send the initial 'page_view' event when the component mounts
    sendEvent("page_view", window.location.pathname);

    // 2. Attach the global click listener
    document.addEventListener("click", handleClick);

    // 3. Cleanup function: remove the listener when the component unmounts
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [handleClick]); // Dependency array: Re-run effect if handleClick changes (it won't)

  return (
    <div>
      <h1>React Activity Tracker Demo</h1>
      <p>Events are being sent to your Node.js API at `{API_URL}`.</p>
      <button>Test Button 1</button>
      <button>Test Button 2</button>
      {/* Any interaction on this page will trigger a 'click' event */}
    </div>
  );
};

export default ActivityTracker;