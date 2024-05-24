"use client"; // Эта директива указывает, что компонент является клиентским

import { NextPage } from 'next';
import React, { useState } from 'react';
import axios from 'axios';

interface ProfileData {
  // Define the structure of your profile data here
}

const AnalyzePage: NextPage = () => {
  const [username, setUsername] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);
  const [status, setStatus] = useState<string | null>(null);
  const [data, setData] = useState<ProfileData | null>(null);

  const fetchData = async () => {
    setStatus('in_progress');
    try {
      const response = await axios.post('http://127.0.0.1:8000/fetch/', { username });
      if (response.data.status === 'Task started') {
        const socket = new WebSocket(`ws://127.0.0.1:8000/ws/instagram_status/${username}/`);
        socket.onmessage = (event) => {
          const message = JSON.parse(event.data).message;
          setProgress(message.progress);
          if (message.status === 'completed') {
            socket.close();
            setStatus('completed');
            axios.get(`http://127.0.0.1:8000/profiles/?username=${username}`).then((response) => {
              setData(response.data);
            });
          }
        };
        socket.onclose = () => {
          axios.get(`http://127.0.0.1:8000/profiles/?username=${username}`).then((response) => {
            setData(response.data);
          });
        };
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setStatus('failed');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Analyze Instagram Profile</h1>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter Instagram Username"
        className="p-2 border border-gray-400 rounded mb-4"
      />
      <button
        onClick={fetchData}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        Fetch Data
      </button>
      {status === 'in_progress' && <div className="mt-4">Loading... {progress}%</div>}
      {status === 'completed' && data && (
        <div className="mt-4">
          <h3 className="text-xl font-bold">Data fetched successfully!</h3>
          {/* Render your data here */}
        </div>
      )}
      {status === 'failed' && <div className="mt-4 text-red-500">Failed to fetch data.</div>}
    </div>
  );
};

export default AnalyzePage;
