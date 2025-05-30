import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const AnimatedTitle = ({ text }) => {
  const titleRef = useRef();

  useEffect(() => {
    const letters = titleRef.current.querySelectorAll(".letter");

    letters.forEach((el, i) => {
      gsap.fromTo(
        el,
        {
          opacity: 0,
          y: gsap.utils.random(-100, 100),
          rotation: gsap.utils.random(-180, 180),
          scale: gsap.utils.random(0.5, 1.5),
        },
        {
          opacity: 1,
          y: 0,
          rotation: 0,
          scale: 1,
          duration: gsap.utils.random(1.2, 1.6),
          delay: i * 0.1,
          ease: "bounce.out",
        }
      );
    });
  }, []);

  return (
    <h1 ref={titleRef} style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
      {text.split("").map((char, index) => (
        <span
          key={index}
          className="letter"
          style={{ display: "inline-block", whiteSpace: "pre" }}
        >
          {char}
        </span>
      ))}
    </h1>
  );
};

export default AnimatedTitle;
