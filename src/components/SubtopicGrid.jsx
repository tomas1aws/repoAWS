import { motion } from 'framer-motion';

const gridVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.04, delayChildren: 0.1 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 }
};

export default function SubtopicGrid({
  subtopics = [],
  onSelect,
  onEdit,
  onDelete,
  onAdd
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-200/80">Subtemas</h3>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/20 px-3 py-1 text-xs font-medium text-emerald-100 shadow-inner shadow-emerald-500/30 transition hover:bg-emerald-500/30"
        >
          <span className="text-base leading-none">＋</span> Nuevo subtema
        </button>
      </div>

      <motion.div
        variants={gridVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-3 sm:grid-cols-2"
      >
        {subtopics.map((subtopic) => (
          <motion.article
            key={subtopic.id}
            variants={cardVariants}
            className="group relative flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/5 p-4 shadow-inner shadow-black/20 backdrop-blur-md transition hover:border-white/20 hover:bg-white/10"
          >
            <button
              type="button"
              onClick={() => onDelete(subtopic.id)}
              className="absolute right-3 top-3 rounded-full border border-red-400/40 bg-red-500/10 p-1 text-[10px] text-red-200 opacity-0 shadow-inner shadow-red-500/30 transition hover:bg-red-500/20 group-hover:opacity-100"
              aria-label={`Eliminar ${subtopic.title}`}
            >
              ✕
            </button>
            <button
              type="button"
              onClick={() => onSelect(subtopic.id)}
              className="flex flex-1 flex-col gap-2 text-left"
            >
              <h4 className="text-sm font-medium text-slate-100">{subtopic.title}</h4>
              <p className="text-xs text-slate-300/80 line-clamp-3">{subtopic.summary}</p>
            </button>
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Detalle</span>
              <button
                type="button"
                onClick={() => onEdit(subtopic.id)}
                className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-1 text-slate-200 transition hover:bg-white/10"
              >
                ✏️ Editar
              </button>
            </div>
          </motion.article>
        ))}
        {!subtopics.length && (
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-6 text-center text-sm text-slate-400">
            Agrega tus primeros subtemas para este tópico.
          </div>
        )}
      </motion.div>
    </div>
  );
}
