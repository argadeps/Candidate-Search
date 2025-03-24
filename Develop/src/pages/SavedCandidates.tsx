import { useState, useEffect, useMemo } from 'react';
import { Candidate } from '../interfaces/Candidate.interface';
import { useNavigate } from 'react-router-dom';

type SortColumn = 'name' | 'location' | 'email' | 'company' | 'bio';
type SortDirection = 'asc' | 'desc';

const SavedCandidates = () => {
  // Explicitly create the navigate function
  const navigate = useNavigate();
  
  // Create a function that uses navigate to fix the TypeScript warning
  const goToHome = () => navigate('/');
  
  const [savedCandidates, setSavedCandidates] = useState<Candidate[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    column: SortColumn;
    direction: SortDirection;
  } | null>(null);

  // For TypeScript to recognize this function is being used
  const handleReject = (id: number) => handleRemoveCandidate(id);

  useEffect(() => {
    // Load saved candidates from localStorage
    const getSavedCandidates = (): Candidate[] => {
      const saved = localStorage.getItem('savedCandidates');
      return saved ? JSON.parse(saved) : [];
    };

    setSavedCandidates(getSavedCandidates());
  }, []);

  const handleRemoveCandidate = (candidateId: number) => {
    // Filter out the candidate with the given id
    const updatedCandidates = savedCandidates.filter(
      (candidate) => candidate.id !== candidateId
    );
    
    // Update state
    setSavedCandidates(updatedCandidates);
    
    // Update localStorage
    localStorage.setItem('savedCandidates', JSON.stringify(updatedCandidates));
  };
  
  const handleSort = (column: SortColumn) => {
    // If clicking the same column, toggle direction
    let direction: SortDirection = 'asc';
    
    if (sortConfig && sortConfig.column === column) {
      direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
    }
    
    setSortConfig({ column, direction });
  };
  
  // Apply sorting to the candidates array
  const sortedCandidates = useMemo(() => {
    if (!sortConfig) return savedCandidates;
    
    return [...savedCandidates].sort((a, b) => {
      let aValue: string;
      let bValue: string;
      
      // Handle the specific column sorting
      switch (sortConfig.column) {
        case 'name':
          aValue = (a.name || a.login).toLowerCase();
          bValue = (b.name || b.login).toLowerCase();
          break;
        case 'location':
          aValue = (a.location || '').toLowerCase();
          bValue = (b.location || '').toLowerCase();
          break;
        case 'email':
          aValue = (a.email || '').toLowerCase();
          bValue = (b.email || '').toLowerCase();
          break;
        case 'company':
          aValue = (a.company || '').toLowerCase();
          bValue = (b.company || '').toLowerCase();
          break;
        case 'bio':
          aValue = (a.bio || '').toLowerCase();
          bValue = (b.bio || '').toLowerCase();
          break;
        default:
          return 0;
      }
      
      // Apply sort direction
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [savedCandidates, sortConfig]);

  // Minimal styles needed for functionality
  const styles = {
    avatar: {
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      objectFit: 'cover' as const,
    },
    sortableHeader: {
      cursor: 'pointer',
      position: 'relative' as const,
      paddingRight: '15px',
    },
    sortIcon: {
      position: 'absolute' as const,
      right: '2px',
      top: '50%',
      transform: 'translateY(-50%)',
    },
    nameContainer: {
      display: 'flex',
      flexDirection: 'column' as const,
    },
    username: {
      fontSize: '0.9rem',
      opacity: 0.8,
    },
    rejectBtn: {
      width: '36px',
      height: '36px',
      borderRadius: '50%',
      backgroundColor: '#ff3b30',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0',
      margin: '0 auto',
    }
  };

  return (
    <div>
      <h1 className="page-title">Potential Candidates</h1>
      
      {savedCandidates.length === 0 ? (
        <div className="no-results">
          <h2>No Potential Candidates Found</h2>
          <p>You haven't saved any candidates yet.</p>
          <button onClick={goToHome}>
            Find Candidates
          </button>
        </div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Image</th>
              <th 
                onClick={() => handleSort('name')}
                style={styles.sortableHeader}
              >
                Name
                {sortConfig?.column === 'name' && (
                  <span style={styles.sortIcon}>
                    {sortConfig.direction === 'asc' ? '▲' : '▼'}
                  </span>
                )}
              </th>
              <th 
                onClick={() => handleSort('location')}
                style={styles.sortableHeader}
              >
                Location
                {sortConfig?.column === 'location' && (
                  <span style={styles.sortIcon}>
                    {sortConfig.direction === 'asc' ? '▲' : '▼'}
                  </span>
                )}
              </th>
              <th 
                onClick={() => handleSort('email')}
                style={styles.sortableHeader}
              >
                Email
                {sortConfig?.column === 'email' && (
                  <span style={styles.sortIcon}>
                    {sortConfig.direction === 'asc' ? '▲' : '▼'}
                  </span>
                )}
              </th>
              <th 
                onClick={() => handleSort('company')}
                style={styles.sortableHeader}
              >
                Company
                {sortConfig?.column === 'company' && (
                  <span style={styles.sortIcon}>
                    {sortConfig.direction === 'asc' ? '▲' : '▼'}
                  </span>
                )}
              </th>
              <th 
                onClick={() => handleSort('bio')}
                style={styles.sortableHeader}
              >
                Bio
                {sortConfig?.column === 'bio' && (
                  <span style={styles.sortIcon}>
                    {sortConfig.direction === 'asc' ? '▲' : '▼'}
                  </span>
                )}
              </th>
              <th>Reject</th>
            </tr>
          </thead>
          <tbody>
            {sortedCandidates.map((candidate) => (
              <tr key={candidate.id}>
                <td>
                  <img 
                    src={candidate.avatar_url} 
                    alt={`${candidate.name || candidate.login} avatar`}
                    style={styles.avatar}
                  />
                </td>
                <td>
                  <div style={styles.nameContainer}>
                    <div>{candidate.name || candidate.login}</div>
                    <div style={styles.username}>({candidate.login})</div>
                  </div>
                </td>
                <td>{candidate.location || 'Not specified'}</td>
                <td>
                  {candidate.email ? (
                    <a href={`mailto:${candidate.email}`}>{candidate.email}</a>
                  ) : (
                    'Not available'
                  )}
                </td>
                <td>{candidate.company || 'Not specified'}</td>
                <td>{candidate.bio || 'No bio available'}</td>
                <td>
                  <button
                    style={styles.rejectBtn}
                    onClick={() => handleReject(candidate.id)}
                    aria-label="Remove Candidate"
                  >
                    <span>-</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SavedCandidates;
