import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 }
};

const panelVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 140, damping: 18 }
  },
  exit: { opacity: 0, y: 24, scale: 0.98, transition: { duration: 0.15 } }
};

export default function SubtopicPanel({ topicId, subtopic, startEditing = false, onClose, onUpdate }) {
  const [isEditing, setIsEditing] = useState(startEditing);
  const [form, setForm] = useState({ title: subtopic.title, summary: subtopic.summary });

  useEffect(() => {
    setForm({ title: subtopic.title, summary: subtopic.summary });
    setIsEditing(startEditing);
  }, [subtopic, startEditing]);

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSave = () => {
    onUpdate(topicId, subtopic.id, {
      title: form.title.trim() || subtopic.title,
      summary: form.summary
    });
    setIsEditing(false);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div className="absolute inset-0 bg-slate-950/70 backdrop-blur" onClick={onClose} />
      <motion.div
        variants={panelVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="relative z-10 flex max-h-[80vh] w-full max-w-2xl flex-col gap-4 overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/50 backdrop-blur-xl"
      >
        <div className="flex items-center justify-between">
          {isEditing ? (
            <input
              value={form.title}
              onChange={handleChange('title')}
              className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-2 text-lg font-semibold text-slate-100 focus:border-sky-400/60 focus:outline-none"
            />
          ) : (
            <h3 className="text-xl font-semibold text-slate-100">{subtopic.title}</h3>
          )}
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <button
              type="button"
              onClick={() => setIsEditing((prev) => !prev)}
              className="rounded-full border border-white/10 bg-white/10 px-3 py-1 transition hover:bg-white/20"
            >
              ✏️ {isEditing ? 'Cancelar' : 'Editar'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 transition hover:bg-white/10"
            >
              ✕ Cerrar
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin">
          {isEditing ? (
            <textarea
              value={form.summary}
              onChange={handleChange('summary')}
              className="min-h-[220px] w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-slate-100 focus:border-sky-400/60 focus:outline-none"
            />
          ) : (
            <div className="prose prose-invert max-w-none prose-headings:text-slate-100 prose-strong:text-white">
              <ReactMarkdown>{subtopic.summary}</ReactMarkdown>
            </div>
          )}
        </div>

        {isEditing && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSave}
              className="rounded-full border border-emerald-400/40 bg-emerald-500/20 px-4 py-2 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-500/30"
            >
              Guardar cambios
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
