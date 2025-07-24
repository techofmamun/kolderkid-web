
import React from "react";
import PageContainer from "../components/PageContainer";


const About: React.FC = () => (
  <PageContainer>
    <div className="prose max-w-2xl text-gray-700">
      <p>
        Welcome to <b>Kolderkid Universe</b>, the ultimate platform for content creators, artists, and fans.
      </p>
      <p>
        <b>KolderKid Records</b>, a leading name in the music industry, brings you an innovative mobile app where musicians, video creators, and designers can showcase their talent. Our mission is to empower aspiring artists by providing a dedicated space to upload, share, and monetize their content.
      </p>
      <h2 className="text-xl font-semibold mt-6 mb-2">What We Offer:</h2>
      <ul className="list-disc ml-6">
        <li><b>Music & Video Streaming:</b> Discover fresh talent and enjoy exclusive content.</li>
        <li><b>Podcast Hub:</b> Listen to insightful and entertaining podcasts.</li>
        <li><b>Apparel Store:</b> Explore and purchase trendy artist merchandise.</li>
        <li><b>Engaging Community:</b> Connect with creators and fans worldwide.</li>
      </ul>
      <p className="mt-6 font-semibold text-sky-700">
        Join Kolderkid Universe and take your creativity to the next level!
      </p>
    </div>
  </PageContainer>
);

export default About;
