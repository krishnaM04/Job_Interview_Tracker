import React, { useState, useEffect, useRef } from 'react';
import Card from '../base/Card';
import Button from '../base/Button';
import Badge from '../base/Badge';
import Table from '../base/Table';
import { getDocuments, uploadDocument, deleteDocument } from '../../services/documentService';

const STORE_KEY = 'local_documents';

function localDocs() {
  try { return JSON.parse(sessionStorage.getItem(STORE_KEY) || '[]'); }
  catch { return []; }
}
function saveDocs(docs) {
  sessionStorage.setItem(STORE_KEY, JSON.stringify(docs));
}

const DOC_TYPES = ['Resume', 'Cover-Letter', 'Supporting', 'Other'];

export default function DocumentLibrary() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // { file }
  const [docType, setDocType] = useState('Resume');
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();

  useEffect(() => {
    (async () => {
      try {
        const res = await getDocuments();
        const apiDocs = Array.isArray(res.data) ? res.data : [];
        const local = localDocs();
        const merged = [...apiDocs];
        local.forEach(d => { if (!merged.find(x => x.id === d.id)) merged.push(d); });
        setDocuments(merged);
      } catch {
        setDocuments(localDocs());
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const openFilePicker = () => fileRef.current?.click();

  const onFileChosen = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setDocType('Resume');
    setModal({ file });
    e.target.value = '';
  };

  const handleUpload = async () => {
    if (!modal) return;
    setUploading(true);
    try {
      const res = await uploadDocument(modal.file, { type: docType });
      const newDoc = res.data;
      const updated = [...documents, newDoc];
      setDocuments(updated);
      saveDocs(localDocs().concat(newDoc));
    } catch {
      const newDoc = {
        id: `local_${Date.now()}`,
        name: modal.file.name,
        type: docType,
        uploadedDate: new Date().toISOString().split('T')[0],
        size: modal.file.size,
      };
      const updated = [...documents, newDoc];
      setDocuments(updated);
      saveDocs(localDocs().concat(newDoc));
    } finally {
      setUploading(false);
      setModal(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this document?')) return;
    try {
      await deleteDocument(id);
    } catch { /* ignore API error, remove locally */ }
    const updated = documents.filter(d => d.id !== id);
    setDocuments(updated);
    saveDocs(localDocs().filter(d => d.id !== id));
  };

  return (
    <div style={{ padding: '20px' }}>
      <input ref={fileRef} type="file" style={{ display: 'none' }} onChange={onFileChosen} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ color: 'var(--text)', margin: 0 }}>Document Library</h1>
        <Button variant="primary" onClick={openFilePicker}>⬆ Upload Document</Button>
      </div>

      {loading ? (
        <div style={{ color: 'var(--text)' }}>Loading documents...</div>
      ) : (
        <Card>
          <Table
            columns={[
              { key: 'name', label: 'Document' },
              { key: 'type', label: 'Type', render: (t) => <Badge>{t}</Badge> },
              { key: 'uploadedDate', label: 'Uploaded' },
              { key: 'size', label: 'Size', render: (s) => s ? `${(s / 1024).toFixed(1)} KB` : '—' },
              {
                key: 'id', label: 'Action',
                render: (id) => (
                  <Button size="small" variant="danger" onClick={() => handleDelete(id)}>
                    Delete
                  </Button>
                )
              }
            ]}
            data={documents}
            paginated={true}
            pageSize={10}
          />
        </Card>
      )}

      {modal && (
        <div style={overlay}>
          <div style={dialog}>
            <h3 style={{ margin: '0 0 16px', color: 'var(--text)' }}>Upload Document</h3>
            <p style={{ margin: '0 0 12px', color: 'var(--text)', fontSize: 14 }}>
              <strong>File:</strong> {modal.file.name}
            </p>
            <label style={{ display: 'block', marginBottom: 8, color: 'var(--text)', fontSize: 14, fontWeight: 600 }}>
              Document Type
            </label>
            <select
              value={docType}
              onChange={e => setDocType(e.target.value)}
              style={selectStyle}
            >
              {DOC_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <div style={{ display: 'flex', gap: 10, marginTop: 20, justifyContent: 'flex-end' }}>
              <Button variant="secondary" onClick={() => setModal(null)} disabled={uploading}>Cancel</Button>
              <Button variant="primary" onClick={handleUpload} loading={uploading}>Upload</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const overlay = {
  position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
  display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
};
const dialog = {
  background: 'var(--bg-surface)', borderRadius: 10, padding: 28,
  width: 360, boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
};
const selectStyle = {
  width: '100%', padding: '10px 12px', borderRadius: 7,
  border: '1px solid var(--border)', background: 'var(--bg-surface)',
  color: 'var(--text)', fontSize: 14
};
