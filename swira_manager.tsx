'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import type { User } from '@supabase/supabase-js';
import { Plus, X, CheckCircle2, Circle, Clock, Tag, ChevronLeft, ChevronRight, CalendarDays, LayoutDashboard, Trello, Activity, Calendar as CalendarIcon, Users, Edit3, Trash2, FileText, Upload, Receipt, Loader2, AlertCircle, Euro, LogOut, ShieldCheck, Building2, ArrowLeft, Search, FileDown, BriefcaseBusiness, Camera, Link2, ExternalLink, SlidersHorizontal, RotateCcw, WalletCards, AlertTriangle } from 'lucide-react';
import { supabase } from './lib/supabase';

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
  { id: 'c1', name: 'Alcacenter', type: 'external', createdAt: null, updatedAt: null, startMonth: null, avatarPath: null, importantLinks: [], recurringAmount: 0 },
  { id: 'c2', name: 'inku_sushi', type: 'external', createdAt: null, updatedAt: null, startMonth: null, avatarPath: null, importantLinks: [], recurringAmount: 0 },
  { id: 'c3', name: 'Merca China', type: 'external', createdAt: null, updatedAt: null, startMonth: null, avatarPath: null, importantLinks: [], recurringAmount: 0 },
  { id: 'c4', name: 'Shushi Tok', type: 'external', createdAt: null, updatedAt: null, startMonth: null, avatarPath: null, importantLinks: [], recurringAmount: 0 },
  { id: 'c5', name: 'SpaceZoneJump', type: 'external', createdAt: null, updatedAt: null, startMonth: null, avatarPath: null, importantLinks: [], recurringAmount: 0 },
  { id: 'c6', name: 'swiraes', type: 'external', createdAt: null, updatedAt: null, startMonth: null, avatarPath: null, importantLinks: [], recurringAmount: 0 },
  { id: 'c7', name: 'Welding Systems', type: 'external', createdAt: null, updatedAt: null, startMonth: null, avatarPath: null, importantLinks: [], recurringAmount: 0 }
];

const mapClientFromDb = (client) => ({
  id: client.id,
  name: client.name,
  type: client.type,
  createdAt: client.created_at,
  updatedAt: client.updated_at,
  startMonth: client.start_month,
  avatarPath: client.avatar_path,
  importantLinks: Array.isArray(client.important_links) ? client.important_links : [],
  recurringAmount: Number(client.recurring_amount || 0),
});

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

const INVOICE_STATUSES = [
  { id: 'pending_creation', label: 'Pendiente de hacer', color: 'border-amber-300 bg-amber-50 text-amber-800' },
  { id: 'ready', label: 'Factura hecha · pendiente de enviar', color: 'border-violet-300 bg-violet-50 text-violet-800' },
  { id: 'sent', label: 'Enviada · pendiente de pago', color: 'border-blue-300 bg-blue-50 text-blue-800' },
  { id: 'paid', label: 'Pagada', color: 'border-emerald-300 bg-emerald-50 text-emerald-800' },
];

const mapTaskFromDb = (task) => ({
  id: task.id,
  title: task.title,
  desc: task.description || '',
  client: task.client_id,
  assignees: task.assignees || [],
  urgency: task.urgency,
  importance: task.importance,
  dueDate: task.due_date,
  startTime: task.start_time?.slice(0, 5) || null,
  status: task.status,
  time: task.estimated_time,
  quantity: task.quantity,
  people: task.people,
  createdAt: task.created_at,
  updatedAt: task.updated_at,
});

const mapTaskToDb = (task) => ({
  id: task.id,
  title: task.title,
  description: task.desc || '',
  client_id: task.client,
  assignees: task.assignees || [],
  urgency: Number(task.urgency),
  importance: Number(task.importance),
  due_date: task.dueDate || null,
  start_time: task.startTime || null,
  status: task.status,
  estimated_time: task.time || null,
  quantity: task.quantity || null,
  people: task.people ? Number(task.people) : null,
  updated_at: new Date().toISOString(),
});

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

