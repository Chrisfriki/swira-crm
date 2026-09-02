'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, X, CheckCircle2, Circle, Clock, Tag, ChevronLeft, ChevronRight, CalendarDays, LayoutDashboard, Trello, Activity, Calendar as CalendarIcon, Users, Edit3, Trash2 } from 'lucide-react';

// ---------------------------------------------------------
// CONSTANTES & CONFIGURACIÓN BASE
// ---------------------------------------------------------
const BRAND_COLORS = {
  preto: '#000000',
  marrom: '#605f4c',
  bege: '#efebe6',
  verdeMedio: '#26d966',
  verdeEscuro: '#1b5b3b'
};

const TEAM = [
  { id: 't1', name: 'Wil', avatar: 'W', color: 'bg-blue-500 text-white' },
  { id: 't2', name: 'Christian', avatar: 'C', color: 'bg-indigo-500 text-white' },
  { id: 't3', name: 'Eva', avatar: 'E', color: 'bg-pink-500 text-white' },
  { id: 't4', name: 'Rafa', avatar: 'R', color: 'bg-amber-500 text-white' },
  { id: 't5', name: 'Sam', avatar: 'S', color: 'bg-emerald-500 text-white' }
];

const INITIAL_CLIENTS = [
  { id: 'c1', name: 'Alcacenter', type: 'external' },
  { id: 'c2', name: 'inku_sushi', type: 'external' },
  { id: 'c3', name: 'Merca China', type: 'external' },
  { id: 'c4', name: 'Shushi Tok', type: 'external' },
  { id: 'c5', name: 'SpaceZoneJump', type: 'external' },
  { id: 'c6', name: 'swiraes', type: 'external' },
  { id: 'c7', name: 'Welding Systems', type: 'external' }
];

const STANDARD_WORKFLOW = [
  { title: "🎬 Grabación de Reels", desc: "Grabar 8 reels", time: "2h", quantity: "8 Reels", people: 2, urgency: 4, importance: 4 },
  { title: "✂️ Edición de Reels", desc: "Editar 8 reels", time: "2h", quantity: "8 Reels", people: 1, urgency: 3, importance: 4 },
  { title: "💡 Inspiración contenido", desc: "Búsqueda, comparación", time: "2,5h", quantity: "8 Reels + 4 Carrusel", people: 1, urgency: 2, importance: 3 },
  { title: "🗓️ Programar en Metricool", desc: "Programar contenido", time: "1h", quantity: "8 Reels + 4 Carrusel", people: 1, urgency: 4, importance: 3 },
  { title: "✍️ Redactar Copys", desc: "Redactar con GPT", time: "1h", quantity: "8 Reels + 4 Carrusel", people: 1, urgency: 3, importance: 3 },
  { title: "🧠 Desarrollo de Estrategia", desc: "Análisis y competencia", time: "2h", quantity: "Mensual", people: 2, urgency: 5, importance: 5 },
  { title: "📱 Crear Post para Google", desc: "Post con palabras clave", time: "2h", quantity: "1 post/sem", people: 1, urgency: 2, importance: 3 },
  { title: "🎨 Diseñar Carrusel IG", desc: "Diseño de carrusel", time: "2h", quantity: "1 carrusel/sem", people: 1, urgency: 3, importance: 4 },
  { title: "📊 Descargar Informes", desc: "Informes de Metricool", time: "1h", quantity: "Mensual", people: 1, urgency: 4, importance: 2 },
  { title: "🤖 Automatizaciones", desc: "Revisar flujos", time: "2h", quantity: "Mensual", people: 1, urgency: 2, importance: 4 },
  { title: "🔍 Control Diario", desc: "Revisar publicaciones", time: "1h", quantity: "Diario", people: 1, urgency: 5, importance: 4 },
];

const STATUSES = [
  { id: 'todo', label: 'Pendiente', color: 'bg-slate-100 text-slate-700' },
  { id: 'in_progress', label: 'En Proceso', color: 'bg-blue-100 text-blue-700' },
  { id: 'fire', label: 'Fuegos a Apagar', color: 'bg-red-100 text-red-700' },
  { id: 'done', label: 'Completado', color: `bg-[${BRAND_COLORS.verdeMedio}]/20 text-[${BRAND_COLORS.verdeEscuro}]` }
];

const QUADRANTS = [
  { id: 'q1', label: 'Hacer Ya (Urg & Imp)', u: 'alta', i: 'alta', color: 'border-red-400 bg-red-50/30' },
  { id: 'q2', label: 'Planificar (No Urg & Imp)', u: 'baja', i: 'alta', color: 'border-blue-400 bg-blue-50/30' },
  { id: 'q3', label: 'Delegar (Urg & No Imp)', u: 'alta', i: 'baja', color: 'border-orange-400 bg-orange-50/30' },
  { id: 'q4', label: 'Posponer (No Urg & No Imp)', u: 'baja', i: 'baja', color: 'border-slate-300 bg-slate-50/30' }
];

const generateTasksForClient = (client) => {
  return STANDARD_WORKFLOW.map(wf => ({
    id: 'task_' + Math.random().toString(36).substr(2, 9),
    title: wf.title,
    desc: wf.desc,
    client: client.id,
    assignees: [], // Sin equipo asignado por defecto
    urgency: wf.urgency,
    importance: wf.importance,
    dueDate: null, // Sin fecha asignada por defecto
    startTime: null, // Sin hora asignada por defecto
    status: 'todo',
    time: wf.time,
    quantity: wf.quantity,
    people: wf.people
  }));
};

const generateInitialTasks = (clientsList) => {
  let initial = [];
  const externalClients = clientsList.filter(c => c.type === 'external');
  externalClients.forEach(client => {
    initial = [...initial, ...generateTasksForClient(client)];
  });
  return initial;
};

