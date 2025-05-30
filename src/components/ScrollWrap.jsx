import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const ScrollWrap = ({ text }) => {
  const containerRef = useRef();
  const textRef = useRef();

  useGSAP(() => {
    const container = containerRef.current;
    const textEl = textRef.current;
    const distance = textEl.offsetWidth;

    gsap.to(textEl, {
      x: () => `-${distance}`, // muovi a sx 
      ease: 'none',
      scrollTrigger: {
        trigger: container,
        start: 'top center',
        end: '+=1000', // distanza max per fare finire lo scroll ? Come si fa infinite ?
        scrub: true
      },
    });
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        width: '100%',
        background: '#111',
        color: '#fff',
        fontSize: '24px',
        padding: '1rem 0'
      }}
    >
      <div
        ref={textRef}
        style={{
          display: 'inline-block',
          paddingLeft: '100vw', // faccio partire il testo da fuori 
        }}
      >
        {text}
      </div>
    </div>
  );
};

export default ScrollWrap;
