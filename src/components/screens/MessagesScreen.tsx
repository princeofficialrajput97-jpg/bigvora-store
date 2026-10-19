import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Headphones, 
  Plus, 
  Search, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft, 
  X, 
  FileText, 
  ShieldCheck, 
  Bot, 
  User, 
  ChevronRight,
  Filter,
  Check,
  RotateCcw,
  Paperclip,
  Send,
  Zap,
  Activity,
  Tag,
  Calendar,
  Layers,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { SupportTicket, TicketCategory, TicketPriority } from '../../types';

export const MessagesScreen: React.FC = () => {
  const { 
    tickets, 
    activeTicketId, 
    setActiveTicketId, 
    createTicket, 
    sendTicketReply, 
    closeTicket, 
    reopenTicket,
    user, 
    orders, 
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'ALL' | 'ACTIVE' | 'RESOLVED'>('ALL');
  const [ticketSearch, setTicketSearch] = useState('');
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);
  
  // New Ticket Form State
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<TicketCategory>('TECHNICAL_BUG');
  const [priority, setPriority] = useState<TicketPriority>('URGENT');
  const [selectedOrderId, setSelectedOrderId] = useState<string>('');
  const [initialMessage, setInitialMessage] = useState('');
  const [attachmentName, setAttachmentName] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ticket Response Form State
  const [replyText, setReplyText] = useState('');
  const [replyAttachment, setReplyAttachment] = useState<string | null>(null);
  const [isSendingReply, setIsSendingReply] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replyFileInputRef = useRef<HTMLInputElement>(null);

  // Filter tickets
  const filteredTickets = tickets.filter(t => {
    const query = ticketSearch.toLowerCase().trim();
    const matchesSearch = 
      !query ||
      t.ticketNumber.toLowerCase().includes(query) ||
      t.subject.toLowerCase().includes(query) ||
      t.category.toLowerCase().includes(query) ||
      t.assignedAgent.toLowerCase().includes(query);

    if (!matchesSearch) return false;
    if (activeTab === 'ACTIVE') return t.status === 'OPEN' || t.status === 'IN_PROGRESS';
    if (activeTab === 'RESOLVED') return t.status === 'RESOLVED' || t.status === 'CLOSED';
    return true;
  });

  const activeTicket = tickets.find(t => t.id === activeTicketId) || null;

  const activeCount = tickets.filter(t => t.status === 'OPEN' || t.status === 'IN_PROGRESS').length;
  const resolvedCount = tickets.filter(t => t.status === 'RESOLVED' || t.status === 'CLOSED').length;

  const handleCreateTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) {
      showToast('Please enter a ticket subject', 'warning');
      return;
    }
    if (!initialMessage.trim()) {
      showToast('Please describe your technical issue or question', 'warning');
      return;
    }

    setIsSubmitting(true);
    const newTkt = await createTicket({
      subject: subject.trim(),
      category,
      priority,
      orderId: selectedOrderId || undefined,
      initialMessage: initialMessage.trim(),
      attachmentName: attachmentName || undefined
    });
    setIsSubmitting(false);

    // Reset Form
    setSubject('');
    setCategory('TECHNICAL_BUG');
    setPriority('URGENT');
    setSelectedOrderId('');
    setInitialMessage('');
    setAttachmentName(null);
    setIsNewTicketModalOpen(false);
    setActiveTicketId(newTkt.id);
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() && !replyAttachment) return;
    if (!activeTicket) return;

    setIsSendingReply(true);
    const textToSend = replyText.trim();
    const attachToSend = replyAttachment;
    setReplyText('');
    setReplyAttachment(null);

    await sendTicketReply(activeTicket.id, textToSend, attachToSend || undefined);
    setIsSendingReply(false);
  };

  const getPriorityBadge = (p: TicketPriority) => {
    switch (p) {
      case 'URGENT':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-red-950/90 border border-red-500/60 text-red-300 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
            Urgent
          </span>
        );
      case 'HIGH':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-950/80 border border-amber-500/50 text-amber-300">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            High
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-950/80 border border-blue-500/50 text-blue-300">
            Medium
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-slate-800 text-slate-300">
            Normal
          </span>
        );
    }
  };

  const getStatusBadge = (s: string) => {
    switch (s) {
      case 'OPEN':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-950/80 border border-amber-500/50 text-amber-300">
            <Clock className="w-3 h-3 text-amber-400" />
            Open
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-950/90 border border-indigo-500/50 text-indigo-300 shadow-xs">
            <Activity className="w-3 h-3 text-indigo-400 animate-spin" />
            In Progress
          </span>
        );
      case 'RESOLVED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/90 border border-emerald-500/50 text-emerald-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            Resolved
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-400">
            Closed
          </span>
        );
    }
  };

  const getCategoryLabel = (cat: TicketCategory) => {
    switch (cat) {
      case 'TECHNICAL_BUG':
        return 'TECHNICAL BUG';
      case 'ORDER_DELIVERY':
        return 'SOURCE CODE DELIVERY';
      case 'PAYMENT_VERIFICATION':
        return 'PAYMENT VERIFICATION';
      case 'CUSTOM_APP':
        return 'CUSTOM APP DEV';
      case 'CUSTOM_WEBSITE':
        return 'CUSTOM WEBSITE DEV';
      default:
        return 'GENERAL SUPPORT';
    }
  };

  return (
    <div className="space-y-5 pb-24 max-w-5xl mx-auto">
      
      {/* Top Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-gradient-to-r from-purple-950/40 via-[#0A0E1A] to-indigo-950/40 border border-purple-500/30 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                <span>Support Ticket Desk</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300">
                  24/7 SLA Active
                </span>
              </h1>
            </div>
          </div>
          <p className="text-xs text-slate-400 pl-11">
            Official engineering helpdesk for Android Studio setup, Gradle build troubleshooting, source code licenses, and custom delivery.
          </p>
        </div>

        <button
          onClick={() => setIsNewTicketModalOpen(true)}
          className="px-5 py-2.5 bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-2xl shadow-lg shadow-purple-950/50 flex items-center justify-center gap-2 transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Raise Support Ticket</span>
        </button>
      </div>

      {/* SLA & Support KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-[#090D1A] border border-slate-800/80 flex items-center gap-3 shadow-md">
          <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-medium block">Total Tickets</span>
            <span className="text-lg font-black text-white font-mono">{tickets.length}</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#090D1A] border border-slate-800/80 flex items-center gap-3 shadow-md">
          <div className="w-10 h-10 rounded-xl bg-indigo-950/60 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-medium block">In Progress</span>
            <span className="text-lg font-black text-indigo-300 font-mono">{activeCount}</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#090D1A] border border-slate-800/80 flex items-center gap-3 shadow-md">
          <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-medium block">Resolved</span>
            <span className="text-lg font-black text-emerald-300 font-mono">{resolvedCount}</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#090D1A] border border-slate-800/80 flex items-center gap-3 shadow-md">
          <div className="w-10 h-10 rounded-xl bg-amber-950/60 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-medium block">Response SLA</span>
            <span className="text-xs font-black text-amber-300">&lt; 2 Hours</span>
          </div>
        </div>
      </div>

      {/* TICKET DETAIL VIEW (When a ticket is clicked/selected) */}
      {activeTicket ? (
        <div className="space-y-4 animate-in fade-in duration-200">
          
          {/* Top Return & Action Navigation Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#0B0F20] border border-slate-800">
            <button
              onClick={() => setActiveTicketId(null)}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-purple-400" />
              <span>Back to Tickets List</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-purple-400">
                #{activeTicket.ticketNumber}
              </span>
              {getPriorityBadge(activeTicket.priority)}
              {getStatusBadge(activeTicket.status)}

              {activeTicket.status !== 'RESOLVED' && activeTicket.status !== 'CLOSED' ? (
                <button
                  onClick={() => closeTicket(activeTicket.id)}
                  className="px-3 py-1.5 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-300 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-all active:scale-95 ml-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Mark as Resolved</span>
                </button>
              ) : (
                <button
                  onClick={() => reopenTicket(activeTicket.id)}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-purple-500/40 text-purple-300 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors ml-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Re-open Ticket</span>
                </button>
              )}
            </div>
          </div>

          {/* Ticket Header & Metadata Summary Card */}
          <div className="p-5 rounded-3xl bg-[#090D1A] border border-purple-500/30 shadow-lg space-y-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-purple-400 mb-1">
                <span>CATEGORY: {getCategoryLabel(activeTicket.category)}</span>
                {activeTicket.orderId && (
                  <span>· LINKED ORDER #{activeTicket.orderId.slice(-6)}</span>
                )}
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white">
                {activeTicket.subject}
              </h2>
            </div>

            {/* Engineer Assignment & SLA Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-[#05070D] border border-slate-800/80 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-purple-950 border border-purple-500/40 flex items-center justify-center text-purple-300 font-bold">
                  VJ
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Assigned Engineer</span>
                  <span className="font-semibold text-slate-200">{activeTicket.assignedAgent}</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-300 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Technical Support Tier</span>
                  <span className="font-semibold text-emerald-300">Level-3 Android Core Support</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Ticket Status</span>
                  <span className="font-semibold text-slate-200">
                    {activeTicket.status === 'RESOLVED' ? 'Resolution Verified' : 'Active Investigation'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Ticket Activity Log / Official Audit Trail */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 px-1">
              <span>Resolution Audit Trail & Discussion</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                {activeTicket.messages.length} updates
              </span>
            </h3>

            <div className="space-y-3">
              {activeTicket.messages.map((msg, index) => {
                const isCustomer = msg.sender === 'CUSTOMER';
                const isSystem = msg.sender === 'SYSTEM';

                if (isSystem) {
                  return (
                    <div key={msg.id} className="p-3 rounded-2xl bg-[#070A14] border border-slate-800/80 flex items-start gap-3">
                      <div className="w-7 h-7 rounded-lg bg-purple-950/80 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0 mt-0.5">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div className="flex-1 text-xs text-slate-400">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-purple-300">{msg.senderName}</span>
                          <span className="text-[10px] text-slate-500 font-mono">{msg.timestamp}</span>
                        </div>
                        <p>{msg.text}</p>
                      </div>
                    </div>
                  );
                }

                return (
                  <div 
                    key={msg.id} 
                    className={`p-4 rounded-3xl border transition-all ${
                      isCustomer
                        ? 'bg-[#0A0D18] border-slate-800/80 shadow-md'
                        : 'bg-gradient-to-r from-purple-950/30 via-[#0E1324] to-[#0A0E1A] border-purple-500/40 shadow-lg'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-800/60">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                          isCustomer
                            ? 'bg-slate-800 text-slate-300 border border-slate-700'
                            : 'bg-purple-600 text-white border border-purple-400 shadow-sm'
                        }`}>
                          {isCustomer ? <User className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">
                              {isCustomer ? 'You (Client)' : msg.senderName}
                            </span>
                            {!isCustomer && (
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-purple-950 border border-purple-500/40 text-purple-300">
                                {msg.senderRole || 'Senior Android Engineer'}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-500">
                            {isCustomer ? 'Submitted original problem statement' : 'Official Senior Engineer Response'}
                          </span>
                        </div>
                      </div>

                      <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>{msg.timestamp}</span>
                      </span>
                    </div>

                    {/* Message Body */}
                    <div className="text-xs leading-relaxed text-slate-200 space-y-2">
                      <p className="whitespace-pre-wrap">{msg.text}</p>

                      {msg.attachmentName && (
                        <div className="mt-3 p-3 rounded-xl bg-[#05070D] border border-purple-500/30 flex items-center justify-between gap-3 max-w-md">
                          <div className="flex items-center gap-2 min-w-0">
                            <FileText className="w-4 h-4 text-purple-400 shrink-0" />
                            <span className="text-xs font-mono text-purple-300 truncate">{msg.attachmentName}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 uppercase font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                            Attached Log
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Ticket Resolved Confirmation Box */}
          {activeTicket.status === 'RESOLVED' && (
            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex items-center gap-3 text-emerald-200">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
              <div className="text-xs">
                <p className="font-bold text-emerald-300">Ticket Marked as Resolved</p>
                <p className="text-slate-400 mt-0.5">
                  The technical guidance for this ticket has been completed. If you still encounter build or Gradle sync issues, you can submit a follow-up response below or re-open the ticket.
                </p>
              </div>
            </div>
          )}

          {/* Add Response / Engineering Log Box */}
          <div className="p-5 rounded-3xl bg-[#090D1A] border border-slate-800/80 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-400" />
                <span>Submit Response or Additional Logs</span>
              </h4>
              <span className="text-[10px] text-slate-500 font-mono">
                Ticket #{activeTicket.ticketNumber}
              </span>
            </div>

            <form onSubmit={handleSendReply} className="space-y-3">
              {replyAttachment && (
                <div className="flex items-center justify-between p-2.5 bg-purple-950/60 border border-purple-500/40 rounded-xl text-xs text-purple-300">
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="w-4 h-4 text-purple-400 shrink-0" />
                    <span className="truncate font-mono">Attached: {replyAttachment}</span>
                  </div>
                  <button type="button" onClick={() => setReplyAttachment(null)} className="p-1 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              <textarea
                rows={3}
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                placeholder="Write your update, provide Gradle sync logs, or ask a question to Vikram Joshi..."
                className="w-full px-4 py-3 bg-[#05070D] border border-slate-800 rounded-2xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 leading-relaxed resize-none"
              />

              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <input
                  type="file"
                  ref={replyFileInputRef}
                  onChange={e => {
                    if (e.target.files && e.target.files[0]) {
                      setReplyAttachment(e.target.files[0].name);
                      showToast(`Attached: ${e.target.files[0].name}`, 'info');
                    }
                  }}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => replyFileInputRef.current?.click()}
                  className="px-3.5 py-2 bg-[#05070D] border border-slate-800 hover:border-purple-500/40 hover:bg-slate-900 rounded-xl text-xs text-slate-300 flex items-center gap-2 transition-colors"
                >
                  <Paperclip className="w-4 h-4 text-purple-400" />
                  <span>Attach Build Log / Screenshot</span>
                </button>

                <button
                  type="submit"
                  disabled={isSendingReply || (!replyText.trim() && !replyAttachment)}
                  className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-40 text-white text-xs font-bold rounded-xl shadow-md shadow-purple-950/50 flex items-center gap-2 transition-all active:scale-95 ml-auto"
                >
                  {isSendingReply ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Post Response</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

        </div>
      ) : (
        /* TICKETS LIST DASHBOARD (When viewing all tickets) */
        <div className="space-y-4">
          
          {/* Filter Bar & Search */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl bg-[#090D1A] border border-slate-800/80">
            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 bg-[#05070D] p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setActiveTab('ALL')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                  activeTab === 'ALL' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                All Tickets ({tickets.length})
              </button>
              <button
                onClick={() => setActiveTab('ACTIVE')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                  activeTab === 'ACTIVE' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Active ({activeCount})
              </button>
              <button
                onClick={() => setActiveTab('RESOLVED')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                  activeTab === 'RESOLVED' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Resolved ({resolvedCount})
              </button>
            </div>

            {/* Search Box */}
            <div className="relative flex-1 max-w-sm">
              <input
                type="text"
                value={ticketSearch}
                onChange={e => setTicketSearch(e.target.value)}
                placeholder="Search ticket #, subject, or engineer..."
                className="w-full pl-9 pr-3 py-2 bg-[#05070D] border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            </div>
          </div>

          {/* Tickets Stream Cards */}
          <div className="space-y-3">
            {filteredTickets.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-[#090D1A] border border-slate-800/80 space-y-3">
                <AlertCircle className="w-10 h-10 text-slate-600 mx-auto" />
                <h3 className="text-sm font-bold text-slate-300">No Support Tickets Found</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  {ticketSearch ? 'No tickets match your search query.' : 'You have not submitted any technical support tickets yet.'}
                </p>
                <button
                  onClick={() => setIsNewTicketModalOpen(true)}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl shadow-md transition-all"
                >
                  Raise Support Ticket
                </button>
              </div>
            ) : (
              filteredTickets.map(ticket => {
                const lastMsg = ticket.messages[ticket.messages.length - 1];

                return (
                  <div
                    key={ticket.id}
                    onClick={() => setActiveTicketId(ticket.id)}
                    className="p-5 rounded-3xl bg-[#090D1A] hover:bg-[#0C1224] border border-slate-800/90 hover:border-purple-500/50 cursor-pointer transition-all shadow-md group relative overflow-hidden"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black text-purple-400 bg-purple-950/60 px-2.5 py-0.5 rounded-lg border border-purple-500/30">
                          #{ticket.ticketNumber}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 uppercase bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                          {getCategoryLabel(ticket.category)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {getPriorityBadge(ticket.priority)}
                        {getStatusBadge(ticket.status)}
                      </div>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                      {ticket.subject}
                    </h3>

                    {lastMsg && (
                      <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed bg-[#05070D] p-3 rounded-2xl border border-slate-800/60">
                        <strong className="text-purple-300">
                          {lastMsg.sender === 'CUSTOMER' ? 'You: ' : `${lastMsg.senderName}: `}
                        </strong>
                        {lastMsg.text}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-800/60 text-xs">
                      <div className="flex items-center gap-2 text-slate-400">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Assigned: <strong className="text-slate-200">{ticket.assignedAgent}</strong></span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-[11px] text-slate-500 font-mono">
                          Updated: {lastMsg?.timestamp || 'Recently'}
                        </span>
                        <span className="text-xs font-bold text-purple-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          <span>View Resolution Log</span>
                          <ChevronRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>
      )}

      {/* RAISE SUPPORT TICKET MODAL */}
      {isNewTicketModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#0D1322] border border-purple-500/40 rounded-3xl p-6 shadow-2xl shadow-purple-950/60 max-h-[92vh] overflow-y-auto">
            
            <button
              onClick={() => setIsNewTicketModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800/60"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-purple-950 border border-purple-500/50 flex items-center justify-center text-purple-400 shadow-sm">
                <Plus className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Raise Technical Support Ticket</h3>
                <p className="text-xs text-slate-400">Senior Android Engineers respond within 30m - 2 hours.</p>
              </div>
            </div>

            <form onSubmit={handleCreateTicketSubmit} className="space-y-4">
              
              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Department / Issue Category <span className="text-purple-400">*</span>
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as TicketCategory)}
                  className="w-full px-3.5 py-2.5 bg-[#05070D] border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="TECHNICAL_BUG">⚙️ Technical Bug & Android Studio Setup</option>
                  <option value="ORDER_DELIVERY">📦 Source Code Delivery & License Download</option>
                  <option value="PAYMENT_VERIFICATION">💳 Payment Verification & Invoices</option>
                  <option value="CUSTOM_APP">📱 Custom Android App Development</option>
                  <option value="CUSTOM_WEBSITE">🌐 Custom Website Development</option>
                  <option value="GENERAL">❓ General Technical Inquiry</option>
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Priority Level <span className="text-purple-400">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['LOW', 'MEDIUM', 'URGENT'] as TicketPriority[]).map(p => (
                    <button
                      type="button"
                      key={p}
                      onClick={() => setPriority(p)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                        priority === p 
                          ? 'bg-purple-600 text-white border-purple-400 shadow-md' 
                          : 'bg-[#05070D] text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {p === 'LOW' ? '🟢 Normal' : p === 'MEDIUM' ? '🟡 Medium' : '🔴 Urgent'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Ticket Subject <span className="text-purple-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="e.g. Assistance with Android Studio setup & Gradle build"
                  className="w-full px-4 py-2.5 bg-[#05070D] border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Related Order (Optional) */}
              {orders.length > 0 && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Link Past Order <span className="text-slate-500 font-normal">(Optional)</span>
                  </label>
                  <select
                    value={selectedOrderId}
                    onChange={e => setSelectedOrderId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#05070D] border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="">No specific order</option>
                    {orders.map(o => (
                      <option key={o.id} value={o.id}>
                        Order #{o.orderNumber} ({o.items[0]?.productTitle})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Problem Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Detailed Problem Description <span className="text-purple-400">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={initialMessage}
                  onChange={e => setInitialMessage(e.target.value)}
                  placeholder="Describe what error you encountered, Android Gradle Plugin version, JDK version, or question..."
                  className="w-full px-4 py-2.5 bg-[#05070D] border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 leading-relaxed resize-none"
                />
              </div>

              {/* File Attachment */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Attach Log File / Screenshot <span className="text-slate-500 font-normal">(Optional)</span>
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={e => {
                    if (e.target.files && e.target.files[0]) {
                      setAttachmentName(e.target.files[0].name);
                      showToast(`Attached: ${e.target.files[0].name}`, 'info');
                    }
                  }}
                  className="hidden"
                />
                
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3.5 py-2 bg-[#05070D] border border-slate-700/80 hover:bg-slate-800 rounded-xl text-xs text-slate-300 flex items-center gap-2 transition-colors"
                  >
                    <Paperclip className="w-3.5 h-3.5 text-purple-400" />
                    <span>Choose File</span>
                  </button>
                  {attachmentName && (
                    <span className="text-xs font-mono text-purple-300 truncate max-w-[200px]">
                      {attachmentName}
                    </span>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-950/50 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 mt-2"
              >
                {isSubmitting ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Register Support Ticket</span>
                  </>
                )}
              </button>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
