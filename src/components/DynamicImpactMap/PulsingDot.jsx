import { Marker } from 'react-simple-maps';
import { useSpring, animated } from 'react-spring';

const PulsingDot = ({ coordinates }) => {
  const { r } = useSpring({
    from: { r: 3 },
    to: { r: 6 },
    config: { duration: 1000 },
    reset: true,
    loop: true,
  });

  return (
    <Marker coordinates={coordinates}>
      <animated.circle r={r} fill="#FFA500" />
    </Marker>
  );
};

export default PulsingDot;
