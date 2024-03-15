import { useContext } from 'react';
import { PaneSystemContext } from './PaneSystemContext';

const SplitterLayer = () => {
  const { splitters } = useContext(PaneSystemContext);
  console.log('splitters', splitters);
  return (
    <div
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
