import { useEffect, useRef, useState } from "react";

// Helper to separate symbols from numbers (e.g., "$67m+" -> { prefix: "$", value: 67, suffix: "m+" })
const parseStatValue = (str) => {
  const match = str.match(/^([^\d]*)(\d+)(.*)$/);
  if (!match) return { prefix: "", value: 0, suffix: str };
  return {
    prefix: match[1],
    value: parseInt(match[2], 10),
    suffix: match[3]
  };
};

// SVG Star Icon
const StarIcon = () => (
  <svg className="h-3.5 w-3.5 text-[#C347FF]" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.539 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

export default function StatCard({ statStr, label }) {
  const { prefix, value, suffix } = parseStatValue(statStr);
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasAnimated(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasAnimated) return;

    let start;
    const duration = 2000; 

    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * value));

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setCount(value);
      }
    };

    const animationFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrame);
  }, [hasAnimated, value]);

  // Check if this is the reviews card
  const isReviewsCard = label === "Five-star reviews";

  return (
    <div 
      ref={ref} 
      className="rounded-2xl border border-[#e0d4e7] bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md flex flex-col justify-between"
    >
      <dt className="text-2xl font-black text-center text-[#C347FF]">
        {prefix}{count}{suffix}
      </dt>
      
      <dd className="mt-1 text-xs font-semibold text-[#75677e] flex justify-center items-center gap-1.5">
        {isReviewsCard ? (
          <>
            {/* Render 5 Star Icons */}
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => <StarIcon key={i} />)}
            </div>
            <span>reviews</span>
          </>
        ) : (
          label
        )}
      </dd>
    </div>
  );
}