export default function App() {
  const [clients, setClients] = useState(INITIAL_CLIENTS);
  const [tasks, setTasks] = useState(() => generateInitialTasks(INITIAL_CLIENTS));
  const [storageReady, setStorageReady] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [filterAssignee, setFilterAssignee] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [draggedTask, setDraggedTask] = useState(null);
  const [selectedClientForModal, setSelectedClientForModal] = useState(null); // Nuevo Panel de Cliente
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false); // Modal de confirmación de reset
  const [isNewClientModalOpen, setIsNewClientModalOpen] = useState(false); // Modal de nuevo cliente

  useEffect(() => {
    try {
      const savedClients = window.localStorage.getItem('swira-crm-v1-clients');
      const savedTasks = window.localStorage.getItem('swira-crm-v1-tasks');
      // La carga se realiza una sola vez tras montar para evitar diferencias de hidratación.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (savedClients) setClients(JSON.parse(savedClients));
      if (savedTasks) setTasks(JSON.parse(savedTasks));
    } catch {
      // Si los datos locales están dañados, mantenemos los valores iniciales.
    } finally {
      setStorageReady(true);
    }
  }, []);

  useEffect(() => {
    if (!storageReady) return;
    window.localStorage.setItem('swira-crm-v1-clients', JSON.stringify(clients));
    window.localStorage.setItem('swira-crm-v1-tasks', JSON.stringify(tasks));
  }, [clients, storageReady, tasks]);
  
  // Calendario
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState('month'); // 'month' o 'week'
  const [selectedDateForNewTask, setSelectedDateForNewTask] = useState(null);

  // Selector de plantillas
  const [selectedTemplate, setSelectedTemplate] = useState('');

  // ---------------------------------------------------------
  // HELPERS DEL CALENDARIO
  // ---------------------------------------------------------
  const toLocalISODate = (d) => {
    if (!d) return null;
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    
    // Ajustar para que la semana empiece en Lunes (1) a Domingo (7)
    let startOffset = firstDay.getDay() - 1;
    if (startOffset === -1) startOffset = 6; // Si es domingo, poner al final

    for (let i = 0; i < startOffset; i++) days.push(null);
    for (let i = 1; i <= lastDay.getDate(); i++) days.push(new Date(year, month, i));
    return days;
  };

  const getDaysInWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // ajustar a Lunes
    const monday = new Date(d.setDate(diff));
    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push(new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i));
    }
    return days;
  };

  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const dayNames = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

  const prevPeriod = () => {
    if (calendarView === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    } else {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 7));
    }
  };

  const nextPeriod = () => {
    if (calendarView === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    } else {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 7));
    }
  };


  // ---------------------------------------------------------
  // DRAG AND DROP HANDLERS
  // ---------------------------------------------------------
  const handleDragStart = (e, id) => {
    setDraggedTask(id);
    e.dataTransfer.effectAllowed = "move";
  };
  
  const handleDragEnd = () => {
    setDraggedTask(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, statusId) => {
    e.preventDefault();
    if (draggedTask) {
      setTasks(prev => prev.map(t => 
        t.id === draggedTask ? { ...t, status: statusId } : t
      ));
    }
    setDraggedTask(null);
  };

  const handleCalendarDrop = (e, dateStr, startTimeStr = null) => {
    e.preventDefault();
    
    // Evitar drop en fines de semana
    const dropDate = new Date(dateStr);
    if (dropDate.getDay() === 0 || dropDate.getDay() === 6) {
       setDraggedTask(null);
       return; 
    }

    if (draggedTask) {
      setTasks(prev => prev.map(t => 
        t.id === draggedTask ? { ...t, dueDate: dateStr, startTime: startTimeStr } : t
      ));
    }
    setDraggedTask(null);
  };

  const handleMatrixDrop = (e, newUrgency, newImportance) => {
    e.preventDefault();
    if (draggedTask) {
      setTasks(prev => prev.map(t => 
        t.id === draggedTask ? { ...t, urgency: newUrgency, importance: newImportance } : t
      ));
    }
    setDraggedTask(null);
  };

  // ---------------------------------------------------------
  // ACCIONES CRUD
  // ---------------------------------------------------------
  const openNewTaskModal = (dateStr = null) => {
    setEditingTask(null);
    setSelectedTemplate('');
    setSelectedDateForNewTask(dateStr);
    setIsModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    // Intentar emparejar el título con una plantilla para mostrarla seleccionada
    const matched = STANDARD_WORKFLOW.find(w => w.title === task.title);
    setSelectedTemplate(matched ? task.title : 'other');
    setIsModalOpen(true);
  };

  const saveTask = (taskData) => {
    if (editingTask) {
      setTasks(prev => prev.map(t => t.id === editingTask.id ? { ...t, ...taskData } : t));
    } else {
      setTasks(prev => [...prev, { ...taskData, id: Date.now().toString() }]);
    }
    setIsModalOpen(false);
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    setIsModalOpen(false);
  };

  // ---------------------------------------------------------
  // RENDERIZADO DE COMPONENTES
  // ---------------------------------------------------------
  // Cálculos de fechas dinámicas para Kanban y Matriz
  const todayStr = toLocalISODate(new Date());
  const endOfWeek = new Date();
  const dayEnd = endOfWeek.getDay();
  endOfWeek.setDate(endOfWeek.getDate() + (dayEnd === 0 ? 0 : 7 - dayEnd));
  const endOfWeekStr = toLocalISODate(endOfWeek);

  const filteredTasks = tasks.filter(t => filterAssignee === 'all' || t.assignees.includes(filterAssignee));

  // Ordenar tareas: Primero las Urgentes(5,4) y luego Alta Importancia(5,4)
  const sortTasks = (tasksList) => {
    return [...tasksList].sort((a, b) => {
      const scoreA = parseInt(a.urgency) + parseInt(a.importance);
      const scoreB = parseInt(b.urgency) + parseInt(b.importance);
      return scoreB - scoreA;
    });
  };

  const getUrgencyImportanceProps = (u, i) => {
    const isU = parseInt(u) >= 4;
    const isI = parseInt(i) >= 4;
    let label = '';
    let color = '';
    if (isU && isI) { label = 'Hacer Ya'; color = 'bg-red-100 text-red-700 border-red-200'; }
    else if (!isU && isI) { label = 'Planificar'; color = 'bg-blue-100 text-blue-700 border-blue-200'; }
    else if (isU && !isI) { label = 'Delegar'; color = 'bg-orange-100 text-orange-700 border-orange-200'; }
    else { label = 'Posponer'; color = 'bg-slate-100 text-slate-700 border-slate-200'; }
    return { label, color };
  };

  const TaskCard = ({ task, compact = false }) => {
    const assignedTeam = TEAM.filter(member => task.assignees.includes(member.id));
    const isDone = task.status === 'done';
    
    if (compact) {
      const bgClass = isDone 
        ? `bg-[${BRAND_COLORS.verdeMedio}]/10 text-[${BRAND_COLORS.verdeEscuro}] border-[${BRAND_COLORS.verdeMedio}] font-bold` 
        : (assignedTeam[0]?.color || 'bg-white border-slate-200 text-slate-700');
      
      return (
        <div 
          draggable
          onDragStart={(e) => handleDragStart(e, task.id)}
          onDragEnd={handleDragEnd}
          onClick={(e) => { e.stopPropagation(); openEditModal(task); }}
          className={`text-[10px] p-1.5 mb-1 rounded cursor-pointer truncate border transition-all hover:scale-[1.02] active:cursor-grabbing shadow-sm flex items-center ${bgClass}`}
          title={`${task.title} (${task.client}) ${task.startTime ? 'a las ' + task.startTime : ''}`}
        >
          {task.startTime && <span className="font-bold mr-1 opacity-70 bg-black/5 px-1 rounded">{task.startTime}</span>}
          <span className="truncate">{isDone ? '✅ ' : ''}{task.client.substring(0,3).toUpperCase()} - {task.title}</span>
        </div>
      );
    }

    return (
      <div 
        draggable
        onDragStart={(e) => handleDragStart(e, task.id)}
        onDragEnd={handleDragEnd}
        onClick={() => openEditModal(task)}
        className={`bg-white p-3 rounded-lg shadow-sm border transition-all hover:shadow-md cursor-pointer active:cursor-grabbing relative overflow-hidden group ${isDone ? `border-[${BRAND_COLORS.verdeMedio}]/50 bg-[${BRAND_COLORS.verdeMedio}]/5` : 'border-slate-200'}`}
      >
        {/* Tira de color del asignado principal (o el primero) */}
        {assignedTeam.length > 0 && !isDone && (
           <div className={`absolute left-0 top-0 bottom-0 w-1 ${assignedTeam[0].color.split(' ')[0]}`}></div>
        )}
        {isDone && (
           <div className={`absolute left-0 top-0 bottom-0 w-1 bg-[${BRAND_COLORS.verdeMedio}]`}></div>
        )}

        <div className="pl-1">
          <div className="flex justify-between items-start mb-2">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${isDone ? `bg-[${BRAND_COLORS.verdeMedio}]/20 text-[${BRAND_COLORS.verdeEscuro}]` : 'bg-slate-100 text-slate-500'}`}>
              {clients.find(c => c.id === task.client)?.name || 'Cliente'}
            </span>
            <div className="flex -space-x-1">
              {assignedTeam.map(member => (
                <div key={member.id} className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white border-2 border-white ${member.color}`} title={member.name}>
                  {member.avatar}
                </div>
              ))}
            </div>
          </div>
          
          <h4 className={`text-sm font-semibold mb-2 leading-tight ${isDone ? `text-[${BRAND_COLORS.verdeEscuro}]` : 'text-slate-800'}`}>
            {isDone && '✅ '}{task.title}
          </h4>
          
          {(task.quantity || task.time || task.people) && (
            <div className={`text-[10px] p-1.5 rounded mb-2 ${isDone ? 'bg-white/50 text-slate-600' : 'bg-slate-50 text-slate-500 border border-slate-100'}`}>
              <div className="flex flex-wrap gap-2">
                {task.quantity && <span><Tag className="w-3 h-3 inline mr-0.5" />{task.quantity}</span>}
                {task.time && <span><Clock className="w-3 h-3 inline mr-0.5" />{task.time}</span>}
                {task.people && <span><Users className="w-3 h-3 inline mr-0.5" />{task.people}p</span>}
              </div>
            </div>
          )}
          
          {task.dueDate && (
            <div className="flex justify-between items-center text-xs text-slate-500 mb-2 font-medium border-t border-slate-100 pt-2 mt-2">
              <div className="flex items-center">
                <CalendarIcon className="w-3 h-3 mr-1" />
                {new Date(task.dueDate).toLocaleDateString()}
              </div>
              {task.startTime && (
                <div className="flex items-center font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                  <Clock className="w-3 h-3 mr-1" />
                  {task.startTime}
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
             {(() => {
                const matrix = getUrgencyImportanceProps(task.urgency, task.importance);
                return (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${matrix.color}`}>
                    U:{task.urgency} I:{task.importance}
                  </span>
                )
             })()}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`flex h-screen bg-[${BRAND_COLORS.bege}] overflow-hidden font-sans text-slate-800`}>
      {/* Sidebar Fija (Menú Izquierdo) */}
      <div className={`w-64 bg-white border-r border-slate-200 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10`}>
        {/* LOGO AREA */}
        <div className={`h-16 flex items-center px-6 bg-[${BRAND_COLORS.preto}]`}>
          <Image
            src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/branding/swira-logo.png`}
            alt="Swira"
            width={160}
            height={60}
            className="h-9 w-auto object-contain"
            preload
          />
        </div>
        
        {/* Navigations */}
        <div className="flex-1 py-6 px-4 space-y-1">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            { id: 'kanban', icon: Trello, label: 'Tablero procesos' },
            { id: 'calendar', icon: CalendarDays, label: 'Calendario' },
            { id: 'matrix', icon: Activity, label: 'Matriz Imp/Urg' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                activeTab === item.id 
                  ? `bg-[${BRAND_COLORS.verdeMedio}]/10 text-[${BRAND_COLORS.verdeEscuro}] shadow-sm border border-[${BRAND_COLORS.verdeMedio}]/20` 
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <item.icon className={`w-5 h-5 ${activeTab === item.id ? `text-[${BRAND_COLORS.verdeMedio}]` : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Create Task Button */}
        <div className="p-4 border-t border-slate-200">
          <button 
            onClick={() => openNewTaskModal()}
            className={`w-full bg-[${BRAND_COLORS.verdeMedio}] hover:bg-[${BRAND_COLORS.verdeEscuro}] text-[${BRAND_COLORS.preto}] hover:text-white font-bold py-3 rounded-xl shadow-md transition-all flex items-center justify-center space-x-2`}
          >
            <Plus className="w-5 h-5" />
            <span>Crear Tarea</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top Bar (Dark/Premium Style) */}
        <header className={`h-16 bg-[${BRAND_COLORS.preto}] border-b border-white/10 flex items-center justify-between px-6 z-10`}>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center">
            {activeTab === 'dashboard' && 'Visión General'}
            {activeTab === 'kanban' && 'Tablero de Procesos'}
            {activeTab === 'calendar' && 'Calendario de Equipo'}
            {activeTab === 'matrix' && 'Matriz de Eisenhower'}
          </h1>
          
          {/* Team Filter */}
          <div className="flex items-center space-x-3 bg-white/10 p-1.5 rounded-lg border border-white/5">
            <span className="text-sm text-slate-300 font-medium px-2">Filtro:</span>
            <div className="flex space-x-1">
              <button 
                onClick={() => setFilterAssignee('all')}
                className={`px-3 py-1 text-sm rounded-md transition-colors font-semibold ${filterAssignee === 'all' ? `bg-[${BRAND_COLORS.verdeMedio}] text-[${BRAND_COLORS.preto}]` : 'text-slate-300 hover:bg-white/10'}`}
              >
                Todos
              </button>
              {TEAM.map(member => (
                <button
                  key={member.id}
                  onClick={() => setFilterAssignee(member.id)}
                  className={`px-3 py-1 text-sm rounded-md transition-colors font-semibold flex items-center space-x-1 ${filterAssignee === member.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-300 hover:bg-white/10'}`}
                >
                  <span className={`w-2 h-2 rounded-full ${member.color.split(' ')[0]}`}></span>
                  <span>{member.name}</span>
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Main Workspace */}
        <main className={`flex-1 p-6 overflow-hidden ${activeTab === 'kanban' || activeTab === 'matrix' ? 'overflow-x-auto' : ''}`}>
          
          {/* Dashboard */}
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-in fade-in duration-300 h-full overflow-y-auto pb-10">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 col-span-1 md:col-span-4 flex justify-between items-center bg-gradient-to-r from-slate-50 to-white">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-1">Resumen del Mes</h2>
                  <p className="text-slate-500">Métricas actuales del equipo Swira.</p>
                </div>
                <div className="flex space-x-3">
                  <button 
                    onClick={() => setIsNewClientModalOpen(true)}
                    className={`px-4 py-2 bg-white text-slate-700 border border-slate-200 text-sm font-bold rounded-lg shadow-sm hover:bg-slate-50 transition-colors flex items-center`}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Nuevo Cliente
                  </button>
                  <button 
                    onClick={() => setIsResetConfirmOpen(true)}
                    className={`px-4 py-2 bg-[${BRAND_COLORS.preto}] text-white text-sm font-bold rounded-lg shadow-sm hover:bg-slate-800 transition-colors flex items-center`}
                  >
                    <Activity className="w-4 h-4 mr-2" />
                    Iniciar Nuevo Mes
                  </button>
                </div>
              </div>

              {[
                { label: 'Total Pendientes', val: filteredTasks.filter(t => t.status === 'todo').length, color: 'text-slate-700', icon: Circle },
                { label: 'En Proceso', val: filteredTasks.filter(t => t.status === 'in_progress').length, color: 'text-blue-600', icon: Activity },
                { label: 'Fuegos a apagar', val: filteredTasks.filter(t => t.status === 'fire').length, color: 'text-red-600', icon: Circle },
                { label: 'Completadas', val: filteredTasks.filter(t => t.status === 'done').length, color: `text-[${BRAND_COLORS.verdeEscuro}]`, icon: CheckCircle2 }
              ].map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between group hover:shadow-md transition-shadow">
                  <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
                    <p className={`text-4xl font-black ${stat.color}`}>{stat.val}</p>
                  </div>
                  <div className={`p-4 rounded-full bg-slate-50 group-hover:scale-110 transition-transform ${stat.color.replace('text-', 'bg-').replace('600', '100').replace('700', '100')}`}>
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                </div>
              ))}

              {/* Progreso por Cliente */}
              <div className="col-span-1 md:col-span-4 mt-2">
                <h3 className="text-xl font-bold text-slate-800 mb-4 border-b border-slate-200 pb-2 flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-slate-500" />
                  Progreso por Cliente (Clic para planificar)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {clients.map(client => {
                    const clientTasks = tasks.filter(t => t.client === client.id);
                    const doneTasks = clientTasks.filter(t => t.status === 'done').length;
                    const totalTasks = clientTasks.length;
                    const percentage = totalTasks === 0 ? 0 : Math.round((doneTasks / totalTasks) * 100);
                    
                    return (
                      <div 
                        key={client.id} 
                        onClick={() => setSelectedClientForModal(client)}
                        className={`bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:border-[${BRAND_COLORS.verdeMedio}] transition-all flex flex-col group relative overflow-hidden cursor-pointer`}
                        title="Haz clic para planificar el trabajo de este cliente"
                      >
                        {/* Pequeña tira de color de marca si está al 100% */}
                        {percentage === 100 && totalTasks > 0 && (
                          <div className={"absolute left-0 top-0 bottom-0 w-1 bg-[" + BRAND_COLORS.verdeEscuro + "]"}></div>
                        )}
                        
                        <div className="flex justify-between items-start mb-4 pl-1">
                          <span className={`text-sm font-bold px-2.5 py-1 rounded-md uppercase tracking-wide truncate max-w-[65%] ${client.type === 'internal' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-700'}`}>
                            {client.name}
                          </span>
                          <span className={"text-xs font-bold px-2 py-1 rounded-md border " + (percentage === 100 && totalTasks > 0 ? `bg-[${BRAND_COLORS.verdeMedio}]/20 text-[${BRAND_COLORS.verdeEscuro}] border-[${BRAND_COLORS.verdeMedio}]/30` : 'bg-slate-50 text-slate-500 border-slate-200')}>
                            {doneTasks} / {totalTasks} <span className="hidden sm:inline">hechas</span>
                          </span>
                        </div>
                        
                        <div className="flex-1 flex flex-col justify-end mt-2 pl-1">
                          <div className="flex justify-between text-[10px] uppercase tracking-wider mb-1.5 font-bold text-slate-400">
                            <span>Avance</span>
                            <span className={percentage === 100 && totalTasks > 0 ? `text-[${BRAND_COLORS.verdeEscuro}]` : ''}>{percentage}%</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div 
                              className={"h-2 rounded-full transition-all duration-500 ease-out " + (percentage === 100 ? `bg-[${BRAND_COLORS.verdeEscuro}]` : `bg-[${BRAND_COLORS.verdeMedio}]`)}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Kanban */}
          {activeTab === 'kanban' && (
            <div className="flex h-full space-x-6 pb-2 animate-in slide-in-from-right-4 duration-300">
              {STATUSES.map(status => {
                // Filtro Inteligente: Mostrar SOLO las tareas con fecha de HOY o atrasadas.
                const kanbanTasks = filteredTasks.filter(t => {
                   if (!t.dueDate) return false; // Ocultar tareas sin planificar (Backlog)
                   return t.dueDate <= todayStr; // Mostrar si es hoy o de días anteriores
                });

                return (
                  <div 
                    key={status.id} 
                    className="flex-1 flex flex-col min-w-[300px] bg-slate-100/50 rounded-2xl border border-slate-200/60 overflow-hidden"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, status.id)}
                  >
                    <div className={`px-4 py-3 border-b border-slate-200 flex justify-between items-center bg-white shadow-sm z-10`}>
                      <h3 className="font-bold text-slate-700 flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-2 ${status.color.split(' ')[0]}`}></div>
                        {status.label}
                      </h3>
                      <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2.5 py-1 rounded-full border border-slate-200">
                        {kanbanTasks.filter(t => t.status === status.id).length}
                      </span>
                    </div>
                    <div className="flex-1 p-3 overflow-y-auto custom-scrollbar space-y-3">
                      {sortTasks(kanbanTasks.filter(t => t.status === status.id)).map(task => (
                        <TaskCard key={task.id} task={task} />
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Calendario */}
          {activeTab === 'calendar' && (
            <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in duration-300">
              <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                <div className="flex items-center space-x-4">
                  <h2 className="text-lg font-bold text-slate-800 flex items-center w-48">
                    <CalendarDays className={`w-5 h-5 mr-2 text-[${BRAND_COLORS.verdeMedio}]`} />
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </h2>
                  <div className="flex items-center space-x-2">
                    <button onClick={prevPeriod} className="p-1.5 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-200 shadow-sm"><ChevronLeft className="w-5 h-5 text-slate-600" /></button>
                    <button onClick={nextPeriod} className="p-1.5 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-200 shadow-sm"><ChevronRight className="w-5 h-5 text-slate-600" /></button>
                  </div>
                </div>
                
                <div className="flex bg-slate-200/50 p-1 rounded-lg">
                  <button 
                    onClick={() => setCalendarView('month')}
                    className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all ${calendarView === 'month' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >Mes</button>
                  <button 
                    onClick={() => setCalendarView('week')}
                    className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all ${calendarView === 'week' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >Semana</button>
                  <button 
                    onClick={() => setCalendarView('day')}
                    className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all ${calendarView === 'day' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >Día</button>
                </div>
              </div>

              {calendarView === 'month' ? (
                <>
                  <div className="grid grid-cols-7 border-b border-slate-200 bg-white">
                    {dayNames.map((day, i) => (
                      <div key={day} className={`py-3 text-center text-xs font-bold ${i >= 5 ? 'text-slate-400 bg-slate-50' : 'text-slate-500'}`}>
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="flex-1 grid grid-cols-7 grid-rows-5 bg-slate-100 gap-px overflow-y-auto">
                    {getDaysInMonth(currentDate).map((date, i) => {
                      const dateStr = toLocalISODate(date);
                      const dayTasks = dateStr ? filteredTasks.filter(t => t.dueDate === dateStr) : [];
                      const isToday = dateStr === toLocalISODate(new Date());
                      const isWeekend = date ? (date.getDay() === 0 || date.getDay() === 6) : false;
                      
                      return (
                        <div 
                          key={i} 
                          className={`min-h-[120px] bg-white p-2 flex flex-col transition-colors
                            ${!date ? 'bg-slate-50/50' : ''} 
                            ${isWeekend ? 'bg-slate-100/80 repeating-linear-gradient-45 cursor-not-allowed' : 'hover:bg-slate-50 cursor-pointer'}
                          `}
                          onClick={() => { if(date && !isWeekend) openNewTaskModal(dateStr) }}
                          onDragOver={(e) => { if(date && !isWeekend) handleDragOver(e); }}
                          onDrop={(e) => { if(date && !isWeekend) handleCalendarDrop(e, dateStr, null); }}
                        >
                          {date && (
                            <>
                              <div className="flex justify-between items-center mb-2">
                                <span className={`text-xs font-bold w-7 h-7 flex items-center justify-center rounded-full ${isToday ? `bg-[${BRAND_COLORS.verdeMedio}] text-[${BRAND_COLORS.preto}] shadow-md` : 'text-slate-700'}`}>
                                  {date.getDate()}
                                </span>
                                {isWeekend && <span className="text-[9px] font-bold text-slate-400 tracking-wider">DESCANSO</span>}
                              </div>
                              <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
                                {dayTasks.map(task => <TaskCard key={task.id} task={task} compact />)}
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="flex flex-col flex-1 overflow-hidden bg-white">
                  {/* Week & Day View Header */}
                  <div className="flex border-b border-slate-200 bg-white shadow-sm z-20">
                    <div className="w-16 flex-shrink-0 border-r border-slate-200 bg-slate-50"></div>
                    {(calendarView === 'week' ? getDaysInWeek(currentDate).slice(0, 5) : [currentDate]).map((date, i) => {
                      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                      return (
                      <div key={i} className={`flex-1 min-w-0 py-3 text-center text-xs font-bold border-r border-slate-200 ${isWeekend ? 'text-slate-400 bg-slate-50 repeating-linear-gradient-45' : 'text-slate-500'}`}>
                        <div className="uppercase mb-1">{dayNames[date.getDay() === 0 ? 6 : date.getDay() - 1]}</div>
                        <div className={`inline-flex items-center justify-center w-7 h-7 rounded-full ${toLocalISODate(date) === toLocalISODate(new Date()) ? 'bg-[#26d966] text-[#000000] shadow-md' : 'text-slate-800'}`}>
                          {date.getDate()}
                        </div>
                      </div>
                    )})}
                  </div>

                  {/* All-Day / Unscheduled section */}
                  <div className="flex border-b-4 border-slate-200 bg-white z-10 shadow-sm">
                    <div className="w-16 flex-shrink-0 border-r border-slate-200 bg-slate-50 flex items-center justify-center p-2">
                      <span className="text-[10px] font-bold text-slate-400 text-center uppercase leading-tight">Sin<br/>Hora</span>
                    </div>
                    {(calendarView === 'week' ? getDaysInWeek(currentDate).slice(0, 5) : [currentDate]).map((date, i) => {
                      const dateStr = toLocalISODate(date);
                      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                      const dayTasks = filteredTasks.filter(t => t.dueDate === dateStr && !t.startTime);
                      return (
                        <div
                          key={i}
                          className={`flex-1 min-w-0 p-1 border-r border-slate-200 min-h-[60px] overflow-hidden ${isWeekend ? 'bg-slate-100/80 repeating-linear-gradient-45 cursor-not-allowed' : 'hover:bg-slate-50'}`}
                          onDragOver={(e) => { if(!isWeekend) handleDragOver(e); }}
                          onDrop={(e) => { if(!isWeekend) handleCalendarDrop(e, dateStr, null); }}
                          onClick={() => { if(!isWeekend) openNewTaskModal(dateStr) }}
                        >
                          <div className="max-h-[120px] overflow-y-auto overflow-x-hidden custom-scrollbar pr-1 w-full">
                            {dayTasks.map(task => <TaskCard key={task.id} task={task} compact />)}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Scrollable Time Grid */}
                  <div className="flex-1 overflow-y-auto bg-white custom-scrollbar">
                    <div className="flex flex-col relative min-h-max">
                      {Array.from({length: 14}, (_, i) => `${(i + 8).toString().padStart(2, '0')}:00`).map((hourStr, hourIdx) => (
                        <div key={hourIdx} className="flex border-b border-slate-100 min-h-[80px]">
                          <div className="w-16 flex-shrink-0 border-r border-slate-200 bg-slate-50 relative">
                            <span className="absolute top-2 right-2 text-[10px] font-bold text-slate-400">{hourStr}</span>
                          </div>
                          {(calendarView === 'week' ? getDaysInWeek(currentDate).slice(0, 5) : [currentDate]).map((date, dayIdx) => {
                            const dateStr = toLocalISODate(date);
                            const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                            const hourPrefix = hourStr.split(':')[0]; // "19"
                            const hourTasks = filteredTasks.filter(t =>
                              t.dueDate === dateStr &&
                              t.startTime &&
                              t.startTime.startsWith(hourPrefix)
                            );

                            return (
                              <div
                                key={dayIdx}
                                className={`flex-1 min-w-0 p-1 border-r border-slate-100 overflow-hidden ${isWeekend ? 'bg-slate-100/80 repeating-linear-gradient-45 cursor-not-allowed' : 'hover:bg-blue-50/30 transition-colors'}`}
                                onDragOver={(e) => { if(!isWeekend) handleDragOver(e); }}
                                onDrop={(e) => { if(!isWeekend) handleCalendarDrop(e, dateStr, hourStr); }}
                                onClick={(e) => {
                                  // Abre el creador de tareas autocompletando la hora seleccionada
                                  if (e.target === e.currentTarget && !isWeekend) {
                                    setEditingTask(null);
                                    setSelectedTemplate('');
                                    setSelectedDateForNewTask(dateStr);
                                    setIsModalOpen(true);
                                    setTimeout(() => {
                                       const startTimeInput = document.querySelector<HTMLInputElement>('input[name="startTime"]');
                                       if(startTimeInput) startTimeInput.value = hourStr;
                                    }, 50);
                                  }
                                }}
                              >
                                <div className="w-full flex flex-col gap-1 overflow-x-hidden">
                                  {hourTasks.map(task => <TaskCard key={task.id} task={task} compact />)}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Matriz Imp/Urg */}
          {activeTab === 'matrix' && (
            <div className="flex flex-col h-full animate-in fade-in duration-300">
               <div className="mb-4 flex items-center justify-between">
                 <h2 className="text-xl font-bold text-slate-800">Matriz de Eisenhower</h2>
                 <p className="text-sm text-slate-500">Haz clic en las pelotas para editar la tarea. El sistema clasifica automáticamente por fechas.</p>
               </div>
               
               <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-4">
                  {QUADRANTS.map(quad => {
                    const quadTasks = filteredTasks.filter(t => {
                       if (!t.dueDate) return false; // Ocultar tareas sin planificar (Backlog)

                       // Lógica Inteligente de Cuadrantes
                       const isPending = t.status !== 'done';
                       const isTodayOrOverdue = isPending && t.dueDate && t.dueDate <= todayStr;
                       const isThisWeek = isPending && t.dueDate && t.dueDate > todayStr && t.dueDate <= endOfWeekStr;
                       
                       let calculatedQuad = '';
                       
                       // 1. Si es de hoy o atrasada -> Siempre a Hacer Ya (Q1)
                       if (isTodayOrOverdue) {
                           calculatedQuad = 'q1';
                       } 
                       // 2. Si es para el resto de la semana -> Siempre a Planificar (Q2)
                       else if (isThisWeek) {
                           calculatedQuad = 'q2';
                       } 
                       // 3. Si no tiene fecha o es de próximas semanas -> Usa las barras de Urgencia/Importancia
                       else {
                           const isU = parseInt(t.urgency) >= 4;
                           const isI = parseInt(t.importance) >= 4;
                           if (isU && isI) calculatedQuad = 'q1';
                           else if (!isU && isI) calculatedQuad = 'q2';
                           else if (isU && !isI) calculatedQuad = 'q3';
                           else calculatedQuad = 'q4';
                       }
                       
                       return calculatedQuad === quad.id;
                    });

                    return (
                      <div 
                        key={quad.id}
                        onDragOver={handleDragOver}
                        onDrop={(e) => {
                           let newU, newI;
                           if (quad.id === 'q1') { newU = 5; newI = 5; }
                           if (quad.id === 'q2') { newU = 2; newI = 5; }
                           if (quad.id === 'q3') { newU = 5; newI = 2; }
                           if (quad.id === 'q4') { newU = 2; newI = 2; }
                           handleMatrixDrop(e, newU, newI);
                        }}
                        className={`border-2 rounded-2xl p-4 flex flex-col ${quad.color} bg-opacity-40 transition-colors`}
                      >
                         <h3 className="font-bold text-slate-800 mb-3 border-b border-black/10 pb-2">{quad.label}</h3>
                         
                         {/* Contenedor de Pelotas */}
                         <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 flex flex-wrap gap-3 content-start">
                           {quadTasks.map(task => {
                             // Color según el asignado o color por defecto de marca
                             const bgClass = task.assignees.length > 0 
                                ? TEAM.find(m => m.id === task.assignees[0])?.color.split(' ')[0] 
                                : `bg-[${BRAND_COLORS.preto}]`;
                             
                             // Inicial del cliente
                             const clientInitial = clients.find(c => c.id === task.client)?.name.charAt(0).toUpperCase() || 'S';

                             return (
                               <div 
                                 key={task.id}
                                 draggable
                                 onDragStart={(e) => handleDragStart(e, task.id)}
                                 onDragEnd={handleDragEnd}
                                 onClick={() => openEditModal(task)}
                                 className={`w-12 h-12 rounded-full ${bgClass} text-white text-lg font-black flex items-center justify-center cursor-pointer shadow-md hover:scale-110 hover:shadow-lg transition-all relative group`}
                               >
                                 {clientInitial}
                                 
                                 {/* Etiqueta Tooltip Oculta (Aparece al pasar el ratón) */}
                                 <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 bg-gray-900 text-white text-xs p-2 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none z-50 transition-opacity">
                                   <p className="font-bold border-b border-gray-700 pb-1 mb-1 truncate">{task.title}</p>
                                   <p className="text-gray-300">📅 {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Sin fecha asignada'}</p>
                                   <p className="text-gray-400 mt-1 truncate">Cliente: {clients.find(c => c.id === task.client)?.name}</p>
                                 </div>
                               </div>
                             );
                           })}
                         </div>
                      </div>
                    )
                  })}
               </div>
            </div>
          )}

        </main>
      </div>

      {/* Modal Nueva/Editar Tarea */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className={`px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-[${BRAND_COLORS.preto}]`}>
              <h3 className="text-xl font-bold text-white flex items-center">
                {editingTask ? <Edit3 className="w-5 h-5 mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
                {editingTask ? 'Editar Tarea' : 'Nueva Tarea'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-white/70 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form 
              className="p-6 overflow-y-auto flex-1 space-y-5"
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                
                // Determinar el título
                let title = '';
                if (selectedTemplate === 'other') {
                  title = String(formData.get('customTitle') || '');
                } else {
                  title = selectedTemplate || (editingTask ? editingTask.title : 'Nueva Tarea');
                }

                // Determinar descripción base
                const descValue = String(formData.get('desc') || '');
                const tmpl = STANDARD_WORKFLOW.find(w => w.title === title);

                saveTask({
                  title: title,
                  desc: descValue,
                  client: formData.get('client'),
                  assignees: formData.getAll('assignees'),
                  urgency: formData.get('urgency'),
                  importance: formData.get('importance'),
                  dueDate: formData.get('dueDate'),
                  startTime: formData.get('startTime') || null,
                  status: formData.get('status') || (editingTask ? editingTask.status : 'todo'),
                  time: tmpl?.time || editingTask?.time,
                  quantity: tmpl?.quantity || editingTask?.quantity,
                  people: tmpl?.people || editingTask?.people,
                });
              }}
            >
              {/* Tipo de Tarea */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">¿Qué tipo de tarea es?</label>
                  <select 
                    value={selectedTemplate}
                    onChange={(e) => setSelectedTemplate(e.target.value)}
                    className={`w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[${BRAND_COLORS.verdeMedio}] outline-none text-slate-800 font-medium`}
                    required
                  >
                    <option value="" disabled>-- Selecciona un proceso estándar --</option>
                    {STANDARD_WORKFLOW.map((wf, idx) => (
                      <option key={idx} value={wf.title}>{wf.title}</option>
                    ))}
                    <option value="other">✏️ Otra tarea (Escribir manualmente)...</option>
                  </select>
                </div>

                {selectedTemplate === 'other' && (
                  <div className="animate-in slide-in-from-top-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Título de la Tarea</label>
                    <input 
                      type="text" 
                      name="customTitle" 
                      placeholder="Ej: Reunión con cliente, Revisión de logos..."
                      defaultValue={editingTask ? editingTask.title : ''} 
                      className={`w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[${BRAND_COLORS.verdeMedio}] outline-none text-slate-800`} 
                      required 
                    />
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Cliente / Proyecto</label>
                  <select name="client" defaultValue={editingTask?.client || clients[0]?.id} className={`w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[${BRAND_COLORS.verdeMedio}] outline-none text-slate-700`}>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Asignar a (Múltiple)</label>
                  <div className="flex flex-wrap gap-2">
                    {TEAM.map(t => (
                      <label key={t.id} className="flex items-center space-x-2 bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors select-none">
                        <input 
                          type="checkbox" 
                          name="assignees" 
                          value={t.id} 
                          defaultChecked={editingTask ? editingTask.assignees.includes(t.id) : false} 
                          className={`w-4 h-4 accent-[${BRAND_COLORS.verdeMedio}] rounded border-slate-300 text-[${BRAND_COLORS.preto}]`} 
                        />
                        <span className="text-sm font-bold text-slate-700">{t.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Fecha Programada</label>
                  <input 
                    type="date" 
                    name="dueDate" 
                    defaultValue={editingTask?.dueDate || selectedDateForNewTask || ''}
                    className={`w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[${BRAND_COLORS.verdeMedio}] outline-none text-slate-700`} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Hora (Opcional)</label>
                  <input 
                    type="time" 
                    name="startTime" 
                    defaultValue={editingTask?.startTime || ''}
                    className={`w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[${BRAND_COLORS.verdeMedio}] outline-none text-slate-700`} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Estado</label>
                  <select name="status" defaultValue={editingTask?.status || 'todo'} className={`w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[${BRAND_COLORS.verdeMedio}] outline-none appearance-none font-semibold text-[${BRAND_COLORS.verdeEscuro}]`}>
                    {STATUSES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1 flex justify-between">
                    Urgencia 
                    <span className="text-[10px] bg-red-100 text-red-700 px-2 rounded-full">1=Baja, 5=Máxima</span>
                  </label>
                  <input type="range" name="urgency" min="1" max="5" defaultValue={editingTask?.urgency || STANDARD_WORKFLOW.find(w => w.title === selectedTemplate)?.urgency || 3} className="w-full accent-red-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1 flex justify-between">
                    Importancia
                    <span className="text-[10px] bg-blue-100 text-blue-700 px-2 rounded-full">1=Baja, 5=Máxima</span>
                  </label>
                  <input type="range" name="importance" min="1" max="5" defaultValue={editingTask?.importance || STANDARD_WORKFLOW.find(w => w.title === selectedTemplate)?.importance || 3} className="w-full accent-blue-500" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Notas / Enlaces (Opcional)</label>
                <textarea 
                  name="desc" 
                  rows={3}
                  defaultValue={editingTask?.desc || STANDARD_WORKFLOW.find(w => w.title === selectedTemplate)?.desc || ''} 
                  className={`w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[${BRAND_COLORS.verdeMedio}] outline-none text-slate-700`}
                ></textarea>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                {editingTask ? (
                  <button type="button" onClick={() => deleteTask(editingTask.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors flex items-center font-bold">
                    <Trash2 className="w-4 h-4 mr-2" /> Eliminar
                  </button>
                ) : <div></div>}
                <div className="space-x-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-lg font-bold transition-colors">Cancelar</button>
                  <button type="submit" className={`px-6 py-2.5 bg-[${BRAND_COLORS.verdeMedio}] hover:bg-[${BRAND_COLORS.verdeEscuro}] text-[${BRAND_COLORS.preto}] hover:text-white rounded-lg font-bold shadow-md transition-all`}>
                    Guardar Tarea
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Planificación por Cliente (BACKLOG / INBOX) */}
      {selectedClientForModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className={`px-6 py-4 border-b border-white/10 flex justify-between items-center bg-[${BRAND_COLORS.preto}]`}>
              <h3 className="text-xl font-bold text-white flex items-center">
                Panel de Planificación: <span className={`text-[${BRAND_COLORS.verdeMedio}] ml-2 uppercase tracking-wide`}>{selectedClientForModal.name}</span>
              </h3>
              <button onClick={() => setSelectedClientForModal(null)} className="text-white/70 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 bg-slate-50">
              <p className="text-sm text-slate-500 mb-6 font-medium">Asigna el equipo, fecha y hora a las tareas pendientes de este cliente. Al ponerles fecha, aparecerán automáticamente en el Calendario y Tablero de procesos.</p>
              
              <div className="space-y-3">
                {tasks.filter(t => t.client === selectedClientForModal.id).map(task => (
                  <div key={task.id} className={`bg-white border rounded-xl p-4 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 shadow-sm transition-all ${task.dueDate && task.assignees.length > 0 ? `border-[${BRAND_COLORS.verdeMedio}]/40 bg-[${BRAND_COLORS.verdeMedio}]/5` : 'border-slate-200 hover:border-slate-300'}`}>
                    
                    {/* Info de Tarea */}
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-bold truncate ${task.dueDate ? `text-[${BRAND_COLORS.verdeEscuro}]` : 'text-slate-800'}`}>{task.title}</h4>
                      <div className="flex flex-wrap gap-2 mt-1.5 text-[10px] text-slate-500 font-medium">
                        {task.quantity && <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{task.quantity}</span>}
                        {task.time && <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200 flex items-center"><Clock className="w-3 h-3 mr-0.5"/>{task.time}</span>}
                        {task.people && <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200 flex items-center"><Users className="w-3 h-3 mr-0.5"/>{task.people}p</span>}
                      </div>
                    </div>

                    {/* Controles de Planificación */}
                    <div className="flex flex-wrap lg:flex-nowrap items-center gap-4 bg-slate-50 p-2.5 rounded-lg border border-slate-100 w-full xl:w-auto">
                      
                      {/* Asignar Equipo Rápidamente */}
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">¿Quién lo hace?</span>
                        <div className="flex space-x-1">
                          {TEAM.map(member => {
                            const isAssigned = task.assignees.includes(member.id);
                            return (
                              <button
                                key={member.id}
                                onClick={() => {
                                  const newAssignees = isAssigned 
                                    ? task.assignees.filter(id => id !== member.id)
                                    : [...task.assignees, member.id];
                                  setTasks(prev => prev.map(t => t.id === task.id ? { ...t, assignees: newAssignees } : t));
                                }}
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all border-2 ${isAssigned ? `${member.color} border-white shadow-md scale-110` : 'bg-white text-slate-400 border-slate-200 hover:bg-slate-200'}`}
                                title={member.name}
                              >
                                {member.avatar}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="w-px h-10 bg-slate-200 hidden lg:block mx-1"></div>

                      {/* Asignar Fecha y Hora */}
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">Fecha de Entrega</span>
                        <input 
                          type="date" 
                          value={task.dueDate || ''}
                          onChange={(e) => setTasks(prev => prev.map(t => t.id === task.id ? { ...t, dueDate: e.target.value } : t))}
                          className={`px-3 py-1.5 text-sm bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-[${BRAND_COLORS.verdeMedio}] outline-none text-slate-700 font-semibold cursor-pointer`} 
                        />
                      </div>

                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">Hora (Opcional)</span>
                        <input 
                          type="time" 
                          value={task.startTime || ''}
                          onChange={(e) => setTasks(prev => prev.map(t => t.id === task.id ? { ...t, startTime: e.target.value } : t))}
                          className={`px-3 py-1.5 text-sm bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-[${BRAND_COLORS.verdeMedio}] outline-none text-slate-700 font-semibold cursor-pointer`} 
                        />
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Confirmación Reset Mensual */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[70] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col text-center p-8">
            <div className={`w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4`}>
              <Activity className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-2">¿Iniciar nuevo mes?</h3>
            <p className="text-slate-500 mb-6 font-medium">
              Esto borrará todo el progreso actual. Las tareas de todos los clientes volverán a estar al 0%, sin fechas asignadas y volverán al panel de planificación (Inbox).
            </p>
            <div className="flex space-x-3 justify-center">
              <button 
                onClick={() => setIsResetConfirmOpen(false)} 
                className="px-5 py-2.5 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-xl font-bold transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={() => {
                  setTasks(generateInitialTasks(clients));
                  setIsResetConfirmOpen(false);
                }} 
                className={`px-5 py-2.5 bg-[${BRAND_COLORS.preto}] text-white hover:bg-slate-800 rounded-xl font-bold shadow-md transition-all`}
              >
                Sí, resetear todo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Nuevo Cliente */}
      {isNewClientModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[70] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
            <div className={`px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-[${BRAND_COLORS.preto}]`}>
              <h3 className="text-xl font-bold text-white flex items-center">
                <Plus className="w-5 h-5 mr-2" />
                Registrar Nuevo Cliente
              </h3>
              <button onClick={() => setIsNewClientModalOpen(false)} className="text-white/70 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form 
              className="p-6"
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const clientName = String(formData.get('clientName') || '');
                if (!clientName.trim()) return;

                const newClient = { 
                  id: 'c_' + Date.now(), 
                  name: clientName, 
                  type: 'external' 
                };

                // Añadimos el cliente a la lista
                setClients(prev => [...prev, newClient]);
                
                // Generamos sus 11 tareas en el Backlog
                const newTasks = generateTasksForClient(newClient);
                setTasks(prev => [...prev, ...newTasks]);
                
                setIsNewClientModalOpen(false);
              }}
            >
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Nombre del Cliente / Empresa</label>
                <input 
                  type="text" 
                  name="clientName" 
                  placeholder="Ej: Swira Studios..."
                  className={`w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[${BRAND_COLORS.verdeMedio}] outline-none text-slate-800 font-medium`} 
                  required 
                  autoFocus
                />
                <p className="text-xs text-slate-500 mt-2">
                  Al crearlo, se generarán automáticamente sus 11 tareas base en su panel de planificación (Inbox).
                </p>
              </div>

              <div className="flex space-x-3 justify-end pt-4 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setIsNewClientModalOpen(false)} 
                  className="px-5 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-bold transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className={`px-5 py-2 bg-[${BRAND_COLORS.verdeMedio}] text-[${BRAND_COLORS.preto}] hover:bg-[${BRAND_COLORS.verdeEscuro}] hover:text-white rounded-lg font-bold shadow-md transition-all`}
                >
                  Guardar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Estilos Globales para Scrollbars */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        .repeating-linear-gradient-45 { background-image: repeating-linear-gradient(45deg, #f1f5f9 0, #f1f5f9 10px, #e2e8f0 10px, #e2e8f0 20px); }
      `}} />
    </div>
  );
}
