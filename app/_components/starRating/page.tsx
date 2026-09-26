import { Star, StarHalf } from "lucide-react";
type StarRatingProps = {
  rating: number | undefined;
};

// عرض النجوم فارغة عند غياب التقييم قبل وصول بيانات المنتج
export default function StarRating({ rating = 0 }: StarRatingProps) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(
        <Star key={i} className="w-4 h-4 fill-[#2D4735] text-[#2D4735]" />,
      );
    } else if (i - 0.5 <= rating) {
      stars.push(
        <StarHalf key={i} className="w-4 h-4 fill-[#2D4735] text-[#2D4735]" />,
      );
    } else {
      stars.push(
        <Star key={i} className="w-4 h-4 text-gray-300 stroke-[1.5]" />,
      );
    }
  }

  return <div className="flex items-center gap-1">{stars}</div>;
}
