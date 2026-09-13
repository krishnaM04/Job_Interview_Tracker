import React, { useState, useMemo } from 'react';

const Table = ({ 
  columns = [],
  data = [],
  sortable = true,
  paginated = true,
  pageSize = 10,
  onRowClick = null,
  searchable = false,
  searchFields = []
}) => {
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = useMemo(() => {
    if (!searchable || !searchTerm) return data;
    return data.filter(row =>
      searchFields.some(field =>
        String(row[field]).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm, searchFields, searchable]);

  const sortedData = useMemo(() => {
    if (!sortable || !sortField) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortField, sortDirection, sortable]);

  const paginatedData = useMemo(() => {
    if (!paginated) return sortedData;
    const startIdx = (currentPage - 1) * pageSize;
    return sortedData.slice(startIdx, startIdx + pageSize);
  }, [sortedData, currentPage, pageSize, paginated]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  const handleSort = (field) => {
    if (!sortable) return;
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <div>
      {searchable && (
        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            style={{
              padding: '10px 14px',
              borderRadius: '7px',
              border: '1px solid var(--border)',
              backgroundColor: 'var(--bg-surface)',
              color: 'var(--text)',
              width: '100%',
              maxWidth: '320px',
              fontSize: '14px',
              transition: 'border-color 0.2s, box-shadow 0.2s'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent)';
              e.currentTarget.style.boxShadow = '0 0 0 3px var(--accent-light)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
        </div>
      )}

      <div style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid var(--border)' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          color: 'var(--text)',
          backgroundColor: 'var(--bg-surface)'
        }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border)', backgroundColor: 'var(--bg)' }}>
              {columns.map(col => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  style={{
                    padding: '14px 16px',
                    textAlign: col.align || 'left',
                    cursor: sortable ? 'pointer' : 'default',
                    userSelect: 'none',
                    fontWeight: '700',
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.4px',
                    color: 'var(--text)',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (sortable) e.currentTarget.style.backgroundColor = 'var(--border-light)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  {col.label}
                  {sortable && sortField === col.key && (
                    <span style={{ marginLeft: '8px', fontSize: '14px' }}>
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-light)' }}>
                  <div style={{ fontSize: '14px' }}>No data available</div>
                </td>
              </tr>
            ) : (
              paginatedData.map((row, idx) => (
                <tr
                  key={idx}
                  onClick={() => onRowClick?.(row)}
                  style={{
                    borderBottom: '1px solid var(--border)',
                    cursor: onRowClick ? 'pointer' : 'default',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--bg)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  {columns.map(col => (
                    <td
                      key={col.key}
                      style={{
                        padding: '14px 16px',
                        textAlign: col.align || 'left',
                        fontSize: '14px'
                      }}
                    >
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {paginated && totalPages > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '20px',
          padding: '16px',
          color: 'var(--text)',
          fontSize: '14px'
        }}>
          <div style={{ fontWeight: '500' }}>
            Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              style={{
                padding: '8px 16px',
                backgroundColor: currentPage === 1 ? 'var(--border)' : 'var(--accent)',
                color: currentPage === 1 ? 'var(--text-light)' : '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                fontWeight: '600',
                fontSize: '13px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (currentPage > 1) {
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(91, 110, 255, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              style={{
                padding: '8px 16px',
                backgroundColor: currentPage === totalPages ? 'var(--border)' : 'var(--accent)',
                color: currentPage === totalPages ? 'var(--text-light)' : '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                fontWeight: '600',
                fontSize: '13px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (currentPage < totalPages) {
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(91, 110, 255, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
