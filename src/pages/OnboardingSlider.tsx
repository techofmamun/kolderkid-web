import React, { useState, useEffect } from "react";

const onboardingData = [
  {
    heading: "Enjoy your own day well",
    description: "Get through the day hearing your version of the best voice",
    image: "/assets/images/welcome1.png",
    bgColor: "#565F65", // light blue
  },
  {
    heading: "Best ear pampering place",
    description:
      "Hear right away with the most advanced feature and customizability",
    image: "/assets/images/welcome2.png",
    bgColor: "#fef9c3", // light yellow
  },
  {
    heading: "Thousand of the best track",
    description:
      "Let music walk side by side with life and guide the path of your soul",
    image: "/assets/images/welcome3.png",
    bgColor: "#DEE0DE", // light pink
  },
];

const OnboardingSlider: React.FC = () => {
  const [current, setCurrent] = useState(0);

  const handleNext = () => {
    setCurrent((prev) => (prev < onboardingData.length - 1 ? prev + 1 : 0));
  };
  const handlePrev = () => {
    setCurrent((prev) => (prev > 0 ? prev - 1 : onboardingData.length - 1));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrent((prev) => (prev < onboardingData.length - 1 ? prev + 1 : 0));
    }, 3000);
    return () => clearTimeout(timer);
  }, [current]);

  return (
    <div className="flex flex-col h-full items-center justify-center bg-gradient-to-b from-sky-200 via-white to-sky-100 ">
      <div className="relative w-full flex-1 flex flex-col items-center mt-auto h-full overflow-hidden">
        {/* Background image with fade transition */}
        {onboardingData.map((item, idx) => (
          <div
            key={item.image}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              idx === current ? "opacity-100 z-0" : "opacity-0 z-0"
            }`}
            style={{
              backgroundImage: `url(${item.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundColor: item.bgColor,
              backdropFilter: 'blur(10px)',
            }}
            aria-hidden={idx !== current}
          />
        ))}
        <div className="flex flex-col items-center max-w-xl w-full mt-auto backdrop-blur-lg p-6 rounded-3xl shadow-lg relative z-10 mb-2">
          <h2 className="text-3xl md:text-4xl font-bold text-sky-800 mb-4 text-center font-poppins">
            {onboardingData[current].heading}
          </h2>
          <p className="text-lg md:text-xl text-sky-600 mb-6 text-center font-poppins">
            {onboardingData[current].description}
          </p>
          <div className="flex items-center justify-center gap-2 mb-6">
            {onboardingData.map((_, idx) => (
              <span
                key={idx}
                className={`transition-all h-2 rounded-full ${
                  idx === current ? "w-8 bg-sky-500" : "w-2 bg-sky-300"
                }`}
              />
            ))}
          </div>
          <div className="flex gap-4">
            <button
              onClick={handlePrev}
              className="px-4 py-2 rounded-full bg-sky-100 text-sky-700 font-semibold shadow hover:bg-sky-200 transition"
              aria-label="Previous"
            >
              Prev
            </button>
            <button
              onClick={handleNext}
              className="px-4 py-2 rounded-full bg-sky-700 text-white font-semibold shadow hover:bg-sky-800 transition"
              aria-label="Next"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingSlider;
