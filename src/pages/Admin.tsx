// Clean Admin page: uses serverless API for reading/writing data and file uploads.
import React, { useEffect, useState, useCallback } from 'react';

const LoginForm: React.FC<{ onSubmit: (email: string, password: string) => Promise<void>, error?: string | null }> = ({ onSubmit, error }) => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [loading, setLoading] = useState(false);
  return (
    <form onSubmit={async (e) => { e.preventDefault(); setLoading(true); await onSubmit(email, pass); setLoading(false); }} className="space-y-3">
      <label className="block text-sm">Email</label>
      <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border rounded" />
      <label className="block text-sm">Password</label>
      <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} className="w-full p-2 border rounded" />
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <div className="flex justify-end">
        <button type="submit" disabled={loading} className="px-3 py-1 bg-blue-600 text-white rounded">{loading ? 'Logging in...' : 'Login'}</button>
      </div>
    </form>
  );
};

type GalleryItem = {
  id: number | string;
  title: string;
  category: string;
  image: string;
  description: string;
};

type Testimonial = {
  id: number | string;
  name: string;
  text: string;
  rating: number;
  location?: string;
};

let API_BASE = 'http://localhost:4001';
try {
  // access Vite env if available
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (import.meta && import.meta.env && import.meta.env.VITE_API_BASE) API_BASE = import.meta.env.VITE_API_BASE;
} catch {
  // ignore
}
const TOKEN_KEY = 'efd_admin_token';

const fetchData = async (file: 'galleryData' | 'testimonials' | 'heroImages') => {
  const res = await authenticatedFetch(`${API_BASE}/api/data/${file}`);
  if (!res.ok) throw new Error('fetch failed');
  return res.json();
};

async function authenticatedFetch(input: RequestInfo, init: RequestInit = {}) {
  const headers = Object.assign({}, (init && (init.headers as Record<string, string>)) || {}, { 'Content-Type': 'application/json' });
  const t = typeof localStorage !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
  if (t) headers['Authorization'] = `Bearer ${t}`;
  const res = await fetch(input, Object.assign({}, init, { headers }));
  if (res.status === 401) {
    // token invalid or expired — clear and force reload to login
    localStorage.removeItem(TOKEN_KEY);
    window.location.reload();
  }
  return res;
}

