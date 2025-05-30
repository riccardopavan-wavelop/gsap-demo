import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';

gsap.registerPlugin(Draggable, InertiaPlugin);

const SpinWheel = () => {
  const wheelRef = useRef(null);

  useEffect(() => {
    Draggable.create(wheelRef.current, {
      type: 'rotation',
      inertia: true,
      throwProps: true,
      cursor: 'grab',
      activeCursor: 'grabbing',
    });
  }, []);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4rem', flexDirection: 'column' }}>
      <span style={{ textAlign: 'center', fontSize: '24px' }}>Spin me!</span>
      <div
        ref={wheelRef}
        style={{
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          border: '8px solid #333',
          background: 'conic-gradient(#61dafb 0% 25%, #ff6f61 25% 50%, #f0db4f 50% 75%, #8e44ad 75% 100%)',
        }}
      >
      </div>
    </div>
  );
};

export default SpinWheel;
