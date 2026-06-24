import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, GraduationCap, Award, Calendar } from 'lucide-react';
import Navbar from '../components/Navbar';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="main-content-layout">
      <Navbar title="My Profile Settings" />

      <div className="page-container">
        <div className="dashboard-title-section">
          <h1>My Profile Details</h1>
          <p>Manage your account settings and review university final project information.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', alignItems: 'start' }}>
          {/* Account Profile Card */}
          <div className="glass-card" style={{ textAlign: 'center', padding: '40px 30px' }}>
            <div 
              style={{ 
                width: '100px', 
                height: '100px', 
                borderRadius: '50%', 
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                color: 'white',
                fontSize: '2.5rem',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                boxShadow: 'var(--shadow-glow)'
              }}
            >
              {user?.name ? user.name.split(' ').map(n=>n[0]).join('').toUpperCase().substring(0,2) : 'U'}
            </div>

            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '5px' }}>{user?.name}</h2>
            <span className={`badge ${user?.role === 'admin' ? 'badge-completed' : 'badge-progress'}`} style={{ marginBottom: '30px' }}>
              {user?.role}
            </span>

            <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '15px', borderTop: '1px solid var(--glass-border)', paddingTop: '25px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <Mail size={18} color="var(--text-muted)" />
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Email Address</div>
                  <div style={{ fontWeight: '500' }}>{user?.email}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <Shield size={18} color="var(--text-muted)" />
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Account Access Level</div>
                  <div style={{ fontWeight: '500', textTransform: 'capitalize' }}>{user?.role || 'User'} Authorization</div>
                </div>
              </div>
            </div>
          </div>

          {/* Academic/University Project Metadata Card */}
          <div className="glass-card" style={{ padding: '30px' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <GraduationCap size={22} color="var(--primary)" />
              <span>University Project Context</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div 
                style={{ 
                  background: 'rgba(255, 255, 255, 0.02)', 
                  padding: '16px', 
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--glass-border)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <Award size={18} color="var(--secondary)" />
                  <h4 style={{ fontWeight: '600' }}>Final Year Capstone Project</h4>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  This application was built to demonstrate an MVC-based Node.js and Express RESTful API backend integrated with a modern React.js SPA client.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingLeft: '5px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>System Architecture</span>
                  <span style={{ fontWeight: '500' }}>MVC (Model-View-Controller)</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Database Technology</span>
                  <span style={{ fontWeight: '500' }}>MongoDB / Mongoose ODM</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Authentication Pattern</span>
                  <span style={{ fontWeight: '500' }}>JSON Web Token (JWT) Bearer</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Interface Styling</span>
                  <span style={{ fontWeight: '500' }}>Vanilla CSS Custom Glassmorphism</span>
                </div>
              </div>

              <div 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px', 
                  borderTop: '1px solid var(--glass-border)', 
                  paddingTop: '20px', 
                  fontSize: '0.8rem', 
                  color: 'var(--text-muted)' 
                }}
              >
                <Calendar size={14} />
                <span>Submitted in fulfillment of project standards.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
