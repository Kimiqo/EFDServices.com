import React from 'react';

const HeroEditor: React.FC<{
  value: string | undefined;
  onChange: (v: string) => void;
  onUpload: (file: File) => Promise<string>;
  onAdd: () => void;
  onDelete: () => void;
}> = ({ value, onChange, onUpload, onAdd, onDelete }) => {
  if (value === undefined)     return (
    <div className="text-gray-500 flex flex-col items-center justify-center space-y-4">
      <p>Select an item to edit, or add a new one.</p>
      <button
        onClick={onAdd}
        className="px-3 py-1 bg-green-500 text-white rounded"
      >
        Add Image
      </button>
    </div>
  );;
  return (
    <div className="space-y-2">
      <label className="block text-sm">Image</label>
      <div className="flex gap-2 items-center mb-2">
        <label className="px-2 py-1 bg-gray-200 rounded cursor-pointer">
          Upload
          <input type="file" accept="image/*" onChange={async (e) => { const file = e.target.files?.[0]; if (!file) return; try { const path = await onUpload(file); onChange(path); } catch (err) { alert('Upload failed: ' + String(err)); } }} style={{ display: 'none' }} />
        </label>
        {value ? (
          <div className="text-sm text-gray-600">{String(value)}</div>
        ) : (
          <div className="text-sm text-gray-400">No image</div>
        )}
      </div>

      <label className="block text-sm">Image URL</label>
      <input value={value || ''} onChange={(e) => onChange(e.target.value)} className="w-full p-2 border rounded" />

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

export default HeroEditor;
