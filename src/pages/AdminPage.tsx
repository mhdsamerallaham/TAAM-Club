import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import {
  getAllCategories, upsertCategory, deleteCategory,
  getAllProducts, upsertProduct, deleteProduct,
  getAllInstagramPosts, upsertInstagramPost, deleteInstagramPost,
  updateSiteSetting, getSiteSettings,
} from '@/lib/supabase/queries';
import { InstagramIcon } from '@/components/ui/Icons';
import type { Category, Product, InstagramPost } from '@/types';
import {
  LayoutDashboard, UtensilsCrossed, Tag, Settings, LogOut,
  Plus, Pencil, Trash2, Save, X, Check, AlertTriangle, Upload, ImagePlus
} from 'lucide-react';

// ─── Types & Auth Constants ────────────────────────────────────
type AdminTab = 'products' | 'categories' | 'instagram' | 'settings';

const ADMIN_CREDENTIAL_HASH = 'ead41fd9c34b76a66339e908e8331b459188e2afde918851bea1b291471222c0';
const ADMIN_SESSION_KEY = 'taam_admin_session_v1';

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// ─── Login Form ────────────────────────────────────
function LoginForm({ onLogin }: { onLogin: () => void }) {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const candidateHash = await sha256Hex(`${normalizedEmail}:${password}`);

      if (candidateHash === ADMIN_CREDENTIAL_HASH) {
        sessionStorage.setItem(ADMIN_SESSION_KEY, candidateHash);
        if (isSupabaseConfigured) {
          await supabase.auth.signInWithPassword({ email: normalizedEmail, password }).catch(() => null);
        }
        onLogin();
        return;
      }

      if (isSupabaseConfigured) {
        const { error: authError } = await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password,
        });
        if (!authError) {
          onLogin();
          return;
        }
      }

      throw new Error('Hatalı kullanıcı adı veya şifre.');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Hatalı kullanıcı adı veya şifre.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-taam-off-white flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-full bg-taam-blue border-4 border-white shadow-lg flex items-center justify-center mx-auto mb-4">
            <span className="font-display text-white text-sm leading-none tracking-wider">TAAM</span>
          </div>
          <h1 className="font-display text-taam-charcoal text-3xl leading-none">Admin Panel</h1>
          <p className="font-accent text-taam-gray text-sm mt-1">TAAM Club Yönetim Sistemi</p>
        </div>

        <div className="admin-card">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="admin-label" htmlFor="admin-email">{t('admin.email')}</label>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="admin-input"
                placeholder="info@taamclub.com"
                required
                autoComplete="email"
              />
            </div>
            <div>
              <label className="admin-label" htmlFor="admin-password">{t('admin.password')}</label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="admin-input"
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm font-accent">
                <AlertTriangle size={14} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-taam btn-taam-primary w-full py-3 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Giriş yapılıyor...' : t('admin.login')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ─── Toast ────────────────────────────────────