export default function App({ currentUser }: { currentUser: User }) {
  const isAdmin = currentUser.app_metadata?.role === 'admin';
  const userName = currentUser.user_metadata?.display_name || currentUser.user_metadata?.name || currentUser.email?.split('@')[0] || 'Usuario';
  const [clients, setClients] = useState(INITIAL_CLIENTS);
  const [tasks, setTasks] = useState(() => generateInitialTasks(INITIAL_CLIENTS));
  const [invoices, setInvoices] = useState([]);
  const [storageReady, setStorageReady] = useState(false);
  const [syncError, setSyncError] = useState('');
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [invoiceClientId, setInvoiceClientId] = useState('');
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [invoiceExtrasDraft, setInvoiceExtrasDraft] = useState([]);
  const [billingMonth, setBillingMonth] = useState(() => new Date().toISOString().slice(0, 7));
  const [billingFilter, setBillingFilter] = useState('all');
  const [isUploadingInvoice, setIsUploadingInvoice] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [filterAssignee, setFilterAssignee] = useState('all');
  const [calendarClientFilter, setCalendarClientFilter] = useState('all');
  const [calendarTypeFilter, setCalendarTypeFilter] = useState('all');
  const [calendarStatusFilter, setCalendarStatusFilter] = useState('all');
  const [now, setNow] = useState(() => new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [draggedTask, setDraggedTask] = useState(null);
  const [selectedClientForModal, setSelectedClientForModal] = useState(null); // Nuevo Panel de Cliente
  const [selectedClientProfile, setSelectedClientProfile] = useState(null);
  const [clientSearch, setClientSearch] = useState('');
  const [isNewClientModalOpen, setIsNewClientModalOpen] = useState(false); // Modal de nuevo cliente
  const [isClientProfileModalOpen, setIsClientProfileModalOpen] = useState(false);
  const [isSavingClientProfile, setIsSavingClientProfile] = useState(false);
  const [clientAvatarUrls, setClientAvatarUrls] = useState({});
  const [clientProfileDraft, setClientProfileDraft] = useState({ startMonth: '', recurringAmount: '0', importantLinks: [{ label: 'Carpeta de Drive', url: '' }] });

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedClients = JSON.parse(window.localStorage.getItem('swira-crm-v1-clients') || 'null');
        const savedTasks = JSON.parse(window.localStorage.getItem('swira-crm-v1-tasks') || 'null');

        if (!supabase) {
          if (savedClients) setClients(savedClients);
          if (savedTasks) setTasks(savedTasks);
          return;
        }

        const [clientsResult, tasksResult, invoicesResult] = await Promise.all([
          supabase.from('clients').select('*').order('name'),
          supabase.from('tasks').select('*').order('created_at'),
          supabase.from('invoices').select('*').order('billing_month', { ascending: false }),
        ]);
        const firstError = clientsResult.error || tasksResult.error || invoicesResult.error;
        if (firstError) throw firstError;

        if (!clientsResult.data?.length) {
          setClients(savedClients || INITIAL_CLIENTS);
          setTasks(savedTasks || generateInitialTasks(savedClients || INITIAL_CLIENTS));
        } else {
          setClients(clientsResult.data.map(mapClientFromDb));
          setTasks((tasksResult.data || []).map(mapTaskFromDb));
        }
        setInvoices(invoicesResult.data || []);
        setSyncError('');
      } catch (error) {
        setSyncError(error && typeof error === 'object' && 'message' in error ? String(error.message) : 'No se pudo conectar con Supabase.');
      } finally {
        setStorageReady(true);
      }
    };

    void loadData();
  }, []);

  useEffect(() => {
    if (!storageReady) return;
    window.localStorage.setItem('swira-crm-v1-clients', JSON.stringify(clients));
    window.localStorage.setItem('swira-crm-v1-tasks', JSON.stringify(tasks));
  }, [clients, storageReady, tasks]);

  useEffect(() => {
    if (!supabase || !storageReady) return;
    const clientsWithAvatar = clients.filter(client => client.avatarPath);
    if (!clientsWithAvatar.length) return;
    let isCancelled = false;
    const loadAvatarUrls = async () => {
      const { data, error } = await supabase.storage.from('client-assets').createSignedUrls(clientsWithAvatar.map(client => client.avatarPath), 3600);
      if (error || isCancelled) return;
      setClientAvatarUrls(Object.fromEntries(clientsWithAvatar.map((client, index) => [client.id, data?.[index]?.signedUrl || ''])));
    };
    void loadAvatarUrls();
    const refreshTimer = window.setInterval(() => void loadAvatarUrls(), 50 * 60 * 1000);
    return () => {
      isCancelled = true;
      window.clearInterval(refreshTimer);
    };
  }, [clients, storageReady]);

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
      void updateTask(draggedTask, { status: statusId });
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
      void updateTask(draggedTask, { dueDate: dateStr, startTime: startTimeStr });
    }
    setDraggedTask(null);
  };

  const handleMatrixDrop = (e, newUrgency, newImportance) => {
    e.preventDefault();
    if (draggedTask) {
      void updateTask(draggedTask, { urgency: newUrgency, importance: newImportance });
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

  const updateTask = async (id, changes) => {
    const currentTask = tasks.find(task => task.id === id);
    if (!currentTask) return;
    const nextTask = { ...currentTask, ...changes };
    setTasks(prev => prev.map(task => task.id === id ? nextTask : task));
    if (!supabase) return;
    const { error } = await supabase.from('tasks').update(mapTaskToDb(nextTask)).eq('id', id);
    if (error) {
      setTasks(prev => prev.map(task => task.id === id ? currentTask : task));
      setSyncError(error.message);
    }
  };

  const saveTask = async (taskData) => {
    const nextTask = editingTask
      ? { ...editingTask, ...taskData }
      : { ...taskData, id: Date.now().toString() };

    if (supabase) {
      const query = editingTask
        ? supabase.from('tasks').update(mapTaskToDb(nextTask)).eq('id', editingTask.id)
        : supabase.from('tasks').insert(mapTaskToDb(nextTask));
      const { error } = await query;
      if (error) {
        setSyncError(error.message);
        return;
      }
    }

    setTasks(prev => editingTask
      ? prev.map(task => task.id === editingTask.id ? nextTask : task)
      : [...prev, nextTask]);
    setIsModalOpen(false);
  };

  const deleteTask = async (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    if (supabase) await supabase.from('tasks').delete().eq('id', id);
    setIsModalOpen(false);
  };

  const createClient = async (clientName) => {
    if (!isAdmin || !clientName.trim()) return;
    const newClient = {
      id: 'c_' + Date.now(),
      name: clientName.trim(),
      type: 'external',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      startMonth: new Date().toISOString().slice(0, 7) + '-01',
      avatarPath: null,
      importantLinks: [],
      recurringAmount: 0,
    };
    const newTasks = generateTasksForClient(newClient);

    if (supabase) {
      const { error: clientError } = await supabase.from('clients').insert({
        id: newClient.id,
        name: newClient.name,
        type: newClient.type,
        start_month: newClient.startMonth,
        important_links: newClient.importantLinks,
        recurring_amount: newClient.recurringAmount,
        updated_at: newClient.updatedAt,
      });
      if (clientError) {
        setSyncError(clientError.message);
        return;
      }
      const { error: tasksError } = await supabase.from('tasks').insert(newTasks.map(mapTaskToDb));
      if (tasksError) {
        setSyncError(tasksError.message);
        return;
      }
    }

    setClients(prev => [...prev, newClient]);
    setTasks(prev => [...prev, ...newTasks]);
    setIsNewClientModalOpen(false);
  };

  const openClientProfileEditor = (client) => {
    setClientProfileDraft({
      startMonth: (client.startMonth || '').slice(0, 7),
      recurringAmount: String(client.recurringAmount || 0),
      importantLinks: client.importantLinks?.length
        ? client.importantLinks.map(link => ({ label: link.label || '', url: link.url || '' }))
        : [{ label: 'Carpeta de Drive', url: '' }],
    });
    setIsClientProfileModalOpen(true);
  };

  const normalizeExternalUrl = (value) => {
    const trimmed = value.trim();
    if (!trimmed) return '';
    return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  };

  const saveClientProfile = async (form) => {
    if (!supabase || !selectedClientProfile || !isAdmin) return;
    setIsSavingClientProfile(true);
    setSyncError('');
    let uploadedAvatarPath = null;
    try {
      const avatarFile = form.get('avatar');
      if (avatarFile instanceof File && avatarFile.size) {
        if (avatarFile.size > 5 * 1024 * 1024) throw new Error('La foto supera el límite de 5 MB.');
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(avatarFile.type)) throw new Error('La foto debe ser JPG, PNG o WebP.');
        const safeName = avatarFile.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9._-]/g, '-');
        uploadedAvatarPath = `${selectedClientProfile.id}/profile-${Date.now()}-${safeName}`;
        const { error: uploadError } = await supabase.storage.from('client-assets').upload(uploadedAvatarPath, avatarFile, {
          contentType: avatarFile.type,
          upsert: false,
        });
        if (uploadError) throw uploadError;
      }

      const importantLinks = clientProfileDraft.importantLinks
        .map(link => ({ label: link.label.trim(), url: normalizeExternalUrl(link.url) }))
        .filter(link => link.label && link.url);
      importantLinks.forEach(link => { new URL(link.url); });
      const startMonth = clientProfileDraft.startMonth ? `${clientProfileDraft.startMonth}-01` : null;
      const recurringAmount = Number(clientProfileDraft.recurringAmount || 0);
      if (!Number.isFinite(recurringAmount) || recurringAmount < 0) throw new Error('La cuota mensual no es válida.');
      const avatarPath = uploadedAvatarPath || selectedClientProfile.avatarPath || null;
      const updatedAt = new Date().toISOString();
      const { data, error } = await supabase.from('clients').update({
        start_month: startMonth,
        avatar_path: avatarPath,
        important_links: importantLinks,
        recurring_amount: recurringAmount,
        updated_at: updatedAt,
      }).eq('id', selectedClientProfile.id).select().single();
      if (error) throw error;

      const updatedClient = mapClientFromDb(data);
      setClients(previous => previous.map(client => client.id === updatedClient.id ? updatedClient : client));
      setSelectedClientProfile(updatedClient);
      setIsClientProfileModalOpen(false);

      const activeMonthKey = new Date().toISOString().slice(0, 7);
      const activeControl = invoices.find(invoice => invoice.client_id === updatedClient.id && invoice.billing_month?.startsWith(activeMonthKey));
      if (activeControl?.status === 'pending_creation' && !activeControl.invoice_path) {
        const extrasTotal = Array.isArray(activeControl.extras) ? activeControl.extras.reduce((sum, extra) => sum + Number(extra.amount || 0), 0) : 0;
        const { data: updatedControl, error: controlError } = await supabase.from('invoices').update({
          recurring_amount: recurringAmount,
          amount: recurringAmount + extrasTotal,
          updated_at: updatedAt,
        }).eq('id', activeControl.id).select().single();
        if (controlError) throw controlError;
        setInvoices(previous => previous.map(invoice => invoice.id === activeControl.id ? updatedControl : invoice));
      }

      if (uploadedAvatarPath) {
        const { data: signedAvatar } = await supabase.storage.from('client-assets').createSignedUrl(uploadedAvatarPath, 3600);
        if (signedAvatar?.signedUrl) setClientAvatarUrls(previous => ({ ...previous, [updatedClient.id]: signedAvatar.signedUrl }));
        if (selectedClientProfile.avatarPath) await supabase.storage.from('client-assets').remove([selectedClientProfile.avatarPath]);
      }
    } catch (error) {
      if (uploadedAvatarPath) await supabase.storage.from('client-assets').remove([uploadedAvatarPath]);
      setSyncError(error instanceof Error ? error.message : 'No se pudo guardar la ficha del cliente.');
    } finally {
      setIsSavingClientProfile(false);
    }
  };

  const signOut = async () => {
    if (supabase) await supabase.auth.signOut();
  };

  const uploadBillingDocument = async (invoiceId, file, kind) => {
    if (!supabase || !file) return null;
    if (file.size > 10 * 1024 * 1024) throw new Error('El archivo supera el límite de 10 MB.');
    const safeName = file.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9._-]/g, '-');
    const path = `${invoiceId}/${kind}-${Date.now()}-${safeName}`;
    const { error } = await supabase.storage.from('billing-documents').upload(path, file, {
      contentType: file.type || undefined,
      upsert: false,
    });
    if (error) throw error;
    return { path, name: file.name };
  };

  const ensureBillingMonth = async (monthKey) => {
    if (!supabase || !isAdmin) return;
    const monthDate = `${monthKey}-01`;
    const eligibleClients = clients.filter(client => !client.startMonth || client.startMonth.slice(0, 7) <= monthKey);
    const existingClientIds = new Set(invoices.filter(invoice => invoice.billing_month?.startsWith(monthKey)).map(invoice => invoice.client_id));
    const missingRecords = eligibleClients.filter(client => !existingClientIds.has(client.id)).map(client => ({
      id: crypto.randomUUID(),
      client_id: client.id,
      billing_month: monthDate,
      recurring_amount: Number(client.recurringAmount || 0),
      extras: [],
      amount: Number(client.recurringAmount || 0),
      status: 'pending_creation',
      notes: '',
      updated_at: new Date().toISOString(),
    }));
    if (!missingRecords.length) return;
    const { error } = await supabase.from('invoices').upsert(missingRecords, { onConflict: 'client_id,billing_month', ignoreDuplicates: true });
    if (error) return setSyncError(error.message);
    const { data, error: refreshError } = await supabase.from('invoices').select('*').eq('billing_month', monthDate);
    if (refreshError) return setSyncError(refreshError.message);
    setInvoices(previous => [...previous.filter(invoice => !invoice.billing_month?.startsWith(monthKey)), ...(data || [])]);
  };

  const openInvoiceEditor = (invoice) => {
    setEditingInvoice(invoice);
    setInvoiceClientId(invoice.client_id);
    setInvoiceExtrasDraft(Array.isArray(invoice.extras) ? invoice.extras.map(extra => ({ concept: extra.concept || '', amount: String(extra.amount || 0) })) : []);
    setIsInvoiceModalOpen(true);
  };

  const saveInvoice = async (form) => {
    if (!supabase) return;
    setIsUploadingInvoice(true);
    setSyncError('');
    try {
      const isExistingInvoice = Boolean(editingInvoice?.id);
      const id = editingInvoice?.id || crypto.randomUUID();
      const invoiceFile = form.get('invoiceFile');
      const receiptFile = form.get('receiptFile');
      const invoiceDocument = invoiceFile instanceof File && invoiceFile.size
        ? await uploadBillingDocument(id, invoiceFile, 'invoice')
        : null;
      const receiptDocument = receiptFile instanceof File && receiptFile.size
        ? await uploadBillingDocument(id, receiptFile, 'receipt')
        : null;
      const status = String(form.get('status') || 'pending_creation');
      const now = new Date().toISOString();
      const extras = invoiceExtrasDraft
        .map(extra => ({ concept: extra.concept.trim(), amount: Number(extra.amount || 0) }))
        .filter(extra => extra.concept && extra.amount > 0);
      const recurringAmount = Number(form.get('recurringAmount') || 0);
      const amount = recurringAmount + extras.reduce((sum, extra) => sum + extra.amount, 0);
      const record = {
        id,
        client_id: String(form.get('clientId')),
        billing_month: `${String(form.get('billingMonth'))}-01`,
        invoice_number: String(form.get('invoiceNumber') || '') || null,
        recurring_amount: recurringAmount,
        extras,
        amount,
        due_date: String(form.get('dueDate') || '') || null,
        status,
        invoice_path: invoiceDocument?.path || editingInvoice?.invoice_path || null,
        invoice_name: invoiceDocument?.name || editingInvoice?.invoice_name || null,
        receipt_path: receiptDocument?.path || editingInvoice?.receipt_path || null,
        receipt_name: receiptDocument?.name || editingInvoice?.receipt_name || null,
        sent_at: status === 'sent' || status === 'paid' ? (editingInvoice?.sent_at || now) : null,
        paid_at: status === 'paid' ? (editingInvoice?.paid_at || now) : null,
        notes: String(form.get('notes') || ''),
        updated_at: now,
      };
      const query = isExistingInvoice
        ? supabase.from('invoices').update(record).eq('id', id)
        : supabase.from('invoices').insert(record);
      const { data, error } = await query.select().single();
      if (error) throw error;
      setInvoices(prev => isExistingInvoice ? prev.map(item => item.id === id ? data : item) : [data, ...prev]);
      setIsInvoiceModalOpen(false);
      setEditingInvoice(null);
    } catch (error) {
      setSyncError(error instanceof Error ? error.message : 'No se pudo guardar la factura.');
    } finally {
      setIsUploadingInvoice(false);
    }
  };

  const updateInvoiceStatus = async (invoice, status) => {
    if (!supabase) return;
    const now = new Date().toISOString();
    const changes = {
      status,
      sent_at: status === 'pending_creation' || status === 'ready' ? null : (invoice.sent_at || now),
      paid_at: status === 'paid' ? (invoice.paid_at || now) : null,
      updated_at: now,
    };
    const { data, error } = await supabase.from('invoices').update(changes).eq('id', invoice.id).select().single();
    if (error) return setSyncError(error.message);
    setInvoices(prev => prev.map(item => item.id === invoice.id ? data : item));
  };

  const openBillingDocument = async (path) => {
    if (!supabase || !path) return;
    const { data, error } = await supabase.storage.from('billing-documents').createSignedUrl(path, 60);
    if (error) return setSyncError(error.message);
    window.open(data.signedUrl, '_blank', 'noopener,noreferrer');
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

  const currentMonthKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
  const filteredTasks = tasks.filter(t => filterAssignee === 'all' || t.assignees.includes(filterAssignee));
  const scheduledThisMonth = tasks.filter(task => task.dueDate?.startsWith(currentMonthKey));
  const scheduledServiceKeys = new Set(scheduledThisMonth.map(task => `${task.client}::${task.title}`));
  const latestUnplannedByService = new Map();
  tasks.filter(task => !task.dueDate).forEach(task => {
    const key = `${task.client}::${task.title}`;
    const previous = latestUnplannedByService.get(key);
    const taskOrder = task.createdAt || task.id;
    const previousOrder = previous?.createdAt || previous?.id || '';
    if (!previous || taskOrder >= previousOrder) latestUnplannedByService.set(key, task);
  });
  const monthlyTasks = [
    ...scheduledThisMonth,
    ...Array.from(latestUnplannedByService.entries())
      .filter(([key]) => !scheduledServiceKeys.has(key))
      .map(([, task]) => task),
  ];
  const periodFilteredTasks = monthlyTasks.filter(task => filterAssignee === 'all' || task.assignees.includes(filterAssignee));
  const calendarTaskTypes = Array.from(new Set(tasks.map(task => task.title))).sort((a, b) => a.localeCompare(b, 'es'));
  const calendarFilteredTasks = filteredTasks.filter(task =>
    (calendarClientFilter === 'all' || task.client === calendarClientFilter)
    && (calendarTypeFilter === 'all' || task.title === calendarTypeFilter)
    && (calendarStatusFilter === 'all' || task.status === calendarStatusFilter)
  );
  const monthLabel = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
  const searchedClients = clients.filter(client => client.name.toLowerCase().includes(clientSearch.trim().toLowerCase()));
  const printableDates = calendarView === 'week'
    ? getDaysInWeek(currentDate).slice(0, 5)
    : getDaysInMonth(currentDate).filter(Boolean);
  const calendarPeriodLabel = calendarView === 'week'
    ? `${printableDates[0]?.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })} – ${printableDates[printableDates.length - 1]?.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}`
    : monthLabel;
  const selectedBillingControls = clients
    .filter(client => !client.startMonth || client.startMonth.slice(0, 7) <= billingMonth)
    .map(client => invoices.find(invoice => invoice.client_id === client.id && invoice.billing_month?.startsWith(billingMonth)) || {
      id: null,
      client_id: client.id,
      billing_month: `${billingMonth}-01`,
      recurring_amount: Number(client.recurringAmount || 0),
      extras: [],
      amount: Number(client.recurringAmount || 0),
      status: 'pending_creation',
    });
  const overdueInvoices = invoices.filter(invoice => invoice.status !== 'paid' && invoice.billing_month?.slice(0, 7) < billingMonth);
  const overdueTotal = overdueInvoices.reduce((sum, invoice) => sum + Number(invoice.amount || 0), 0);
  const billingExtrasTotal = selectedBillingControls.reduce((sum, invoice) => sum + (Array.isArray(invoice.extras) ? invoice.extras.reduce((extraSum, extra) => extraSum + Number(extra.amount || 0), 0) : 0), 0);
  const billingExpectedTotal = selectedBillingControls.reduce((sum, invoice) => sum + Number(invoice.amount || 0), 0);
  const visibleBillingControls = selectedBillingControls.filter(invoice => billingFilter === 'all' || invoice.status === billingFilter);
  const calendarFilterSummary = [
    calendarTypeFilter !== 'all' ? calendarTypeFilter : null,
    calendarClientFilter !== 'all' ? clients.find(client => client.id === calendarClientFilter)?.name : null,
    calendarStatusFilter !== 'all' ? STATUSES.find(status => status.id === calendarStatusFilter)?.label : null,
    filterAssignee !== 'all' ? TEAM.find(member => member.id === filterAssignee)?.name : 'Todo el equipo',
  ].filter(Boolean).join(' · ');

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

  const getClientServices = (clientId) => {
    const services = new Map();
    tasks.filter(task => task.client === clientId).forEach(task => {
      if (!services.has(task.title)) services.set(task.title, task);
    });
    return Array.from(services.values());
  };

  const formatMonth = (value) => value
    ? new Date(`${String(value).slice(0, 10)}T00:00:00`).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
    : 'Sin fecha';

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
    <>
    <div className={`app-shell flex h-screen bg-[${BRAND_COLORS.bege}] overflow-hidden font-sans text-slate-800`}>
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
            ...(isAdmin ? [{ id: 'clients', icon: Building2, label: 'Clientes' }] : []),
            ...(isAdmin ? [{ id: 'invoices', icon: FileText, label: 'Facturas' }] : []),
          ].map(item => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (item.id === 'invoices') void ensureBillingMonth(billingMonth);
              }}
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

        <div className="mx-4 mb-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black text-sm font-black text-white">{String(userName).charAt(0).toUpperCase()}</div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-black text-slate-800">{userName}</p>
              <p className="flex items-center text-[11px] font-bold text-slate-500">{isAdmin && <ShieldCheck className="mr-1 h-3 w-3 text-[#1b5b3b]" />}{isAdmin ? 'Administrador' : 'Equipo'}</p>
            </div>
            <button onClick={() => void signOut()} className="rounded-lg p-2 text-slate-400 transition hover:bg-white hover:text-red-600" aria-label="Cerrar sesión" title="Cerrar sesión"><LogOut className="h-4 w-4" /></button>
          </div>
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
            {activeTab === 'clients' && 'Clientes'}
            {activeTab === 'invoices' && 'Facturación mensual'}
          </h1>
          
          <div className="flex items-center gap-3">
            <div className="hidden text-right text-white sm:block">
              <p className="text-sm font-black capitalize">{now.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
              <p className="text-xs font-semibold tabular-nums text-white/55">{now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
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
          </div>
        </header>

        {syncError && (
          <div className="mx-6 mt-4 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            <span className="flex items-center"><AlertCircle className="mr-2 h-4 w-4" />{syncError}</span>
            <button onClick={() => setSyncError('')} className="rounded p-1 hover:bg-red-100" aria-label="Cerrar aviso"><X className="h-4 w-4" /></button>
          </div>
        )}

        {/* Main Workspace */}
        <main className={`flex-1 p-6 overflow-hidden ${activeTab === 'kanban' || activeTab === 'matrix' ? 'overflow-x-auto' : ''}`}>
          
          {/* Dashboard */}
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-in fade-in duration-300 h-full overflow-y-auto pb-10">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 col-span-1 md:col-span-4 flex justify-between items-center bg-gradient-to-r from-slate-50 to-white">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-1">Resumen de {monthLabel}</h2>
                  <p className="text-slate-500">Solo se muestran las tareas del mes seleccionado; las antiguas ya no se acumulan.</p>
                </div>
                <div className="flex flex-wrap items-center justify-end gap-3">
                  <div className="flex items-center rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
                    <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))} className="rounded-md p-2 text-slate-500 hover:bg-slate-100" aria-label="Mes anterior"><ChevronLeft className="h-4 w-4" /></button>
                    <span className="min-w-36 px-2 text-center text-sm font-black capitalize text-slate-700">{monthLabel}</span>
                    <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))} className="rounded-md p-2 text-slate-500 hover:bg-slate-100" aria-label="Mes siguiente"><ChevronRight className="h-4 w-4" /></button>
                  </div>
                  {isAdmin && <div>
                  <button
                    onClick={() => setIsNewClientModalOpen(true)}
                    className={`px-4 py-2 bg-white text-slate-700 border border-slate-200 text-sm font-bold rounded-lg shadow-sm hover:bg-slate-50 transition-colors flex items-center`}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Nuevo Cliente
                  </button>
                  </div>}
                </div>
              </div>

              {[
                { label: 'Pendientes del mes', val: periodFilteredTasks.filter(t => t.status === 'todo').length, color: 'text-slate-700', icon: Circle },
                { label: 'En proceso', val: periodFilteredTasks.filter(t => t.status === 'in_progress').length, color: 'text-blue-600', icon: Activity },
                { label: 'Fuegos a apagar', val: periodFilteredTasks.filter(t => t.status === 'fire').length, color: 'text-red-600', icon: Circle },
                { label: 'Completadas', val: periodFilteredTasks.filter(t => t.status === 'done').length, color: `text-[${BRAND_COLORS.verdeEscuro}]`, icon: CheckCircle2 }
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
                    const clientTasks = monthlyTasks.filter(t => t.client === client.id);
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
                    {calendarPeriodLabel}
                  </h2>
                  <div className="flex items-center space-x-2">
                    <button onClick={prevPeriod} className="p-1.5 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-200 shadow-sm"><ChevronLeft className="w-5 h-5 text-slate-600" /></button>
                    <button onClick={nextPeriod} className="p-1.5 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-200 shadow-sm"><ChevronRight className="w-5 h-5 text-slate-600" /></button>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex bg-slate-200/50 p-1 rounded-lg">
                    <button
                      onClick={() => setCalendarView('month')}
                      className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all ${calendarView === 'month' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >Mes</button>
                    <button
                      onClick={() => setCalendarView('week')}
                      className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all ${calendarView === 'week' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >Semana</button>
                  </div>
                  <button onClick={() => window.print()} className="flex items-center rounded-lg bg-black px-4 py-2 text-sm font-black text-white shadow-sm transition hover:bg-[#1b5b3b]"><FileDown className="mr-2 h-4 w-4" />Exportar PDF</button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 bg-white px-4 py-3">
                <span className="flex items-center text-xs font-black uppercase tracking-wider text-slate-400"><SlidersHorizontal className="mr-2 h-4 w-4" />Filtrar calendario</span>
                <select value={calendarTypeFilter} onChange={event => setCalendarTypeFilter(event.target.value)} className="max-w-64 rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700"><option value="all">Todos los tipos</option>{calendarTaskTypes.map(title => <option key={title} value={title}>{title}</option>)}</select>
                <select value={calendarClientFilter} onChange={event => setCalendarClientFilter(event.target.value)} className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700"><option value="all">Todos los clientes</option>{clients.map(client => <option key={client.id} value={client.id}>{client.name}</option>)}</select>
                <select value={calendarStatusFilter} onChange={event => setCalendarStatusFilter(event.target.value)} className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700"><option value="all">Todos los estados</option>{STATUSES.map(status => <option key={status.id} value={status.id}>{status.label}</option>)}</select>
                {(calendarTypeFilter !== 'all' || calendarClientFilter !== 'all' || calendarStatusFilter !== 'all' || filterAssignee !== 'all') && <button onClick={() => { setCalendarTypeFilter('all'); setCalendarClientFilter('all'); setCalendarStatusFilter('all'); setFilterAssignee('all'); }} className="ml-auto inline-flex items-center rounded-lg px-3 py-2 text-xs font-black text-slate-500 hover:bg-slate-100"><RotateCcw className="mr-1.5 h-3.5 w-3.5" />Limpiar filtros</button>}
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
                      const dayTasks = dateStr ? calendarFilteredTasks.filter(t => t.dueDate === dateStr) : [];
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
                      const dayTasks = calendarFilteredTasks.filter(t => t.dueDate === dateStr && !t.startTime);
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
                            const hourTasks = calendarFilteredTasks.filter(t =>
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

          {/* Clientes */}
          {activeTab === 'clients' && isAdmin && (
            <div className="h-full overflow-y-auto pb-10">
              {selectedClientProfile ? (() => {
                const clientInvoices = invoices.filter(invoice => invoice.client_id === selectedClientProfile.id);
                const services = getClientServices(selectedClientProfile.id);
                const clientMonthTasks = monthlyTasks.filter(task => task.client === selectedClientProfile.id);
                const completed = clientMonthTasks.filter(task => task.status === 'done').length;
                return (
                  <div className="space-y-6">
                    <button onClick={() => setSelectedClientProfile(null)} className="flex items-center text-sm font-bold text-slate-500 hover:text-slate-900"><ArrowLeft className="mr-2 h-4 w-4" />Volver a clientes</button>
                    <section className="rounded-2xl bg-black p-7 text-white shadow-sm">
                      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                        <div className="flex items-center gap-5">
                          <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/15 bg-white/10 text-3xl font-black">
                            {clientAvatarUrls[selectedClientProfile.id] ? <Image loader={({ src }) => src} unoptimized src={clientAvatarUrls[selectedClientProfile.id]} alt={`Foto de ${selectedClientProfile.name}`} fill sizes="80px" className="object-cover" /> : selectedClientProfile.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#26d966]">Ficha de cliente</p>
                            <h2 className="mt-2 text-3xl font-black">{selectedClientProfile.name}</h2>
                            <p className="mt-2 text-sm text-white/60">Cliente desde {formatMonth(selectedClientProfile.startMonth || selectedClientProfile.createdAt)}</p>
                            <button onClick={() => openClientProfileEditor(selectedClientProfile)} className="mt-3 inline-flex items-center rounded-lg border border-white/20 px-3 py-2 text-xs font-black transition hover:bg-white hover:text-black"><Edit3 className="mr-2 h-4 w-4" />Editar ficha</button>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <div className="rounded-xl bg-white/10 px-4 py-3"><p className="text-xs text-white/50">Servicios</p><p className="text-xl font-black">{services.length}</p></div>
                          <div className="rounded-xl bg-white/10 px-4 py-3"><p className="text-xs text-white/50">Cuota mensual</p><p className="text-xl font-black">{Number(selectedClientProfile.recurringAmount || 0).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</p></div>
                          <div className="rounded-xl bg-white/10 px-4 py-3"><p className="text-xs text-white/50">Facturas</p><p className="text-xl font-black">{clientInvoices.length}</p></div>
                          <div className="rounded-xl bg-[#26d966] px-4 py-3 text-black"><p className="text-xs font-bold">{monthLabel}</p><p className="text-xl font-black">{completed}/{clientMonthTasks.length}</p></div>
                        </div>
                      </div>
                    </section>

                    <div className="grid gap-6 xl:grid-cols-[1fr_1.35fr]">
                      <div className="space-y-6">
                      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="mb-5 flex items-center gap-3"><BriefcaseBusiness className="h-5 w-5 text-[#1b5b3b]" /><div><h3 className="font-black text-slate-800">Servicios incluidos</h3><p className="text-xs text-slate-500">Extraídos de las tareas configuradas para el cliente.</p></div></div>
                        <div className="space-y-3">
                          {services.map(service => (
                            <div key={service.title} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                              <p className="font-bold text-slate-800">{service.title}</p>
                              <div className="mt-2 flex flex-wrap gap-2 text-xs font-semibold text-slate-500">
                                {service.quantity && <span className="rounded-md bg-white px-2 py-1">{service.quantity}</span>}
                                {service.time && <span className="rounded-md bg-white px-2 py-1">{service.time}</span>}
                                {service.people && <span className="rounded-md bg-white px-2 py-1">{service.people} persona{service.people > 1 ? 's' : ''}</span>}
                              </div>
                            </div>
                          ))}
                          {!services.length && <p className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-400">Sin servicios configurados.</p>}
                        </div>
                      </section>

                      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="mb-5 flex items-center gap-3"><Link2 className="h-5 w-5 text-[#1b5b3b]" /><div><h3 className="font-black text-slate-800">Enlaces importantes</h3><p className="text-xs text-slate-500">Drive, web y redes sociales del cliente.</p></div></div>
                        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                          {selectedClientProfile.importantLinks?.map((link, index) => (
                            <a key={`${link.url}-${index}`} href={link.url} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-[#26d966] hover:bg-emerald-50">
                              <span className="min-w-0"><span className="block font-bold text-slate-800">{link.label}</span><span className="mt-1 block truncate text-xs text-slate-500">{link.url.replace(/^https?:\/\//, '')}</span></span>
                              <ExternalLink className="ml-3 h-4 w-4 shrink-0 text-slate-400" />
                            </a>
                          ))}
                          {!selectedClientProfile.importantLinks?.length && <p className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-400">Todavía no hay enlaces guardados.</p>}
                        </div>
                      </section>
                      </div>

                      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="mb-5 flex items-center justify-between"><div><h3 className="font-black text-slate-800">Historial de facturación</h3><p className="text-xs text-slate-500">Control permanente de los documentos generados en Holded.</p></div><button onClick={() => { setInvoiceClientId(selectedClientProfile.id); setIsInvoiceModalOpen(true); }} className="rounded-lg bg-[#26d966] px-3 py-2 text-xs font-black text-black"><Plus className="mr-1 inline h-4 w-4" />Añadir mes</button></div>
                        <div className="space-y-3">
                          {clientInvoices.map(invoice => {
                            const status = INVOICE_STATUSES.find(item => item.id === invoice.status);
                            return (
                              <article key={invoice.id} className="flex flex-col gap-3 rounded-xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
                                <div><p className="font-black capitalize text-slate-800">{formatMonth(invoice.billing_month)}</p><p className="mt-1 text-xs font-semibold text-slate-500">{invoice.invoice_number || 'Sin número'} · {Number(invoice.amount || 0).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</p></div>
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className={`rounded-full border px-3 py-1 text-xs font-black ${status?.color || 'border-slate-200 bg-slate-50 text-slate-600'}`}>{status?.label || invoice.status}</span>
                                  {invoice.invoice_path && <button onClick={() => void openBillingDocument(invoice.invoice_path)} className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-50" title="Abrir factura"><FileText className="h-4 w-4" /></button>}
                                  {invoice.receipt_path && <button onClick={() => void openBillingDocument(invoice.receipt_path)} className="rounded-lg border border-emerald-200 bg-emerald-50 p-2 text-emerald-600" title="Abrir justificante"><Receipt className="h-4 w-4" /></button>}
                                </div>
                              </article>
                            );
                          })}
                          {!clientInvoices.length && <p className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-400">Todavía no hay meses de facturación registrados.</p>}
                        </div>
                      </section>
                    </div>
                  </div>
                );
              })() : (
                <div>
                  <div className="mb-6 flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center">
                    <div><h2 className="text-2xl font-black text-slate-800">Cartera de clientes</h2><p className="mt-1 text-sm text-slate-500">Servicios, antigüedad y facturación mensual en una única ficha.</p></div>
                    <div className="flex gap-3">
                      <label className="relative block"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={clientSearch} onChange={event => setClientSearch(event.target.value)} placeholder="Buscar cliente…" className="rounded-xl border border-slate-300 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#26d966]" /></label>
                      <button onClick={() => setIsNewClientModalOpen(true)} className="flex items-center rounded-xl bg-[#26d966] px-4 py-2.5 text-sm font-black text-black"><Plus className="mr-2 h-4 w-4" />Nuevo cliente</button>
                    </div>
                  </div>
                  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="hidden grid-cols-[1.5fr_1fr_0.7fr_1.1fr_36px] gap-4 border-b border-slate-200 bg-slate-50 px-6 py-3 text-xs font-black uppercase tracking-wider text-slate-400 md:grid"><span>Cliente</span><span>Desde</span><span>Servicios</span><span>Factura del mes</span><span /></div>
                    {searchedClients.map(client => {
                      const services = getClientServices(client.id);
                      const currentInvoice = invoices.find(invoice => invoice.client_id === client.id && invoice.billing_month?.startsWith(currentMonthKey));
                      const status = currentInvoice ? INVOICE_STATUSES.find(item => item.id === currentInvoice.status) : null;
                      return (
                        <button key={client.id} onClick={() => setSelectedClientProfile(client)} className="grid w-full grid-cols-1 gap-3 border-b border-slate-100 px-6 py-5 text-left transition last:border-0 hover:bg-slate-50 md:grid-cols-[1.5fr_1fr_0.7fr_1.1fr_36px] md:items-center md:gap-4">
                          <span className="flex items-center gap-3 font-black text-slate-800"><span className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-black text-white">{clientAvatarUrls[client.id] ? <Image loader={({ src }) => src} unoptimized src={clientAvatarUrls[client.id]} alt="" fill sizes="40px" className="object-cover" /> : client.name.charAt(0).toUpperCase()}</span>{client.name}</span>
                          <span className="text-sm font-semibold capitalize text-slate-500">{formatMonth(client.startMonth || client.createdAt)}</span>
                          <span className="text-sm font-black text-slate-700">{services.length}</span>
                          <span className={`w-fit rounded-full border px-3 py-1 text-xs font-black ${status?.color || 'border-slate-200 bg-slate-50 text-slate-500'}`}>{status?.label || 'Sin registro este mes'}</span>
                          <ChevronRight className="hidden h-5 w-5 text-slate-300 md:block" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Facturación */}
          {activeTab === 'invoices' && isAdmin && (
            <div className="h-full overflow-y-auto pb-10">
              <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-black text-slate-800">Control de facturación</h2>
                  <p className="mt-1 text-sm text-slate-500">Una fila por cliente y mes. La factura se sigue creando en Holded.</p>
                </div>
                <div className="flex items-center gap-3">
                  <input type="month" value={billingMonth} onChange={event => { setBillingMonth(event.target.value); void ensureBillingMonth(event.target.value); }} className="rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-black capitalize text-slate-700" />
                  <button onClick={() => void ensureBillingMonth(billingMonth)} className="flex items-center justify-center rounded-xl bg-[#26d966] px-5 py-3 font-black text-black shadow-sm transition hover:bg-[#1b5b3b] hover:text-white"><WalletCards className="mr-2 h-5 w-5" />Preparar mes</button>
                </div>
              </div>

              {overdueInvoices.length > 0 && <button onClick={() => setBillingFilter('overdue')} className="mb-6 flex w-full items-center justify-between rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-left text-red-800"><span className="flex items-center font-black"><AlertTriangle className="mr-3 h-5 w-5" />Hay {overdueInvoices.length} mensualidad{overdueInvoices.length === 1 ? '' : 'es'} anterior{overdueInvoices.length === 1 ? '' : 'es'} pendiente{overdueInvoices.length === 1 ? '' : 's'} de cobro</span><span className="font-black">{overdueTotal.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })} · Ver pendientes</span></button>}

              <div className="mb-6 grid grid-cols-2 gap-4 xl:grid-cols-5">
                <div className="rounded-2xl border border-slate-200 bg-white p-5"><p className="text-xs font-black uppercase tracking-wider text-slate-400">Previsto del mes</p><p className="mt-2 text-2xl font-black text-slate-900">{billingExpectedTotal.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</p></div>
                <div className="rounded-2xl border border-violet-200 bg-violet-50 p-5"><p className="text-xs font-black uppercase tracking-wider text-violet-700">Extras</p><p className="mt-2 text-2xl font-black text-violet-900">{billingExtrasTotal.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</p></div>
                {['pending_creation', 'sent', 'paid'].map(statusId => {
                  const status = INVOICE_STATUSES.find(item => item.id === statusId);
                  const items = selectedBillingControls.filter(invoice => invoice.status === statusId);
                  return <button key={statusId} onClick={() => setBillingFilter(statusId)} className={`rounded-2xl border p-5 text-left ${status?.color}`}><p className="text-xs font-black uppercase tracking-wider">{status?.label}</p><div className="mt-2 flex items-end justify-between"><span className="text-2xl font-black">{items.length}</span><span className="text-sm font-black">{items.reduce((sum, invoice) => sum + Number(invoice.amount || 0), 0).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</span></div></button>;
                })}
              </div>

              <div className="mb-4 flex flex-wrap gap-2"><button onClick={() => setBillingFilter('all')} className={`rounded-full px-4 py-2 text-xs font-black ${billingFilter === 'all' ? 'bg-black text-white' : 'bg-white text-slate-500'}`}>Todos ({selectedBillingControls.length})</button>{INVOICE_STATUSES.map(status => <button key={status.id} onClick={() => setBillingFilter(status.id)} className={`rounded-full px-4 py-2 text-xs font-black ${billingFilter === status.id ? 'bg-black text-white' : 'bg-white text-slate-500'}`}>{status.label}</button>)}{overdueInvoices.length > 0 && <button onClick={() => setBillingFilter('overdue')} className={`rounded-full px-4 py-2 text-xs font-black ${billingFilter === 'overdue' ? 'bg-red-600 text-white' : 'bg-red-50 text-red-700'}`}>Pendientes anteriores</button>}</div>

              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="hidden grid-cols-[1.35fr_.8fr_.8fr_.8fr_1.15fr_110px] gap-4 border-b border-slate-200 bg-slate-50 px-5 py-3 text-xs font-black uppercase tracking-wider text-slate-400 lg:grid"><span>Cliente</span><span>Recurrente</span><span>Extras</span><span>Total</span><span>Estado</span><span>Acciones</span></div>
                {(billingFilter === 'overdue' ? overdueInvoices : visibleBillingControls).map(invoice => {
                  const client = clients.find(item => item.id === invoice.client_id);
                  const status = INVOICE_STATUSES.find(item => item.id === invoice.status);
                  const extrasTotal = Array.isArray(invoice.extras) ? invoice.extras.reduce((sum, extra) => sum + Number(extra.amount || 0), 0) : 0;
                  return <article key={invoice.id || `${invoice.client_id}-${invoice.billing_month}`} className="grid gap-3 border-b border-slate-100 px-5 py-4 last:border-0 lg:grid-cols-[1.35fr_.8fr_.8fr_.8fr_1.15fr_110px] lg:items-center">
                    <div className="min-w-0"><p className="truncate font-black text-slate-800">{client?.name || 'Cliente'}</p><p className="mt-1 text-xs capitalize text-slate-400">{formatMonth(invoice.billing_month)}{billingFilter === 'overdue' ? ' · pendiente anterior' : ''}</p></div>
                    <p className="text-sm font-bold text-slate-600">{Number(invoice.recurring_amount || 0).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</p>
                    <p className={`text-sm font-black ${extrasTotal ? 'text-violet-700' : 'text-slate-400'}`}>{extrasTotal ? `+ ${extrasTotal.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}` : 'Sin extras'}</p>
                    <p className="text-base font-black text-slate-900">{Number(invoice.amount || 0).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</p>
                    <select value={invoice.status} disabled={!invoice.id} onChange={event => void updateInvoiceStatus(invoice, event.target.value)} className={`w-full rounded-lg border px-3 py-2 text-xs font-black ${status?.color}`} aria-label={`Estado de ${client?.name || 'cliente'}`}>{INVOICE_STATUSES.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}</select>
                    <div className="flex gap-2"><button onClick={() => openInvoiceEditor(invoice)} className="flex-1 rounded-lg bg-black px-3 py-2 text-xs font-black text-white hover:bg-[#1b5b3b]">Gestionar</button>{invoice.invoice_path && <button onClick={() => void openBillingDocument(invoice.invoice_path)} className="rounded-lg border border-slate-200 p-2 text-blue-600" title="Abrir factura"><FileText className="h-4 w-4" /></button>}</div>
                  </article>;
                })}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Modal Nueva Factura */}
      {isInvoiceModalOpen && isAdmin && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className={`flex items-center justify-between bg-[${BRAND_COLORS.preto}] px-6 py-4`}>
              <div>
                <h3 className="text-xl font-black text-white">Gestionar mensualidad</h3>
                <p className="text-xs text-slate-400">Cuota recurrente, extras, documentos y estado de cobro.</p>
              </div>
              <button onClick={() => { setIsInvoiceModalOpen(false); setEditingInvoice(null); }} className="rounded-lg p-1 text-white/70 hover:bg-white/10 hover:text-white"><X className="h-6 w-6" /></button>
            </div>
            <form className="space-y-5 overflow-y-auto p-6" onSubmit={event => { event.preventDefault(); void saveInvoice(new FormData(event.currentTarget)); }}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-bold text-slate-700">Cliente</label>
                  <select name="clientId" required defaultValue={invoiceClientId} disabled={Boolean(editingInvoice)} className={`w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 outline-none focus:ring-2 focus:ring-[${BRAND_COLORS.verdeMedio}] disabled:opacity-70`}>
                    <option value="">Selecciona un cliente</option>
                    {clients.map(client => <option key={client.id} value={client.id}>{client.name}</option>)}
                  </select>
                  {editingInvoice && <input type="hidden" name="clientId" value={invoiceClientId} />}
                </div>
                <div>
                  <label className="mb-1 block text-sm font-bold text-slate-700">Mes de control</label>
                  <input type="month" name="billingMonth" required readOnly defaultValue={editingInvoice?.billing_month?.slice(0, 7) || billingMonth} className={`w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 outline-none focus:ring-2 focus:ring-[${BRAND_COLORS.verdeMedio}]`} />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-bold text-slate-700">Número de factura</label>
                  <input name="invoiceNumber" defaultValue={editingInvoice?.invoice_number || ''} placeholder="Ej. F-2026-0092" className={`w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 outline-none focus:ring-2 focus:ring-[${BRAND_COLORS.verdeMedio}]`} />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-bold text-slate-700">Cuota recurrente (€)</label>
                  <input type="number" name="recurringAmount" min="0" step="0.01" defaultValue={editingInvoice?.recurring_amount ?? clients.find(client => client.id === invoiceClientId)?.recurringAmount ?? 0} required className={`w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 outline-none focus:ring-2 focus:ring-[${BRAND_COLORS.verdeMedio}]`} />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-bold text-slate-700">Fecha de vencimiento</label>
                  <input type="date" name="dueDate" defaultValue={editingInvoice?.due_date || ''} className={`w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 outline-none focus:ring-2 focus:ring-[${BRAND_COLORS.verdeMedio}]`} />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-bold text-slate-700">Estado inicial</label>
                  <select name="status" defaultValue={editingInvoice?.status || 'pending_creation'} className={`w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 font-semibold outline-none focus:ring-2 focus:ring-[${BRAND_COLORS.verdeMedio}]`}>
                    {INVOICE_STATUSES.map(status => <option key={status.id} value={status.id}>{status.label}</option>)}
                  </select>
                </div>
              </div>
              <div className="rounded-xl border border-violet-200 bg-violet-50/60 p-4">
                <div className="mb-3 flex items-center justify-between"><div><p className="font-black text-slate-800">Servicios extra de este mes</p><p className="text-xs text-slate-500">No se copiarán al mes siguiente.</p></div><button type="button" onClick={() => setInvoiceExtrasDraft(previous => [...previous, { concept: '', amount: '0' }])} className="inline-flex items-center rounded-lg bg-white px-3 py-2 text-xs font-black text-violet-700 shadow-sm"><Plus className="mr-1 h-4 w-4" />Añadir extra</button></div>
                <div className="space-y-2">{invoiceExtrasDraft.map((extra, index) => <div key={index} className="grid grid-cols-[1fr_130px_36px] gap-2"><input value={extra.concept} onChange={event => setInvoiceExtrasDraft(previous => previous.map((item, itemIndex) => itemIndex === index ? { ...item, concept: event.target.value } : item))} placeholder="Ej. Grabación adicional" className="rounded-lg border border-violet-200 bg-white px-3 py-2 text-sm" /><input type="number" min="0" step="0.01" value={extra.amount} onChange={event => setInvoiceExtrasDraft(previous => previous.map((item, itemIndex) => itemIndex === index ? { ...item, amount: event.target.value } : item))} className="rounded-lg border border-violet-200 bg-white px-3 py-2 text-sm" /><button type="button" onClick={() => setInvoiceExtrasDraft(previous => previous.filter((_, itemIndex) => itemIndex !== index))} className="rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500" aria-label="Eliminar extra"><Trash2 className="mx-auto h-4 w-4" /></button></div>)}</div>
                {!invoiceExtrasDraft.length && <p className="rounded-lg border border-dashed border-violet-200 bg-white/60 p-3 text-center text-xs font-semibold text-slate-400">Sin extras este mes.</p>}
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="cursor-pointer rounded-xl border-2 border-dashed border-blue-200 bg-blue-50/50 p-5 text-center transition hover:border-blue-400">
                  <FileText className="mx-auto mb-2 h-7 w-7 text-blue-500" />
                  <span className="block text-sm font-black text-slate-700">Adjuntar PDF de Holded</span>
                  <span className="mt-1 block text-xs text-slate-500">PDF, PNG, JPG o WebP · máx. 10 MB</span>
                  <input type="file" name="invoiceFile" accept="application/pdf,image/png,image/jpeg,image/webp" className="mt-3 block w-full text-xs text-slate-500" />
                </label>
                <label className="cursor-pointer rounded-xl border-2 border-dashed border-emerald-200 bg-emerald-50/50 p-5 text-center transition hover:border-emerald-400">
                  <Receipt className="mx-auto mb-2 h-7 w-7 text-emerald-500" />
                  <span className="block text-sm font-black text-slate-700">Justificante opcional</span>
                  <span className="mt-1 block text-xs text-slate-500">También podrás añadirlo más tarde</span>
                  <input type="file" name="receiptFile" accept="application/pdf,image/png,image/jpeg,image/webp" className="mt-3 block w-full text-xs text-slate-500" />
                </label>
              </div>
              <div>
                <label className="mb-1 block text-sm font-bold text-slate-700">Notas</label>
                <textarea name="notes" rows={3} defaultValue={editingInvoice?.notes || ''} placeholder="Observaciones, forma de pago, contacto…" className={`w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 outline-none focus:ring-2 focus:ring-[${BRAND_COLORS.verdeMedio}]`} />
              </div>
              <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
                <button type="button" onClick={() => { setIsInvoiceModalOpen(false); setEditingInvoice(null); }} className="rounded-lg px-5 py-2.5 font-bold text-slate-600 hover:bg-slate-100">Cancelar</button>
                <button type="submit" disabled={isUploadingInvoice} className={`flex min-w-40 items-center justify-center rounded-lg bg-[${BRAND_COLORS.verdeMedio}] px-5 py-2.5 font-black text-black disabled:opacity-50`}>
                  {isUploadingInvoice ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Subiendo…</> : <><Upload className="mr-2 h-4 w-4" />Guardar control</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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

                void saveTask({
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
              <div className="mb-6 flex flex-col justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center">
                <div><p className="font-black capitalize text-slate-800">Planificación de {monthLabel}</p><p className="mt-1 text-sm text-slate-500">Se muestra una sola tarea por servicio pendiente, evitando las copias acumuladas de meses anteriores.</p></div>
                <div className="flex items-center rounded-lg bg-slate-100 p-1">
                  <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))} className="rounded-md p-2 hover:bg-white" aria-label="Mes anterior"><ChevronLeft className="h-4 w-4" /></button>
                  <span className="min-w-32 text-center text-xs font-black capitalize">{monthLabel}</span>
                  <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))} className="rounded-md p-2 hover:bg-white" aria-label="Mes siguiente"><ChevronRight className="h-4 w-4" /></button>
                </div>
              </div>
              
              <div className="space-y-3">
                {monthlyTasks.filter(t => t.client === selectedClientForModal.id).map(task => (
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
                                  void updateTask(task.id, { assignees: newAssignees });
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
                          onChange={(e) => void updateTask(task.id, { dueDate: e.target.value })}
                          className={`px-3 py-1.5 text-sm bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-[${BRAND_COLORS.verdeMedio}] outline-none text-slate-700 font-semibold cursor-pointer`} 
                        />
                      </div>

                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">Hora (Opcional)</span>
                        <input 
                          type="time" 
                          value={task.startTime || ''}
                          onChange={(e) => void updateTask(task.id, { startTime: e.target.value })}
                          className={`px-3 py-1.5 text-sm bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-[${BRAND_COLORS.verdeMedio}] outline-none text-slate-700 font-semibold cursor-pointer`} 
                        />
                      </div>
                    </div>

                  </div>
                ))}
                {!monthlyTasks.some(task => task.client === selectedClientForModal.id) && <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm font-semibold text-slate-400">No hay tareas para este cliente en {monthLabel}.</div>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Editar Ficha de Cliente */}
      {isClientProfileModalOpen && selectedClientProfile && isAdmin && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between bg-black px-6 py-5 text-white">
              <div><p className="text-xs font-black uppercase tracking-[0.18em] text-[#26d966]">Ficha de cliente</p><h3 className="mt-1 text-xl font-black">Editar {selectedClientProfile.name}</h3></div>
              <button onClick={() => setIsClientProfileModalOpen(false)} className="rounded-lg p-2 text-white/60 hover:bg-white/10 hover:text-white" aria-label="Cerrar"><X className="h-5 w-5" /></button>
            </div>
            <form className="overflow-y-auto p-6" onSubmit={event => { event.preventDefault(); void saveClientProfile(new FormData(event.currentTarget)); }}>
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 flex items-center text-sm font-black text-slate-700"><Camera className="mr-2 h-4 w-4" />Foto de perfil</span>
                  <input type="file" name="avatar" accept="image/jpeg,image/png,image/webp" className="block w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-black file:px-3 file:py-2 file:font-bold file:text-white" />
                  <span className="mt-2 block text-xs text-slate-400">JPG, PNG o WebP · máximo 5 MB.</span>
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-black text-slate-700">Cliente desde</span>
                  <input type="month" value={clientProfileDraft.startMonth} onChange={event => setClientProfileDraft(previous => ({ ...previous, startMonth: event.target.value }))} className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-semibold outline-none focus:border-[#26d966]" />
                  <span className="mt-2 block text-xs text-slate-400">Puedes elegir cualquier mes y año.</span>
                </label>
                <label className="block sm:col-span-2">
                  <span className="mb-2 block text-sm font-black text-slate-700">Cuota recurrente mensual</span>
                  <div className="relative"><Euro className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input type="number" min="0" step="0.01" value={clientProfileDraft.recurringAmount} onChange={event => setClientProfileDraft(previous => ({ ...previous, recurringAmount: event.target.value }))} className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3 pl-11 pr-4 text-sm font-semibold outline-none focus:border-[#26d966]" /></div>
                  <span className="mt-2 block text-xs text-slate-400">Este importe se copiará como base al preparar cada nuevo mes.</span>
                </label>
              </div>

              <div className="mt-7 border-t border-slate-100 pt-6">
                <div className="mb-4 flex items-center justify-between"><div><h4 className="font-black text-slate-800">Enlaces importantes</h4><p className="text-xs text-slate-500">Añade Drive, página web o cualquier red social.</p></div><button type="button" onClick={() => setClientProfileDraft(previous => ({ ...previous, importantLinks: [...previous.importantLinks, { label: '', url: '' }] }))} className="inline-flex items-center rounded-lg bg-emerald-50 px-3 py-2 text-xs font-black text-[#1b5b3b]"><Plus className="mr-1 h-4 w-4" />Añadir</button></div>
                <div className="space-y-3">
                  {clientProfileDraft.importantLinks.map((link, index) => (
                    <div key={index} className="grid gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 sm:grid-cols-[0.8fr_1.4fr_40px]">
                      <input value={link.label} onChange={event => setClientProfileDraft(previous => ({ ...previous, importantLinks: previous.importantLinks.map((item, itemIndex) => itemIndex === index ? { ...item, label: event.target.value } : item) }))} placeholder="Ej: Carpeta de Drive" className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#26d966]" />
                      <input type="text" inputMode="url" value={link.url} onChange={event => setClientProfileDraft(previous => ({ ...previous, importantLinks: previous.importantLinks.map((item, itemIndex) => itemIndex === index ? { ...item, url: event.target.value } : item) }))} placeholder="drive.google.com/…" className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#26d966]" />
                      <button type="button" onClick={() => setClientProfileDraft(previous => ({ ...previous, importantLinks: previous.importantLinks.filter((_, itemIndex) => itemIndex !== index) }))} className="flex items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500" aria-label="Eliminar enlace"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-7 flex justify-end gap-3 border-t border-slate-100 pt-5">
                <button type="button" onClick={() => setIsClientProfileModalOpen(false)} className="rounded-lg px-5 py-2.5 font-bold text-slate-600 hover:bg-slate-100">Cancelar</button>
                <button type="submit" disabled={isSavingClientProfile} className="inline-flex items-center rounded-lg bg-[#26d966] px-5 py-2.5 font-black text-black disabled:opacity-50">{isSavingClientProfile && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Guardar ficha</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Nuevo Cliente */}
      {isNewClientModalOpen && isAdmin && (
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
                void createClient(clientName);
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
    <section className={`print-calendar ${calendarView === 'week' ? 'is-week' : 'is-month'}`}>
      <header className="print-calendar-header">
        <Image src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/branding/swira-logo.png`} alt="Swira" width={150} height={56} className="print-calendar-logo" />
        <div>
          <p className="print-calendar-kicker">Planificación de equipo</p>
          <h1>Calendario {calendarView === 'week' ? 'semanal' : 'mensual'}</h1>
          <p>{calendarPeriodLabel} · {calendarFilterSummary}</p>
        </div>
      </header>
      <div className="print-calendar-grid" style={{ gridTemplateColumns: `repeat(${calendarView === 'week' ? 5 : 7}, minmax(0, 1fr))` }}>
        {(calendarView === 'week' ? getDaysInWeek(currentDate).slice(0, 5) : getDaysInMonth(currentDate)).map((date, index) => {
          if (!date) return <div key={`empty-${index}`} className="print-calendar-day print-calendar-empty" />;
          const dateKey = toLocalISODate(date);
          const dayTasks = sortTasks(calendarFilteredTasks.filter(task => task.dueDate === dateKey));
          const visiblePrintTasks = calendarView === 'month' ? dayTasks.slice(0, 4) : dayTasks;
          return (
            <article key={dateKey} className="print-calendar-day">
              <div className="print-calendar-date"><span>{dayNames[date.getDay() === 0 ? 6 : date.getDay() - 1]}</span><strong>{date.getDate()}</strong></div>
              <div className="print-calendar-tasks">
                {visiblePrintTasks.map(task => {
                  const client = clients.find(item => item.id === task.client);
                  const people = TEAM.filter(member => task.assignees.includes(member.id)).map(member => member.name).join(', ');
                  return <div key={task.id} className={`print-calendar-task ${task.status === 'done' ? 'is-done' : ''}`}><b>{task.startTime || '—'} · {client?.name || 'Cliente'}</b><span>{task.title}</span>{people && <small>{people}</small>}</div>;
                })}
                {dayTasks.length > visiblePrintTasks.length && <span className="print-calendar-more">+{dayTasks.length - visiblePrintTasks.length} tareas más</span>}
                {!dayTasks.length && <span className="print-calendar-no-tasks">Sin tareas</span>}
              </div>
            </article>
          );
        })}
      </div>
      <footer className="print-calendar-footer">Generado desde Swira CRM · {now.toLocaleDateString('es-ES')} · {now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</footer>
    </section>
    </>
  );
}
