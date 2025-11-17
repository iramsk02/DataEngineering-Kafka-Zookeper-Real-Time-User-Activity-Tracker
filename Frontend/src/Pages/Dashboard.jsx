
import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend,
  BarChart, Bar,
  PieChart, Pie, Cell, ResponsiveContainer,
} from "recharts";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

const cardStyle = {
  backgroundColor: '#ffffff',
  borderRadius: '10px',
  boxShadow: '0 6px 15px rgba(0,0,0,0.08)',
  padding: '25px',
  marginBottom: '20px',
};

const metricCardStyle = { 
    ...cardStyle, 
    textAlign: 'center', 
    backgroundColor: '#e3f2fd', 
    border: '1px solid #90caf9',
};


export default function Dashboard() {
  const [pageViews, setPageViews] = useState([]);
  const [activity, setActivity] = useState([]);
  const [activeUsers, setActiveUsers] = useState(0);
  const [eventTypes, setEventTypes] = useState([]); 
  const [latestEvents, setLatestEvents] = useState([]);

  const fetchData = () => {
    axios.get("http://localhost:5000/page-views").then(res => setPageViews(res.data));
    axios.get("http://localhost:5000/activity-minutes").then(res => setActivity(res.data));
    axios.get("http://localhost:5000/active-users").then(res => setActiveUsers(res.data.activeUsers));
    axios.get("http://localhost:5000/event-types").then(res => setEventTypes(res.data));
    axios.get("http://localhost:5000/events").then(res => setLatestEvents(res.data));
  };

  useEffect(() => {
    fetchData(); 

    const intervalId = setInterval(fetchData, 5000); 

    return () => clearInterval(intervalId); 
  }, []);

  const formattedActivity = activity.map(item => {
   
    const { day, hour, minute } = item._id;
    const timeLabel = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    return { ...item, timeLabel };
  });

  return (
    <div style={{ minHeight: "100vh", padding: "30px", fontFamily: "Roboto, sans-serif", backgroundColor: '#f0f2f5' }}>
      <h1 style={{ color: '#1a202c', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px', marginBottom: '30px' }}>
        <span style={{ marginRight: '10px', color: '#007bff' }}>&#9679;</span> Real-Time User Activity Dashboard
      </h1>

      {/* --- Active Users Card --- */}
      <div style={metricCardStyle}>
        <h2 style={{ color: '#1565c0', margin: 0, fontSize: '1.2em' }}>
            <span style={{ marginRight: '8px' }}>&#128065;</span> Active Users (Last 10 Min)
        </h2>
        <p style={{ fontSize: '3.5em', fontWeight: '900', color: '#004d40', margin: '10px 0 0' }}>
          {activeUsers}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        
        {/* --- Activity Per Minute Line Chart --- */}
        <div style={cardStyle}>
          <h2 style={{ color: '#333', fontSize: '1.2em' }}>
            <span style={{ marginRight: '8px' }}>&#8599;</span> Event Volume Over Time
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={formattedActivity} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="timeLabel" angle={-15} textAnchor="end" height={50} style={{ fontSize: '0.8em' }} />
              <YAxis allowDecimals={false} />
              <Tooltip labelFormatter={(value) => `Time: ${value}`} />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="#38b2ac" 
                strokeWidth={3} 
                dot={false} 
                activeDot={{ r: 6 }}
                name="Total Events"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* --- Most Visited Pages Bar Chart --- */}
        <div style={cardStyle}>
          <h2 style={{ color: '#333', fontSize: '1.2em' }}>
            <span style={{ marginRight: '8px' }}>&#128200;</span> Most Visited Pages
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={pageViews} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="_id" angle={-15} textAnchor="end" height={60} style={{ fontSize: '0.8em' }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar 
                dataKey="count" 
                fill="#6366f1" 
                name="Page Views"
                radius={[4, 4, 0, 0]} 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
        
        {/* --- Event Types Pie Chart --- */}
        <div style={cardStyle}>
          <h2 style={{ color: '#333', fontSize: '1.2em' }}>
            <span style={{ marginRight: '8px' }}>&#x25D1;</span> Event Type Breakdown
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={eventTypes}
                dataKey="count"
                nameKey="_id"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                labelLine={false} // Clean up label lines
                label={({ _id, percent }) => `${_id} ${(percent * 100).toFixed(0)}%`}
              >
                {eventTypes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name, props) => [`${value} events`, props.payload._id]} />
              <Legend layout="horizontal" align="center" wrapperStyle={{ paddingTop: '10px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* --- Latest Events Table --- */}
        <div style={cardStyle}>
          <h2 style={{ color: '#333', fontSize: '1.2em' }}>
            <span style={{ marginRight: '8px' }}>&#9998;</span> Latest User Events (Real-Time Feed)
          </h2>
          
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9em' }}>
              <thead>
                <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={tableHeaderStyle}>Time</th>
                  <th style={tableHeaderStyle}>User ID</th>
                  <th style={tableHeaderStyle}>Event Type</th>
                  <th style={tableHeaderStyle}>Page</th>
                </tr>
              </thead>
              <tbody>
                {latestEvents.slice(0, 10).map((event, index) => (
                  <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#fafafa' : '#ffffff' }}>
                    <td style={tableCellStyle}>
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </td>
                    <td style={tableCellStyle}>{event.userId.substring(0, 10)}...</td> 
                    <td style={tableCellStyle}>
                      <span style={{ 
                        backgroundColor: event.eventType === 'page_view' ? '#ccff90' : '#b3e5fc', 
                        padding: '3px 8px', 
                        fontSize: '0.85em',
                        fontWeight: 600,
                        borderRadius: '12px' 
                      }}>
                        {event.eventType}
                      </span>
                    </td>
                    <td style={tableCellStyle}>{event.page}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

const tableHeaderStyle = { padding: '12px 8px', borderBottom: '1px solid #ddd', textAlign: 'left', color: '#4a5568' };
const tableCellStyle = { padding: '10px 8px', borderBottom: '1px solid #eee' };