function Toast({ message, type }: { message: string; type: 'success' | 'error' }) {
  return (
    <div className={`fixed bottom-4 right-4 left-4 sm:left-auto sm:bottom-6 sm:right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg font-accent text-sm text-white ${type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
      {type === 'success' ? <Check size={14} className="flex-shrink-0" /> : <AlertTriangle size={14} className="flex-shrink-0" />}
      <span className="truncate">{message}</span>
    </div>
  );
}

// ─── Confirm Dialog ────────────────────────────────────
function ConfirmDialog({ onConfirm, onCancel, message }: { onConfirm: () => void; onCancel: () => void; message: string }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle size={18} className="text-red-600" />
          </div>
          <div>
            <h3 className="font-accent font-700 text-taam-charcoal text-sm">Silme Onayı</h3>
            <p className="font-accent text-taam-gray text-xs">{message}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel} className="btn-taam btn-taam-outline text-sm px-4 py-2 flex-1">İptal</button>
          <button onClick={onConfirm} className="btn-taam btn-taam-red text-sm px-4 py-2 flex-1">Sil</button>
        </div>
      </div>
    </div>
  );
}

// ─── Device Image Upload Field ────────────────────────────────────
function optimizeImageFile(file: File, maxDim = 900, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Dosya okunamadı.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Görsel yüklenemedi.'));
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(reader.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/webp', quality);
        resolve(dataUrl.startsWith('data:image/webp') ? dataUrl : canvas.toDataURL('image/jpeg', quality));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

function ImageUploadField({
  value,
  onChange,
  onError,
}: {
  value: string;
  onChange: (dataUrl: string) => void;
  onError?: (msg: string) => void;
}) {
  const [uploading, setUploading] = useState(false);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      onError?.('Lütfen geçerli bir görsel dosyası (PNG, JPG, WEBP) seçin.');
      return;
    }
    setUploading(true);
    try {
      if (isSupabaseConfigured) {
        const ext = file.name.split('.').pop() || 'jpg';
        const filePath = `uploads/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const { error: uploadErr } = await supabase.storage.from('images').upload(filePath, file, { upsert: true });
        if (!uploadErr) {
          const { data } = supabase.storage.from('images').getPublicUrl(filePath);
          if (data?.publicUrl) {
            onChange(data.publicUrl);
            return;
          }
        }
      }
      const optimizedDataUrl = await optimizeImageFile(file);
      onChange(optimizedDataUrl);
    } catch {
      onError?.('Görsel yüklenirken bir hata oluştu.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  return (
    <div className="md:col-span-2">
      <label className="admin-label">Ürün / Gönderi Görseli</label>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-3.5 rounded-xl border border-dashed border-gray-300 bg-taam-off-white/60">
        {value ? (
          <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200 bg-white">
            <img src={value} alt="Yüklenen görsel" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center shadow hover:bg-red-700 transition-colors"
              aria-label="Görseli kaldır"
            >
              <X size={12} />
            </button>
          </div>
        ) : (
          <div className="w-24 h-24 rounded-lg border border-gray-200 bg-white flex flex-col items-center justify-center text-taam-gray flex-shrink-0">
            <ImagePlus size={22} className="mb-1 opacity-60" />
            <span className="font-accent text-[10px] text-center px-1">Görsel Yok</span>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <label className="btn-taam btn-taam-primary text-xs px-4 py-2.5 cursor-pointer self-start inline-flex items-center gap-2">
            <Upload size={14} />
            <span>{uploading ? 'Görsel İşleniyor...' : value ? 'Görseli Değiştir (Cihazdan Seç)' : 'Cihazdan Görsel Yükle'}</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
              className="hidden"
            />
          </label>
          <span className="font-accent text-xs text-taam-gray">
            Cihazınızdan veya galerinizden fotoğraf seçerek doğrudan yükleyebilirsiniz (JPG, PNG, WEBP).
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Products Manager ────────────────────────────────────
function ProductsManager() {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Product> | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    async function load() {
      try {
        const [prods, cats] = await Promise.all([getAllProducts(), getAllCategories()]);
        setProducts(prods);
        setCategories(cats);
      } catch {
        showToast(t('admin.error'), 'error');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [t]);

  async function handleSave() {
    if (!editing) return;
    try {
      const saved = await upsertProduct(editing);
      setProducts((prev) => editing.id
        ? prev.map((p) => p.id === saved.id ? saved : p)
        : [saved, ...prev]
      );
      setEditing(null);
      showToast(t('admin.success'), 'success');
    } catch {
      showToast(t('admin.error'), 'error');
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      showToast('Ürün silindi.', 'success');
    } catch {
      showToast(t('admin.error'), 'error');
    }
    setDeleteId(null);
  }

  const emptyProduct: Partial<Product> = {
    name_tr: '', name_en: '', description_tr: '', description_en: '',
    price: 0, image_url: '', category_id: categories[0]?.id ?? '',
    sort_order: 0, is_featured: false, is_active: true, is_new: false,
    is_signature: false, is_spicy: false, is_vegetarian: false,
  };

  if (loading) return <div className="p-8 font-accent text-taam-gray">{t('admin.loading')}</div>;

  return (
    <div>
      {toast && <Toast {...toast} />}
      {deleteId && (
        <ConfirmDialog
          message={t('admin.confirmDelete')}
          onConfirm={() => handleDelete(deleteId)}
          onCancel={() => setDeleteId(null)}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-accent font-700 text-taam-charcoal text-lg">{t('admin.products')} ({products.length})</h2>
        <button
          onClick={() => setEditing(emptyProduct)}
          className="btn-taam btn-taam-primary text-xs px-4 py-2"
        >
          <Plus size={14} /> {t('admin.add')}
        </button>
      </div>

      {/* Edit Form */}
      {editing && (
        <div className="admin-card mb-6 border-taam-blue border-2">
          <h3 className="font-accent font-700 text-taam-charcoal text-sm mb-4">
            {editing.id ? t('admin.edit') : t('admin.add')} — {t('admin.products').slice(0, -2)}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {[
              { key: 'name_tr', label: t('admin.name_tr') },
              { key: 'name_en', label: t('admin.name_en') },
              { key: 'description_tr', label: t('admin.description_tr') },
              { key: 'description_en', label: t('admin.description_en') },
              { key: 'price', label: t('admin.price'), type: 'number' },
              { key: 'sort_order', label: t('admin.sort_order'), type: 'number' },
            ].map(({ key, label, type }) => (
              <div key={key} className={key.includes('description') ? 'md:col-span-2' : ''}>
                <label className="admin-label">{label}</label>
                <input
                  type={type ?? 'text'}
                  value={(editing as Record<string, unknown>)[key] as string ?? ''}
                  onChange={(e) => setEditing((prev) => ({
                    ...prev,
                    [key]: type === 'number' ? parseFloat(e.target.value) : e.target.value,
                  }))}
                  className="admin-input"
                />
              </div>
            ))}
            <div>
              <label className="admin-label">{t('admin.category')}</label>
              <select
                value={editing.category_id ?? ''}
                onChange={(e) => setEditing((prev) => ({ ...prev, category_id: e.target.value }))}
                className="admin-input"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name_tr}</option>
                ))}
              </select>
            </div>
            <ImageUploadField
              value={editing.image_url ?? ''}
              onChange={(dataUrl) => setEditing((prev) => ({ ...prev, image_url: dataUrl }))}
              onError={(msg) => showToast(msg, 'error')}
            />
          </div>

          {/* Checkboxes */}
          <div className="flex flex-wrap gap-4 mb-4">
            {[
              { key: 'is_active', label: t('admin.is_active') },
              { key: 'is_featured', label: t('admin.is_featured') },
              { key: 'is_new', label: t('admin.is_new') },
              { key: 'is_signature', label: t('admin.is_signature') },
              { key: 'is_spicy', label: t('admin.is_spicy') },
              { key: 'is_vegetarian', label: t('admin.is_vegetarian') },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(editing as Record<string, unknown>)[key] as boolean ?? false}
                  onChange={(e) => setEditing((prev) => ({ ...prev, [key]: e.target.checked }))}
                  className="w-4 h-4 rounded accent-taam-blue"
                />
                <span className="font-accent text-sm text-taam-charcoal">{label}</span>
              </label>
            ))}
          </div>

          <div className="flex gap-3">
            <button onClick={handleSave} className="btn-taam btn-taam-primary text-xs px-4 py-2">
              <Save size={14} /> {t('admin.save')}
            </button>
            <button onClick={() => setEditing(null)} className="btn-taam btn-taam-outline text-xs px-4 py-2">
              <X size={14} /> {t('admin.cancel')}
            </button>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="admin-card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[540px]">
            <thead>
              <tr className="border-b border-gray-100 bg-taam-off-white">
                <th className="text-left p-3 font-accent font-600 text-taam-gray text-xs uppercase tracking-wide">Ürün</th>
                <th className="text-left p-3 font-accent font-600 text-taam-gray text-xs uppercase tracking-wide">Kategori</th>
                <th className="text-left p-3 font-accent font-600 text-taam-gray text-xs uppercase tracking-wide">Fiyat</th>
                <th className="text-left p-3 font-accent font-600 text-taam-gray text-xs uppercase tracking-wide">Durum</th>
                <th className="text-right p-3 font-accent font-600 text-taam-gray text-xs uppercase tracking-wide">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center font-accent text-taam-gray">{t('admin.noData')}</td></tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="border-b border-gray-50 hover:bg-taam-off-white/50">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        {product.image_url && (
                          <img src={product.image_url} alt={product.name_tr} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                        )}
                        <div>
                          <div className="font-accent font-600 text-taam-charcoal">{product.name_tr}</div>
                          <div className="font-accent text-taam-gray text-xs">{product.name_en}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 font-accent text-taam-gray text-xs">{(product.category as unknown as Category)?.name_tr ?? '—'}</td>
                    <td className="p-3 font-display text-taam-blue">₺{product.price}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-accent font-600 ${product.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {product.is_active ? 'Aktif' : 'Pasif'}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => setEditing(product)}
                          className="w-8 h-8 rounded-lg bg-taam-off-white hover:bg-taam-blue hover:text-white text-taam-charcoal flex items-center justify-center transition-colors"
                          aria-label={`${product.name_tr} düzenle`}
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={() => setDeleteId(product.id)}
                          className="w-8 h-8 rounded-lg bg-taam-off-white hover:bg-red-600 hover:text-white text-taam-charcoal flex items-center justify-center transition-colors"
                          aria-label={`${product.name_tr} sil`}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Categories Manager ────────────────────────────────────
function CategoriesManager() {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Category> | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    getAllCategories().then(setCategories).finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    if (!editing) return;
    try {
      const saved = await upsertCategory(editing);
      setCategories((prev) => editing.id ? prev.map((c) => c.id === saved.id ? saved : c) : [saved, ...prev]);
      setEditing(null);
      showToast(t('admin.success'), 'success');
    } catch {
      showToast(t('admin.error'), 'error');
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      showToast('Kategori silindi.', 'success');
    } catch {
      showToast(t('admin.error'), 'error');
    }
    setDeleteId(null);
  }

  const emptyCategory: Partial<Category> = { name_tr: '', name_en: '', slug: '', sort_order: 0, is_active: true };

  if (loading) return <div className="p-8 font-accent text-taam-gray">{t('admin.loading')}</div>;

  return (
    <div>
      {toast && <Toast {...toast} />}
      {deleteId && (
        <ConfirmDialog
          message={t('admin.confirmDelete')}
          onConfirm={() => handleDelete(deleteId)}
          onCancel={() => setDeleteId(null)}
        />
      )}

      <div className="flex items-center justify-between mb-6">
        <h2 className="font-accent font-700 text-taam-charcoal text-lg">{t('admin.categories')} ({categories.length})</h2>
        <button onClick={() => setEditing(emptyCategory)} className="btn-taam btn-taam-primary text-xs px-4 py-2">
          <Plus size={14} /> {t('admin.add')}
        </button>
      </div>

      {editing && (
        <div className="admin-card mb-6 border-taam-blue border-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {[
              { key: 'name_tr', label: t('admin.name_tr') },
              { key: 'name_en', label: t('admin.name_en') },
              { key: 'slug', label: t('admin.slug') },
              { key: 'sort_order', label: t('admin.sort_order'), type: 'number' },
            ].map(({ key, label, type }) => (
              <div key={key}>
                <label className="admin-label">{label}</label>
                <input
                  type={type ?? 'text'}
                  value={(editing as Record<string, unknown>)[key] as string ?? ''}
                  onChange={(e) => setEditing((prev) => ({
                    ...prev,
                    [key]: type === 'number' ? parseInt(e.target.value) : e.target.value,
                  }))}
                  className="admin-input"
                />
              </div>
            ))}
          </div>
          <label className="flex items-center gap-2 mb-4 cursor-pointer">
            <input type="checkbox" checked={editing.is_active ?? true} onChange={(e) => setEditing((prev) => ({ ...prev, is_active: e.target.checked }))} className="w-4 h-4 rounded accent-taam-blue" />
            <span className="font-accent text-sm text-taam-charcoal">{t('admin.is_active')}</span>
          </label>
          <div className="flex gap-3">
            <button onClick={handleSave} className="btn-taam btn-taam-primary text-xs px-4 py-2"><Save size={14} /> {t('admin.save')}</button>
            <button onClick={() => setEditing(null)} className="btn-taam btn-taam-outline text-xs px-4 py-2"><X size={14} /> {t('admin.cancel')}</button>
          </div>
        </div>
      )}

      <div className="admin-card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[440px]">
            <thead>
              <tr className="border-b border-gray-100 bg-taam-off-white">
                <th className="text-left p-3 font-accent font-600 text-taam-gray text-xs uppercase tracking-wide">Kategori</th>
                <th className="text-left p-3 font-accent font-600 text-taam-gray text-xs uppercase tracking-wide">Slug</th>
                <th className="text-left p-3 font-accent font-600 text-taam-gray text-xs uppercase tracking-wide">Sıra</th>
                <th className="text-right p-3 font-accent font-600 text-taam-gray text-xs uppercase tracking-wide">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} className="border-b border-gray-50 hover:bg-taam-off-white/50">
                  <td className="p-3">
                    <div className="font-accent font-600 text-taam-charcoal">{cat.name_tr}</div>
                    <div className="font-accent text-taam-gray text-xs">{cat.name_en}</div>
                  </td>
                  <td className="p-3 font-accent text-taam-gray text-xs font-mono">{cat.slug}</td>
                  <td className="p-3 font-accent text-taam-charcoal">{cat.sort_order}</td>
                  <td className="p-3 text-right">
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => setEditing(cat)} className="w-8 h-8 rounded-lg bg-taam-off-white hover:bg-taam-blue hover:text-white text-taam-charcoal flex items-center justify-center transition-colors" aria-label={`${cat.name_tr} düzenle`}><Pencil size={13} /></button>
                      <button onClick={() => setDeleteId(cat.id)} className="w-8 h-8 rounded-lg bg-taam-off-white hover:bg-red-600 hover:text-white text-taam-charcoal flex items-center justify-center transition-colors" aria-label={`${cat.name_tr} sil`}><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Instagram Manager ────────────────────────────────────
function InstagramManager() {
  const { t } = useTranslation();
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<InstagramPost> | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    getAllInstagramPosts().then(setPosts).finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    if (!editing) return;
    try {
      const saved = await upsertInstagramPost(editing);
      setPosts((prev) => editing.id ? prev.map((p) => p.id === saved.id ? saved : p) : [saved, ...prev]);
      setEditing(null);
      showToast(t('admin.success'), 'success');
    } catch {
      showToast(t('admin.error'), 'error');
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteInstagramPost(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
      showToast('Gönderi silindi.', 'success');
    } catch {
      showToast(t('admin.error'), 'error');
    }
    setDeleteId(null);
  }

  const emptyPost: Partial<InstagramPost> = { image_url: '', instagram_url: '', caption_tr: '', caption_en: '', sort_order: 0, is_active: true };

  if (loading) return <div className="p-8 font-accent text-taam-gray">{t('admin.loading')}</div>;

  return (
    <div>
      {toast && <Toast {...toast} />}
      {deleteId && <ConfirmDialog message={t('admin.confirmDelete')} onConfirm={() => handleDelete(deleteId)} onCancel={() => setDeleteId(null)} />}

      <div className="flex items-center justify-between mb-6">
        <h2 className="font-accent font-700 text-taam-charcoal text-lg">{t('admin.instagram')} ({posts.length})</h2>
        <button onClick={() => setEditing(emptyPost)} className="btn-taam btn-taam-primary text-xs px-4 py-2"><Plus size={14} /> {t('admin.add')}</button>
      </div>

      {editing && (
        <div className="admin-card mb-6 border-taam-blue border-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <ImageUploadField
              value={editing.image_url ?? ''}
              onChange={(dataUrl) => setEditing((prev) => ({ ...prev, image_url: dataUrl }))}
              onError={(msg) => showToast(msg, 'error')}
            />
            {[
              { key: 'instagram_url', label: t('admin.instagram_url') },
              { key: 'caption_tr', label: 'Caption (TR)' },
              { key: 'caption_en', label: 'Caption (EN)' },
              { key: 'sort_order', label: t('admin.sort_order'), type: 'number' },
            ].map(({ key, label, type }) => (
              <div key={key}>
                <label className="admin-label">{label}</label>
                <input type={type ?? 'text'} value={(editing as Record<string, unknown>)[key] as string ?? ''} onChange={(e) => setEditing((prev) => ({ ...prev, [key]: type === 'number' ? parseInt(e.target.value) : e.target.value }))} className="admin-input" />
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={handleSave} className="btn-taam btn-taam-primary text-xs px-4 py-2"><Save size={14} /> {t('admin.save')}</button>
            <button onClick={() => setEditing(null)} className="btn-taam btn-taam-outline text-xs px-4 py-2"><X size={14} /> {t('admin.cancel')}</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {posts.map((post) => (
          <div key={post.id} className="relative group rounded-xl overflow-hidden aspect-square bg-taam-off-white">
            <img src={post.image_url} alt={post.caption_tr ?? ''} className="w-full h-full object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
              <button onClick={() => setEditing(post)} className="w-9 h-9 rounded-full bg-white text-taam-charcoal flex items-center justify-center"><Pencil size={14} /></button>
              <button onClick={() => setDeleteId(post.id)} className="w-9 h-9 rounded-full bg-red-600 text-white flex items-center justify-center"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Settings Manager ────────────────────────────────────
function SettingsManager() {
  const { t } = useTranslation();
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const settingFields = [
    { key: 'address', label: t('contact.address') },
    { key: 'phone', label: t('contact.phone') },
    { key: 'email', label: t('contact.email') },
    { key: 'instagram_url', label: 'Instagram URL' },
    { key: 'google_maps_url', label: 'Google Maps URL' },
    { key: 'opening_hours', label: t('contact.hours') },
    { key: 'meta_title', label: 'Meta Title' },
    { key: 'meta_description', label: 'Meta Description' },
  ];

  useEffect(() => {
    getSiteSettings().then(setSettings).finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      await Promise.all(Object.entries(settings).map(([k, v]) => updateSiteSetting(k, v)));
      showToast(t('admin.success'), 'success');
    } catch {
      showToast(t('admin.error'), 'error');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="p-8 font-accent text-taam-gray">{t('admin.loading')}</div>;

  return (
    <div>
      {toast && <Toast {...toast} />}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-accent font-700 text-taam-charcoal text-lg">{t('admin.settings')}</h2>
      </div>
      <div className="admin-card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {settingFields.map(({ key, label }) => (
            <div key={key}>
              <label className="admin-label" htmlFor={`setting-${key}`}>{label}</label>
              <input
                id={`setting-${key}`}
                type="text"
                value={settings[key] ?? ''}
                onChange={(e) => setSettings((prev) => ({ ...prev, [key]: e.target.value }))}
                className="admin-input"
              />
            </div>
          ))}
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-taam btn-taam-primary text-sm px-6 py-3 disabled:opacity-50"
        >
          <Save size={14} /> {saving ? 'Kaydediliyor...' : t('admin.save')}
        </button>
      </div>
    </div>
  );
}

// ─── ADMIN PAGE ────────────────────────────────────
export default function AdminPage() {
  const { t } = useTranslation();
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    localStorage.removeItem('taam_demo_auth');
    return sessionStorage.getItem(ADMIN_SESSION_KEY) === ADMIN_CREDENTIAL_HASH;
  });
  const [activeTab, setActiveTab] = useState<AdminTab>('products');
  const [loading, setLoading] = useState(() => isSupabaseConfigured && !isAuthenticated);

  useEffect(() => {
    if (!isSupabaseConfigured || isAuthenticated) {
      return;
    }
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setIsAuthenticated(true);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) setIsAuthenticated(true);
    });
    return () => subscription.unsubscribe();
  }, [isAuthenticated]);

  async function handleLogout() {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    localStorage.removeItem('taam_demo_auth');
    if (isSupabaseConfigured) {
      await supabase.auth.signOut().catch(() => null);
    }
    setIsAuthenticated(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-taam-off-white flex items-center justify-center">
        <div className="font-accent text-taam-gray">Yükleniyor...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm onLogin={() => setIsAuthenticated(true)} />;
  }

  const tabs: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
    { id: 'products', label: t('admin.products'), icon: <UtensilsCrossed size={16} /> },
    { id: 'categories', label: t('admin.categories'), icon: <Tag size={16} /> },
    { id: 'instagram', label: t('admin.instagram'), icon: <InstagramIcon size={16} /> },
    { id: 'settings', label: t('admin.settings'), icon: <Settings size={16} /> },
  ];

  return (
    <>
      <Helmet>
        <title>Admin Panel | TAAM Club</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-taam-off-white flex flex-col lg:flex-row">
        {/* Mobile Header & Horizontal Tab Bar */}
        <header className="lg:hidden bg-taam-charcoal text-white sticky top-0 z-40 border-b border-white/10">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-taam-blue flex items-center justify-center">
                <span className="font-display text-white text-[11px] leading-none tracking-wider">TAAM</span>
              </div>
              <div>
                <div className="font-accent font-700 text-white text-sm leading-tight">Admin</div>
                <div className="font-accent text-white/40 text-[11px] leading-tight">TAAM Club</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-accent text-xs text-white/70 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
            >
              <LogOut size={14} />
              {t('admin.logout')}
            </button>
          </div>
          <nav className="flex items-center gap-1.5 px-4 pb-3 overflow-x-auto" role="navigation" aria-label="Mobil admin navigasyon">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-accent text-xs whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-taam-blue text-white font-semibold'
                    : 'text-white/60 hover:text-white bg-white/5'
                }`}
                aria-current={activeTab === tab.id ? 'page' : undefined}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </header>

        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-60 bg-taam-charcoal flex-shrink-0 flex-col pt-6 pb-6" role="navigation" aria-label="Admin navigasyon">
          {/* Logo */}
          <div className="px-5 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-taam-blue flex items-center justify-center">
                <span className="font-display text-white text-xs leading-none tracking-wider">TAAM</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-accent font-700 text-white text-sm">Admin</span>
                </div>
                <div className="font-accent text-white/40 text-xs">TAAM Club</div>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3">
            <div className="mb-2 px-2">
              <span className="font-accent text-white/30 text-xs uppercase tracking-widest">Yönetim</span>
            </div>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 font-accent text-sm transition-all text-left ${
                  activeTab === tab.id
                    ? 'bg-taam-blue text-white'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
                aria-current={activeTab === tab.id ? 'page' : undefined}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Logout */}
          <div className="px-3">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-accent text-sm text-white/40 hover:text-white hover:bg-white/5 transition-all"
            >
              <LogOut size={16} />
              {t('admin.logout')}
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 overflow-x-hidden p-4 sm:p-6 lg:p-8" role="main">
          {/* Header */}
          <div className="mb-6 lg:mb-8">
            <div className="flex items-center gap-2 text-taam-gray font-accent text-xs uppercase tracking-widest mb-1">
              <LayoutDashboard size={12} />
              TAAM Club Admin
            </div>
            <h1 className="font-display text-taam-charcoal text-3xl sm:text-4xl leading-none">
              {tabs.find((t) => t.id === activeTab)?.label}
            </h1>
          </div>

          {/* Tab content */}
          {activeTab === 'products' && <ProductsManager />}
          {activeTab === 'categories' && <CategoriesManager />}
          {activeTab === 'instagram' && <InstagramManager />}
          {activeTab === 'settings' && <SettingsManager />}
        </main>
      </div>
    </>
  );
}
