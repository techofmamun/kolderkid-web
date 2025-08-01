import { type FC, useState } from "react";
import { useLikeMutation } from "../services/api";

interface LikeButtonProps {
  type_of_item: number;
  item_id: number;
  isLiked: boolean;
  refetch: () => void;
}

const LikeButton: FC<LikeButtonProps> = ({
  type_of_item,
  item_id,
  isLiked,
  refetch,
}) => {
  const [liked, setLiked] = useState(isLiked);
  const [like] = useLikeMutation();
  return (
    <button
      onClick={async () => {
        setLiked((l) => !l);
        try {
          await like({
            type_of_item,
            item_id,
          });
          refetch();
        } catch {
          setLiked((l) => !l);
          console.error("Like failed");
        }
      }}
      aria-label="Favourite"
      className="hover:scale-110 transition cursor-pointer"
    >
      <svg
        width="28"
        height="28"
        fill={liked ? "#ef4444" : "none"}
        stroke="black"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    </button>
  );
};

export default LikeButton;
