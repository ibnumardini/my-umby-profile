import { useColorModeValue } from "@chakra-ui/react";

const useParticlesConfig = () => {
  const bgColor = useColorModeValue("white", "gray.800");
  const linkColor = useColorModeValue("#007BFF", "#66B2FF");
  const particleColors = useColorModeValue(
    ["#007BFF", "#339CFF", "#66B2FF"],
    ["#339CFF", "#66B2FF", "#99CCFF"]
  );

  return {
    background: { color: { value: bgColor } },
    fullScreen: { enable: true, zIndex: -1 },
    fpsLimit: 120,
    interactivity: {
      events: {
        onClick: { enable: true, mode: "push" },
        onHover: {
          enable: true,
          mode: "grab",
          parallax: { enable: true, force: 50, smooth: 15 },
        },
        resize: true,
      },
      modes: {
        grab: { distance: 250, links: { opacity: 0.6 } },
        push: { quantity: 4 },
        bubble: { distance: 300, size: 12, duration: 2, opacity: 0.8 },
        repulse: { distance: 200, duration: 0.4 },
      },
    },
    particles: {
      number: { value: 120, density: { enable: true, area: 800 } },
      color: { value: particleColors },
      links: {
        enable: true,
        color: linkColor,
        distance: 150,
        opacity: 0.4,
        width: 1,
      },
      move: { enable: true, speed: 1.5, outModes: { default: "out" } },
      opacity: {
        value: { min: 0.2, max: 0.6 },
        animation: { enable: true, speed: 1, minimumValue: 0.2 },
      },
      size: {
        value: { min: 1, max: 4 },
        animation: { enable: true, speed: 3, minimumValue: 1 },
      },
      shape: { type: "circle" },
    },
    detectRetina: true,
  };
};

export default useParticlesConfig;
