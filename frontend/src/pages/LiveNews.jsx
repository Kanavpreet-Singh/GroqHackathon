import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
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


const categories = ["All", "Technology", "Sports", "Science", "Business"];

const LiveNews = () => {

  const [mockNews, setMockNews] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const resp = await axios.get("http://localhost:5000/news/livenews", {
          headers: {
            token: localStorage.getItem("token")
          }
        });
        console.log(resp.data.articles);
        setMockNews(resp.data.articles);
      } catch (error) {
        console.error("Failed to fetch news:", error);
      }
    };

    fetchNews();
  }, []);


  const [selectedArticle, setSelectedArticle] = useState(null);



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
        <div className="flex justify-center px-4">
          <div className="flex flex-wrap gap-4 justify-center  px-4">
            {mockNews.map((news) => (
              <Card
                key={news.id}
                className="max-w-sm h-[350px] hover:shadow-lg transition-shadow duration-300 hover-lift bg-background cursor-pointer"
                onClick={() => setSelectedArticle(news)}
              >
                <div className="w-full h- overflow-hidden rounded-t-lg">
                  <img
                    src={news.image}
                    alt={news.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
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
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Dialog
        open={!!selectedArticle}
        onOpenChange={() => setSelectedArticle(null)}
      >
        {selectedArticle && (
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{selectedArticle.title}</DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              <p className="text-muted-foreground mb-4">
                {selectedArticle.content}
              </p>
              <Button
                className="w-full"
                onClick={() => window.open(selectedArticle.url, "_blank")}
              >
                Read Full Article
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>

      <Footer />
    </div>
  );
};

export default LiveNews;
