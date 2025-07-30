import React, { useEffect, useRef, useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { Clock, Eye, ChevronLeft, ChevronRight } from "lucide-react";

const NewsCarousel = () => {
  const [carouselItems, setCarouselItems] = useState([]);
  const timeout = useRef();
  const [currentSlide, setCurrentSlide] = useState(0);

  const [sliderRef, instanceRef] = useKeenSlider(
    {
      loop: true,
      slides: {
        perView: 1,
        spacing: 0,
      },
      slideChanged(s) {
        setCurrentSlide(s.track.details.rel);
      },
    },
    []
  );

  useEffect(() => {
    if (!instanceRef.current || carouselItems.length === 0) return;

    const slider = instanceRef.current;

    const clearNextTimeout = () => {
      if (timeout.current) clearTimeout(timeout.current);
    };

    const nextTimeout = () => {
      timeout.current = setTimeout(() => {
        slider.next();
        nextTimeout();
      }, 4000); 
    };

    slider.on("created", nextTimeout);
    slider.on("dragStarted", clearNextTimeout);
    slider.on("animationEnded", nextTimeout);
    slider.on("updated", nextTimeout);
    return () => clearNextTimeout();
  }, [carouselItems, instanceRef]);

  useEffect(() => {
    fetch("https://your-deployment-url.onrender.com/api/news")
      .then((res) => res.json())
      .then((data) => {
        setCarouselItems(data.carousel || []);
      })
      .catch((err) => console.error("Carousel fetch error:", err));
  }, []);

  const handleView = (postId) => {
    fetch(`https://your-deployment-url.onrender.com/api/interactions/view/${postId}`, {
      method: "POST",
    }).catch(() => {});
  };

  if (carouselItems.length === 0) return null;

  return (
    <div className="relative">
      <div ref={sliderRef} className="keen-slider rounded-xl overflow-hidden">
        {carouselItems.map((item, index) => (
          <a
            key={item._id || index}
            href={item.url}
            target="_blank"
            rel="noreferrer"
            onClick={() => handleView(item._id)}
            className="keen-slider__slide relative h-64 md:h-80 lg:h-[22rem] bg-[var(--color-background)] block group"
            style={{ textDecoration: 'none' }}
          >
            <img
              src={item.img}
              alt={item.title}
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-background)]/80 to-transparent p-6 flex flex-col justify-end">
              <div className="flex items-center gap-4 text-sm text-[var(--color-text-primary)] mb-2">
                {item.category && (
                  <span className="bg-[var(--color-text-secondary)]/10 px-2 py-1 rounded text-xs text-[var(--color-text-primary)]">
                    {item.category}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {item.time}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {item.views}
                </span>
              </div>
              <h2 className="text-[var(--color-text-primary)] text-lg md:text-xl font-semibold group-hover:underline">
                {item.title}
              </h2>
            </div>
          </a>
        ))}
      </div>
      <button
        aria-label="Previous slide"
        className="absolute top-1/2 left-2 -translate-y-1/2 bg-[var(--color-background)]/80 hover:bg-[var(--color-surface)] rounded-full p-2 shadow border border-[var(--color-border)] z-10"
        onClick={() => instanceRef.current && instanceRef.current.prev()}
        style={{ display: carouselItems.length > 1 ? 'block' : 'none' }}
      >
        <ChevronLeft className="h-6 w-6 text-[var(--color-text-primary)]" />
      </button>
      <button
        aria-label="Next slide"
        className="absolute top-1/2 right-2 -translate-y-1/2 bg-[var(--color-background)]/80 hover:bg-[var(--color-surface)] rounded-full p-2 shadow border border-[var(--color-border)] z-10"
        onClick={() => instanceRef.current && instanceRef.current.next()}
        style={{ display: carouselItems.length > 1 ? 'block' : 'none' }}
      >
        <ChevronRight className="h-6 w-6 text-[var(--color-text-primary)]" />
      </button>
    </div>
  );
};

export default NewsCarousel;
