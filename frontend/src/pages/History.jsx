import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import axios from 'axios';
import { useTheme } from "@/context/ThemeContext";
import { BASE_URL } from '../helper';
import ApertureMark from '@/components/ApertureMark';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RotateCcw } from 'lucide-react';

const History = () => {
  const [userhistory, setUserHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isDark } = useTheme();

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const history = await axios.get(`${BASE_URL}/user/history`, {
        headers: {
          token: localStorage.getItem('token'),
        },
      });
      setUserHistory(history.data);
    } catch (err) {
      console.error('Error fetching history:', err);
      setError(
        err.response?.data?.message || "Couldn't load your history right now. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);
  const processHtmlContent = (htmlContent) => {

    if (typeof window === 'undefined') return htmlContent;

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');

    const allElements = doc.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, span, div, ul, ol');
    allElements.forEach(el => {
      el.style.color = '';
    });
    return doc.body.innerHTML;
  };

  return (
    <div className={`min-h-screen ${isDark ? 'dark-theme' : ''}`}>
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-4xl font-bold mb-6 text-center text-foreground">Your History</h1>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
            <ApertureMark spinning size={32} />
            <p>Loading your history...</p>
          </div>
        ) : error ? (
          <div className="max-w-md mx-auto rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
            <AlertTriangle className="h-6 w-6 text-destructive mx-auto mb-2" />
            <p className="text-destructive font-semibold mb-1">Couldn't load history</p>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <Button variant="outline" size="sm" onClick={fetchHistory} className="inline-flex items-center gap-1">
              <RotateCcw className="h-3.5 w-3.5" />
              Retry
            </Button>
          </div>
        ) : userhistory.length === 0 ? (
          <p className="text-center text-lg text-foreground">No history found.</p>
        ) : (
          userhistory
            .filter(uh => uh.videoUrl || uh.originalText)
            .map((uh, index) => (
              <div
                key={index}
                className="rounded-2xl shadow-lg border border-border bg-card p-6 mb-8 transition-all duration-300"
              >
                <h1 className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 border border-primary/30 font-mono text-lg font-bold text-primary mb-4">
                  {index + 1}
                </h1>

                <h2 className="text-2xl font-semibold mb-4 text-foreground">
                  { uh.originalText
                    ? uh.originalText.substring(0, 100) + (uh.originalText.length > 100 ? '...' : '')
                    : uh.videoUrl
                      ? uh.videoUrl
                      : 'Failure'}
                </h2>
                  <br></br>
                <h3 className="text-lg font-bold mb-2 text-black dark:text-white">
                  Extracted Summary:
                </h3>

                <div className={`custom-html-content text-base leading-relaxed ${isDark ? 'dark-content' : 'light-content'}`}>
                  
                  <div
                  
                    dangerouslySetInnerHTML={{
                      __html: processHtmlContent(uh.summarizedText)
                    }}
                  />
                </div>
              </div>
            ))
        )}

      </div>

      <style jsx global>{`
        .dark-theme .dark-content * {
          color: white !important;
          font-size: 1.125rem !important; /* text-lg equivalent */
        }
        .light-content * {
          color: black !important;
          font-size: 1.125rem !important; /* text-lg equivalent */
        }
        .dark-content p, .light-content p {
          margin-bottom: 1rem !important;
          line-height: 1.7 !important;
        }
        .dark-content h1, .dark-content h2, .dark-content h3, 
        .dark-content h4, .dark-content h5, .dark-content h6 {
          color: white !important;
          font-weight: bold !important;
          margin-top: 1.5rem !important;
          margin-bottom: 1rem !important;
        }
        .light-content h1, .light-content h2, .light-content h3, 
        .light-content h4, .light-content h5, .light-content h6 {
          color: black !important;
          font-weight: bold !important;
          margin-top: 1.5rem !important;
          margin-bottom: 1rem !important;
        }
        .dark-content h1, .light-content h1 {
          font-size: 1.875rem !important; /* text-3xl */
        }
        .dark-content h2, .light-content h2 {
          font-size: 1.5rem !important; /* text-2xl */
        }
        .dark-content h3, .light-content h3 {
          font-size: 1.25rem !important; /* text-xl */
        }
        .dark-theme .dark-content a {
          color: #60a5fa !important;
          font-weight: bold !important;
          text-decoration: underline !important;
        }
        .light-content a {
          color: #2563eb !important;
          font-weight: bold !important;
          text-decoration: underline !important;
        }
        .dark-content ul, .light-content ul,
        .dark-content ol, .light-content ol {
          padding-left: 2rem !important;
          margin-bottom: 1rem !important;
        }
        .dark-content li, .light-content li {
          margin-bottom: 0.5rem !important;
        }
      `}</style>
    </div>
  );
};

export default History;
