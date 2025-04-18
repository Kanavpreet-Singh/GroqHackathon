import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import axios from 'axios';
import { useTheme } from "@/context/ThemeContext";

const History = () => {
  const [userhistory, setUserHistory] = useState([]);
  const { isDark } = useTheme();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const history = await axios.get('http://localhost:5000/user/history', {
          headers: {
            token: localStorage.getItem('token'),
          },
        });
        console.log(history.data);
        setUserHistory(history.data);
      } catch (error) {
        console.error('Error fetching history:', error);
      }
    };

    fetchHistory();
  }, []);

  // Create a style for the rich text content to ensure proper colors
  const getContentStyle = () => {
    return {
      color: isDark ? 'white' : 'black',
    };
  };

  return (
    <div className={`min-h-screen bg-background ${isDark ? 'dark-theme' : ''}`}>
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6 text-center text-foreground">User History</h1>

        {userhistory.length === 0 ? (
          <p className="text-center text-muted-foreground">No history found.</p>
        ) : (
          userhistory
            .filter(uh => uh.videoUrl || uh.originalText)
            .map((uh, index) => (
              <div
                key={index}
                className={`rounded-2xl shadow p-6 mb-6 ${isDark ? 'bg-muted' : 'bg-white'}`}
              >
                <h2 className="text-xl font-bold mb-4 text-foreground">
                  {uh.originalText
                    ? uh.originalText.substring(0, 100) + (uh.originalText.length > 100 ? '...' : '')
                    : uh.videoUrl
                    ? uh.videoUrl
                    : 'Failure'}
                </h2>

                <div 
                  className={`prose max-w-none text-foreground`}
                  style={getContentStyle()}
                  dangerouslySetInnerHTML={{ 
                    __html: uh.summarizedText 
                  }} 
                />
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default History;