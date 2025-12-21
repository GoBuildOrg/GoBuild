import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import ReviewForm from '@/components/ReviewForm';
import { supabase } from '@/integrations/supabase/client';

const accentColor = 'text-blue-600';

const Profile: React.FC = () => {
    
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'active' | 'history'>('active');
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [popupAnimatingOut, setPopupAnimatingOut] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [showReviewPopup, setShowReviewPopup] = useState(false);

  // ✅ REAL DATA STATES
  const [activeRequests, setActiveRequests] = useState<any[]>([]);
  const [serviceHistory, setServiceHistory] = useState<any[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(true);

  const displayName =
    user?.user_metadata?.full_name || user?.email || 'User';

  // 🔒 Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/auth/login');
    }
  }, [user, navigate]);

  // 📥 FETCH USER REQUESTS
  useEffect(() => {
    if (!user) return;

    const fetchRequests = async () => {
      setLoadingRequests(true);

      const { data, error } = await supabase
        .from('User Request')
        .select('id, ServiceType, Results')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching requests:', error);
        setLoadingRequests(false);
        return;
      }

      setActiveRequests(
        data.filter(
          (req) => req.Results === false || req.Results === null
        )
      );

      setServiceHistory(
        data.filter((req) => req.Results === true)
      );

      setLoadingRequests(false);
    };

    fetchRequests();
  }, [user]);

  const openDeletePopup = () => {
    setDeleteReason('');
    setEmail('');
    setPassword('');
    setShowDeletePopup(true);
  };
  useEffect(()=>{
    if(!user){
        navigate("/auth/login")
    }
  })
  const closeDeletePopup = () => {
    setPopupAnimatingOut(true);
    setTimeout(() => {
      setPopupAnimatingOut(false);
      setShowDeletePopup(false);
    }, 300); // duration matches CSS animation of 0.3s
  };

  const canDelete = deleteReason.trim() !== '' && email.trim() !== '' && password.trim() !== '';

  const handleDeleteAccount = () => {
    if (!canDelete) return;

    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      setDeleting(true);
      // TODO: Implement backend call for actual delete with re-authentication and reason
      setTimeout(() => {
        setDeleting(false);
        setShowDeletePopup(false);
        alert('Account deleted successfully.');
      }, 2000);
    }
  };

  return (
    <div className="bg-white min-h-screen py-8 px-4 sm:px-6 md:px-16 font-sans relative">
        <Navbar />
      <div className="max-w-5xl mx-auto w-full mt-14">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12 px-4 md:px-0">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">
              <span className={accentColor}>{displayName}</span>
              <span className="text-gray-900">’s Dashboard</span>
            </h1>
            <p className="text-gray-500 text-base sm:text-lg font-medium max-w-xl">
              Manage your <span className={accentColor}>service requests</span> and track their progress.
            </p>
          </div>
          <div className="flex gap-4">
            <button
              className="bg-blue-600 text-white px-4 py-3 rounded-lg font-bold flex items-center justify-center gap-3 hover:bg-blue-700 transition text-base sm:text-lg shadow-lg min-w-[180px]"
              onClick={() => navigate('/services')}
            >
              <span className="text-3xl font-extrabold leading-none">+</span> New Service Request
            </button>
            <button
              onClick={() => setShowReviewPopup(true)}
              className="bg-green-600 text-white px-4 py-3 rounded-lg font-bold hover:bg-green-700 transition text-base sm:text-lg shadow-lg min-w-[180px]"
            >
              Leave a Review
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-lg overflow-hidden shadow mb-10 text-base md:text-lg font-semibold border border-gray-300">
          <button
            className={`flex-1 py-4 transition duration-200 ${tab === 'active' ? `bg-white ${accentColor} border-b-6 border-blue-600 shadow-inner` : 'text-gray-400 hover:text-blue-600'}`}
            onClick={() => setTab('active')}
          >
            Active Requests ({activeRequests.length})
          </button>
          <button
            className={`flex-1 py-4 ${
              tab === 'history'
                ? 'bg-white text-blue-600'
                : 'text-gray-400'
            }`}
            onClick={() => setTab('history')}
          >
            Service History ({serviceHistory.length})
          </button>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow p-6 min-h-[250px]">
          {loadingRequests ? (
            <div className="text-center text-gray-500 text-lg">
              Loading your requests...
            </div>
          ) : tab === 'active' ? (
            activeRequests.length ? (
              activeRequests.map((req) => (
                <div
                  key={req.id}
                  className="border-b py-4 flex justify-between items-center"
                >
                  <div>
                    <h3 className="text-xl font-semibold">
                      {req.ServiceType}
                    </h3>
                    <p className="text-blue-600 font-medium">
                      Status: In Progress
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500">
                No Active Requests
              </div>
            )
          ) : serviceHistory.length ? (
            serviceHistory.map((req) => (
              <div key={req.id} className="border-b last:border-none py-6">
                <div className="font-semibold text-2xl">{req.name}</div>
                <div className="text-gray-600 mt-1 text-lg">
                  Status: <span className="text-green-700 font-semibold">{req.status}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500">
              No Service History
            </div>
          )}
        </div>

        {/* Delete Account */}
        <div className="mt-14 flex justify-center px-4 md:px-0">
          <button
            onClick={openDeletePopup}
            className="bg-red-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-red-700 transition shadow-lg max-w-md w-full"
          >
            Delete My Account
          </button>
        </div>

        {/* Delete Reason Popup */}
        {showDeletePopup && (
          <div
            className={`fixed top-0 right-0 z-50 w-full sm:w-96 h-full bg-white shadow-xl p-6 flex flex-col
              ${popupAnimatingOut ? 'animate-slideOutToRight' : 'animate-slideInFromRight'}`}
            style={{ animationDuration: '0.3s', animationFillMode: 'forwards' }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Why are you deleting your account?</h2>
              <button
                onClick={closeDeletePopup}
                className="text-gray-600 hover:text-gray-900 text-2xl font-bold leading-none"
                aria-label="Close popup"
              >
                &times;
              </button>
            </div>

            <textarea
              className="border border-gray-300 rounded p-3 resize-none w-full h-24 focus:outline-blue-500 mb-4"
              placeholder="Please provide a brief reason..."
              value={deleteReason}
              onChange={(e) => setDeleteReason(e.target.value)}
            />

            <input
              type="email"
              className="border border-gray-300 rounded p-3 mb-4 w-full focus:outline-blue-500"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Email"
            />

            <div className="flex items-center mb-6">
              <input
                type="password"
                className="border border-gray-300 rounded p-3 w-full focus:outline-blue-500"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-label="Password"
              />
              <Link
                to="pages/auth/ForgotPassword.tsx"
                className="text-blue-600 ml-3 whitespace-nowrap hover:underline"
              >
                Forgot?
              </Link>
            </div>

            <button
              onClick={handleDeleteAccount}
              disabled={!(deleteReason.trim() && email.trim() && password.trim()) || deleting}
              className={`mt-auto py-3 rounded-lg font-bold text-white w-full transition ${
                !(deleteReason.trim() && email.trim() && password.trim()) || deleting
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700 cursor-pointer'
              }`}
            >
              {deleting ? 'Deleting Account...' : 'Delete Account'}
            </button>
          </div>
        )}

        {/* Review Popup (from separate component) */}
        {showReviewPopup && <ReviewForm onClose={() => setShowReviewPopup(false)} />}
      </div>
    </div>
  );
};

export default Profile;
