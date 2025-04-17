import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import axios from 'axios';

const History = () => {
  const [userhistory, setUserHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const history = await axios.get('http://localhost:5000/user/history', {
          headers: {
            token: localStorage.getItem('token'),
          },
        });
        console.log(history.data)
        setUserHistory(history.data);
      } catch (error) {
        console.error('Error fetching history:', error);
      }
    };

    fetchHistory();
  }, []);

  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6 text-center">User History</h1>

        {userhistory.length === 0 ? (
          <p className="text-center text-gray-500">No history found.</p>
        ) : (
          userhistory.filter(uh => uh.videoUrl || uh.originalText).map((uh, index) => (

            <div
              key={index}
              className="bg-white rounded-2xl shadow p-6 mb-6 prose prose-lg max-w-none"
            >
                 <h2 className="text-xl font-semibold mb-4 text-white">
                {uh.originalText
                  ? uh.originalText
                  : uh.videoUrl
                    ? uh.videoUrl
                    : "failure"}

              </h2>

              <div dangerouslySetInnerHTML={{ __html: uh.summarizedText }} />
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default History;
