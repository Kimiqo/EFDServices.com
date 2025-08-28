import React from 'react';

const HeroList: React.FC<{ items: string[]; onSelect: (index: number) => void; selectedIndex: number | null }> = ({ items, onSelect, selectedIndex }) => {
  return (
    <div>
      <div className="grid grid-cols-3 gap-4">
        {items.map((img, idx) => (
          <div key={`${img}-${idx}`} className={`bg-white rounded shadow p-3 ${selectedIndex === idx ? 'ring-2 ring-blue-300' : ''}`}>
            <div className="h-40 bg-gray-200 mb-3 flex items-center justify-center overflow-hidden" onClick={() => onSelect(idx)}>
              {img ? <img src={img} alt={`hero-${idx}`} className="w-full h-full object-cover" /> : <div className="text-gray-500">No image</div>}
            </div>
            <div className="text-sm text-gray-600">{img}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeroList;
