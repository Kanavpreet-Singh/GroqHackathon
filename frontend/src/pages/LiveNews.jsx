import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card"

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import axios from "axios";
import { BASE_URL } from "../helper";
import { WireBadge } from "@/components/ui/wire-badge";
import ApertureMark from "@/components/ApertureMark";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RotateCcw } from "lucide-react";

const LiveNews = () => {
  const [newsArticles, setNewsArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);
      const resp = await axios.get(`${BASE_URL}/news/livenews`, {
        headers: {
          token: localStorage.getItem("token")
        }
      });
      setNewsArticles(resp.data.articles);
    } catch (err) {
      console.error("Failed to fetch news:", err);
      setError(err.response?.data?.message || "Failed to fetch news. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-6 text-center">
          <h1 className="text-4xl font-bold mb-4 animate-fade-in">
            Live News Feed
          </h1>
          <p className="text-muted-foreground mb-6">
            Stay updated with the latest trending news
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 h-64 text-muted-foreground">
            <ApertureMark spinning size={36} />
            <p>Fetching the latest headlines...</p>
          </div>
        ) : error ? (
          <div className="max-w-md mx-auto rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
            <AlertTriangle className="h-6 w-6 text-destructive mx-auto mb-2" />
            <p className="text-destructive font-semibold mb-1">Couldn't load live news</p>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <Button variant="outline" size="sm" onClick={fetchNews} className="inline-flex items-center gap-1">
              <RotateCcw className="h-3.5 w-3.5" />
              Retry
            </Button>
          </div>
        ) : (
          <div className="flex flex-wrap gap-6 justify-center">
            {newsArticles.map((news) => (
              <Card
                key={news.id}
                className="w-full max-w-sm overflow-hidden flex flex-col hover-lift"
              >
                <div className="w-full aspect-video overflow-hidden bg-muted">
                  <img
                    src={news.image}
                    alt={news.title}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                  />
                </div>
                <CardContent className="p-4 flex flex-col flex-1">
                  <div className="mb-2">
                    <WireBadge variant="info">
                      {new Date(news.publishedAt).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                        timeZone: "Asia/Kolkata"
                      })}
                    </WireBadge>
                  </div>
                  <h2 className="text-lg font-semibold mb-1 line-clamp-2 text-foreground">
                    {news.title}
                  </h2>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {news.description}
                  </p>
                  <button
                    onClick={() => news.url && window.open(news.url, '_blank', 'noopener,noreferrer')}
                    className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring shadow-sm mt-auto"
                  >
                    Read Full Article
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>


      <Footer />
    </div>
  );
};

export default LiveNews;