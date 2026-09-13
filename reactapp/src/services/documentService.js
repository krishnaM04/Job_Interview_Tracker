import mockData from '../api/mockData';

export const getDocuments = async (candidateId) => {
  await new Promise(r => setTimeout(r, 300));
  return { data: mockData.documents, status: 200 };
};

export const getDocumentById = async (docId) => {
  await new Promise(r => setTimeout(r, 200));
  const doc = mockData.documents.find(d => d.id === docId);
  return { data: doc, status: doc ? 200 : 404 };
};

export const uploadDocument = async (file, metadata) => {
  await new Promise(r => setTimeout(r, 800));
  const newDoc = {
    id: mockData.documents.length + 1,
    name: file.name,
    type: metadata.type,
    uploadedDate: new Date().toISOString().split('T')[0],
    size: file.size,
    version: 1,
    tags: metadata.tags || [],
    usedInApplications: []
  };
  mockData.documents.push(newDoc);
  return { data: newDoc, status: 201 };
};

export const deleteDocument = async (docId) => {
  await new Promise(r => setTimeout(r, 250));
  const index = mockData.documents.findIndex(d => d.id === docId);
  if (index === -1) return { status: 404 };
  const deleted = mockData.documents.splice(index, 1);
  return { data: deleted[0], status: 200 };
};

export const updateDocumentMetadata = async (docId, metadata) => {
  await new Promise(r => setTimeout(r, 250));
  const doc = mockData.documents.find(d => d.id === docId);
  if (!doc) return { status: 404 };
  Object.assign(doc, metadata);
  return { data: doc, status: 200 };
};

export const createDocumentVersion = async (docId, newFile) => {
  await new Promise(r => setTimeout(r, 500));
  const doc = mockData.documents.find(d => d.id === docId);
  if (!doc) return { status: 404 };
  doc.version += 1;
  doc.uploadedDate = new Date().toISOString().split('T')[0];
  return { data: doc, status: 200 };
};

export const getResumeTemplates = async () => {
  await new Promise(r => setTimeout(r, 200));
  return {
    data: [
      { id: 1, name: 'Modern', category: 'technical' },
      { id: 2, name: 'Classic', category: 'professional' },
      { id: 3, name: 'Minimal', category: 'minimalist' }
    ],
    status: 200
  };
};

export const getCoverLetterTemplates = async () => {
  await new Promise(r => setTimeout(r, 200));
  return {
    data: [
      { 
        id: 1, 
        name: 'Professional', 
        content: 'Dear [Company Name],\n\nI am interested in the [Position] role...'
      },
      { 
        id: 2, 
        name: 'Enthusiastic', 
        content: 'Dear Hiring Manager,\n\nI am excited about the opportunity...'
      }
    ],
    status: 200
  };
};

export const generateCoverLetter = async (templateId, variables) => {
  await new Promise(r => setTimeout(r, 300));
  return {
    data: {
      content: 'Generated cover letter with company and position info',
      generatedDate: new Date().toISOString()
    },
    status: 201
  };
};
