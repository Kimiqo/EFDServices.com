import React from 'react';
import type { GalleryItem } from '../../types';

const GalleryList: React.FC<{ items: GalleryItem[]; onSelect: (index: number) => void; selectedIndex: number | null }> = ({ items, onSelect, selectedIndex }) => {
  return (
    <div>
      <div className="grid grid-cols-3 gap-4">
        {items.map((item, idx) => (
          <div key={item.id || idx} className={`bg-white rounded shadow p-3 cursor-pointer ${selectedIndex === idx ? 'ring-2 ring-blue-300' : ''}`} onClick={() => onSelect(idx)}>
            <div className="h-40 bg-gray-200 mb-3 flex items-center justify-center overflow-hidden">
              {item.image ? <img src={item.image} alt={item.title} className="w-full h-full object-cover" /> : <div className="text-gray-500">No image</div>}
            </div>
            <h3 className="font-semibold">{item.title}</h3>
            <p className="text-sm text-gray-500">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GalleryList;
