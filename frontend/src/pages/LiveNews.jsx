import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import axios from "axios";
import { BASE_URL } from "../helper";

const categories = ["All", "Technology", "Sports", "Science", "Business"];

const LiveNews = () => {
  const [mockNews, setMockNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);
        const resp = await axios.get(`${BASE_URL}/news/livenews`, {
          headers: {
            token: localStorage.getItem("token")
          }
        });
        setMockNews(resp.data.articles);
      } catch (error) {
        console.error("Failed to fetch news:", error);
        setError("Failed to fetch news. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

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
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-red-500 text-xl">{error}</div>
          </div>
        ) : (
          <div className="flex justify-center px-4">
            <div className="flex flex-wrap gap-4 justify-center px-4">
              {mockNews.map((news) => (
                <Card
                  key={news.id}
                  className="max-w-sm h-[350px] flex flex-col "

                >
                  <div className="w-full h- overflow-hidden rounded-t-lg">
                    <img
                      src={news.image}
                      alt={news.title}
                      className="w-full max-h-2 "
                    />
                  </div>
                  <CardContent className="p-4 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm text-muted-foreground">
                        {new Date(news.publishedAt).toLocaleString("en-IN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                          timeZone: "Asia/Kolkata"
                        })}
                      </span>
                    </div>
                    <h2 className="text-lg font-semibold mb-1 line-clamp-2">
                      {news.title}
                    </h2>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {news.description}
                    </p>
                    <br /><br />
                    <button
                      onClick={() => news.url && window.open(news.url, '_blank', 'noopener,noreferrer')}
                      className="
                           
          px-4 py-2  
          text-sm font-medium
          bg-primary text-primary-foreground 
          rounded-md 
          hover:bg-primary/90 
          transition-colors
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
          shadow-sm
          mt-auto
      "
                    >
                      Read Full Article
                    </button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>


      <Footer />
    </div>
  );
};

export default LiveNews;