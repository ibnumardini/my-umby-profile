import { useEffect, useState, useMemo } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import useParticlesConfig from "../config/particles";

export default function ParticleBackground() {
  const [initParticle, setInitParticle] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInitParticle(true);
    });
  }, []);

  const particlesLoaded = (container) => {
    console.log(container);
  };

  const particleOptions = useMemo(useParticlesConfig, []);

  if (initParticle) {
    return (
      <Particles
        id="tsparticles"
        options={particleOptions}
        loaded={particlesLoaded}
      />
    );
  }

  return <></>;
}
