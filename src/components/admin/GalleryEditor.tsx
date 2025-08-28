import React from 'react';
import type { GalleryItem } from '../../types/adminTypes';

const GalleryEditor: React.FC<{
  item: GalleryItem | null;
  onChange: (next: GalleryItem) => void;
  onUpload: (file: File) => Promise<string>;
  onAdd: () => void;
  onDelete: () => void;
}> = ({ item, onChange, onUpload, onAdd, onDelete }) => {
  if (!item) return <div className="text-gray-500">Select an item to edit.</div>;
  return (
    <div className="space-y-2">
      <label className="block text-sm">Image</label>
      <div className="flex gap-2 items-center mb-2">
        <label className="px-2 py-1 bg-gray-200 rounded cursor-pointer">
          Upload
          <input type="file" accept="image/*" onChange={async (e) => { const file = e.target.files?.[0]; if (!file) return; try { const path = await onUpload(file); onChange({ ...item, image: path }); } catch (err) { alert('Upload failed: ' + String(err)); } }} style={{ display: 'none' }} />
        </label>
        {item.image ? (
          <div className="text-sm text-gray-600">{String(item.image)}</div>
        ) : (
          <div className="text-sm text-gray-400">No image</div>
        )}
      </div>

      <label className="block text-sm">Title</label>
      <input value={item.title || ''} onChange={(e) => onChange({ ...item, title: e.target.value })} className="w-full p-2 border rounded" />

      <label className="block text-sm">Category</label>
      <select value={item.category || ''} onChange={(e) => onChange({ ...item, category: e.target.value })} className="w-full p-2 border rounded">
        <option value="apparel">Apparel</option>
        <option value="caps">Caps</option>
        <option value="custom">Custom Pieces</option>
        <option value="bibs/hwBags">Bibs/Homework Bags</option>
      </select>

      <label className="block text-sm">Description</label>
      <textarea value={item.description || ''} onChange={(e) => onChange({ ...item, description: e.target.value })} className="w-full p-2 border rounded h-24" />

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

export default GalleryEditor;
