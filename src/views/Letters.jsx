import { useRef } from "react";
import AnimatedTitle from "../components/Title";
import ScrollWrap from "../components/ScrollWrap";
import GridListToggle from "../components/GridListToggle";
import SpinWheel from "../components/SpinWheel";
import Carousel from "../components/Carousel";

const Letterspage = () => {
  const container = useRef();

  return (
    <main className="home" ref={container}>
      <div className="letters-container">
        <AnimatedTitle text={"Titolo con animazioni diverse per ogni lettera"}/>
        <ScrollWrap text={"Tetso che va da destra a sinistra on scroll"} />
        <Carousel />
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '0 4vh'
        }}>
          <GridListToggle />
          <SpinWheel />
        </div>
      </div>
    </main>
  );
}

export default Letterspage;