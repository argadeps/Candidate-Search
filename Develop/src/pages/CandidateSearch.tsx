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
const noMoreCandidates = candidates.length === 0 || currentIndex => CandidateSearch.length;

return (
  <div className='candidate-search'>
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
      
    ) : noMoreCandidates ? 
    }

  </div>
)



    

}



export default CandidateSearch;
