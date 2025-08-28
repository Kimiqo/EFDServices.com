import React from 'react';
import type { Testimonial } from '../../types/adminTypes';

const TestimonialList: React.FC<{ items: Testimonial[]; onEdit: (index: number) => void }> = ({ items, onEdit }) => {
  return (
    <div className="space-y-3">
      {items.map((t, idx) => (
        <div key={t.id || idx} className="bg-white p-4 rounded shadow flex justify-between items-start">
          <div>
            <div className="flex items-center mb-1">
              <div className="font-semibold mr-3">{t.name}</div>
              <div className="text-sm text-gray-500">{t.location}</div>
            </div>
            <div className="text-gray-600 italic">"{t.text}"</div>
          </div>
          <div className="ml-4">
            <button onClick={() => onEdit(idx)} className="px-2 py-1 bg-white border rounded">Edit</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TestimonialList;
