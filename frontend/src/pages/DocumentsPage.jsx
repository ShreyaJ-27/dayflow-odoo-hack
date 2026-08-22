import React, { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../services/api';
import { toast } from 'sonner';
import {
  FileText,
  Upload,
  Download,
  Trash2,
  AlertCircle,
  RefreshCw,
  File,
  Image,
  FileSpreadsheet,
  FileText as FilePdf,
  Plus,
  CheckCircle2,
  Loader2
} from 'lucide-react';

const fmtDate = (v) => v ? new Date(v).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
const fmtSize = (bytes) => {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getFileIcon = (mimeType) => {
  if (!mimeType) return File;
  if (mimeType.startsWith('image/')) return Image;
  if (mimeType.includes('pdf')) return FilePdf;
  if (mimeType.includes('sheet') || mimeType.includes('csv') || mimeType.includes('excel')) return FileSpreadsheet;
  return File;
};

const DOC_TYPES = ['ID_PROOF', 'OFFER_LETTER', 'CONTRACT', 'CERTIFICATE', 'MEDICAL', 'OTHER'];

export const DocumentsPage = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [docType, setDocType] = useState('OTHER');
  const fileRef = useRef(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.myDocuments();
      setDocuments(result.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load documents');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File too large. Maximum size is 10 MB.');
      return;
    }
    setUploading(true);
    try {
      const result = await api.uploadDocument(file, docType);
      setDocuments((prev) => [result.data, ...prev]);
      toast.success(`"${file.name}" uploaded successfully`);
      if (fileRef.current) fileRef.current.value = '';
    } catch (err) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this document? This cannot be undone.')) return;
    setDeleteId(id);
    try {
      await api.deleteDocument(id);
      setDocuments((prev) => prev.filter((d) => d.id !== id));
      toast.success('Document deleted');
    } catch (err) {
      toast.error(err.message || 'Delete failed');
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
            Documents
            <span className="text-xs px-2.5 py-1 rounded-full bg-brand-500/15 text-brand-300 border border-brand-500/30 font-medium">
              {documents.length} files
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">Upload and manage your personal documents.</p>
        </div>

        {/* Upload */}
        <div className="flex items-center gap-3">
          <select
            value={docType}
            onChange={(e) => setDocType(e.target.value)}
            className="bg-[#141624] border border-[#23273a] text-xs text-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-brand-500"
          >
            {DOC_TYPES.map((t) => (
              <option key={t} value={t} className="bg-[#131622]">{t.replace('_', ' ')}</option>
            ))}
          </select>

          <label className="cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-accent-purple text-white text-xs font-bold shadow-lg shadow-brand-600/30 hover:shadow-brand-500/50 hover:scale-[1.02] transition-all">
            {uploading ? (
              <><Loader2 className="w-4 h-4 animate-spin" />Uploading...</>
            ) : (
              <><Upload className="w-4 h-4" />Upload File</>
            )}
            <input
              ref={fileRef}
              type="file"
              className="sr-only"
              onChange={handleUpload}
              disabled={uploading}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xls,.xlsx,.csv"
            />
          </label>
        </div>
      </div>

      {/* Loading/Error */}
      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 bg-white/5 rounded-xl" />
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center gap-4 py-12">
          <AlertCircle className="w-8 h-8 text-rose-400" />
          <p className="text-sm text-slate-400">{error}</p>
          <button onClick={load} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 text-white text-sm font-semibold transition-colors">
            <RefreshCw className="w-4 h-4" />Retry
          </button>
        </div>
      ) : documents.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] gap-4">
          <div className="p-6 rounded-2xl bg-[#131622] border border-[#23273a] border-dashed">
            <FileText className="w-10 h-10 text-slate-600 mx-auto" />
          </div>
          <h3 className="font-bold text-white">No documents yet</h3>
          <p className="text-sm text-slate-400 max-w-sm text-center">
            Upload your ID proof, certificates, contracts, and other important documents here.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl bg-[#131622] border border-[#23273a] overflow-hidden">
          <div className="divide-y divide-[#23273a]/60">
            {documents.map((doc) => {
              const Icon = getFileIcon(doc.mimeType);
              return (
                <div key={doc.id} className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors group">
                  {/* Icon */}
                  <div className="w-10 h-10 rounded-xl bg-[#161928] border border-[#23273a] flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-brand-400" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{doc.originalName || doc.fileName}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-brand-500/15 text-brand-300">
                        {doc.type}
                      </span>
                      <span className="text-[11px] text-slate-500">{fmtSize(doc.size)}</span>
                      <span className="text-[11px] text-slate-500">{fmtDate(doc.createdAt)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {doc.url && (
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-brand-500/10 hover:bg-brand-500/20 text-brand-400 hover:text-brand-300 transition-colors"
                        title="Download"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </a>
                    )}
                    <button
                      onClick={() => handleDelete(doc.id)}
                      disabled={deleteId === doc.id}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 transition-colors disabled:opacity-50"
                      title="Delete"
                    >
                      {deleteId === doc.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentsPage;
