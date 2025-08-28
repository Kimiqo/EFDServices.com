// Clean Admin page: uses serverless API for reading/writing data and file uploads.
import React, { useEffect, useState, useCallback } from 'react';
import LoginForm from '../components/admin/LoginForm';
import ChangePasswordForm from '../components/admin/ChangePasswordForm';
import GalleryList from '../components/admin/GalleryList';
import GalleryEditor from '../components/admin/GalleryEditor';
import TestimonialList from '../components/admin/TestimonialList';
import TestimonialEditor from '../components/admin/TestimonialEditor';
import HeroList from '../components/admin/HeroList';
import HeroEditor from '../components/admin/HeroEditor';
import type { GalleryItem, Testimonial } from '../types/adminTypes';

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
  const [section, setSection] = useState<'gallery' | 'testimonials' | 'hero' | 'profile'>('gallery');
  const [profileEmail, setProfileEmail] = useState<string | null>(null);
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
        const pRes = await authenticatedFetch(`${API_BASE}/api/profile`);
        const p = pRes.ok ? await pRes.json() : null;
        if (!mounted) return;
        setGalleryItems(g.galleryItems || []);
        setTestimonials(t.testimonials || []);
        setHeroImages(h.heroImages || []);
        setProfileEmail(p ? p.email : null);
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

  const tryNavigate = async (to: 'gallery' | 'testimonials' | 'hero' | 'profile') => {
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
      <div className="page-container flex items-center justify-center">
        <div className="w-full max-w-md bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Admin Login</h2>
          <LoginForm onSubmit={async (u, p) => { await doLogin(u, p); }} error={loginError} />
        </div>
      </div>
    );
  }

  return (
    <div className="page-container flex">
      <aside className="w-64 bg-gray-100 p-4 border-r">
        <h2 className="text-xl font-semibold mb-4">Admin</h2>
        <nav className="space-y-2">
          <button onClick={() => tryNavigate('gallery')} className={`w-full text-left px-3 py-2 rounded ${section === 'gallery' ? 'bg-white shadow' : ''}`}>Gallery</button>
          <button onClick={() => tryNavigate('testimonials')} className={`w-full text-left px-3 py-2 rounded ${section === 'testimonials' ? 'bg-white shadow' : ''}`}>Testimonials</button>
          <button onClick={() => tryNavigate('hero')} className={`w-full text-left px-3 py-2 rounded ${section === 'hero' ? 'bg-white shadow' : ''}`}>Hero Images</button>
          <button onClick={() => tryNavigate('profile')} className={`w-full text-left px-3 py-2 rounded ${section === 'profile' ? 'bg-white shadow' : ''}`}>Profile</button>
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
              <GalleryList items={galleryItems} onSelect={(i) => setSelectedIndex(i)} selectedIndex={selectedIndex} />
            </div>

            <aside className="col-span-1">
              <div className="bg-white p-4 rounded shadow">
                <div className="flex justify-between mb-3">
                  <h3 className="font-semibold">Details</h3>
                </div>
                <GalleryEditor
                  item={selectedIndex !== null ? galleryItems[selectedIndex] : null}
                  onChange={(next) => { if (selectedIndex === null) return; const arr = [...galleryItems]; arr[selectedIndex] = next; setGalleryItems(arr); setDirty(true); }}
                  onUpload={uploadImage}
                  onAdd={() => { addGallery(); setSelectedIndex(galleryItems.length); }}
                  onDelete={() => { if (selectedIndex === null) return; deleteGallery(selectedIndex); setSelectedIndex(null); }}
                />
              </div>
            </aside>
          </div>
        )}

        {section === 'testimonials' && (
          <div className="grid grid-cols-4 gap-6">
            <div className="col-span-3">
              <TestimonialList items={testimonials} onEdit={(i) => setSelectedIndex(i)} />
            </div>

            <aside className="col-span-1">
              <div className="bg-white p-4 rounded shadow">
                <div className="flex justify-between mb-3">
                  <h3 className="font-semibold">Details</h3>
                </div>
                <TestimonialEditor
                  item={selectedIndex !== null ? testimonials[selectedIndex] : null}
                  onChange={(next) => { if (selectedIndex === null) return; const arr = [...testimonials]; arr[selectedIndex] = next; setTestimonials(arr); setDirty(true); }}
                  onAdd={() => { addTestimonial(); setSelectedIndex(testimonials.length); }}
                  onDelete={() => { if (selectedIndex === null) return; deleteTestimonial(selectedIndex); setSelectedIndex(null); }}
                />
              </div>
            </aside>
          </div>
        )}

        {section === 'hero' && (
          <div className="grid grid-cols-4 gap-6">
            <div className="col-span-3">
              <HeroList items={heroImages} onSelect={(i) => setSelectedIndex(i)} selectedIndex={selectedIndex} />
            </div>

            <aside className="col-span-1">
              <div className="bg-white p-4 rounded shadow">
                <div className="flex justify-between mb-3">
                  <h3 className="font-semibold">Hero Images</h3>
                </div>
                <HeroEditor
                  value={selectedIndex !== null ? heroImages[selectedIndex] : undefined}
                  onChange={(v) => { if (selectedIndex === null) return; const arr = [...heroImages]; arr[selectedIndex] = v; setHeroImages(arr); setDirty(true); }}
                  onUpload={uploadImage}
                  onAdd={() => { const next = [...heroImages, '']; setHeroImages(next); setSelectedIndex(heroImages.length); setDirty(true); }}
                  onDelete={() => { if (selectedIndex === null) return; const next = [...heroImages]; next.splice(selectedIndex, 1); setHeroImages(next); setSelectedIndex(null); setDirty(true); }}
                />
              </div>
            </aside>
          </div>
        )}
        {section === 'profile' && (
          <div className="max-w-lg">
            <div className="bg-white p-4 rounded shadow space-y-4">
              <h3 className="font-semibold">Profile</h3>
              <div>
                <div className="text-sm text-gray-600">Email</div>
                <div className="font-medium">{profileEmail || '—'}</div>
              </div>

              <ChangePasswordForm onChange={async (oldP, newP) => {
                try {
                  const res = await authenticatedFetch(`${API_BASE}/api/change-password`, { method: 'POST', body: JSON.stringify({ oldPassword: oldP, newPassword: newP }) });
                  if (!res.ok) {
                    const j = await res.json().catch(() => ({}));
                    alert('Change failed: ' + (j.error || 'unknown'));
                    return false;
                  }
                  alert('Password changed');
                  return true;
                } catch (e) {
                  alert('Change failed: ' + String(e));
                  return false;
                }
              }} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
