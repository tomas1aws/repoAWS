import { motion } from 'framer-motion';

function isEmojiIcon(icon) {
  if (!icon) return false;
  return icon.length <= 3 && !icon.includes('/') && !icon.includes('.');
}

const containerVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 }
};

export default function TopicsGrid({ topics, onSelect, onEdit, onDelete }) {
  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
    >
      {topics.map((topic) => (
        <motion.article
          key={topic.id}
          variants={itemVariants}
          className="group relative flex h-full cursor-pointer flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/20 backdrop-blur-md transition hover:border-white/20 hover:bg-white/10"
        >
          <button
            type="button"
            onClick={() => onDelete(topic.id)}
            className="absolute right-4 top-4 rounded-full border border-red-400/40 bg-red-500/10 p-2 text-xs text-red-200 opacity-0 shadow-inner shadow-red-500/30 transition hover:bg-red-500/20 group-hover:opacity-100"
            aria-label={`Eliminar ${topic.title}`}
          >
            ✕
          </button>

          <button
            type="button"
            onClick={() => onSelect(topic.id)}
            className="flex flex-1 flex-col gap-4 text-left"
          >
            <div className={`inline-flex w-fit items-center gap-3 rounded-2xl bg-gradient-to-br ${topic.color} p-3 shadow-inner shadow-black/20`}
            >
              {topic.icon && (
                isEmojiIcon(topic.icon) ? (
                  <span className="text-3xl">{topic.icon}</span>
                ) : (
                  <img
                    src={topic.icon}
                    alt={topic.title}
                    className="h-10 w-10 rounded-xl border border-white/20 bg-white/10 p-2"
                  />
                )
              )}
              <div>
                <h2 className="text-xl font-semibold text-slate-100">{topic.title}</h2>
                {topic.tags?.length ? (
                  <p className="text-xs uppercase tracking-widest text-slate-200/70">
                    {topic.tags.join(' · ')}
                  </p>
                ) : null}
              </div>
            </div>
            <p className="text-sm text-slate-300/80 line-clamp-4">
              {topic.summary}
            </p>
          </button>

          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>{topic.subtopics?.length ?? 0} subtemas</span>
            <button
              type="button"
              onClick={() => onEdit(topic.id)}
              className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-slate-200 transition hover:bg-white/20"
            >
              <span>✏️</span> Editar
            </button>
          </div>
        </motion.article>
      ))}
    </motion.section>
  );
}
