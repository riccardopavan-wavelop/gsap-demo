import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import Draggable from 'gsap/Draggable';

gsap.registerPlugin(Draggable);

const GridListToggle = () => {
  const [isGrid, setIsGrid] = useState(true);
  const [buttonText, setButtonText] = useState('List');
  const containerRef = useRef(null);
  const boxesRef = useRef([]);
  const positions = useRef([]);
  const order = useRef([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  const draggableInstances = useRef([]);

  const BOXSIZE = 100;
  const GAP = 20;
  const COLS = 3;

  const layoutBoxes = () => {
    boxesRef.current.forEach((box, i) => {
      if (!box) return;
      
      const index = order.current.indexOf(i);
      
      let x, y;
      if (isGrid) {
        const row = Math.floor(index / COLS);
        const col = index % COLS;
        x = col * (BOXSIZE + GAP);
        y = row * (BOXSIZE + GAP);
      } else {
        x = 0;
        y = index * (BOXSIZE + GAP);
      }

      gsap.to(box, {
        x,
        y,
        duration: 0.4,
        ease: 'power2.inOut',
      });

      positions.current[i] = { x, y };
    });
  };

  const destroyDraggable = () => {
    draggableInstances.current.forEach(instance => {
      if (instance) {
        instance.kill();
      }
    });
    draggableInstances.current = [];
  };

  const initDraggable = () => {
    destroyDraggable();

    boxesRef.current.forEach((box, i) => {
      if (!box) return;
      // 1 instance draggabile per box
      const draggableInstance = Draggable.create(box, {
        type: 'x,y',
        bounds: containerRef.current,
        onPress() {
          gsap.to(box, { scale: 1.1, zIndex: 1000, duration: 0.2 });
        },
        onRelease() {
          gsap.to(box, { scale: 1, zIndex: 1, duration: 0.2 });

          // check se è stata draggata sopra un'altra box
          let swapWith = null;
          const draggedRect = box.getBoundingClientRect();
          const draggedCenterX = draggedRect.left + draggedRect.width / 2;
          const draggedCenterY = draggedRect.top + draggedRect.height / 2;

          boxesRef.current.forEach((otherBox, j) => {
            if (i !== j && otherBox) {
              const otherRect = otherBox.getBoundingClientRect();
              const otherCenterX = otherRect.left + otherRect.width / 2;
              const otherCenterY = otherRect.top + otherRect.height / 2;
              
              const distance = Math.sqrt(
                Math.pow(draggedCenterX - otherCenterX, 2) + 
                Math.pow(draggedCenterY - otherCenterY, 2)
              );
              
              if (distance < BOXSIZE * 0.8) {
                swapWith = j;
              }
            }
          });

          if (swapWith !== null) {
            const iIndex = order.current.indexOf(i);
            const jIndex = order.current.indexOf(swapWith);
            [order.current[iIndex], order.current[jIndex]] = [
              order.current[jIndex],
              order.current[iIndex],
            ];
          }

          layoutBoxes();
        },
      })[0];

      draggableInstances.current[i] = draggableInstance;
    });
  };

  const toggleLayout = () => {
    const nextIsGrid = !isGrid;
    setIsGrid(nextIsGrid);
    setButtonText(nextIsGrid ? 'List' : 'Grid');
  };

  useEffect(() => {
    layoutBoxes();
    setTimeout(() => {
      initDraggable();
    }, 100);
  }, [isGrid]);

  useEffect(() => {
    layoutBoxes();
    initDraggable();
    
    return () => {
      destroyDraggable();
    };
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <button
        onClick={toggleLayout}
        style={{
          fontSize: '1.2rem',
          padding: '0.6rem 1.2rem'
        }}
      >
        Cambia in {buttonText}
      </button>

      <div
        ref={containerRef}
        style={{
          position: 'relative',
          width: isGrid ? `${COLS * (BOXSIZE + GAP)}px` : `${BOXSIZE + 20}px`,
          height: isGrid ? `${Math.ceil(9 / COLS) * (BOXSIZE + GAP)}px` : `${9 * (BOXSIZE + GAP)}px`,
          padding: '10px',
        }}
      >
        {[...Array(9)].map((_, i) => (
          <div
            key={i}
            ref={(el) => (boxesRef.current[i] = el)}
            style={{
              position: 'absolute',
              width: `${BOXSIZE}px`,
              height: `${BOXSIZE}px`,
              background: 'linear-gradient(135deg, #61dafb, #4fa8c5)',
              borderRadius: '12px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontWeight: 'bold',
              fontSize: '1.5rem',
              color: '#111',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
              cursor: 'grab',
              userSelect: 'none',
              transition: 'box-shadow 0.2s ease',
              textAlign: 'center'
            }}
          >
            {i + 1 === 1 ? 'Drag me!' : i + 1}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GridListToggle;