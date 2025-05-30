import { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';

gsap.registerPlugin(Draggable);

const SLIDE_WIDTH = 80;
const SLIDE_MARGIN = 2;
const TRANSITION_DURATION = 0.6;

const CarouselWithLoop = () => {
  const originalSlides = ['#FF6B6B', '#6BCB77', '#4D96FF', '#FFD93D'];
  const totalSlides = originalSlides.length;

  const trackRef = useRef(null);
  const draggableInstance = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(1);

  const getSlideOffset = (index) => `-${index * (SLIDE_WIDTH + SLIDE_MARGIN)}vw`;

  const goToSlide = (index, animated = true) => {
    const slideCount = totalSlides + 2;
    const newIndex = (index + slideCount) % slideCount;
    setCurrentIndex(newIndex);

    const targetX = `-${newIndex * (SLIDE_WIDTH + SLIDE_MARGIN)}vw`;

    if (animated) {
      gsap.to(trackRef.current, {
        x: targetX,
        duration: TRANSITION_DURATION,
        ease: 'power2.inOut',
        onComplete: () => fixLoop(newIndex),
      });
    } else {
      gsap.set(trackRef.current, {
        x: targetX,
      });
      fixLoop(newIndex);
    }
  };

  const fixLoop = (index) => {
    if (index === 0) {
      setCurrentIndex(totalSlides);
      gsap.set(trackRef.current, {
        x: getSlideOffset(totalSlides),
      });
    } else if (index === totalSlides + 1) {
      setCurrentIndex(1);
      gsap.set(trackRef.current, {
        x: getSlideOffset(1),
      });
    }
  };

  const handleNext = () => goToSlide(currentIndex + 1);
  const handlePrev = () => goToSlide(currentIndex - 1);

  useEffect(() => {
    gsap.set(trackRef.current, {
      x: getSlideOffset(currentIndex),
    });

    const slideWidthPx = window.innerWidth * ((SLIDE_WIDTH + SLIDE_MARGIN) / 100);

    draggableInstance.current = Draggable.create(trackRef.current, {
      type: 'x',
      edgeResistance: 0.75,
      bounds: {
        minX: -((totalSlides + 1) * slideWidthPx),
        maxX: 0,
      },
      onDragEnd: function () {
        const index = Math.round(-this.x / slideWidthPx);
        goToSlide(index);
      },
    })[0];

    return () => {
      if (draggableInstance.current) {
        draggableInstance.current.kill();
      }
    };
  }, []);

  const slides = [
    originalSlides[originalSlides.length - 1], // clone prima slide
    ...originalSlides,
    originalSlides[0], // clone ultima slide
  ];

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        overflow: 'hidden',
        padding: '0 10vw',
        touchAction: 'pan-y',
      }}
    >
      <div
        ref={trackRef}
        style={{
          display: 'flex',
          gap: `${SLIDE_MARGIN}vw`,
          cursor: 'grab',
          userSelect: 'none',
        }}
      >
        {slides.map((color, i) => (
          <div
            key={i}
            style={{
              flex: `0 0 ${SLIDE_WIDTH}vw`,
              height: '60vh',
              background: color,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '3rem',
              color: '#fff',
              fontWeight: 'bold',
              borderRadius: '20px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            }}
          >
            {i === 0
              ? `Slide ${totalSlides}`
              : i === slides.length - 1
              ? 'Slide 1'
              : `Slide ${i}`}
          </div>
        ))}
      </div>

      <div
        style={{
          position: 'absolute',
          top: '50%',
          width: '80%',
          display: 'flex',
          justifyContent: 'space-between',
          transform: 'translateY(-50%)',
          pointerEvents: 'none',
        }}
      >
        <button onClick={handlePrev} style={{ ...buttonStyle, pointerEvents: 'auto' }}>
          Prev
        </button>
        <button onClick={handleNext} style={{ ...buttonStyle, pointerEvents: 'auto' }}>
          Next
        </button>
      </div>
    </div>
  );
};

const buttonStyle = {
  background: 'rgba(0,0,0,0.6)',
  color: '#fff',
  border: 'none',
  padding: '1rem 2rem',
  fontSize: '1.25rem',
  cursor: 'pointer',
  borderRadius: '8px',
};

export default CarouselWithLoop;
