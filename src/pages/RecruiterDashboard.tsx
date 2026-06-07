import React, { useState } from 'react';
import { ApplicantPipeline } from '../components/dashboard/ApplicantPipeline';
import { CandidateDetailDrawer } from '../components/dashboard/CandidateDetailDrawer';
import { useParams, useNavigate } from 'react-router-dom';

export default function RecruiterDashboard() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(id || null);

  const handleInspect = (candidateId: string) => {
    setSelectedCandidate(candidateId);
    navigate(`/dashboard/${candidateId}`, { replace: true });
  };

  const handleClose = () => {
    setSelectedCandidate(null);
    navigate('/dashboard', { replace: true });
  };

  return (
    <div className="p-4 md:p-8 flex justify-center">
      <div className="w-full max-w-7xl">
        <ApplicantPipeline onInspect={handleInspect} />
      </div>

      {selectedCandidate && (
        <CandidateDetailDrawer 
          candidateId={selectedCandidate} 
          onClose={handleClose} 
        />
      )}
    </div>
  );
}
