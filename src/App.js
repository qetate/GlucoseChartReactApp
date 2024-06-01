import React, { useState } from 'react';
import './App.css';
import ChartComponent from './ChartComponent'; // Import ChartComponent for displaying charts

function App() {
  // Define state variables using the useState hook
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [jwtToken, setJwtToken] = useState('');
  const [patientId, setPatientId] = useState('');
  const [cgmData, setCGMData] = useState(null);

  // Header configuration for API requests
  const headers = {
    'accept-encoding': 'gzip, deflate, br',
    'cache-control': 'no-cache',
    'connection': 'Keep-Alive',
    'content-type': 'application/json',
    'product': 'llu.ios',
    'version': '4.9.0',
  };

  // Function to handle user login
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    try {
      const loginData = { email: username, password }; // Create an object with user credentials
      // Send a POST request to the login endpoint
      const response = await fetch(`/llu/auth/login`, {
        method: 'POST',
        headers,
        body: JSON.stringify(loginData),
      });
      const data = await response.json();

      if (response.ok) {
        // Check if the login is valid and a JWT token is received
        if (data.status === 0 && data.data && data.data.authTicket && data.data.authTicket.token) {
          setJwtToken(data.data.authTicket.token); // Store the received JWT token in state
          setError(''); // Clear any previous error messages
          const loginTime = new Date();
          localStorage.setItem('loginTime', loginTime); 
          const fetchedPatientId = await fetchPatientId(data.data.authTicket.token); // Fetch patient ID
          setPatientId(fetchedPatientId); // Store the fetched patient ID in state
          // Fetch CGM data using the obtained patient ID and token
          await fetchCGMData(fetchedPatientId, data.data.authTicket.token, loginTime);
        } else {
          setError('Invalid login.'); 
        }
      } else {
        setError(data.message || 'Login failed'); 
      }
    } catch (error) {
      setError('An error occurred during login: ' + error.message); 
      console.error('Error during login:', error);
    }
  };

  // Function to fetch the patient ID
  const fetchPatientId = async (token) => {
    try {
      // Send a GET request for the patient ID
      const response = await fetch(`/llu/connections`, {
        method: 'GET',
        headers: {
          ...headers,
          'authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json(); 

      if (response.ok) {
        // Check if the patient ID is found in the response data
        if (data.status === 0 && data.data && data.data.length > 0) {
          // Return the first patient ID if found
          return data.data[0].patientId;
        } else {
          setError('No connections found'); 
        }
      } else {
        setError(data.message || 'Failed to fetch connections'); 
      }
    } catch (error) {
      setError('An error occurred while fetching connections: ' + error.message);
      console.error('Error fetching connections:', error);
    }
  };

  // Function to fetch CGM data
  const fetchCGMData = async (patientId, token, loginTime) => {
    try {
      // Calculate the minimum value for the x-axis (12 hours before login time)
      const minTimestamp = new Date(loginTime.getTime() - 12 * 60 * 60 * 1000).toISOString();
      // Send a GET request to fetch CGM data
      const response = await fetch(`/llu/connections/${patientId}/graph?minTimestamp=${minTimestamp}`, {
        method: 'GET',
        headers: {
          ...headers,
          'authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json(); 

      if (response.ok) {
        setCGMData(data.data); // Store the fetched CGM data in state
      } else {
        setError(data.message || 'Failed to fetch CGM data');
      }
    } catch (error) {
      setError('An error occurred while fetching CGM data: ' + error.message); 
      console.error('Error fetching CGM data:', error);
    }
  };

  return (
    <div className="App">
      <h1>Glucose Chart App</h1>
      {jwtToken ? (
        // If JWT token exists, render ChartComponent with CGM data
        <div>
          {patientId && cgmData && <ChartComponent data={cgmData} />}
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
      ) : (
        // If JWT token does not exist, render login form
        <div>
          <form onSubmit={handleLogin}>
            <div>
              <label>Username: </label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div>
              <label>Password: </label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /> 
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>} 
            <button type="submit">Login</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;