import { useContext } from 'react';
import { SplitterRegistry } from './registry/SplitterRegistry';

const SplitterLayer = () => {
  const { splitters } = useContext(SplitterRegistry);
  console.log('splitters', splitters);
  return (
    <div
      className="splitters"
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%'
      }}
    >
      {splitters.map((splitter, index) => (
        <div
          key={splitter.id}
          style={{
            position: 'absolute',
            left: splitter.x,
            top: splitter.y,
            width: splitter.width,
            height: splitter.height,
            backgroundColor: splitter.color
          }}
        />
      ))}
    </div>
  );
};

export default SplitterLayer;
