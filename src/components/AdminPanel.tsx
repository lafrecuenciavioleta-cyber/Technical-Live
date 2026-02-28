import React from 'react';
import { PageData } from '../types';
import { Save, X, Image as ImageIcon, Type, DollarSign, List, Clock, Plus, Trash2, MessageCircle, ChevronUp, ChevronDown, LogOut, Eye, EyeOff, Layout } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AdminPanelProps {
  data: PageData;
  onSave: (newData: PageData) => void;
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ data, onSave, onClose }) => {
  const [formData, setFormData] = React.useState<PageData>(data);
  const [activeTab, setActiveTab] = React.useState('hero');
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState<string | null>(null);

  React.useEffect(() => {
    // Bloquear scroll del fondo
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'fontDisplayUrl' | 'fontSansUrl' | 'headerLogoUrl' | 'footerLogoUrl' | 'faviconUrl' | 'adminLogoUrl' | 'globalBgImage') => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(field);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${field}.${fileExt}`;
      const folder = field.includes('font') ? 'fonts' : 'branding';
      const filePath = `${folder}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      handleChange('settings', field, publicUrl);
    } catch (error: any) {
      console.error('Error uploading file:', error);
      alert(`Error al subir el archivo: ${error.message || 'Error desconocido'}\n\nAsegúrate de que el bucket "media" exista en Supabase y tenga las políticas de RLS correctas.`);
    } finally {
      setIsUploading(null);
    }
  };

  const handleChange = (section: keyof PageData, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] as any),
        [field]: value,
      },
    }));
  };

  const handleNestedChange = (section: keyof PageData, index: number, field: string, value: any) => {
    const sectionData = { ...(formData[section] as any) };
    const items = [...(sectionData.items || sectionData.tiers || sectionData.suites || sectionData.artists || sectionData.accordion)];
    items[index] = { ...items[index], [field]: value };

    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...sectionData,
        [sectionData.items ? 'items' : sectionData.tiers ? 'tiers' : sectionData.suites ? 'suites' : sectionData.artists ? 'artists' : 'accordion']: items,
      },
    }));
  };

  const addItem = (section: keyof PageData, defaultItem: any) => {
    const sectionData = { ...(formData[section] as any) };
    const key = sectionData.items ? 'items' : sectionData.tiers ? 'tiers' : sectionData.suites ? 'suites' : sectionData.artists ? 'artists' : 'accordion';
    const items = [...(sectionData[key] || []), defaultItem];

    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...sectionData,
        [key]: items,
      },
    }));
  };

  const removeItem = (section: keyof PageData, index: number) => {
    const sectionData = { ...(formData[section] as any) };
    const key = sectionData.items ? 'items' : sectionData.tiers ? 'tiers' : sectionData.suites ? 'suites' : sectionData.artists ? 'artists' : 'accordion';
    const items = (sectionData[key] || []).filter((_: any, i: number) => i !== index);

    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...sectionData,
        [key]: items,
      },
    }));
  };

  const moveItem = (section: keyof PageData, index: number, direction: 'up' | 'down') => {
    const sectionData = { ...(formData[section] as any) };
    const key = sectionData.items ? 'items' : sectionData.tiers ? 'tiers' : sectionData.suites ? 'suites' : sectionData.artists ? 'artists' : 'accordion';
    const items = [...(sectionData[key] || [])];

    if (direction === 'up' && index > 0) {
      [items[index], items[index - 1]] = [items[index - 1], items[index]];
    } else if (direction === 'down' && index < items.length - 1) {
      [items[index], items[index + 1]] = [items[index + 1], items[index]];
    }

    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...sectionData,
        [key]: items,
      },
    }));
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newOrder = [...formData.sectionOrder];
    if (direction === 'up' && index > 0) {
      [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]];
    } else if (direction === 'down' && index < newOrder.length - 1) {
      [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    }
    setFormData(prev => ({ ...prev, sectionOrder: newOrder }));
  };

  const toggleSectionVisibility = (sectionId: string) => {
    setFormData(prev => {
      const isHidden = prev.hiddenSections?.includes(sectionId);
      const newHidden = isHidden
        ? prev.hiddenSections.filter(id => id !== sectionId)
        : [...(prev.hiddenSections || []), sectionId];
      return { ...prev, hiddenSections: newHidden };
    });
  };

  const tabs = [
    { id: 'structure', label: 'Estructura' },
    { id: 'hero', label: 'Hero' },
    { id: 'welcome', label: 'Bienvenida' },
    { id: 'lineup', label: 'Line Up' },
    { id: 'experience', label: 'Experiencia' },
    { id: 'lodging', label: 'Hospedaje' },
    { id: 'caliPackage', label: 'Paquete Cali' },
    { id: 'tickets', label: 'Boletería' },
    { id: 'buy', label: 'Comprar' },
    { id: 'faqs', label: 'Preguntas' },
    { id: 'footer', label: 'Footer' },
    { id: 'settings', label: 'Configuración' },
  ];

  return (
    <div className="fixed inset-0 bg-black flex flex-col md:flex-row z-[100] font-sans overflow-hidden">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-black/60 border-b border-white/10">
        {formData.settings.adminLogoUrl ? (
          <img src={formData.settings.adminLogoUrl} alt="Logo" className="h-6 w-auto" />
        ) : (
          <h2 className="text-gold font-display font-black text-xs tracking-[0.3em] uppercase">Mundo Tay Admin</h2>
        )}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-white/60 hover:text-white"
        >
          {isSidebarOpen ? <X size={20} /> : <List size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`
        fixed md:relative inset-0 md:inset-auto z-[110] md:z-0
        w-80 bg-black md:bg-black border-r border-white/10 flex flex-col shrink-0
        transition-transform duration-300 md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-8 border-b border-white/5">
          {formData.settings.adminLogoUrl ? (
            <img src={formData.settings.adminLogoUrl} alt="Logo" className="h-10 w-auto mb-4" />
          ) : (
            <>
              <h2 className="text-gold font-display font-black text-sm tracking-[0.3em] uppercase mb-1">Admin Panel</h2>
              <p className="text-[9px] text-white/30 tracking-[0.2em] uppercase font-bold">Tay Beach 2026</p>
            </>
          )}
        </div>

        <div className="flex md:hidden items-center justify-between mb-8 pb-4 border-b border-white/10">
          <div className="text-gold font-serif text-xl tracking-widest">MENÚ</div>
          <button onClick={() => setIsSidebarOpen(false)} className="text-white/40"><X size={20} /></button>
        </div>

        <nav className="flex-1 space-y-1 md:space-y-2 overflow-y-auto pr-2 custom-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setIsSidebarOpen(false); // Cierra en mobile al elegir
              }}
              className={`w-full text-left px-5 py-3 md:py-3 rounded-full text-[10px] md:text-xs tracking-[0.2em] transition-all font-black uppercase ${activeTab === tab.id ? 'bg-gold text-white shadow-lg shadow-gold/20 scale-[1.02]' : 'text-white/40 hover:bg-white/5 hover:text-white'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Acciones de escritorio */}
        <div className="hidden md:block pt-6 border-t border-white/10 space-y-4">
          <button
            onClick={() => onSave(formData)}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-full text-xs font-bold flex items-center justify-center space-x-2 transition-all"
          >
            <Save size={16} />
            <span>GUARDAR CAMBIOS</span>
          </button>
          <button
            onClick={onClose}
            className="w-full border border-white/10 hover:bg-white/5 text-white/60 py-3 rounded-full text-xs font-bold flex items-center justify-center space-x-2 transition-all"
          >
            <X size={16} />
            <span>CERRAR</span>
          </button>
          <button
            onClick={() => supabase.auth.signOut()}
            className="w-full text-red-500/60 hover:text-red-500 py-3 rounded-full text-[10px] font-black tracking-widest flex items-center justify-center space-x-2 transition-all mt-4"
          >
            <LogOut size={14} />
            <span>CERRAR SESIÓN</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-10 bg-black pb-32 md:pb-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-serif mb-6 md:mb-8 italic text-gold/80">{tabs.find(t => t.id === activeTab)?.label}</h2>

          {activeTab === 'structure' && (
            <div className="space-y-6">
              <div className="p-6 glass rounded-xl space-y-6">
                <div className="text-gold text-[10px] tracking-widest font-bold uppercase mb-4">Orden de Secciones y Menú</div>
                <div className="space-y-4">
                  {formData.sectionOrder.map((id, idx) => (
                    <div key={id} className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg border border-white/10 group">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() => moveSection(idx, 'up')}
                            disabled={idx === 0}
                            className="p-1 hover:bg-white/10 rounded transition-colors disabled:opacity-20"
                          >
                            <ChevronUp size={14} />
                          </button>
                          <button
                            onClick={() => moveSection(idx, 'down')}
                            disabled={idx === formData.sectionOrder.length - 1}
                            className="p-1 hover:bg-white/10 rounded transition-colors disabled:opacity-20"
                          >
                            <ChevronDown size={14} />
                          </button>
                        </div>
                        <button
                          onClick={() => toggleSectionVisibility(id)}
                          className={`p-2 rounded-lg transition-all ${formData.hiddenSections?.includes(id) ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'}`}
                          title={formData.hiddenSections?.includes(id) ? 'Mostrar sección' : 'Ocultar sección'}
                        >
                          {formData.hiddenSections?.includes(id) ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>

                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <span className="text-[8px] text-white/20 font-black tracking-widest uppercase block">ID Interno</span>
                          <span className="text-xs font-display font-bold text-white/40 tracking-wider block">{id}</span>
                        </div>
                        <div className="space-y-2">
                          <span className="text-[8px] text-white/20 font-black tracking-widest uppercase block">Nombre en Menú</span>
                          <input
                            type="text"
                            value={formData.sectionLabels[id] || id}
                            onChange={(e) => {
                              const newLabels = { ...formData.sectionLabels, [id]: e.target.value };
                              setFormData(prev => ({ ...prev, sectionLabels: newLabels }));
                            }}
                            className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-xs text-white focus:border-gold focus:outline-none transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'hero' && (
            <div className="space-y-6">
              <Input label="Título Principal" value={formData.hero.title} onChange={(v) => handleChange('hero', 'title', v)} />
              <Input label="Subtítulo" value={formData.hero.subtitle} onChange={(v) => handleChange('hero', 'subtitle', v)} />
              <Input label="Fecha del Evento" value={formData.hero.date} onChange={(v) => handleChange('hero', 'date', v)} type="datetime-local" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Texto Botón CTA" value={formData.hero.ctaText} onChange={(v) => handleChange('hero', 'ctaText', v)} />
                <Select
                  label="Destino del Botón"
                  value={formData.hero.ctaUrl || '#boleteria'}
                  onChange={(v) => handleChange('hero', 'ctaUrl', v)}
                  options={[
                    ...formData.sectionOrder.map(id => ({
                      value: `#${id}`,
                      label: `Ir a: ${formData.sectionLabels[id] || id.toUpperCase()}`
                    })),
                    { value: 'custom', label: 'URL Personalizada...' }
                  ]}
                />
              </div>

              {formData.hero.ctaUrl && !formData.hero.ctaUrl.startsWith('#') && formData.hero.ctaUrl !== '#boleteria' && (
                <Input
                  label="URL Personalizada (https://...)"
                  value={formData.hero.ctaUrl}
                  onChange={(v) => handleChange('hero', 'ctaUrl', v)}
                />
              )}

              {/* Handler for "custom" selection to clear if needed or keep existing */}
              <Input label="Imagen de Fondo (URL)" value={formData.hero.bgImage} onChange={(v) => handleChange('hero', 'bgImage', v)} icon={<ImageIcon size={16} />} />
              <Input label="Video de Fondo (URL MP4 o YouTube)" value={formData.hero.videoUrl} onChange={(v) => handleChange('hero', 'videoUrl', v)} icon={<List size={16} />} />
            </div>
          )}

          {activeTab === 'welcome' && (
            <div className="space-y-10">
              <div className="space-y-6">
                <label className="text-gold text-[10px] tracking-widest font-bold uppercase">Bloque 1: Esencia</label>
                <Input label="Título 1" value={formData.welcome.title1} onChange={(v) => handleChange('welcome', 'title1', v)} />
                <TextArea label="Descripción 1" value={formData.welcome.desc1} onChange={(v) => handleChange('welcome', 'desc1', v)} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Imagen 1 (URL)" value={formData.welcome.img1} onChange={(v) => handleChange('welcome', 'img1', v)} icon={<ImageIcon size={16} />} />
                  <Input label="Video 1 (URL MP4 / YouTube - Opcional)" value={formData.welcome.video1 || ''} onChange={(v) => handleChange('welcome', 'video1', v)} icon={<List size={16} />} />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] tracking-widest text-white/40 block font-bold uppercase">Acordeón</label>
                    <button
                      onClick={() => addItem('welcome', { title: '', content: '' })}
                      className="text-gold hover:text-white transition-colors flex items-center space-x-1 text-[10px] font-bold"
                    >
                      <Plus size={14} />
                      <span>AGREGAR ITEM</span>
                    </button>
                  </div>
                  {(formData.welcome.accordion || []).map((item, idx) => (
                    <div key={idx} className="p-4 glass rounded-lg space-y-3 relative group">
                      <div className="flex justify-between items-center bg-white/5 -mx-4 -mt-4 p-3 mb-2 rounded-t-lg border-b border-white/5">
                        <div className="text-gold text-[10px] tracking-widest font-bold uppercase">ITEM {idx + 1}</div>
                        <div className="flex items-center space-x-3">
                          <button onClick={() => moveItem('welcome', idx, 'up')} disabled={idx === 0} className="text-white/40 hover:text-gold disabled:opacity-10 transition-colors"><ChevronUp size={16} /></button>
                          <button onClick={() => moveItem('welcome', idx, 'down')} disabled={idx === formData.welcome.accordion.length - 1} className="text-white/40 hover:text-gold disabled:opacity-10 transition-colors"><ChevronDown size={16} /></button>
                          <button
                            onClick={() => removeItem('welcome', idx)}
                            className="text-white/40 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      <Input label={`Título ${idx + 1}`} value={item.title} onChange={(v) => {
                        const newAcc = [...formData.welcome.accordion];
                        newAcc[idx] = { ...newAcc[idx], title: v };
                        handleChange('welcome', 'accordion', newAcc);
                      }} />
                      <TextArea label={`Contenido ${idx + 1}`} value={item.content} onChange={(v) => {
                        const newAcc = [...formData.welcome.accordion];
                        newAcc[idx] = { ...newAcc[idx], content: v };
                        handleChange('welcome', 'accordion', newAcc);
                      }} />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="Texto Botón" value={item.btnText || ''} onChange={(v) => {
                          const newAcc = [...formData.welcome.accordion];
                          newAcc[idx] = { ...newAcc[idx], btnText: v };
                          handleChange('welcome', 'accordion', newAcc);
                        }} placeholder="Ej: SABER MÁS" />
                        <Select
                          label="Destino del Botón"
                          value={item.btnUrl || ''}
                          onChange={(v: string) => {
                            const newAcc = [...formData.welcome.accordion];
                            newAcc[idx] = { ...newAcc[idx], btnUrl: v };
                            handleChange('welcome', 'accordion', newAcc);
                          }}
                          options={[
                            { value: '', label: 'Sin enlace' },
                            ...formData.sectionOrder.map(id => ({
                              value: `#${id}`,
                              label: `Ir a: ${formData.sectionLabels[id] || id.toUpperCase()}`
                            })),
                            { value: 'custom', label: 'URL Personalizada...' }
                          ]}
                        />
                      </div>
                      {item.btnUrl && !item.btnUrl.startsWith('#') && item.btnUrl !== '' && (
                        <Input label="URL Personalizada (https://...)" value={item.btnUrl} onChange={(v) => {
                          const newAcc = [...formData.welcome.accordion];
                          newAcc[idx] = { ...newAcc[idx], btnUrl: v };
                          handleChange('welcome', 'accordion', newAcc);
                        }} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6 pt-10 border-t border-white/10">
                <label className="text-gold text-[10px] tracking-widest font-bold uppercase">Bloque 2: Historia</label>
                <Input label="Etiqueta (Ej: HISTORIA)" value={formData.welcome.subtitle2} onChange={(v) => handleChange('welcome', 'subtitle2', v)} />
                <Input label="Título 2" value={formData.welcome.title2} onChange={(v) => handleChange('welcome', 'title2', v)} />
                <TextArea label="Descripción 2" value={formData.welcome.desc2} onChange={(v) => handleChange('welcome', 'desc2', v)} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Texto Botón 2" value={formData.welcome.btnText2} onChange={(v) => handleChange('welcome', 'btnText2', v)} />
                  <Select
                    label="Destino del Botón"
                    value={formData.welcome.btnUrl2 || '#'}
                    onChange={(v) => handleChange('welcome', 'btnUrl2', v)}
                    options={[
                      ...formData.sectionOrder.map(id => ({
                        value: `#${id}`,
                        label: `Ir a: ${formData.sectionLabels[id] || id.toUpperCase()}`
                      })),
                      { value: 'custom', label: 'URL Personalizada...' }
                    ]}
                  />
                </div>
                {formData.welcome.btnUrl2 && !formData.welcome.btnUrl2.startsWith('#') && (
                  <Input
                    label="URL Personalizada (https://...)"
                    value={formData.welcome.btnUrl2}
                    onChange={(v) => handleChange('welcome', 'btnUrl2', v)}
                  />
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Imagen 2 (URL)" value={formData.welcome.img2} onChange={(v) => handleChange('welcome', 'img2', v)} icon={<ImageIcon size={16} />} />
                  <Input label="Video 2 (URL MP4 / YouTube - Opcional)" value={formData.welcome.video2 || ''} onChange={(v) => handleChange('welcome', 'video2', v)} icon={<List size={16} />} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'lineup' && (
            <div className="space-y-10">
              <Input label="Título" value={formData.lineup.title} onChange={(v) => handleChange('lineup', 'title', v)} />
              <Input label="Subtítulo" value={formData.lineup.subtitle} onChange={(v) => handleChange('lineup', 'subtitle', v)} />
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <label className="text-gold text-[10px] tracking-widest font-bold uppercase">Artistas</label>
                  <button
                    onClick={() => addItem('lineup', { name: '', genre: '', time: '', img: '' })}
                    className="text-gold hover:text-white transition-colors flex items-center space-x-1 text-[10px] font-bold"
                  >
                    <Plus size={14} />
                    <span>AGREGAR ARTISTA</span>
                  </button>
                </div>
                {(formData.lineup.artists || []).map((artist, idx) => (
                  <div key={idx} className="p-6 glass rounded-xl space-y-4 relative group">
                    <div className="flex justify-between items-center bg-white/5 -mx-6 -mt-6 p-4 mb-2 rounded-t-xl border-b border-white/5">
                      <div className="text-gold text-[10px] tracking-widest font-bold uppercase">ARTISTA {idx + 1}</div>
                      <div className="flex items-center space-x-3">
                        <button onClick={() => moveItem('lineup', idx, 'up')} disabled={idx === 0} className="text-white/40 hover:text-gold disabled:opacity-10 transition-colors"><ChevronUp size={18} /></button>
                        <button onClick={() => moveItem('lineup', idx, 'down')} disabled={idx === formData.lineup.artists.length - 1} className="text-white/40 hover:text-gold disabled:opacity-10 transition-colors"><ChevronDown size={18} /></button>
                        <button
                          onClick={() => removeItem('lineup', idx)}
                          className="text-white/40 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input label="Nombre" value={artist.name} onChange={(v) => {
                        const newArtists = [...formData.lineup.artists];
                        newArtists[idx] = { ...newArtists[idx], name: v };
                        handleChange('lineup', 'artists', newArtists);
                      }} />
                      <Input label="Género" value={artist.genre} onChange={(v) => {
                        const newArtists = [...formData.lineup.artists];
                        newArtists[idx] = { ...newArtists[idx], genre: v };
                        handleChange('lineup', 'artists', newArtists);
                      }} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input label="Horario" value={artist.time} onChange={(v) => {
                        const newArtists = [...formData.lineup.artists];
                        newArtists[idx] = { ...newArtists[idx], time: v };
                        handleChange('lineup', 'artists', newArtists);
                      }} icon={<Clock size={14} />} />
                      <Input label="Imagen (URL)" value={artist.img} onChange={(v) => {
                        const newArtists = [...formData.lineup.artists];
                        newArtists[idx] = { ...newArtists[idx], img: v };
                        handleChange('lineup', 'artists', newArtists);
                      }} icon={<ImageIcon size={14} />} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'experience' && (
            <div className="space-y-10">
              <div className="flex justify-between items-center">
                <Input label="Título de Sección" value={formData.experience.title} onChange={(v) => handleChange('experience', 'title', v)} />
                <button
                  onClick={() => addItem('experience', { title: '', desc: '', img: '', duration: '' })}
                  className="text-gold hover:text-white transition-colors flex items-center space-x-1 text-[10px] font-bold"
                >
                  <Plus size={14} />
                  <span>AGREGAR EXPERIENCIA</span>
                </button>
              </div>
              <div className="grid grid-cols-1 gap-8">
                {(formData.experience.items || []).map((item, idx) => (
                  <div key={idx} className="p-6 glass rounded-xl space-y-4 relative group">
                    <div className="flex justify-between items-center bg-white/5 -mx-6 -mt-6 p-4 mb-2 rounded-t-xl border-b border-white/5">
                      <div className="text-gold text-[10px] tracking-widest font-bold uppercase">EXPERIENCIA {idx + 1}</div>
                      <div className="flex items-center space-x-3">
                        <button onClick={() => moveItem('experience', idx, 'up')} disabled={idx === 0} className="text-white/40 hover:text-gold disabled:opacity-10 transition-colors"><ChevronUp size={18} /></button>
                        <button onClick={() => moveItem('experience', idx, 'down')} disabled={idx === formData.experience.items.length - 1} className="text-white/40 hover:text-gold disabled:opacity-10 transition-colors"><ChevronDown size={18} /></button>
                        <button
                          onClick={() => removeItem('experience', idx)}
                          className="text-white/40 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input label="Título" value={item.title} onChange={(v) => handleNestedChange('experience', idx, 'title', v)} />
                      <Input label="Duración" value={item.duration || ''} onChange={(v) => handleNestedChange('experience', idx, 'duration', v)} />
                    </div>
                    <Input label="Descripción" value={item.desc} onChange={(v) => handleNestedChange('experience', idx, 'desc', v)} />
                    <Input label="Imagen (URL)" value={item.img} onChange={(v) => handleNestedChange('experience', idx, 'img', v)} icon={<ImageIcon size={16} />} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'lodging' && (
            <div className="space-y-10">
              <Input label="Título" value={formData.lodging.title} onChange={(v) => handleChange('lodging', 'title', v)} />
              <Input label="Etiqueta Superior" value={formData.lodging.subtitle} onChange={(v) => handleChange('lodging', 'subtitle', v)} />
              <TextArea label="Descripción" value={formData.lodging.desc} onChange={(v) => handleChange('lodging', 'desc', v)} />
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] tracking-widest text-white/40 block font-bold uppercase">GESTIÓN DE SUITES</label>
                  <button
                    onClick={() => addItem('lodging', { name: '', capacity: '', beds: '', space: '', highlight: '', img: '' })}
                    className="text-gold hover:text-white transition-colors flex items-center space-x-1 text-[10px] font-bold"
                  >
                    <Plus size={14} />
                    <span>AGREGAR SUITE</span>
                  </button>
                </div>
                {(formData.lodging.suites || []).map((suite, idx) => (
                  <div key={idx} className="p-6 glass rounded-xl space-y-4 relative group">
                    <div className="flex justify-between items-center bg-white/5 -mx-6 -mt-6 p-4 mb-2 rounded-t-xl border-b border-white/5">
                      <div className="text-gold text-[10px] tracking-widest font-bold uppercase">SUITE {idx + 1}</div>
                      <div className="flex items-center space-x-3">
                        <button onClick={() => moveItem('lodging', idx, 'up')} disabled={idx === 0} className="text-white/40 hover:text-gold disabled:opacity-10 transition-colors"><ChevronUp size={18} /></button>
                        <button onClick={() => moveItem('lodging', idx, 'down')} disabled={idx === formData.lodging.suites.length - 1} className="text-white/40 hover:text-gold disabled:opacity-10 transition-colors"><ChevronDown size={18} /></button>
                        <button
                          onClick={() => removeItem('lodging', idx)}
                          className="text-white/40 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input label="Nombre" value={suite.name} onChange={(v) => {
                        const newSuites = [...formData.lodging.suites];
                        newSuites[idx] = { ...newSuites[idx], name: v };
                        handleChange('lodging', 'suites', newSuites);
                      }} />
                      <Input label="Destacado" value={suite.highlight} onChange={(v) => {
                        const newSuites = [...formData.lodging.suites];
                        newSuites[idx] = { ...newSuites[idx], highlight: v };
                        handleChange('lodging', 'suites', newSuites);
                      }} />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <Input label="Capacidad" value={suite.capacity} onChange={(v) => {
                        const newSuites = [...formData.lodging.suites];
                        newSuites[idx] = { ...newSuites[idx], capacity: v };
                        handleChange('lodging', 'suites', newSuites);
                      }} />
                      <Input label="Espacio" value={suite.space} onChange={(v) => {
                        const newSuites = [...formData.lodging.suites];
                        newSuites[idx] = { ...newSuites[idx], space: v };
                        handleChange('lodging', 'suites', newSuites);
                      }} />
                      <Input label="Camas" value={suite.beds} onChange={(v) => {
                        const newSuites = [...formData.lodging.suites];
                        newSuites[idx] = { ...newSuites[idx], beds: v };
                        handleChange('lodging', 'suites', newSuites);
                      }} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input label="Texto Botón" value={suite.btnText || ''} onChange={(v) => {
                        const newSuites = [...formData.lodging.suites];
                        newSuites[idx] = { ...newSuites[idx], btnText: v };
                        handleChange('lodging', 'suites', newSuites);
                      }} />
                      <Input label="URL Redirección" value={suite.btnUrl || ''} onChange={(v) => {
                        const newSuites = [...formData.lodging.suites];
                        newSuites[idx] = { ...newSuites[idx], btnUrl: v };
                        handleChange('lodging', 'suites', newSuites);
                      }} />
                    </div>
                    <Input label="Imagen Principal (URL)" value={suite.img} onChange={(v) => {
                      const newSuites = [...formData.lodging.suites];
                      newSuites[idx] = { ...newSuites[idx], img: v };
                      handleChange('lodging', 'suites', newSuites);
                    }} icon={<ImageIcon size={16} />} />

                    <div className="space-y-4 pt-4 border-t border-white/5">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                        <h1 className="text-2xl md:text-3xl font-display font-black tracking-tighter uppercase text-white drop-shadow-sm flex items-center gap-3">
                          <span className="w-1.5 h-8 bg-gold rounded-full"></span>
                          {tabs.find(t => t.id === activeTab)?.label}
                        </h1>
                        <button
                          onClick={() => {
                            const newSuites = [...formData.lodging.suites];
                            const gallery = [...(newSuites[idx].gallery || [])];
                            gallery.push('https://');
                            newSuites[idx] = { ...newSuites[idx], gallery };
                            handleChange('lodging', 'suites', newSuites);
                          }}
                          className="text-[8px] tracking-widest font-black text-gold hover:text-white transition-colors"
                        >
                          + AÑADIR FOTO
                        </button>
                      </div>
                      <div className="space-y-2">
                        {(suite.gallery || []).map((photo, pIdx) => (
                          <div key={pIdx} className="flex items-center space-x-2">
                            <div className="flex-1">
                              <Input
                                label=""
                                placeholder="URL de la imagen"
                                value={photo}
                                onChange={(v) => {
                                  const newSuites = [...formData.lodging.suites];
                                  const gallery = [...(newSuites[idx].gallery || [])];
                                  gallery[pIdx] = v;
                                  newSuites[idx] = { ...newSuites[idx], gallery };
                                  handleChange('lodging', 'suites', newSuites);
                                }}
                              />
                            </div>
                            <button
                              onClick={() => {
                                const newSuites = [...formData.lodging.suites];
                                const gallery = (newSuites[idx].gallery || []).filter((_, i) => i !== pIdx);
                                newSuites[idx] = { ...newSuites[idx], gallery };
                                handleChange('lodging', 'suites', newSuites);
                              }}
                              className="p-2 text-white/20 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'caliPackage' && (
            <div className="space-y-10">
              <Input label="Título" value={formData.caliPackage.title} onChange={(v: string) => handleChange('caliPackage', 'title', v)} />
              <TextArea label="Descripción" value={formData.caliPackage.desc} onChange={(v: string) => handleChange('caliPackage', 'desc', v)} />
              <Input label="Icono (Lucide)" value={formData.caliPackage.icon || 'Plane'} onChange={(v: string) => handleChange('caliPackage', 'icon', v)} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Texto Botón" value={formData.caliPackage.btnText || ''} onChange={(v: string) => handleChange('caliPackage', 'btnText', v)} />
                <Select
                  label="Destino del Botón"
                  value={formData.caliPackage.btnUrl || '#'}
                  onChange={(v: string) => handleChange('caliPackage', 'btnUrl', v)}
                  options={[
                    ...formData.sectionOrder.map(id => ({
                      value: `#${id}`,
                      label: `Ir a: ${formData.sectionLabels[id] || id.toUpperCase()}`
                    })),
                    { value: 'custom', label: 'URL Personalizada...' }
                  ]}
                />
              </div>
              {formData.caliPackage.btnUrl && !formData.caliPackage.btnUrl.startsWith('#') && (
                <Input
                  label="URL Personalizada (https://...)"
                  value={formData.caliPackage.btnUrl}
                  onChange={(v: string) => handleChange('caliPackage', 'btnUrl', v)}
                />
              )}
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] tracking-widest text-white/40 block font-bold uppercase">Beneficios</label>
                  <button
                    onClick={() => addItem('caliPackage', { title: '', desc: '' })}
                    className="text-gold hover:text-white transition-colors flex items-center space-x-1 text-[10px] font-bold"
                  >
                    <Plus size={14} />
                    <span>AGREGAR BENEFICIO</span>
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {(formData.caliPackage.items || []).map((item, idx) => (
                    <div key={idx} className="p-4 glass rounded-lg space-y-3 relative group">
                      <div className="flex justify-between items-center bg-white/5 -mx-4 -mt-4 p-3 mb-2 rounded-t-lg border-b border-white/5">
                        <div className="text-gold text-[8px] tracking-widest font-bold uppercase">BENEFICIO {idx + 1}</div>
                        <div className="flex items-center space-x-2">
                          <button onClick={() => moveItem('caliPackage', idx, 'up')} disabled={idx === 0} className="text-white/40 hover:text-gold disabled:opacity-10 transition-colors"><ChevronUp size={14} /></button>
                          <button onClick={() => moveItem('caliPackage', idx, 'down')} disabled={idx === formData.caliPackage.items.length - 1} className="text-white/40 hover:text-gold disabled:opacity-10 transition-colors"><ChevronDown size={14} /></button>
                          <button
                            onClick={() => removeItem('caliPackage', idx)}
                            className="text-white/40 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      <Input label="Beneficio" value={item.title} onChange={(v) => {
                        const newItems = [...formData.caliPackage.items];
                        newItems[idx] = { ...newItems[idx], title: v };
                        handleChange('caliPackage', 'items', newItems);
                      }} />
                      <Input label="Detalle" value={item.desc} onChange={(v) => {
                        const newItems = [...formData.caliPackage.items];
                        newItems[idx] = { ...newItems[idx], desc: v };
                        handleChange('caliPackage', 'items', newItems);
                      }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tickets' && (
            <div className="space-y-10">
              <Input label="Título" value={formData.tickets.title} onChange={(v) => handleChange('tickets', 'title', v)} />
              <Input label="Subtítulo" value={formData.tickets.subtitle} onChange={(v) => handleChange('tickets', 'subtitle', v)} />
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] tracking-widest text-white/40 block font-bold uppercase">Tiers de Boletería</label>
                  <button
                    onClick={() => addItem('tickets', { name: '', price: '', features: [], recommended: false, bgImage: '' })}
                    className="text-gold hover:text-white transition-colors flex items-center space-x-1 text-[10px] font-bold"
                  >
                    <Plus size={14} />
                    <span>AGREGAR TIER</span>
                  </button>
                </div>
                {(formData.tickets.tiers || []).map((tier, idx) => (
                  <div key={idx} className="p-6 glass rounded-xl space-y-4 relative group">
                    <div className="flex justify-between items-center bg-white/5 -mx-6 -mt-6 p-4 mb-2 rounded-t-xl border-b border-white/5">
                      <div className="text-gold text-[10px] tracking-widest font-bold uppercase">TIER {idx + 1}</div>
                      <div className="flex items-center space-x-3">
                        <button onClick={() => moveItem('tickets', idx, 'up')} disabled={idx === 0} className="text-white/40 hover:text-gold disabled:opacity-10 transition-colors"><ChevronUp size={18} /></button>
                        <button onClick={() => moveItem('tickets', idx, 'down')} disabled={idx === formData.tickets.tiers.length - 1} className="text-white/40 hover:text-gold disabled:opacity-10 transition-colors"><ChevronDown size={18} /></button>
                        <button
                          onClick={() => removeItem('tickets', idx)}
                          className="text-white/40 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-end items-center">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!tier.recommended}
                          onChange={(e) => {
                            const newTiers = formData.tickets.tiers.map((t, i) => ({ ...t, recommended: i === idx ? e.target.checked : false }));
                            handleChange('tickets', 'tiers', newTiers);
                          }}
                          className="accent-gold"
                        />
                        <span className="text-[10px] font-display font-bold tracking-widest uppercase">Recomendado</span>
                      </label>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input label="Nombre" value={tier.name} onChange={(v) => {
                        const newTiers = [...formData.tickets.tiers];
                        newTiers[idx] = { ...newTiers[idx], name: v };
                        handleChange('tickets', 'tiers', newTiers);
                      }} />
                      <Input label="Precio" value={tier.price} onChange={(v) => {
                        const newTiers = [...formData.tickets.tiers];
                        newTiers[idx] = { ...newTiers[idx], price: v };
                        handleChange('tickets', 'tiers', newTiers);
                      }} icon={<DollarSign size={14} />} />
                    </div>
                    <Input label="Imagen de Fondo (URL)" value={tier.bgImage || ''} onChange={(v) => {
                      const newTiers = [...formData.tickets.tiers];
                      newTiers[idx] = { ...newTiers[idx], bgImage: v };
                      handleChange('tickets', 'tiers', newTiers);
                    }} icon={<ImageIcon size={14} />} />
                    <TextArea label="Características (una por línea)" value={tier.features.join('\n')} onChange={(v) => {
                      const newTiers = [...formData.tickets.tiers];
                      newTiers[idx] = { ...newTiers[idx], features: v.split('\n').filter(Boolean) };
                      handleChange('tickets', 'tiers', newTiers);
                    }} />
                    <Input label="Texto del Botón" value={tier.btnText || 'COMPRAR AHORA'} onChange={(v: string) => {
                      const newTiers = [...formData.tickets.tiers];
                      newTiers[idx] = { ...newTiers[idx], btnText: v };
                      handleChange('tickets', 'tiers', newTiers);
                    }} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Select
                        label="Destino del Botón"
                        value={tier.btnUrl || '#buy'}
                        onChange={(v: string) => {
                          const newTiers = [...formData.tickets.tiers];
                          newTiers[idx] = { ...newTiers[idx], btnUrl: v };
                          handleChange('tickets', 'tiers', newTiers);
                        }}
                        options={[
                          ...formData.sectionOrder.map(id => ({
                            value: `#${id}`,
                            label: `Ir a: ${formData.sectionLabels[id] || id.toUpperCase()}`
                          })),
                          { value: 'custom', label: 'URL Personalizada...' }
                        ]}
                      />
                      {tier.btnUrl && !tier.btnUrl.startsWith('#') && tier.btnUrl !== '#buy' && (
                        <Input
                          label="URL Personalizada (https://...)"
                          value={tier.btnUrl}
                          onChange={(v: string) => {
                            const newTiers = [...formData.tickets.tiers];
                            newTiers[idx] = { ...newTiers[idx], btnUrl: v };
                            handleChange('tickets', 'tiers', newTiers);
                          }}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'buy' && (
            <div className="space-y-10">
              <Input label="Título de la Sección" value={formData.buy.title} onChange={(v) => handleChange('buy', 'title', v)} />
              <Input label="Descripción Corta" value={formData.buy.description} onChange={(v) => handleChange('buy', 'description', v)} />
              <div className="p-6 glass rounded-xl space-y-4">
                <div className="text-gold text-[10px] tracking-widest font-bold uppercase">Widget FourVenues</div>
                <Input
                  label="URL del Script (Iframe)"
                  value={formData.buy.widgetUrl}
                  onChange={(v) => handleChange('buy', 'widgetUrl', v)}
                  placeholder="https://www.fourvenues.com/assets/iframe/..."
                />
                <p className="text-[10px] text-white/30 italic">
                  * Pega aquí el enlace de FourVenues que termina en un código de 4 dígitos.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'faqs' && (
            <div className="space-y-10">
              <Input label="Título" value={formData.faqs.title} onChange={(v) => handleChange('faqs', 'title', v)} />
              <Input label="Subtítulo" value={formData.faqs.subtitle} onChange={(v) => handleChange('faqs', 'subtitle', v)} />
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <label className="text-gold text-[10px] tracking-widest font-bold uppercase">Preguntas Frecuentes</label>
                  <button
                    onClick={() => addItem('faqs', { question: '', answer: '' })}
                    className="text-gold hover:text-white transition-colors flex items-center space-x-1 text-[10px] font-bold"
                  >
                    <Plus size={14} />
                    <span>AGREGAR PREGUNTA</span>
                  </button>
                </div>
                {(formData.faqs.items || []).map((item, idx) => (
                  <div key={idx} className="p-6 glass rounded-xl space-y-4 relative group">
                    <div className="flex justify-between items-center bg-white/5 -mx-6 -mt-6 p-4 mb-2 rounded-t-xl border-b border-white/5">
                      <div className="text-gold text-[10px] tracking-widest font-bold uppercase">PREGUNTA {idx + 1}</div>
                      <div className="flex items-center space-x-3">
                        <button onClick={() => moveItem('faqs', idx, 'up')} disabled={idx === 0} className="text-white/40 hover:text-gold disabled:opacity-10 transition-colors"><ChevronUp size={18} /></button>
                        <button onClick={() => moveItem('faqs', idx, 'down')} disabled={idx === formData.faqs.items.length - 1} className="text-white/40 hover:text-gold disabled:opacity-10 transition-colors"><ChevronDown size={18} /></button>
                        <button
                          onClick={() => removeItem('faqs', idx)}
                          className="text-white/40 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    <Input label="Pregunta" value={item.question} onChange={(v) => {
                      const newItems = [...formData.faqs.items];
                      newItems[idx] = { ...newItems[idx], question: v };
                      handleChange('faqs', 'items', newItems);
                    }} />
                    <TextArea label="Respuesta" value={item.answer} onChange={(v) => {
                      const newItems = [...formData.faqs.items];
                      newItems[idx] = { ...newItems[idx], answer: v };
                      handleChange('faqs', 'items', newItems);
                    }} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'footer' && (
            <div className="space-y-6">
              <TextArea label="Descripción Footer" value={formData.footer.description} onChange={(v) => handleChange('footer', 'description', v)} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Dirección / Ubicación" value={formData.footer.address} onChange={(v) => handleChange('footer', 'address', v)} />
                <Input label="Email de Contacto" value={formData.footer.email} onChange={(v) => handleChange('footer', 'email', v)} />
                <Input label="Teléfono / WhatsApp" value={formData.footer.phone} onChange={(v) => handleChange('footer', 'phone', v)} />
              </div>
              <div className="pt-4 border-t border-white/5">
                <div className="text-gold text-[10px] tracking-widest font-bold uppercase mb-6">Redes Sociales</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Input label="Instagram" value={formData.footer.social.instagram} onChange={(v) => {
                    handleChange('footer', 'social', { ...formData.footer.social, instagram: v });
                  }} />
                  <Input label="Facebook" value={formData.footer.social.facebook} onChange={(v) => {
                    handleChange('footer', 'social', { ...formData.footer.social, facebook: v });
                  }} />
                  <Input label="Twitter" value={formData.footer.social.twitter} onChange={(v) => {
                    handleChange('footer', 'social', { ...formData.footer.social, twitter: v });
                  }} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-8">
              {/* 1. Información General */}
              <div className="p-8 glass rounded-2xl space-y-6 border border-white/5">
                <div className="flex items-center space-x-3 border-b border-white/5 pb-4 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-gold/20 flex items-center justify-center text-gold">
                    <Type size={18} />
                  </div>
                  <h3 className="text-white font-archivo font-black tracking-tighter text-lg italic uppercase">Información General</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <Input
                      label="Nombre del Sitio (Pestaña del Navegador)"
                      value={formData.settings.siteName}
                      onChange={(v) => handleChange('settings', 'siteName', v)}
                      placeholder="Ej: Technical Live 2026"
                      icon={<Type size={14} />}
                    />
                    <Input
                      label="Color de Acento (Principal)"
                      value={formData.settings.accentColor}
                      onChange={(v) => handleChange('settings', 'accentColor', v)}
                      type="color"
                    />
                  </div>
                  <div className="space-y-6">
                    <Input
                      label="Texto del Menú Pill (Fijo)"
                      value={formData.settings.navBrandText}
                      onChange={(v) => handleChange('settings', 'navBrandText', v)}
                      placeholder="Ej: TAY BEACH 2026"
                      icon={<Type size={14} />}
                    />
                    <Input
                      label="WhatsApp (Ej: 57300...)"
                      value={formData.settings.whatsappNumber}
                      onChange={(v) => handleChange('settings', 'whatsappNumber', v)}
                      placeholder="Número sin el +"
                      icon={<MessageCircle size={14} />}
                    />
                  </div>
                </div>
              </div>

              {/* 2. Identidad Visual (Logos) */}
              <div className="p-8 glass rounded-2xl space-y-8 border border-white/5">
                <div className="flex items-center space-x-3 border-b border-white/5 pb-4 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-gold/20 flex items-center justify-center text-gold">
                    <ImageIcon size={18} />
                  </div>
                  <h3 className="text-white font-archivo font-black tracking-tighter text-lg italic uppercase">Identidad Visual (Logos)</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  {/* Navegación y Tamaños */}
                  <div className="space-y-6 p-6 bg-white/5 rounded-xl border border-white/5">
                    <h4 className="text-gold text-[10px] tracking-widest font-bold uppercase mb-4">Logo Navegación (Header)</h4>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <Input
                        label="Tamaño Desk (px)"
                        value={formData.settings.logoSize}
                        onChange={(v: string) => handleChange('settings', 'logoSize', parseInt(v) || 0)}
                        type="number"
                      />
                      <Input
                        label="Tamaño Móvil (px)"
                        value={formData.settings.mobileLogoSize}
                        onChange={(v: string) => handleChange('settings', 'mobileLogoSize', parseInt(v) || 0)}
                        type="number"
                      />
                    </div>
                    <FileUpload
                      label="Subir Logo Principal"
                      url={formData.settings.headerLogoUrl}
                      onFileSelect={(e: any) => handleFileUpload(e, 'headerLogoUrl')}
                      isUploading={isUploading === 'headerLogoUrl'}
                      onClear={() => handleChange('settings', 'headerLogoUrl', '')}
                      accept="image/*"
                      placeholder="Recomendado: PNG Transparente"
                    />
                  </div>

                  {/* Pestaña Navegador (Favicon) */}
                  <div className="space-y-6 p-6 bg-white/5 rounded-xl border border-white/5">
                    <h4 className="text-gold text-[10px] tracking-widest font-bold uppercase mb-4">Icono Pestaña (Favicon)</h4>
                    <FileUpload
                      label="Subir Favicon"
                      url={formData.settings.faviconUrl}
                      onFileSelect={(e: any) => handleFileUpload(e, 'faviconUrl')}
                      isUploading={isUploading === 'faviconUrl'}
                      onClear={() => handleChange('settings', 'faviconUrl', '')}
                      accept="image/*"
                      placeholder="Icono cuadrado (PNG/ICO)"
                    />
                  </div>

                  {/* Logo Footer */}
                  <div className="space-y-6 p-6 bg-white/5 rounded-xl border border-white/5">
                    <h4 className="text-gold text-[10px] tracking-widest font-bold uppercase mb-4">Logo del Footer</h4>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <Input
                        label="Tamaño Desk (px)"
                        value={formData.settings.footerLogoSize}
                        onChange={(v: string) => handleChange('settings', 'footerLogoSize', parseInt(v) || 0)}
                        type="number"
                      />
                      <Input
                        label="Tamaño Móvil (px)"
                        value={formData.settings.footerMobileLogoSize}
                        onChange={(v: string) => handleChange('settings', 'footerMobileLogoSize', parseInt(v) || 0)}
                        type="number"
                      />
                    </div>
                    <FileUpload
                      label="Subir Logo Footer"
                      url={formData.settings.footerLogoUrl}
                      onFileSelect={(e: any) => handleFileUpload(e, 'footerLogoUrl')}
                      isUploading={isUploading === 'footerLogoUrl'}
                      onClear={() => handleChange('settings', 'footerLogoUrl', '')}
                      accept="image/*"
                      placeholder="Si queda en blanco usa el principal"
                    />
                  </div>

                  {/* Logo Panel Admin */}
                  <div className="space-y-6 p-6 bg-white/5 rounded-xl border border-white/5">
                    <h4 className="text-gold text-[10px] tracking-widest font-bold uppercase mb-4">Logo Admin Panel</h4>
                    <FileUpload
                      label="Subir Logo Administrador"
                      url={formData.settings.adminLogoUrl}
                      onFileSelect={(e: any) => handleFileUpload(e, 'adminLogoUrl')}
                      isUploading={isUploading === 'adminLogoUrl'}
                      onClear={() => handleChange('settings', 'adminLogoUrl', '')}
                      accept="image/*"
                      placeholder="Aparece en la barra lateral"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Estética & Pantallas */}
              <div className="p-8 glass rounded-2xl space-y-8 border border-white/5">
                <div className="flex items-center space-x-3 border-b border-white/5 pb-4 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-gold/20 flex items-center justify-center text-gold">
                    <Layout size={18} />
                  </div>
                  <h3 className="text-white font-archivo font-black tracking-tighter text-lg italic uppercase">Estética & Pantallas</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {/* Carga */}
                  <div className="space-y-6">
                    <h4 className="text-gold text-[10px] tracking-widest font-bold uppercase">Pantalla de Carga</h4>
                    <Input
                      label="Texto de Carga"
                      value={formData.settings.loadingText}
                      onChange={(v) => handleChange('settings', 'loadingText', v)}
                      placeholder="Ej: CARGANDO..."
                    />
                    <Input
                      label="Color del Cargador"
                      value={formData.settings.loadingColor}
                      onChange={(v) => handleChange('settings', 'loadingColor', v)}
                      type="color"
                    />
                  </div>

                  {/* Fondo */}
                  <div className="space-y-6">
                    <h4 className="text-gold text-[10px] tracking-widest font-bold uppercase">Fondo Global</h4>
                    <Select
                      label="Tipo de Fondo"
                      value={formData.settings.globalBgType || 'blurred'}
                      onChange={(v: string) => handleChange('settings', 'globalBgType', v)}
                      options={[
                        { value: 'blurred', label: 'Efecto Cristal (Portada)' },
                        { value: 'image', label: 'Imagen Personalizada' },
                        { value: 'color', label: 'Color Sólido' }
                      ]}
                    />
                    {formData.settings.globalBgType === 'color' && (
                      <Input
                        label="Color de Fondo"
                        value={formData.settings.globalBgColor || '#000000'}
                        onChange={(v: string) => handleChange('settings', 'globalBgColor', v)}
                        type="color"
                      />
                    )}
                    {formData.settings.globalBgType === 'image' && (
                      <FileUpload
                        label="Subir Imagen de Fondo"
                        url={formData.settings.globalBgImage}
                        onFileSelect={(e: any) => handleFileUpload(e, 'globalBgImage')}
                        isUploading={isUploading === 'globalBgImage'}
                        onClear={() => handleChange('settings', 'globalBgImage', '')}
                        accept="image/*"
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6 glass rounded-xl space-y-6">
                <div className="text-gold text-[10px] tracking-widest font-bold uppercase">Contacto</div>
                <Input
                  label="Número de WhatsApp (Sin +, ej: 57300...)"
                  value={formData.settings.whatsappNumber}
                  onChange={(v: string) => handleChange('settings', 'whatsappNumber', v)}
                  icon={<MessageCircle size={16} />}
                />
              </div>

              <div className="p-6 glass rounded-xl space-y-6">
                <div className="text-gold text-[10px] tracking-widest font-bold uppercase">Tipografía (Fuentes Personalizadas)</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Input
                      label="Fuente Display (Nombre)"
                      value={formData.settings.fontDisplay}
                      onChange={(v: string) => handleChange('settings', 'fontDisplay', v)}
                      placeholder="Ej: Space Grotesk"
                    />
                    <FileUpload
                      label="Archivo de Fuente Display"
                      url={formData.settings.fontDisplayUrl}
                      onFileSelect={(e) => handleFileUpload(e, 'fontDisplayUrl')}
                      isUploading={isUploading === 'fontDisplayUrl'}
                      onClear={() => handleChange('settings', 'fontDisplayUrl', '')}
                    />
                  </div>
                  <div className="space-y-4">
                    <Input
                      label="Fuente Sans (Nombre)"
                      value={formData.settings.fontSans}
                      onChange={(v: string) => handleChange('settings', 'fontSans', v)}
                      placeholder="Ej: Inter"
                    />
                    <FileUpload
                      label="Archivo de Fuente Sans"
                      url={formData.settings.fontSansUrl}
                      onFileSelect={(e) => handleFileUpload(e, 'fontSansUrl')}
                      isUploading={isUploading === 'fontSansUrl'}
                      onClear={() => handleChange('settings', 'fontSansUrl', '')}
                    />
                  </div>
                </div>
                <p className="text-[10px] text-white/30 italic">
                  * Nota: Al subir un archivo, este tendrá prioridad sobre el nombre de la fuente de Google.
                </p>
              </div>
            </div>
          )}
        </div>
      </div >

      {/* Barra de acciones móvil fija inferior */}
      < div className="md:hidden fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-xl border-t border-white/10 p-4 z-[105] flex gap-2" >
        <button
          onClick={() => onSave(formData)}
          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl text-[10px] font-black border border-emerald-400/20 flex items-center justify-center space-x-2"
        >
          <Save size={14} />
          <span>GUARDAR</span>
        </button>
        <button
          onClick={onClose}
          className="flex-1 bg-white/5 hover:bg-white/10 text-white/60 py-4 rounded-xl text-[10px] font-black border border-white/10 flex items-center justify-center space-x-2"
        >
          <X size={14} />
          <span>CERRAR</span>
        </button>
        <button
          onClick={() => supabase.auth.signOut()}
          className="w-12 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl border border-red-500/20 flex items-center justify-center"
        >
          <LogOut size={14} />
        </button>
      </div >
    </div >
  );
};

const Input = ({ label, value, onChange, type = 'text', icon }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] tracking-widest text-white/40 uppercase font-bold">{label}</label>
    <div className="relative">
      {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20">{icon}</div>}
      <input
        type={type}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-sm text-white focus:border-gold focus:outline-none transition-all ${icon ? 'pl-12' : ''}`}
      />
    </div>
  </div>
);

const Select = ({ label, value, onChange, options }: any) => {
  const isCustom = value && !value.startsWith('#');
  const displayValue = isCustom ? 'custom' : value;

  return (
    <div className="space-y-2">
      <label className="text-[10px] tracking-widest text-white/40 uppercase font-bold">{label}</label>
      <select
        value={displayValue}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-sm text-white focus:border-gold focus:outline-none transition-all appearance-none cursor-pointer"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1em' }}
      >
        {options.map((opt: any) => (
          <option key={opt.value} value={opt.value} className="bg-zinc-900 text-white">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

const TextArea = ({ label, value, onChange }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] tracking-widest text-white/40 uppercase font-bold">{label}</label>
    <textarea
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      rows={4}
      className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-sm text-white focus:border-gold focus:outline-none transition-all resize-none"
    />
  </div>
);

const FileUpload = ({ label, url, onFileSelect, isUploading, onClear, accept = ".woff,.woff2,.ttf,.otf", placeholder = "Subir Archivo (.woff2, .ttf)" }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] tracking-widest text-white/40 uppercase font-bold">{label}</label>
    <div className="relative group">
      {url ? (
        <div className="w-full bg-gold/10 border border-gold/30 rounded-lg py-3 px-4 flex items-center justify-between">
          <div className="flex items-center space-x-3 overflow-hidden">
            <Type size={16} className="text-gold flex-shrink-0" />
            <span className="text-xs text-gold truncate">Fuente cargada correctamente</span>
          </div>
          <button
            onClick={onClear}
            className="p-1 hover:bg-gold/20 rounded-full text-gold transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <label className="w-full bg-white/5 border border-white/10 border-dashed rounded-lg py-6 px-4 flex flex-col items-center justify-center cursor-pointer hover:bg-white/10 hover:border-gold/50 transition-all space-y-2">
          <input
            type="file"
            className="hidden"
            accept={accept}
            onChange={onFileSelect}
            disabled={isUploading}
          />
          {isUploading ? (
            <div className="w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Plus size={20} className="text-white/20" />
              <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">{placeholder}</span>
            </>
          )}
        </label>
      )}
    </div>
  </div>
);
