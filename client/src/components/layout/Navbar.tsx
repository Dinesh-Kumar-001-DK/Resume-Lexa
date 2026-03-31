import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Home, LogOut, User } from 'lucide-react';
import { supabase } from '../../utils/supabase';
import { toast } from 'react-toastify';

interface NavbarProps {
  score?: number | null;
  onAnalyze?: () => void;
  isAnalyzing?: boolean;
  showActions?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ score, onAnalyze, isAnalyzing, showActions = false }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <header style={{
      height: 56,
      background: 'var(--white)',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 1.5rem',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: 'var(--shadow-sm)',
    }}>
      <Link to="/dashboard" style={{
        fontFamily: 'var(--font-sans)',
        fontSize: '0.8rem',
        fontWeight: 700,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: 'var(--navy)',
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
      }}>
        <Home size={14} />
        The Editorial Intelligence
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {showActions && score !== null && score !== undefined && (
          <div style={{
            background: 'var(--navy)',
            color: 'var(--white)',
            borderRadius: 999,
            padding: '0.25rem 0.875rem',
            fontSize: '0.8125rem',
            fontWeight: 700,
          }}>
            {score}
          </div>
        )}

        {showActions && onAnalyze && (
          <button
            onClick={onAnalyze}
            disabled={isAnalyzing}
            className="btn btn-indigo btn-sm"
          >
            {isAnalyzing ? (
              <><div className="spinner" style={{ width: 14, height: 14 }} /> Analyzing...</>
            ) : 'Analyze Resume'}
          </button>
        )}

        <button
          onClick={() => navigate('/resume/new')}
          className="btn btn-outline btn-sm"
          style={{ gap: '0.3rem' }}
        >
          <Plus size={14} />
          New
        </button>

        <button
          onClick={handleLogout}
          className="btn btn-ghost btn-sm"
          title="Logout"
        >
          <LogOut size={14} />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
