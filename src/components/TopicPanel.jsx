import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import SubtopicGrid from './SubtopicGrid.jsx';

function isEmojiIcon(icon) {
  if (!icon) return false;
  return icon.length <= 3 && !icon.includes('/') && !icon.includes('.');
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 }
};

const panelVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 120, damping: 18 }
  },
  exit: { opacity: 0, y: 40, scale: 0.95, transition: { duration: 0.15 } }
};

export default function TopicPanel({
  topic,
  onClose,
  onUpdate,
  onDelete,
  onAddSubtopic,
  onSelectSubtopic,
  onEditSubtopic,
  onDeleteSubtopic
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    title: topic.title,
    summary: topic.summary,
    tags: topic.tags?.join(', ') ?? '',
    color: topic.color ?? 'from-slate-500/40 to-slate-700/30',
    icon: topic.icon ?? ''
  });

  useEffect(() => {
    setForm({
      title: topic.title,
      summary: topic.summary,
      tags: topic.tags?.join(', ') ?? '',
      color: topic.color ?? 'from-slate-500/40 to-slate-700/30',
      icon: topic.icon ?? ''
    });
    setIsEditing(false);
  }, [topic]);

  const parsedTags = useMemo(
    () =>
      form.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
    [form.tags]
  );

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleToggleEditing = () => {
    setIsEditing((prev) => {
      const next = !prev;
      if (!next) {
        setForm({
          title: topic.title,
          summary: topic.summary,
          tags: topic.tags?.join(', ') ?? '',
          color: topic.color ?? 'from-slate-500/40 to-slate-700/30',
          icon: topic.icon ?? ''
        });
      }
      return next;
    });
  };

  const handleSave = () => {
    onUpdate(topic.id, {
      title: form.title.trim() || topic.title,
      summary: form.summary,
      color: form.color,
      icon: form.icon,
      tags: parsedTags
    });
    setIsEditing(false);
  };

  const displayTags = (isEditing ? parsedTags : topic.tags ?? []).filter(Boolean);

  const iconPreview = isEmojiIcon(form.icon) ? (
    <span className="text-4xl">{form.icon}</span>
  ) : form.icon ? (
    <img
      src={form.icon}
      alt={topic.title}
      className="h-16 w-16 rounded-2xl border border-white/10 bg-white/10 p-3 shadow-inner shadow-black/40"
    />
  ) : (
    <div className="h-16 w-16 rounded-2xl border border-dashed border-white/10 bg-white/5" />
  );

  return (
    <motion.div
      className="fixed inset-0 z-40 flex items-center justify-center"
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
        onClick={onClose}
      />

      <motion.div
        variants={panelVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="relative z-10 flex max-h-[90vh] w-full max-w-4xl flex-col gap-6 overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/50 backdrop-blur-xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`rounded-3xl bg-gradient-to-br ${form.color} p-4 shadow-inner shadow-black/30`}>
              {iconPreview}
            </div>
            <div className="space-y-1">
              {isEditing ? (
                <input
                  value={form.title}
                  onChange={handleChange('title')}
                  className="w-full rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-lg font-semibold text-slate-100 focus:border-sky-400/60 focus:outline-none"
                />
              ) : (
                <h2 className="text-2xl font-semibold text-slate-100">{topic.title}</h2>
              )}
              <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-slate-300/80">
                {displayTags.length ? (
                  displayTags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 bg-white/10 px-2 py-1"
                    >
                      #{tag}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-500">Sin tags</span>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 text-xs text-slate-300">
            <button
              type="button"
              onClick={handleToggleEditing}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-slate-200 transition hover:bg-white/20"
            >
              ✏️ {isEditing ? 'Cancelar' : 'Editar'}
            </button>
            <button
              type="button"
              onClick={() => onDelete(topic.id)}
              className="inline-flex items-center gap-2 rounded-full border border-red-500/40 bg-red-500/20 px-3 py-1 text-red-200 transition hover:bg-red-500/30"
            >
              🗑️ Eliminar
            </button>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-slate-200 transition hover:bg-white/10"
            >
              ✕ Cerrar
            </button>
          </div>
        </div>

        <div className="grid flex-1 gap-6 overflow-hidden lg:grid-cols-[1.3fr_1fr]">
          <div className="flex flex-col gap-4 overflow-y-auto pr-2 scrollbar-thin">
            {isEditing ? (
              <div className="space-y-4">
                <label className="flex flex-col gap-2 text-sm text-slate-200">
                  Resumen (Markdown)
                  <textarea
                    value={form.summary}
                    onChange={handleChange('summary')}
                    className="min-h-[160px] rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-slate-100 focus:border-sky-400/60 focus:outline-none"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm text-slate-200">
                  Tags (separados por coma)
                  <input
                    value={form.tags}
                    onChange={handleChange('tags')}
                    className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-slate-100 focus:border-sky-400/60 focus:outline-none"
                  />
                </label>
                <div className="grid gap-3 md:grid-cols-2">
                  <label className="flex flex-col gap-2 text-sm text-slate-200">
                    Icono (emoji o URL)
                    <input
                      value={form.icon}
                      onChange={handleChange('icon')}
                      placeholder="Ej: ☁️"
                      className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-slate-100 focus:border-sky-400/60 focus:outline-none"
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-sm text-slate-200">
                    Gradiente Tailwind
                    <input
                      value={form.color}
                      onChange={handleChange('color')}
                      placeholder="from-indigo-500/50 to-purple-500/40"
                      className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-slate-100 focus:border-sky-400/60 focus:outline-none"
                    />
                  </label>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleSave}
                    className="rounded-full border border-emerald-400/40 bg-emerald-500/20 px-4 py-2 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-500/30"
                  >
                    Guardar cambios
                  </button>
                </div>
              </div>
            ) : (
              <div className="prose prose-invert max-w-none prose-headings:text-slate-100 prose-strong:text-white prose-a:text-sky-300/90">
                <ReactMarkdown>{topic.summary}</ReactMarkdown>
              </div>
            )}
          </div>

          <div className="overflow-y-auto pr-2 scrollbar-thin">
            <SubtopicGrid
              subtopics={topic.subtopics}
              onAdd={() => onAddSubtopic(topic.id)}
              onSelect={(subtopicId) => onSelectSubtopic(subtopicId)}
              onEdit={(subtopicId) => onEditSubtopic(subtopicId)}
              onDelete={(subtopicId) => onDeleteSubtopic(topic.id, subtopicId)}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
