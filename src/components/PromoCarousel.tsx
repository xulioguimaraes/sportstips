"use client";

import { useState, useEffect, useRef, TouchEvent } from "react";
import Image from "next/image";

interface PromoCarouselProps {
  autoPlayInterval?: number;
}

const PromoCarousel = ({ autoPlayInterval = 5000 }: PromoCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const slides = [
    {
      id: 1,
      image: "/images/promo-banner-1.jpg",
      alt: "Promo Imperdível - Primeiro tip grátis",
    },
    {
      id: 2,
      image: "/images/promo-banner-2.jpg",
      alt: "FuteScore Logo",
    },
  ];

  // Auto-play functionality
  useEffect(() => {
    if (autoPlayInterval > 0 && !isDragging) {
      timerRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
      }, autoPlayInterval);

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }
  }, [autoPlayInterval, isDragging, slides.length]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setIsDragging(true);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    const currentTouch = e.targetTouches[0].clientX;
    setTouchEnd(currentTouch);
    setDragOffset(currentTouch - touchStart);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setDragOffset(0);

    const minSwipeDistance = 50;
    const distance = touchStart - touchEnd;

    if (Math.abs(distance) > minSwipeDistance) {
      if (distance > 0) {
        // Swiped left - next slide
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
      } else {
        // Swiped right - previous slide
        setCurrentIndex((prevIndex) =>
          prevIndex === 0 ? slides.length - 1 : prevIndex - 1
        );
      }
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  // Mouse handlers for desktop drag
  const handleMouseDown = (e: React.MouseEvent) => {
    setTouchStart(e.clientX);
    setIsDragging(true);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const currentTouch = e.clientX;
    setTouchEnd(currentTouch);
    setDragOffset(currentTouch - touchStart);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    setDragOffset(0);

    const minSwipeDistance = 50;
    const distance = touchStart - touchEnd;

    if (Math.abs(distance) > minSwipeDistance) {
      if (distance > 0) {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
      } else {
        setCurrentIndex((prevIndex) =>
          prevIndex === 0 ? slides.length - 1 : prevIndex - 1
        );
      }
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      handleMouseUp();
    }
  };

  return (
    <div className="w-full overflow-hidden relative bg-transparent  mb-4">
      {/* Carousel Container */}
      <div
        className="relative h-48 rounded-lg overflow-hidden cursor-grab active:cursor-grabbing shadow-lg"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {/* Slides */}
        <div
          className="flex h-full transition-transform duration-300 ease-out"
          style={{
            transform: `translateX(calc(-${
              currentIndex * 100
            }% + ${dragOffset}px))`,
            transition: isDragging ? "none" : "transform 0.3s ease-out",
          }}
        >
          {slides.map((slide) => (
            <div
              key={slide.id}
              className="min-w-full h-full relative flex-shrink-0"
            >
              <div className="relative w-full h-full">
                <Image
                  src={slide.image}
                  alt={slide.alt}
                  fill
                  className="object-cover rounded-lg"
                  priority={slide.id === 1}
                  draggable={false}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />
                {/* Fallback gradient */}
                <div className="absolute z-0 inset-0 bg-gradient-to-br from-teal-500 via-teal-600 to-slate-800 rounded-lg flex items-center justify-center">
                  <div className="text-center px-6">
                    <h2 className="text-2xl md:text-4xl font-bold text-white mb-2">
                      {slide.id === 1 ? "PROMO IMPERDÍVEL" : "FuteScore"}
                    </h2>
                    <p className="text-white/90 text-sm md:text-base">
                      {slide.id === 1 ? (
                        <p
                          dangerouslySetInnerHTML={{
                            __html: `Na compra do primeiro tip,<br />o segundo sai de graça!`,
                          }}
                        ></p>
                      ) : (
                        "Seus palpites esportivos em um só lugar"
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Dots */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                if (timerRef.current) {
                  clearInterval(timerRef.current);
                }
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "w-8 bg-white"
                  : "w-2 bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Ir para slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PromoCarousel;
