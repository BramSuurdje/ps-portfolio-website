"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Particles from "@/components/particles";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getImageURL } from "@/lib/pocketbase";
import DocumentShowcase from "@/components/DocumentShowcase";
export default function Page() {
  const [semester1Documents, setSemester1Documents] = useState([]);
  const [semester2Documents, setSemester2Documents] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isloading, setLoading] = useState(true); // Added loading state
  const thumbnailPlaceholder = "https://placehold.co/240x340";

  async function getFiles() {
    const response = await fetch(
      "https://cdn.bramsuurd.nl/api/collections/3wpait0y5cwq47t/records",
    );
    const data = await response.json();
    return data.items;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const files = await getFiles();
        const semester1 = files.filter(
          (file) => file.semester === "1" && file.year === "1",
        );
        const semester2 = files.filter(
          (file) => file.semester === "2" && file.year === "1",
        );

        setSemester1Documents(semester1);
        setSemester2Documents(semester2);
        
        setTimeout(() => {
          setLoading(false);
        }, 1250);
      } catch (error) {
        console.error("Error fetching documents:", error);
        setSemester1Documents([]);
        setSemester2Documents([]);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const openModal = (document) => {
    setSelectedDocument(document);
  };

  const closeModal = () => {
    setSelectedDocument(null);
  };

  return (
    <main>
      {isloading ? (
        <div className="flex h-screen w-screen items-center justify-center">
          <div className="banter-loader">
            <div className="banter-loader__box"></div>
            <div className="banter-loader__box"></div>
            <div className="banter-loader__box"></div>
            <div className="banter-loader__box"></div>
            <div className="banter-loader__box"></div>
            <div className="banter-loader__box"></div>
            <div className="banter-loader__box"></div>
            <div className="banter-loader__box"></div>
            <div className="banter-loader__box"></div>
          </div>
        </div>
      ) : (
        <div className="max-w-screen flex min-h-screen animate-fade-in flex-col items-center overflow-x-hidden overscroll-none bg-gradient-to-tl from-black/20 via-zinc-600/20 to-black/20 antialiased">
          <Particles
            className="absolute inset-0 -z-10 animate-fade-in"
            quantity={100}
          />
          <h1 className="mb-4 pt-10 text-center text-4xl font-bold">
            Professional Skills Portfolio
          </h1>
          <Tabs
            defaultValue="sem2"
            className="flex flex-col items-center justify-center"
          >
            <TabsList>
              <TabsTrigger value="sem1">Semester 1</TabsTrigger>
              <TabsTrigger value="sem2">Semester 2</TabsTrigger>
            </TabsList>
            <TabsContent value="sem1">
              <DocumentShowcase semestername={semester1Documents} />
            </TabsContent>
            <TabsContent value="sem2">
              <DocumentShowcase semestername={semester2Documents} />
            </TabsContent>
          </Tabs>
          <div className="flex flex-col items-center justify-center pt-12"></div>
          {selectedDocument && (
            <div
              className="fixed left-0 top-0 z-50 flex h-screen w-full items-center justify-center bg-black/50"
              onClick={closeModal}
            >
              <button
                className="absolute right-2 top-2 text-lg font-bold text-white"
                onClick={closeModal}
              >
                &times;
              </button>
              <iframe
                className="h-screen w-1/2"
                title={selectedDocument.documentName}
                src={getImageURL(selectedDocument.id, selectedDocument.pdf)}
              ></iframe>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
