import React from 'react';
import type { Testimonial } from '../../types';

const TestimonialEditor: React.FC<{
  item: Testimonial | null;
  onChange: (next: Testimonial) => void;
  onAdd: () => void;
  onDelete: () => void;
}> = ({ item, onChange, onAdd, onDelete }) => {
  if (!item)     return (
    <div className="text-gray-500 flex flex-col items-center justify-center space-y-4">
      <p>Select a testimonial to edit, or add a new one.</p>
      <button
        onClick={onAdd}
        className="px-3 py-1 bg-green-500 text-white rounded"
      >
        Add Testimonial
      </button>
    </div>
  );;
  return (
    <div className="space-y-2">
      <label className="block text-sm">Name</label>
      <input value={item.name || ''} onChange={(e) => onChange({ ...item, name: e.target.value })} className="w-full p-2 border rounded" />

      <label className="block text-sm">Location</label>
      <input value={item.location || ''} onChange={(e) => onChange({ ...item, location: e.target.value })} className="w-full p-2 border rounded" />

      <label className="block text-sm">Rating</label>
      <input type="number" min={1} max={5} value={item.rating || 5} onChange={(e) => onChange({ ...item, rating: Number(e.target.value) })} className="w-full p-2 border rounded" />

      <label className="block text-sm">Text</label>
      <textarea value={item.text || ''} onChange={(e) => onChange({ ...item, text: e.target.value })} className="w-full p-2 border rounded h-24" />

      <div className="flex justify-between">
        <div />
        <div className="space-x-2">
          <button onClick={onAdd} className="px-2 py-1 bg-green-500 text-white rounded">Add</button>
          <button onClick={onDelete} className="px-2 py-1 bg-red-500 text-white rounded">Delete</button>
        </div>
      </div>
    </div>
  );
};

export default TestimonialEditor;
