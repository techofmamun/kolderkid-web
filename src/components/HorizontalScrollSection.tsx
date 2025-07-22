import React, { useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import type { Item } from "../services/api";

interface HorizontalScrollSectionProps {
  title: string;
  seeAllPath: string;
  items: Array<Item>;
  renderItem: (item: Item) => React.ReactNode;
  detailsPath: (item: Item) => string;
  loading?: boolean;
  emptyText?: string;
}

const HorizontalScrollSection: React.FC<HorizontalScrollSectionProps> = ({
  title,
  seeAllPath,
  items,
  renderItem,
  detailsPath,
  loading,
  emptyText = "No items",
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scrollSection = (dir: "left" | "right") => {
    if (scrollRef.current) {
      const amount = scrollRef.current.offsetWidth * 0.7;
      scrollRef.current.scrollBy({
        left: dir === "left" ? -amount : amount,
        behavior: "smooth",
      });
    }
  };
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <div className="flex items-center mb-2 gap-2">
        <span className="text-lg font-bold text-sky-800 flex-1">{title}</span>
        {/* {items.length > 0 && (
          <> */}
        <button
          className="p-2 rounded-full bg-sky-100 hover:bg-sky-200 text-sky-700 shadow cursor-pointer"
          onClick={() => scrollSection("left")}
          aria-label="Scroll left"
        >
          <FaChevronLeft />
        </button>
        <button
          className="px-2 py-1 rounded-lg bg-sky-100 hover:bg-sky-200 text-sky-700 shadow cursor-pointer"
          onClick={() => navigate(seeAllPath)}
        >
          See All
        </button>
        <button
          className="p-2 rounded-full bg-sky-100 hover:bg-sky-200 text-sky-700 shadow cursor-pointer"
          onClick={() => scrollSection("right")}
          aria-label="Scroll right"
        >
          <FaChevronRight />
        </button>
        {/* </>
        )} */}
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-2"
        style={{
          scrollBehavior: "smooth",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <style>
          {`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        `}
        </style>
        <div className="hide-scrollbar flex gap-4 w-full">
          {loading ? (
            <div className="text-sky-700">Loading...</div>
          ) : items && items.length ? (
            items.map((item) => (
              <div
                key={item.id}
                className="cursor-pointer"
                onClick={() => navigate(detailsPath(item))}
              >
                {renderItem(item)}
              </div>
            ))
          ) : (
            <div className="text-sky-800 text-center">
              {emptyText} available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HorizontalScrollSection;
