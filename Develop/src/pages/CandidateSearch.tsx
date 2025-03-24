import { useState, useEffect } from 'react';
import { searchGithub, searchGithubUser } from '../api/API';
import { Candidate } from '../interfaces/Candidate.interface';
import { useNavigate } from 'react-router-dom';

const CandidateSearch = () => {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);


const getSavedCandidates = (): Candidate[] => {
  const saved = localStorage.getItem('savedCandidates');
  return saved ? JSON.parse(saved) :[]
};

const saveCandidate = (candidate: Candidate) => {
  const savedCandidates = getSavedCandidates();
  if (!savedCandidates.some((c: Candidate) => c.id === candidate.id)) {
    localStorage.setItem(
      'savedCandidates',
      JSON.stringify([...savedCandidates, candidate])

    );
    
  }
};

const handleRefresh =() => {
  setRefreshTrigger(prev => prev + 1);
};

useEffect(() => {
  const fetchCandidates = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Call searchGithub without parameters
      const data = await searchGithub();
      
      // Check if data is an array
      if (!Array.isArray(data)) {
        throw new Error('Invalid data format received from API');
      }
      
      // Get detailed information for each user
      const detailedCandidates = await Promise.all(
        data.slice(0, 10).map(async (user: any) => {
          return await searchGithubUser(user.login);
        })
      );
      
      setCandidates(detailedCandidates);
      setCurrentIndex(0); // Reset to first candidate
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch candidates. Please try again later.');
      setLoading(false);
      console.error('Error fetching candidates:', err);
    }
  };

  fetchCandidates();
}, [refreshTrigger]); 

const handleAccept = () => {
  if (candidates.length > 0 && currentIndex < candidates.length) {
    saveCandidate(candidates[currentIndex]);
    nextCandidate();
  }
};

const handleReject = () => {
  nextCandidate();

};

const nextCandidate = () => {
  setCurrentIndex(prevIndex => prevIndex +1);

};

const currentCandidate = candidates[currentIndex];
const noMoreCandidates = candidates.length === 0 || currentIndex >= candidates.length;

return (
  <div className='candidate-search'>
    <h1 className='page-title'>Candidate Search</h1>
    <div className='refresh-container'>
      <button onClick={handleRefresh}
      className='refresh-button'
      disabled={loading}
      > 
      Find New Canidates
      </button>      
    </div>

    {loading ? (
      <div className='loading'>Loading Candidates...</div>
    ) : error ? (
      <div className='error'>{error}</div>
    ) : noMoreCandidates ? (
      <div className='no-candidates'>
        <h2>No Candidates Available</h2>
        <p>Click "Find New Candidates" to discover more users.</p>
        {getSavedCandidates().length > 0 && (
          <button onClick={() => navigate('/SavedCandidates')}>
            View Saved Candidates
          </button>
        )}
      </div>
    ) : (
      <div className='candidate-profile'>        
          <img
            src={currentCandidate.avatar_url}
            alt={`${currentCandidate.name || currentCandidate.login} avatar`}
            className="candidate-avatar"
            />
          <h2 className="candidate-name">{currentCandidate.name || currentCandidate.login}</h2>
          <p className="candidate-username">@{currentCandidate.login}</p>         
      

        <div className='candidate-details'>
          <p>
            <span className='detail-label'>location:</span>
            {currentCandidate.location || 'Not Specified'}
          </p>
          <p>
            <span className='detail-label'>Email:</span>
            {currentCandidate.email || 'Not Available'}
          </p>
          <p>
            <span className='detail-label'>GitHub:</span>
            <a
            href={currentCandidate.html_url}
            target='blank'
            rel='noopener noreferrer'
            >
              {currentCandidate.html_url}
            </a>
          </p>
          <p> 
          <span className="detail-label">Company:</span> 
          {currentCandidate.company || 'Not specified'}
          </p>
        </div>
        <div className='candidate-actions'>
        <button 
         className="reject-btn" 
         onClick={handleReject}
         aria-label="Reject Candidate"
       >
         <span className="btn-icon">-</span>
       </button>

       <button 
              className="accept-btn" 
              onClick={handleAccept}
              aria-label="Accept Candidate"
            >
              <span className="btn-icon">+</span>
            </button>
        </div> 
        </div>
    )}
    </div>
);

};
export default CandidateSearch;

