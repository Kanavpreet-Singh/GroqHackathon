import React, { useState } from "react";
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

const mockNews = [
  {
    id: 1,
    title: "Global Technology Summit Announces Breakthrough in AI",
    description:
      "Leading tech companies reveal new developments in artificial intelligence that could revolutionize industry.",
    category: "Technology",
    date: "2024-04-19",
    content: `Malayalam film actor Shine Tom Chacko, who fled from a hotel in Kochi during a narcotics raid earlier this week, was arrested by Kochi police on Saturday after about a four-hour long interrogation in connection with a drug case.
        
        The police said that he was charged under Sections 27 (consumption of any narcotic drug or psychotropic substance) and 29 (abetment and criminal conspiracy) of the Narcotic Drugs and Psychotropic Substances (NDPS) Act.
        
        The cops added that the medical examination and further proceedings will be conducted soon.
        
        The 41-year-old actor, who hit the headlines with fantasy comedy film Ithihasa - which was the highest-grossing Malayalam film in 2014 - on Saturday appeared before the Kochi City Police for questioning in response to a formal notice issued by the police.

        The controversy began earlier this week, on Wednesday, when Chacko reportedly fled during a police raid linked to an alleged drug use case.`,

    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475",
    url: "https://example.com/article1",
  },
  {
    id: 2,
    title: "Major Sports League Expansion Announced",
    description:
      "Professional sports league announces plans to add three new teams in upcoming season.",
    category: "Sports",
    date: "2024-04-19",
    content: "Detailed information about the sports league expansion...",
    imageUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    url: "https://example.com/article2",
  },
  {
    id: 3,
    title: "New Scientific Discovery in Marine Biology",
    description:
      "Scientists discover previously unknown species in the depths of the Pacific Ocean.",
    category: "Science",
    date: "2024-04-18",
    content: "Details about the scientific discovery...",
    imageUrl: "https://images.unsplash.com/photo-1507413245164-6160d8298b31",
    url: "https://example.com/article3",
  },
  {
    id: 4,
    title: "Major Business Merger Announced",
    description:
      "Two industry giants announce merger that will reshape the market landscape.",
    category: "Business",
    date: "2024-04-17",
    content: "Details about the business merger...",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
    url: "https://example.com/article4",
  },
];

const categories = ["All", "Technology", "Sports", "Science", "Business"];

const LiveNews = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedArticle, setSelectedArticle] = useState(null);

  const filteredNews =
    selectedCategory === "All"
      ? mockNews
      : mockNews.filter((news) => news.category === selectedCategory);

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

          <div className="flex items-center justify-center gap-3 mb-6 flex-wrap">
            <Filter className="h-5 w-5 text-muted-foreground" />
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={`hover-lift ${
                  selectedCategory === category
                    ? "green-gradient hover:shadow-md hover:shadow-primary/30"
                    : ""
                }`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
        <div className="flex justify-center px-4">
        <div className="flex flex-wrap gap-4 justify-center  px-4">
          {filteredNews.map((news) => (
            <Card
              key={news.id}
              className="max-w-sm h-[350px] hover:shadow-lg transition-shadow duration-300 hover-lift bg-background cursor-pointer"
              onClick={() => setSelectedArticle(news)}
            >
              <div className="w-full h- overflow-hidden rounded-t-lg">
                <img
                  src={news.imageUrl}
                  alt={news.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {news.category}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {news.date}
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
