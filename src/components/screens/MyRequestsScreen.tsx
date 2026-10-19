import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  FileText, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  Calendar, 
  ArrowRight, 
  ShieldCheck, 
  Smartphone, 
  Globe,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export const MyRequestsScreen: React.FC = () => {
  const { requests, approveQuote, navigateTo, openConversationWithSupport, showToast } = useApp();
  const [approvingId, setApprovingId] = useState<string | null>(null);

  const handleApprove = async (id: string, reqIdStr: string) => {
    setApprovingId(id);
    const success = await approveQuote(id);
    setApprovingId(null);
    if (success) {
      showToast(`Milestone quote for ${reqIdStr} approved!`, 'success');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SUBMITTED':
        return <span className="text-[10px] bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded font-mono">SUBMITTED</span>;
      case 'UNDER_REVIEW':
        return <span className="text-[10px] bg-amber-950/80 border border-amber-500/40 text-amber-300 px-2.5 py-0.5 rounded font-mono">UNDER REVIEW</span>;
      case 'QUOTE_READY':
        return <span className="text-[10px] bg-purple-950/80 border border-purple-500/40 text-purple-300 px-2.5 py-0.5 rounded font-mono font-bold animate-pulse">QUOTE READY</span>;
      case 'AWAITING_APPROVAL':
        return <span className="text-[10px] bg-blue-950/80 border border-blue-500/40 text-blue-300 px-2.5 py-0.5 rounded font-mono">AWAITING APPROVAL</span>;
      case 'AWAITING_PAYMENT':
        return <span className="text-[10px] bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 px-2.5 py-0.5 rounded font-mono">AWAITING PAYMENT</span>;
      case 'IN_PROGRESS':
        return <span className="text-[10px] bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 px-2.5 py-0.5 rounded font-mono font-bold">IN PROGRESS</span>;
      case 'COMPLETED':
        return <span className="text-[10px] bg-emerald-900 text-white px-2.5 py-0.5 rounded font-mono">COMPLETED</span>;
      default:
        return <span className="text-[10px] bg-slate-800 text-slate-400 px-2.5 py-0.5 rounded font-mono">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 pb-24">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-400" />
            <span>My Custom Requests & Quotes</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Track status, quotes, and delivery milestones for your submitted project specifications.
          </p>
        </div>

        <button
          onClick={() => navigateTo('build-app')}
          className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-md"
        >
          <span>New Brief</span>
        </button>
      </div>

      {requests.length === 0 ? (
        <div className="py-20 text-center bg-[#0D1322]/50 border border-slate-800/80 rounded-3xl p-8 max-w-sm mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-purple-950/50 border border-purple-500/30 flex items-center justify-center mx-auto text-purple-400 mb-3">
            <FileText className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-white">No Project Requests</h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Need an Android app or custom website engineered? Submit your brief to receive an architect quote.
          </p>
          <button
            onClick={() => navigateTo('build-app')}
            className="mt-5 px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-xl transition-colors"
          >
            Create First Request
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map(req => (
            <div
              key={req.id}
              className="p-5 rounded-2xl bg-[#0D1322] border border-slate-800/80 space-y-4 shadow-sm"
            >
              {/* Top row */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/60">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-purple-400">
                    {req.type === 'CUSTOM_APP' ? (
                      <Smartphone className="w-4 h-4 text-purple-400" />
                    ) : (
                      <Globe className="w-4 h-4 text-cyan-400" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-white">{req.requestId}</span>
                      {getStatusBadge(req.status)}
                    </div>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      Submitted on {req.createdAt} · {req.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      navigateTo('messages', { conversationId: `conv-${req.id}` });
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
                    <span>Project Discussion</span>
                  </button>
                </div>
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="text-base font-bold text-white">{req.projectName}</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {req.description}
                </p>
              </div>

              {/* Features Requested */}
              {req.features && req.features.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-semibold">
                    Scope & Technical Deliverables:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {req.features.map((f, i) => (
                      <span key={i} className="text-[11px] px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-300">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Quote & Approval Callout (Section 10 Requirement) */}
              {req.quotedPrice ? (
                <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs text-slate-400">Formal Engineering Quote:</span>
                      <span className="text-lg font-black text-white font-mono">
                        ${req.quotedPrice.toLocaleString()} USD
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-purple-300 mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-purple-400" />
                        Target Handoff: {req.estimatedDeliveryDate || 'TBD'}
                      </span>
                      {req.assignedTeam && (
                        <span>· {req.assignedTeam}</span>
                      )}
                    </div>
                  </div>

                  <div>
                    {req.scopeApprovedByCustomer ? (
                      <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-500/40 px-3 py-1.5 rounded-xl">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Scope & Quote Approved</span>
                      </div>
                    ) : (
                      <button
                        disabled={approvingId === req.id}
                        onClick={() => handleApprove(req.id, req.requestId)}
                        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50"
                      >
                        {approvingId === req.id ? 'Processing...' : 'Approve Milestone Quote'}
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                  <span>Target Budget: <strong className="text-slate-200">{req.budgetRange}</strong></span>
                  <span>Est. Timeline: <strong className="text-slate-200">{req.expectedDeadline}</strong></span>
                </div>
              )}

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
