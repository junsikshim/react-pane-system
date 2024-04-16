import { useContext } from 'react';
import { SplitterRegistry } from './splitter/SplitterRegistry';
import RowSplitter from './splitter/PaneRowSplitter';
import ColumnSplitter from './splitter/PaneSplitter';
import SplitterIntersectionHandle from './splitter/SplitterIntersectionHandle';

const SplitterLayer = () => {
  const { splitters, intersections } = useContext(SplitterRegistry);

  return (
    <div
      className="splitters"
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        userSelect: 'none'
      }}
    >
      {/* Splitters */}
      {splitters.map((splitter) => {
        if (splitter.orientation === 'horizontal')
          return <RowSplitter key={splitter.id} splitter={splitter} />;
        else if (splitter.orientation === 'vertical')
          return <ColumnSplitter key={splitter.id} splitter={splitter} />;

        return null;
      })}

      {/* Intersection handles */}
      {intersections.map((intersection) => (
        <SplitterIntersectionHandle
          key={intersection.id}
          intersection={intersection}
        />
      ))}
    </div>
  );
};

export default SplitterLayer;
