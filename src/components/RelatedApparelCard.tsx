import React from "react";
import type { ApparelItem } from "../services/api";

interface RelatedApparelCardProps {
  apparel: ApparelItem;
  onClick?: () => void;
}

const RelatedApparelCard: React.FC<RelatedApparelCardProps> = ({
  apparel,
  onClick,
}) => {
  return (
    <button
      className="min-w-[200px]  rounded-2xl shadow-lg p-3 flex flex-col items-center hover:scale-105 transition relative border border-sky-200/40 backdrop-blur-sm bg-white/50 cursor-pointer"
      onClick={onClick}
      aria-label={apparel.product_name}
    >
      <img
        src={apparel.image && apparel.image[0]}
        alt={apparel.product_name}
        className="w-16 h-16 object-cover rounded mb-2 border"
      />
      <div className="font-medium text-center text-sky-700 line-clamp-1">
        {apparel.product_name}
      </div>
      <div className="text-xs text-gray-500 text-center line-clamp-1">
        {apparel.product_description}
      </div>
    </button>
  );
};

export default RelatedApparelCard;