const Admin: React.FC = () => {
  const [section, setSection] = useState<'gallery' | 'testimonials' | 'hero'>('gallery');
  const [token, setToken] = useState<string | null>(() => (typeof localStorage !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null));
  const [loginError, setLoginError] = useState<string | null>(null);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [heroImages, setHeroImages] = useState<string[]>([]);
  const [dirty, setDirty] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    // Only fetch protected data when we have a token.
    if (!token) {
      setLoading(false);
      return;
    }
    let mounted = true;
    (async () => {
      try {
        const g = await fetchData('galleryData');
        const t = await fetchData('testimonials');
        const h = await fetchData('heroImages');
        if (!mounted) return;
        setGalleryItems(g.galleryItems || []);
        setTestimonials(t.testimonials || []);
        setHeroImages(h.heroImages || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [token]);

  useEffect(() => {
    const onBefore = (e: BeforeUnloadEvent) => {
      if (dirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', onBefore);
    return () => window.removeEventListener('beforeunload', onBefore);
  }, [dirty]);

  const saveFile = useCallback(async (file: 'galleryData' | 'testimonials' | 'heroImages') => {
    const body: Record<string, unknown> = {};
    if (file === 'galleryData') {
      body['galleryItems'] = galleryItems;
      body['heroImages'] = heroImages;
    }
    if (file === 'testimonials') body['testimonials'] = testimonials;
    if (file === 'heroImages') body['heroImages'] = heroImages;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    const t = typeof localStorage !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
    if (t) headers['Authorization'] = `Bearer ${t}`;
    const res = await authenticatedFetch(`${API_BASE}/api/data/${file}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error('save failed');
    setDirty(false);
  }, [galleryItems, testimonials, heroImages]);

  // intercept in-app link clicks and prompt when dirty (placed after saveFile is defined)
  useEffect(() => {
    const onDocClick = (ev: MouseEvent) => {
      if (!dirty) return;
      const target = ev.target as HTMLElement | null;
      if (!target) return;
      const a = target.closest && (target.closest('a') as HTMLAnchorElement | null);
      if (!a) return;
      const href = a.getAttribute('href') || '';
      if (!href.startsWith('/')) return;
      ev.preventDefault();
      const keep = window.confirm('You have unsaved changes. Save before leaving? OK = Save, Cancel = Discard');
      (async () => {
        if (keep) {
          try {
            // hero images are stored in galleryData
            const file: 'galleryData' | 'testimonials' = section === 'testimonials' ? 'testimonials' : 'galleryData';
            await saveFile(file);
          } catch (err) {
            alert('Save failed: ' + String(err));
            return;
          }
        }
        window.location.href = href;
      })();
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, [dirty, section, saveFile]);

  const addGallery = () => {
    const next = [...galleryItems, { id: Date.now(), title: 'New', category: 'apparel', image: '', description: '' }];
    setGalleryItems(next);
    setDirty(true);
  };

  const deleteGallery = (idx: number) => {
    const next = [...galleryItems];
    next.splice(idx, 1);
    setGalleryItems(next);
    setDirty(true);
  };

  const addTestimonial = () => {
    const next = [...testimonials, { id: Date.now(), name: 'New', text: '', rating: 5 }];
    setTestimonials(next);
    setDirty(true);
  };

  const deleteTestimonial = (idx: number) => {
    const next = [...testimonials];
    next.splice(idx, 1);
    setTestimonials(next);
    setDirty(true);
  };

  const uploadImage = async (file: File) => {
    const filename = `${Date.now()}-${file.name}`;
    const buf = await file.arrayBuffer();
    const bytes = new Uint8Array(buf);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
    const base64 = btoa(binary);
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    const t = typeof localStorage !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
    if (t) headers['Authorization'] = `Bearer ${t}`;
    const res = await authenticatedFetch(`${API_BASE}/api/upload`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ filename, dataBase64: base64 }),
    });
    if (!res.ok) throw new Error('upload failed');
    const data = await res.json();
    return data.path || `/${filename}`;
  };

  const doLogin = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setLoginError(j.error || 'login failed');
        return;
      }
      const j = await res.json();
      localStorage.setItem(TOKEN_KEY, j.token);
      setToken(j.token);
      setLoginError(null);
    } catch (err) {
      setLoginError(String(err));
    }
  };

  const doLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
  };

  const tryNavigate = async (to: 'gallery' | 'testimonials' | 'hero') => {
    if (dirty) {
      const keep = window.confirm('You have unsaved changes. Save before leaving? OK = Save, Cancel = Discard');
      if (keep) {
        try {
          const file = section === 'testimonials' ? 'testimonials' : 'galleryData';
          await saveFile(file as 'galleryData' | 'testimonials');
        } catch (err) {
          alert('Save failed: ' + String(err));
          return;
        }
      }
    }
    setSection(to);
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Admin Login</h2>
          <LoginForm onSubmit={async (u, p) => { await doLogin(u, p); }} error={loginError} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-gray-100 p-4 border-r">
        <h2 className="text-xl font-semibold mb-4">Admin</h2>
        <nav className="space-y-2">
          <button onClick={() => tryNavigate('gallery')} className={`w-full text-left px-3 py-2 rounded ${section === 'gallery' ? 'bg-white shadow' : ''}`}>Gallery</button>
          <button onClick={() => tryNavigate('testimonials')} className={`w-full text-left px-3 py-2 rounded ${section === 'testimonials' ? 'bg-white shadow' : ''}`}>Testimonials</button>
          <button onClick={() => tryNavigate('hero')} className={`w-full text-left px-3 py-2 rounded ${section === 'hero' ? 'bg-white shadow' : ''}`}>Hero Images</button>
        </nav>
      </aside>

      <main className="flex-1 p-6 bg-gray-50">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{section === 'gallery' ? 'Gallery' : section === 'testimonials' ? 'Testimonials' : 'Hero Images'}</h1>
          <div className="flex items-center gap-3">
            <button onClick={() => {
              if (section === 'gallery') saveFile('galleryData');
              else if (section === 'testimonials') saveFile('testimonials');
              else saveFile('heroImages');
            }} disabled={!dirty} className="px-3 py-1 bg-green-500 text-white rounded disabled:opacity-60">Save</button>
            <button onClick={() => { doLogout(); }} className="px-3 py-1 bg-red-500 text-white rounded">Logout</button>
          </div>
        </div>

        {section === 'gallery' && (
          <div className="grid grid-cols-4 gap-6">
            <div className="col-span-3">
              <div className="grid grid-cols-3 gap-4">
                {galleryItems.map((item, idx) => (
                  <div key={item.id || idx} className="bg-white rounded shadow p-3 cursor-pointer" onClick={() => setSelectedIndex(idx)}>
                    <div className="h-40 bg-gray-200 mb-3 flex items-center justify-center overflow-hidden">
                      {item.image ? <img src={item.image} alt={item.title} className="w-full h-full object-cover" /> : <div className="text-gray-500">No image</div>}
                    </div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <aside className="col-span-1">
              <div className="bg-white p-4 rounded shadow">
                <div className="flex justify-between mb-3">
                  <h3 className="font-semibold">Details</h3>
                  <div className="space-x-2">
                    <button onClick={() => { addGallery(); setSelectedIndex(galleryItems.length); }} className="px-2 py-1 bg-green-500 text-white rounded">Add</button>
                    {selectedIndex !== null && <button onClick={() => { deleteGallery(selectedIndex); setSelectedIndex(null); }} className="px-2 py-1 bg-red-500 text-white rounded">Delete</button>}
                  </div>
                </div>

                {selectedIndex === null ? (
                  <div className="text-gray-500">Select an item to edit.</div>
                ) : (
                  ((): JSX.Element => {
                    const it = galleryItems[selectedIndex];
                    if (!it) return <div className="text-red-500">Item missing</div>;
                    return (
                      <div className="space-y-2">
                        <label className="block text-sm">Image</label>
                        <div className="flex gap-2 items-center mb-2">
                          <label className="px-2 py-1 bg-gray-200 rounded cursor-pointer">
                            Upload
                            <input type="file" accept="image/*" onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              try {
                                const path = await uploadImage(file);
                                const next = [...galleryItems];
                                next[selectedIndex] = { ...next[selectedIndex], image: path };
                                setGalleryItems(next);
                                setDirty(true);
                              } catch (err) {
                                alert('Upload failed: ' + String(err));
                              }
                            }} style={{ display: 'none' }} />
                          </label>
                          {it.image ? (
                            <div className="text-sm text-gray-600">{String(it.image)}</div>
                          ) : (
                            <div className="text-sm text-gray-400">No image</div>
                          )}
                        </div>

                        <label className="block text-sm">Title</label>
                        <input value={it.title || ''} onChange={(e) => { const next = [...galleryItems]; next[selectedIndex] = { ...it, title: e.target.value }; setGalleryItems(next); setDirty(true); }} className="w-full p-2 border rounded" />

                        <label className="block text-sm">Category</label>
                        <select value={it.category || ''} onChange={(e) => { const next = [...galleryItems]; next[selectedIndex] = { ...it, category: e.target.value }; setGalleryItems(next); setDirty(true); }} className="w-full p-2 border rounded">
                          <option value="apparel">Apparel</option>
                          <option value="caps">Caps</option>
                          <option value="custom">Custom Pieces</option>
                          <option value="bibs/hwBags">Bibs/Homework Bags</option>
                        </select>

                        <label className="block text-sm">Description</label>
                        <textarea value={it.description || ''} onChange={(e) => { const next = [...galleryItems]; next[selectedIndex] = { ...it, description: e.target.value }; setGalleryItems(next); setDirty(true); }} className="w-full p-2 border rounded h-24" />
                      </div>
                    );
                  })()
                )}
              </div>
            </aside>
          </div>
        )}

        {section === 'testimonials' && (
          <div className="grid grid-cols-4 gap-6">
            <div className="col-span-3">
              <div className="space-y-3">
                {testimonials.map((t, idx) => (
                  <div key={t.id || idx} className="bg-white p-4 rounded shadow flex justify-between items-start">
                    <div>
                      <div className="flex items-center mb-1">
                        <div className="font-semibold mr-3">{t.name}</div>
                        <div className="text-sm text-gray-500">{t.location}</div>
                      </div>
                      <div className="text-gray-600 italic">"{t.text}"</div>
                    </div>
                    <div className="ml-4">
                      <button onClick={() => setSelectedIndex(idx)} className="px-2 py-1 bg-white border rounded">Edit</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <aside className="col-span-1">
              <div className="bg-white p-4 rounded shadow">
                <div className="flex justify-between mb-3">
                  <h3 className="font-semibold">Details</h3>
                  <div className="space-x-2">
                    <button onClick={() => { addTestimonial(); setSelectedIndex(testimonials.length); }} className="px-2 py-1 bg-green-500 text-white rounded">Add</button>
                    {selectedIndex !== null && <button onClick={() => { deleteTestimonial(selectedIndex); setSelectedIndex(null); }} className="px-2 py-1 bg-red-500 text-white rounded">Delete</button>}
                  </div>
                </div>

                {selectedIndex === null ? (
                  <div className="text-gray-500">Select a testimonial to edit.</div>
                ) : (
                  ((): JSX.Element => {
                    const t = testimonials[selectedIndex];
                    if (!t) return <div className="text-red-500">Item missing</div>;
                    return (
                      <div className="space-y-2">
                        <label className="block text-sm">Name</label>
                        <input value={t.name || ''} onChange={(e) => { const next = [...testimonials]; next[selectedIndex] = { ...t, name: e.target.value }; setTestimonials(next); setDirty(true); }} className="w-full p-2 border rounded" />

                        <label className="block text-sm">Location</label>
                        <input value={t.location || ''} onChange={(e) => { const next = [...testimonials]; next[selectedIndex] = { ...t, location: e.target.value }; setTestimonials(next); setDirty(true); }} className="w-full p-2 border rounded" />

                        <label className="block text-sm">Rating</label>
                        <input type="number" min={1} max={5} value={t.rating || 5} onChange={(e) => { const next = [...testimonials]; next[selectedIndex] = { ...t, rating: Number(e.target.value) }; setTestimonials(next); setDirty(true); }} className="w-full p-2 border rounded" />

                        <label className="block text-sm">Text</label>
                        <textarea value={t.text || ''} onChange={(e) => { const next = [...testimonials]; next[selectedIndex] = { ...t, text: e.target.value }; setTestimonials(next); setDirty(true); }} className="w-full p-2 border rounded h-24" />
                      </div>
                    );
                  })()
                )}
              </div>
            </aside>
          </div>
        )}

        {section === 'hero' && (
          <div className="grid grid-cols-4 gap-6">
            <div className="col-span-3">
              <div className="grid grid-cols-3 gap-4">
                {heroImages.map((img, idx) => (
                  <div key={`${img}-${idx}`} className="bg-white rounded shadow p-3">
                    <div className="h-40 bg-gray-200 mb-3 flex items-center justify-center overflow-hidden">
                      {img ? <img src={img} alt={`hero-${idx}`} className="w-full h-full object-cover" /> : <div className="text-gray-500">No image</div>}
                    </div>
                    <div className="text-sm text-gray-600">{img}</div>
                  </div>
                ))}
              </div>
            </div>

            <aside className="col-span-1">
              <div className="bg-white p-4 rounded shadow">
                <div className="flex justify-between mb-3">
                  <h3 className="font-semibold">Hero Images</h3>
                  <div className="space-x-2">
                    <button onClick={() => { const next = [...heroImages, '']; setHeroImages(next); setSelectedIndex(heroImages.length); setDirty(true); }} className="px-2 py-1 bg-green-500 text-white rounded">Add</button>
                    {selectedIndex !== null && <button onClick={() => { const next = [...heroImages]; next.splice(selectedIndex, 1); setHeroImages(next); setSelectedIndex(null); setDirty(true); }} className="px-2 py-1 bg-red-500 text-white rounded">Delete</button>}
                  </div>
                </div>

                {selectedIndex === null ? (
                  <div className="text-gray-500">Select a hero image to edit.</div>
                ) : (
                  ((): JSX.Element => {
                    const img = heroImages[selectedIndex];
                    if (img === undefined) return <div className="text-red-500">Item missing</div>;
                    return (
                      <div className="space-y-2">
                        <label className="block text-sm">Image</label>
                        <div className="flex gap-2 items-center mb-2">
                          <label className="px-2 py-1 bg-gray-200 rounded cursor-pointer">
                            Upload
                            <input type="file" accept="image/*" onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              try {
                                const path = await uploadImage(file);
                                const next = [...heroImages];
                                next[selectedIndex] = path;
                                setHeroImages(next);
                                setDirty(true);
                              } catch (err) {
                                alert('Upload failed: ' + String(err));
                              }
                            }} style={{ display: 'none' }} />
                          </label>
                          {img ? (
                            <div className="text-sm text-gray-600">{String(img)}</div>
                          ) : (
                            <div className="text-sm text-gray-400">No image</div>
                          )}
                        </div>

                        <label className="block text-sm">Image URL</label>
                        <input value={img || ''} onChange={(e) => { const next = [...heroImages]; next[selectedIndex] = e.target.value; setHeroImages(next); setDirty(true); }} className="w-full p-2 border rounded" />
                      </div>
                    );
                  })()
                )}
              </div>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
