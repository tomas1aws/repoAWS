import { useDeferredValue, useMemo, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import TopicsGrid from './TopicsGrid.jsx';
import TopicPanel from './TopicPanel.jsx';
import SubtopicPanel from './SubtopicPanel.jsx';
import { useLocalState } from '../hooks/useLocalState.js';
import { generateUUID } from '../utils/uuid.js';
import awsIcon from '../assets/icons/aws.svg';
import dockerIcon from '../assets/icons/docker.svg';
import kubernetesIcon from '../assets/icons/kubernetes.svg';

const seedTopics = [
  {
    id: 'topic-aws',
    title: 'AWS',
    icon: awsIcon,
    color: 'from-amber-500/60 to-amber-400/30',
    summary: 'Servicios principales de Amazon Web Services enfocados en cómputo y almacenamiento.',
    tags: ['cloud', 'aws'],
    subtopics: [
      {
        id: 'subtopic-aws-ec2',
        title: 'EC2',
        summary: 'Instancias de cómputo elásticas para ejecutar workloads en la nube. Soporta auto scaling, AMIs y distintos tipos de instancia.'
      },
      {
        id: 'subtopic-aws-s3',
        title: 'S3',
        summary: 'Servicio de almacenamiento de objetos. Ideal para backups, data lakes y hosting estático. Versioning, lifecycle policies y buckets cifrados.'
      }
    ]
  },
  {
    id: 'topic-docker',
    title: 'Docker',
    icon: dockerIcon,
    color: 'from-sky-500/60 to-cyan-400/30',
    summary: 'Plataforma de contenedores para construir, compartir y ejecutar aplicaciones de manera aislada y reproducible.',
    tags: ['containers', 'devops'],
    subtopics: [
      {
        id: 'subtopic-docker-images',
        title: 'Images',
        summary: 'Plantillas inmutables que definen el sistema de archivos y la configuración de un contenedor. Construidas con Dockerfile.'
      },
      {
        id: 'subtopic-docker-containers',
        title: 'Containers',
        summary: 'Instancias en ejecución de una imagen. Se pueden gestionar con docker run, docker ps, logs, exec y compose.'
      }
    ]
  },
  {
    id: 'topic-kubernetes',
    title: 'Kubernetes',
    icon: kubernetesIcon,
    color: 'from-indigo-500/60 to-purple-500/30',
    summary: 'Orquestador de contenedores para despliegues declarativos, escalamiento automático y gestión de servicios resilientes.',
    tags: ['k8s', 'orchestrator'],
    subtopics: [
      {
        id: 'subtopic-k8s-pods',
        title: 'Pods',
        summary: 'Unidad mínima desplegable compuesta por uno o más contenedores que comparten red y almacenamiento.'
      },
      {
        id: 'subtopic-k8s-services',
        title: 'Services',
        summary: 'Abstracción para exponer Pods de manera estable. Tipos ClusterIP, NodePort, LoadBalancer e Ingress.'
      }
    ]
  }
];

function normalizeQuery(value) {
  return value.trim().toLowerCase();
}

export default function App() {
  const [topics, setTopics] = useLocalState('memory-board-topics', seedTopics);
  const [selectedTopicId, setSelectedTopicId] = useState(null);
  const [selectedSubtopicId, setSelectedSubtopicId] = useState(null);
  const [subtopicEditing, setSubtopicEditing] = useState(false);
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);

  const filteredTopics = useMemo(() => {
    const query = normalizeQuery(deferredSearch);
    if (!query) return topics;
    return topics.filter((topic) => {
      const inTitle = topic.title.toLowerCase().includes(query);
      const inTags = topic.tags?.some((tag) => tag.toLowerCase().includes(query));
      const inSubtopics = topic.subtopics?.some((sub) => sub.title.toLowerCase().includes(query));
      return inTitle || inTags || inSubtopics;
    });
  }, [topics, deferredSearch]);

  const activeTopic = useMemo(
    () => topics.find((topic) => topic.id === selectedTopicId) ?? null,
    [topics, selectedTopicId]
  );

  const activeSubtopic = useMemo(() => {
    if (!activeTopic || !selectedSubtopicId) return null;
    return activeTopic.subtopics?.find((sub) => sub.id === selectedSubtopicId) ?? null;
  }, [activeTopic, selectedSubtopicId]);

  const handleAddTopic = () => {
    setTopics((prev) => [
      ...prev,
      {
        id: `topic-${generateUUID()}`,
        title: 'Nuevo Tema',
        icon: awsIcon,
        color: 'from-slate-500/40 to-slate-700/30',
        summary: 'Agrega una descripción en markdown.',
        tags: [],
        subtopics: []
      }
    ]);
  };

  const handleUpdateTopic = (id, patch) => {
    setTopics((prev) =>
      prev.map((topic) => (topic.id === id ? { ...topic, ...patch } : topic))
    );
  };

  const handleDeleteTopic = (id) => {
    setTopics((prev) => prev.filter((topic) => topic.id !== id));
    if (selectedTopicId === id) {
      setSelectedTopicId(null);
      setSelectedSubtopicId(null);
    }
  };

  const handleAddSubtopic = (topicId) => {
    setTopics((prev) =>
      prev.map((topic) =>
        topic.id === topicId
          ? {
              ...topic,
              subtopics: [
                ...(topic.subtopics ?? []),
                {
                  id: `subtopic-${generateUUID()}`,
                  title: 'Nuevo Subtema',
                  summary: 'Describe brevemente el concepto o comandos relevantes.'
                }
              ]
            }
          : topic
      )
    );
  };

  const handleUpdateSubtopic = (topicId, subtopicId, patch) => {
    setTopics((prev) =>
      prev.map((topic) =>
        topic.id === topicId
          ? {
              ...topic,
              subtopics: topic.subtopics?.map((sub) =>
                sub.id === subtopicId ? { ...sub, ...patch } : sub
              )
            }
          : topic
      )
    );
  };

  const handleDeleteSubtopic = (topicId, subtopicId) => {
    setTopics((prev) =>
      prev.map((topic) =>
        topic.id === topicId
          ? {
              ...topic,
              subtopics: topic.subtopics?.filter((sub) => sub.id !== subtopicId) ?? []
            }
          : topic
      )
    );
    if (selectedSubtopicId === subtopicId) {
      setSelectedSubtopicId(null);
    }
  };

  const handleClosePanels = () => {
    setSelectedSubtopicId(null);
    setSelectedTopicId(null);
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(topics, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'knowledge-board.json';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const handleImport = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (!Array.isArray(parsed)) {
        throw new Error('Formato inválido');
      }
      setTopics(parsed);
      setSelectedTopicId(null);
      setSelectedSubtopicId(null);
      setSubtopicEditing(false);
    } catch (error) {
      console.error('Error al importar JSON', error);
      alert('El archivo no es válido. Revisa el formato.');
    } finally {
      event.target.value = '';
    }
  };

  return (
    <div className="min-h-screen backdrop-blur-sm">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-6 py-12">
        <header className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-lg shadow-black/20 backdrop-blur-lg">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold text-slate-100">Knowledge Dashboard</h1>
              <p className="text-sm text-slate-300/80">
                Organiza tus temas de Cloud y DevOps en tarjetas jerárquicas. Usa Markdown para capturar comandos y apuntes.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleExport}
                className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-slate-100 shadow-inner shadow-white/10 transition hover:bg-white/20"
              >
                Exportar JSON
              </button>
              <label className="cursor-pointer rounded-full border border-emerald-400/40 bg-emerald-500/20 px-4 py-2 text-sm font-medium text-emerald-200 shadow-inner shadow-emerald-500/20 transition hover:bg-emerald-500/30">
                Importar JSON
                <input type="file" accept="application/json" onChange={handleImport} className="hidden" />
              </label>
            </div>
          </div>
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-3 shadow-inner shadow-black/20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="h-5 w-5 text-slate-300"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35m0 0A6.75 6.75 0 105.25 5.25a6.75 6.75 0 0011.4 11.4z"
                />
              </svg>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar por tema, subtema o tag"
                className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none"
              />
            </div>
            <button
              onClick={handleAddTopic}
              className="flex items-center justify-center gap-2 rounded-full border border-sky-400/40 bg-sky-500/20 px-4 py-2 text-sm font-medium text-sky-100 shadow-inner shadow-sky-500/30 transition hover:bg-sky-500/30"
            >
              <span className="text-lg">＋</span> Nuevo tema
            </button>
          </div>
        </header>

        <TopicsGrid
          topics={filteredTopics}
          onSelect={(topicId) => {
            setSelectedTopicId(topicId);
            setSelectedSubtopicId(null);
            setSubtopicEditing(false);
          }}
          onEdit={(topicId) => setSelectedTopicId(topicId)}
          onDelete={handleDeleteTopic}
        />
      </div>

      <AnimatePresence>
        {activeTopic && (
          <TopicPanel
            key={activeTopic.id}
            topic={activeTopic}
            onClose={handleClosePanels}
            onUpdate={handleUpdateTopic}
            onDelete={handleDeleteTopic}
            onAddSubtopic={handleAddSubtopic}
            onSelectSubtopic={(subtopicId) => {
              setSelectedSubtopicId(subtopicId);
              setSubtopicEditing(false);
            }}
            onEditSubtopic={(subtopicId) => {
              setSelectedSubtopicId(subtopicId);
              setSubtopicEditing(true);
            }}
            onDeleteSubtopic={handleDeleteSubtopic}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeTopic && activeSubtopic && (
          <SubtopicPanel
            key={activeSubtopic.id}
            topicId={activeTopic.id}
            subtopic={activeSubtopic}
            startEditing={subtopicEditing}
            onClose={() => {
              setSelectedSubtopicId(null);
              setSubtopicEditing(false);
            }}
            onUpdate={handleUpdateSubtopic}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
