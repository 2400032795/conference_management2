
import React, { useState } from 'react';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('portal-select');
  const [currentUserType, setCurrentUserType] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [papers, setPapers] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [registrations, setRegistrations] = useState([]);

  // Pre-configured test accounts
  const testAccounts = [
    { email: 'admin@test.com', password: 'admin123', name: 'Admin User', type: 'admin' },
    { email: 'student1@test.com', password: 'pass123', name: 'Alice Johnson', type: 'student', university: 'MIT' },
    { email: 'student2@test.com', password: 'pass123', name: 'Bob Smith', type: 'student', university: 'Stanford' },
    { email: 'student3@test.com', password: 'pass123', name: 'Carol Davis', type: 'student', university: 'Harvard' },
    { email: 'employee1@test.com', password: 'pass123', name: 'Dr. David Wilson', type: 'employee', department: 'Computer Science' },
    { email: 'employee2@test.com', password: 'pass123', name: 'Dr. Emma Brown', type: 'employee', department: 'AI Research' },
    { email: 'employee3@test.com', password: 'pass123', name: 'Dr. Frank Miller', type: 'employee', department: 'Data Science' }
  ];

  const showToast = (message, type) => {
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      top: 2rem;
      right: 2rem;
      background: #1a1a2e;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-left: 4px solid ${type === 'success' ? '#4ade80' : '#ef4444'};
      border-radius: 12px;
      padding: 1rem 1.5rem;
      min-width: 300px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      z-index: 2000;
      color: white;
    `;
    toast.innerHTML = `
      <div style="font-weight: 600; margin-bottom: 0.25rem;">${type === 'success' ? 'Success' : 'Error'}</div>
      <div style="color: #b0b0b0; font-size: 0.9rem;">${message}</div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  const handleLogin = (event, userType) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const email = formData.get('email');
    const password = formData.get('password');
    
    const account = testAccounts.find(acc => acc.email === email && acc.password === password && acc.type === userType);
    
    if (account) {
      setCurrentUser(account);
      setCurrentView('dashboard');
      setCurrentUserType(userType);
    } else {
      showToast('Invalid credentials. Try one of the test accounts.', 'error');
    }
  };

  const handleSignup = (event, userType) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const name = formData.get('name');
    const email = formData.get('email');
    
    setCurrentUser({ 
      email, 
      name, 
      type: userType,
      university: userType === 'student' ? 'New University' : undefined,
      department: userType === 'employee' ? 'New Department' : undefined
    });
    setCurrentView('dashboard');
    setCurrentUserType(userType);
  };

  const handlePaperSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const title = formData.get('title');
    const abstract = formData.get('abstract');
    const keywords = formData.get('keywords').split(',').map(k => k.trim());
    
    const newPaper = {
      id: Date.now().toString(),
      title,
      abstract,
      keywords,
      authorName: currentUser.name,
      authorEmail: currentUser.email,
      status: 'Under Review',
      submittedAt: Date.now(),
      reviewCount: 0
    };
    
    setPapers([...papers, newPaper]);
    showToast('Paper submitted successfully!', 'success');
    setCurrentView('dashboard');
  };

  const handleScheduleMeeting = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const professorEmail = formData.get('professor');
    const date = formData.get('date');
    const time = formData.get('time');
    const topic = formData.get('topic');
    
    const professor = testAccounts.find(acc => acc.email === professorEmail);
    
    const newMeeting = {
      id: Date.now().toString(),
      studentName: currentUser.name,
      studentEmail: currentUser.email,
      professorName: professor.name,
      professorEmail: professor.email,
      department: professor.department,
      date: date,
      time: time,
      topic: topic,
      status: 'Pending',
      scheduledAt: Date.now()
    };
    
    setMeetings([...meetings, newMeeting]);
    showToast('Meeting request sent successfully!', 'success');
  };

  const handleReviewSubmit = (event, paperId) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const rating = parseInt(formData.get('rating'));
    const comments = formData.get('comments');
    const recommendation = formData.get('recommendation');
    
    const newReview = {
      id: Date.now().toString(),
      paperId,
      reviewerName: currentUser.name,
      reviewerEmail: currentUser.email,
      rating,
      comments,
      recommendation,
      submittedAt: Date.now()
    };
    
    setReviews([...reviews, newReview]);
    
    // Update paper review count
    setPapers(papers.map(p => 
      p.id === paperId ? { ...p, reviewCount: (p.reviewCount || 0) + 1 } : p
    ));
    
    showToast('Review submitted successfully!', 'success');
    setCurrentView('dashboard');
  };

  const handleSessionCreate = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    const newSession = {
      id: Date.now().toString(),
      title: formData.get('title'),
      date: formData.get('date'),
      startTime: formData.get('startTime'),
      endTime: formData.get('endTime'),
      room: formData.get('room'),
      track: formData.get('track'),
      description: formData.get('description'),
      createdAt: Date.now()
    };
    
    setSessions([...sessions, newSession]);
    showToast('Session created successfully!', 'success');
    setCurrentView('dashboard');
  };

  const handleRegistration = (sessionId) => {
    const session = sessions.find(s => s.id === sessionId);
    const existingReg = registrations.find(r => r.sessionId === sessionId && r.userEmail === currentUser.email);
    
    if (existingReg) {
      showToast('You are already registered for this session!', 'error');
      return;
    }
    
    const newRegistration = {
      id: Date.now().toString(),
      sessionId,
      sessionTitle: session.title,
      userName: currentUser.name,
      userEmail: currentUser.email,
      registeredAt: Date.now()
    };
    
    setRegistrations([...registrations, newRegistration]);
    showToast('Successfully registered for session!', 'success');
  };

  const updatePaperStatus = (paperId, newStatus) => {
    setPapers(papers.map(p => p.id === paperId ? { ...p, status: newStatus } : p));
    showToast(`Paper ${newStatus.toLowerCase()} successfully!`, 'success');
  };

  const updateMeetingStatus = (meetingId, newStatus) => {
    setMeetings(meetings.map(m => m.id === meetingId ? { ...m, status: newStatus } : m));
    showToast(`Meeting ${newStatus.toLowerCase()} successfully!`, 'success');
  };

  const assignReviewer = (paperId, reviewerEmail) => {
    const paper = papers.find(p => p.id === paperId);
    const reviewer = testAccounts.find(acc => acc.email === reviewerEmail);
    
    if (!paper.assignedReviewers) {
      paper.assignedReviewers = [];
    }
    
    if (paper.assignedReviewers.includes(reviewerEmail)) {
      showToast('Reviewer already assigned to this paper!', 'error');
      return;
    }
    
    setPapers(papers.map(p => 
      p.id === paperId 
        ? { ...p, assignedReviewers: [...(p.assignedReviewers || []), reviewerEmail] }
        : p
    ));
    
    showToast(`${reviewer.name} assigned as reviewer!`, 'success');
  };

  const deleteSession = (sessionId) => {
    setSessions(sessions.filter(s => s.id !== sessionId));
    setRegistrations(registrations.filter(r => r.sessionId !== sessionId));
    showToast('Session deleted successfully!', 'success');
  };

  // Portal Selection View
  const PortalSelect = () => (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Conference Management System</h1>
          <p className="auth-subtitle">Select Your Portal</p>
        </div>
        
        <div className="portal-selection">
          <div className="portal-card admin-portal" onClick={() => { setCurrentView('login'); setCurrentUserType('admin'); }}>
            <div className="portal-icon">⚙️</div>
            <h3>Admin Portal</h3>
            <p>Manage conferences, schedules, reviews, and registrations</p>
            <button className="btn btn-admin">Enter as Admin</button>
          </div>

          <div className="portal-card student-portal" onClick={() => { setCurrentView('login'); setCurrentUserType('student'); }}>
            <div className="portal-icon">🎓</div>
            <h3>Participant Portal</h3>
            <p>Submit papers, register for sessions, and view schedules</p>
            <button className="btn btn-student">Enter as Participant</button>
          </div>

          <div className="portal-card employee-portal" onClick={() => { setCurrentView('login'); setCurrentUserType('employee'); }}>
            <div className="portal-icon">👨‍🏫</div>
            <h3>Reviewer Portal</h3>
            <p>Review papers, provide feedback, and manage sessions</p>
            <button className="btn btn-employee">Enter as Reviewer</button>
          </div>
        </div>
      </div>
    </div>
  );

  // Login View
  const Login = ({ userType }) => {
    const isStudent = userType === 'student';
    const isAdmin = userType === 'admin';
    const badgeClass = isAdmin ? 'admin-badge' : isStudent ? 'student-badge' : 'employee-badge';
    const btnClass = isAdmin ? 'btn-admin' : isStudent ? 'btn-student' : 'btn-employee';
    const icon = isAdmin ? '⚙️' : isStudent ? '🎓' : '👨‍🏫';
    const label = isAdmin ? 'Admin' : isStudent ? 'Participant' : 'Reviewer';
    
    return (
      <div className="auth-container">
        <div className="auth-card auth-form-card">
          <button className="back-btn" onClick={() => setCurrentView('portal-select')}>
            ← Back to Portal Selection
          </button>
          
          <div className="auth-header">
            <div className={`portal-badge ${badgeClass}`}>
              {icon} {label}
            </div>
            <h2 className="auth-title">Welcome Back</h2>
            <p className="auth-subtitle">Sign in to continue</p>
          </div>

          <form className="auth-form" onSubmit={(e) => handleLogin(e, userType)}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address</label>
              <input 
                type="email" 
                id="email" 
                name="email"
                className="form-input" 
                placeholder="Enter your email"
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <input 
                type="password" 
                id="password" 
                name="password"
                className="form-input" 
                placeholder="Enter your password"
                required 
              />
            </div>

            <button type="submit" className={`btn ${btnClass}`}>
              Sign In
            </button>
          </form>

          <div className="auth-switch">
            <p>
              Don't have an account?
              <button className="link-btn" onClick={() => setCurrentView('signup')}>
                Sign Up
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Signup View
  const Signup = ({ userType }) => {
    const isStudent = userType === 'student';
    const isAdmin = userType === 'admin';
    const badgeClass = isAdmin ? 'admin-badge' : isStudent ? 'student-badge' : 'employee-badge';
    const btnClass = isAdmin ? 'btn-admin' : isStudent ? 'btn-student' : 'btn-employee';
    const icon = isAdmin ? '⚙️' : isStudent ? '🎓' : '👨‍🏫';
    const label = isAdmin ? 'Admin' : isStudent ? 'Participant' : 'Reviewer';
    
    return (
      <div className="auth-container">
        <div className="auth-card auth-form-card">
          <button className="back-btn" onClick={() => setCurrentView('portal-select')}>
            ← Back to Portal Selection
          </button>
          
          <div className="auth-header">
            <div className={`portal-badge ${badgeClass}`}>
              {icon} {label}
            </div>
            <h2 className="auth-title">Create Account</h2>
            <p className="auth-subtitle">Sign up to get started</p>
          </div>

          <form className="auth-form" onSubmit={(e) => handleSignup(e, userType)}>
            <div className="form-group">
              <label className="form-label" htmlFor="name">Full Name</label>
              <input 
                type="text" 
                id="name" 
                name="name"
                className="form-input" 
                placeholder="Enter your full name"
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address</label>
              <input 
                type="email" 
                id="email" 
                name="email"
                className="form-input" 
                placeholder="Enter your email"
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <input 
                type="password" 
                id="password" 
                name="password"
                className="form-input" 
                placeholder="Enter your password"
                minLength="6"
                required 
              />
            </div>

            <button type="submit" className={`btn ${btnClass}`}>
              Create Account
            </button>
          </form>

          <div className="auth-switch">
            <p>
              Already have an account?
              <button className="link-btn" onClick={() => setCurrentView('login')}>
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Admin Dashboard
  const AdminDashboard = () => {
    const employees = testAccounts.filter(acc => acc.type === 'employee');
    
    return (
      <div className="theme-admin">
        <nav className="nav">
          <div className="nav-content">
            <div className="nav-logo">
              <span>⚙️</span>
              Conference Management System
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <span style={{ color: '#b0b0b0' }}>{currentUser.name}</span>
              <button className="btn" style={{ padding: '0.5rem 1rem', width: 'auto' }} onClick={() => { setCurrentUser(null); setCurrentView('portal-select'); }}>Logout</button>
            </div>
          </div>
        </nav>

        <main className="main">
          <div className="hero">
            <h1>Admin Dashboard</h1>
            <p>Manage conference schedules, paper submissions, and peer reviews</p>
          </div>

          <div style={{ marginTop: '3rem' }}>
            {/* Statistics Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
              <div style={{ background: '#1a1a2e', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '16px', padding: '1.5rem' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📄</div>
                <div style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.25rem' }}>{papers.length}</div>
                <div style={{ color: '#b0b0b0' }}>Total Submissions</div>
              </div>
              <div style={{ background: '#1a1a2e', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '16px', padding: '1.5rem' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📅</div>
                <div style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.25rem' }}>{sessions.length}</div>
                <div style={{ color: '#b0b0b0' }}>Conference Sessions</div>
              </div>
              <div style={{ background: '#1a1a2e', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '16px', padding: '1.5rem' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>✍️</div>
                <div style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.25rem' }}>{reviews.length}</div>
                <div style={{ color: '#b0b0b0' }}>Peer Reviews</div>
              </div>
              <div style={{ background: '#1a1a2e', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '16px', padding: '1.5rem' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>👥</div>
                <div style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.25rem' }}>{registrations.length}</div>
                <div style={{ color: '#b0b0b0' }}>Registrations</div>
              </div>
            </div>

            {/* Paper Management */}
            <div style={{ marginBottom: '4rem' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '2rem' }}>📋 Paper Submissions Management</h2>

              {papers.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#b0b0b0', background: '#1a1a2e', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <div style={{ fontSize: '4rem', marginBottom: '1rem', opacity: '0.5' }}>📋</div>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>No submissions yet</h3>
                  <p>Papers submitted by participants will appear here</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {papers.map(paper => {
                    const paperReviews = reviews.filter(r => r.paperId === paper.id);
                    const avgRating = paperReviews.length > 0 
                      ? (paperReviews.reduce((sum, r) => sum + r.rating, 0) / paperReviews.length).toFixed(1)
                      : 'N/A';
                    
                    return (
                      <div key={paper.id} style={{ background: '#1a1a2e', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '16px', padding: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', gap: '1rem' }}>
                          <div>
                            <h3 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '0.5rem' }}>{paper.title}</h3>
                            <p style={{ color: '#10b981', fontSize: '0.95rem', marginBottom: '0.25rem' }}>By {paper.authorName}</p>
                            <p style={{ color: '#b0b0b0', fontSize: '0.9rem' }}>Submitted on {new Date(paper.submittedAt).toLocaleDateString()}</p>
                          </div>
                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <span style={{ 
                              padding: '0.5rem 1rem', 
                              borderRadius: '8px', 
                              fontSize: '0.85rem', 
                              fontWeight: '600', 
                              whiteSpace: 'nowrap',
                              background: paper.status === 'Accepted' ? 'rgba(34, 197, 94, 0.1)' : paper.status === 'Rejected' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(234, 179, 8, 0.1)',
                              color: paper.status === 'Accepted' ? '#4ade80' : paper.status === 'Rejected' ? '#ef4444' : '#facc15',
                              border: paper.status === 'Accepted' ? '1px solid rgba(34, 197, 94, 0.3)' : paper.status === 'Rejected' ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(234, 179, 8, 0.3)'
                            }}>
                              {paper.status}
                            </span>
                          </div>
                        </div>
                        
                        <p style={{ color: '#b0b0b0', lineHeight: '1.6', marginBottom: '1rem' }}>{paper.abstract}</p>
                        
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                          {paper.keywords.map((kw, idx) => (
                            <span key={idx} style={{ padding: '0.25rem 0.75rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '6px', fontSize: '0.85rem' }}>{kw}</span>
                          ))}
                        </div>

                        <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1rem', borderRadius: '12px', marginBottom: '1rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                            <span style={{ color: '#b0b0b0' }}>Reviews: {paperReviews.length}</span>
                            <span style={{ color: '#b0b0b0' }}>Avg Rating: ⭐ {avgRating}</span>
                          </div>
                          
                          <div style={{ marginBottom: '1rem' }}>
                            <label style={{ color: '#b0b0b0', fontSize: '0.9rem', marginBottom: '0.5rem', display: 'block' }}>Assign Reviewer:</label>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <select 
                                id={`reviewer-${paper.id}`}
                                style={{ 
                                  flex: 1,
                                  padding: '0.5rem',
                                  background: 'rgba(255, 255, 255, 0.05)',
                                  border: '1px solid rgba(255, 255, 255, 0.1)',
                                  borderRadius: '8px',
                                  color: 'white',
                                  cursor: 'pointer'
                                }}
                              >
                                <option value="">Select reviewer...</option>
                                {employees.map(emp => (
                                  <option key={emp.email} value={emp.email}>{emp.name} - {emp.department}</option>
                                ))}
                              </select>
                              <button 
                                className="btn"
                                style={{ padding: '0.5rem 1rem', width: 'auto', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)' }}
                                onClick={() => {
                                  const select = document.getElementById(`reviewer-${paper.id}`);
                                  if (select.value) assignReviewer(paper.id, select.value);
                                }}
                              >
                                Assign
                              </button>
                            </div>
                          </div>

                          {paper.assignedReviewers && paper.assignedReviewers.length > 0 && (
                            <div>
                              <span style={{ color: '#b0b0b0', fontSize: '0.9rem' }}>Assigned Reviewers:</span>
                              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                                {paper.assignedReviewers.map((email, idx) => {
                                  const reviewer = testAccounts.find(acc => acc.email === email);
                                  return (
                                    <span key={idx} style={{ padding: '0.25rem 0.75rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '6px', fontSize: '0.85rem' }}>
                                      {reviewer?.name}
                                    </span>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>

                        {paper.status === 'Under Review' && (
                          <div style={{ display: 'flex', gap: '1rem' }}>
                            <button className="btn" style={{ padding: '0.5rem 1rem', width: 'auto', background: 'rgba(34, 197, 94, 0.1)', color: '#4ade80', border: '1px solid rgba(34, 197, 94, 0.3)' }} onClick={() => updatePaperStatus(paper.id, 'Accepted')}>
                              Accept Paper
                            </button>
                            <button className="btn" style={{ padding: '0.5rem 1rem', width: 'auto', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)' }} onClick={() => updatePaperStatus(paper.id, 'Rejected')}>
                              Reject Paper
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Session Management */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: '700' }}>📅 Conference Schedule Management</h2>
                <button className="btn btn-admin" style={{ width: 'auto' }} onClick={() => setCurrentView('create-session')}>
                  + Create Session
                </button>
              </div>

              {sessions.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#b0b0b0', background: '#1a1a2e', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <div style={{ fontSize: '4rem', marginBottom: '1rem', opacity: '0.5' }}>📅</div>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>No sessions scheduled</h3>
                  <p>Click "Create Session" to add conference sessions</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                  {sessions.map(session => {
                    const sessionRegs = registrations.filter(r => r.sessionId === session.id);
                    
                    return (
                      <div key={session.id} style={{ background: '#1a1a2e', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '16px', padding: '1.5rem' }}>
                        <div style={{ marginBottom: '1rem' }}>
                          <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '0.5rem' }}>{session.title}</h3>
                          <span style={{ padding: '0.25rem 0.75rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '6px', fontSize: '0.85rem' }}>
                            {session.track}
                          </span>
                        </div>
                        
                        <div style={{ marginBottom: '1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <span>📅</span>
                            <span style={{ color: '#b0b0b0' }}>{new Date(session.date).toLocaleDateString()}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <span>🕐</span>
                            <span style={{ color: '#b0b0b0' }}>{session.startTime} - {session.endTime}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span>📍</span>
                            <span style={{ color: '#b0b0b0' }}>{session.room}</span>
                          </div>
                        </div>
                        
                        <p style={{ color: '#b0b0b0', lineHeight: '1.6', fontSize: '0.95rem', marginBottom: '1rem' }}>{session.description}</p>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', marginBottom: '1rem' }}>
                          <span style={{ color: '#b0b0b0', fontSize: '0.9rem' }}>Registrations:</span>
                          <span style={{ color: '#10b981', fontWeight: '600' }}>{sessionRegs.length}</span>
                        </div>

                        <button 
                          className="btn" 
                          style={{ padding: '0.5rem 1rem', width: '100%', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)' }}
                          onClick={() => deleteSession(session.id)}
                        >
                          Delete Session
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    );
  };

  // Student Dashboard
  const StudentDashboard = () => {
    const userPapers = papers.filter(p => p.authorEmail === currentUser.email);
    const userRegistrations = registrations.filter(r => r.userEmail === currentUser.email);
    const registeredSessionIds = userRegistrations.map(r => r.sessionId);
    
    return (
      <div className="theme-student">
        <nav className="nav">
          <div className="nav-content">
            <div className="nav-logo">
              <span>🎓</span>
              Conference Management System
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <span style={{ color: '#b0b0b0' }}>{currentUser.name}</span>
              <button className="btn" style={{ padding: '0.5rem 1rem', width: 'auto' }} onClick={() => { setCurrentUser(null); setCurrentView('portal-select'); }}>Logout</button>
            </div>
          </div>
        </nav>

        <main className="main">
          <div className="hero">
            <h1>Welcome, {currentUser.name}!</h1>
            <p>Submit papers, register for sessions, and view conference schedules</p>
          </div>

          <div style={{ marginTop: '3rem' }}>
            {/* Paper Submissions Section */}
            <div style={{ marginBottom: '4rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: '700' }}>📄 My Paper Submissions</h2>
                <button className="btn btn-student" style={{ width: 'auto' }} onClick={() => setCurrentView('submit-paper')}>
                  + Submit New Paper
                </button>
              </div>

              {userPapers.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#b0b0b0', background: '#1a1a2e', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <div style={{ fontSize: '4rem', marginBottom: '1rem', opacity: '0.5' }}>📄</div>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>No papers submitted yet</h3>
                  <p>Click "Submit New Paper" to get started</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {userPapers.map(paper => {
                    const paperReviews = reviews.filter(r => r.paperId === paper.id);
                    
                    return (
                      <div key={paper.id} style={{ background: '#1a1a2e', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '16px', padding: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', gap: '1rem' }}>
                          <div>
                            <h3 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '0.5rem' }}>{paper.title}</h3>
                            <p style={{ color: '#b0b0b0', fontSize: '0.9rem' }}>Submitted on {new Date(paper.submittedAt).toLocaleDateString()}</p>
                          </div>
                          <span style={{ 
                            padding: '0.5rem 1rem', 
                            borderRadius: '8px', 
                            fontSize: '0.85rem', 
                            fontWeight: '600', 
                            whiteSpace: 'nowrap',
                            background: paper.status === 'Accepted' ? 'rgba(34, 197, 94, 0.1)' : paper.status === 'Rejected' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(234, 179, 8, 0.1)',
                            color: paper.status === 'Accepted' ? '#4ade80' : paper.status === 'Rejected' ? '#ef4444' : '#facc15',
                            border: paper.status === 'Accepted' ? '1px solid rgba(34, 197, 94, 0.3)' : paper.status === 'Rejected' ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(234, 179, 8, 0.3)'
                          }}>
                            {paper.status}
                          </span>
                        </div>
                        <p style={{ color: '#b0b0b0', lineHeight: '1.6', marginBottom: '1rem' }}>{paper.abstract}</p>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                          {paper.keywords.map((kw, idx) => (
                            <span key={idx} style={{ padding: '0.25rem 0.75rem', background: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa', borderRadius: '6px', fontSize: '0.85rem' }}>{kw}</span>
                          ))}
                        </div>
                        
                        {paperReviews.length > 0 && (
                          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1rem', borderRadius: '12px' }}>
                            <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.75rem' }}>Reviews ({paperReviews.length})</h4>
                            {paperReviews.map(review => (
                              <div key={review.id} style={{ marginBottom: '0.75rem', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                  <span style={{ color: '#60a5fa', fontSize: '0.9rem' }}>{review.reviewerName}</span>
                                  <span style={{ color: '#facc15' }}>⭐ {review.rating}/5</span>
                                </div>
                                <p style={{ color: '#b0b0b0', fontSize: '0.9rem', marginBottom: '0.25rem' }}>{review.comments}</p>
                                <span style={{ 
                                  padding: '0.25rem 0.5rem', 
                                  borderRadius: '6px', 
                                  fontSize: '0.8rem',
                                  background: review.recommendation === 'Accept' ? 'rgba(34, 197, 94, 0.1)' : review.recommendation === 'Reject' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(234, 179, 8, 0.1)',
                                  color: review.recommendation === 'Accept' ? '#4ade80' : review.recommendation === 'Reject' ? '#ef4444' : '#facc15'
                                }}>
                                  {review.recommendation}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Conference Schedule */}
            <div style={{ marginBottom: '4rem' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '2rem' }}>📅 Conference Schedule</h2>
              
              {sessions.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#b0b0b0', background: '#1a1a2e', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <div style={{ fontSize: '4rem', marginBottom: '1rem', opacity: '0.5' }}>📅</div>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>No sessions scheduled</h3>
                  <p>Conference sessions will appear here once scheduled</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                  {sessions.map(session => {
                    const isRegistered = registeredSessionIds.includes(session.id);
                    
                    return (
                      <div key={session.id} style={{ background: '#1a1a2e', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '16px', padding: '1.5rem' }}>
                        <div style={{ marginBottom: '1rem' }}>
                          <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '0.5rem' }}>{session.title}</h3>
                          <span style={{ padding: '0.25rem 0.75rem', background: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa', borderRadius: '6px', fontSize: '0.85rem' }}>
                            {session.track}
                          </span>
                        </div>
                        
                        <div style={{ marginBottom: '1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <span>📅</span>
                            <span style={{ color: '#b0b0b0' }}>{new Date(session.date).toLocaleDateString()}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <span>🕐</span>
                            <span style={{ color: '#b0b0b0' }}>{session.startTime} - {session.endTime}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span>📍</span>
                            <span style={{ color: '#b0b0b0' }}>{session.room}</span>
                          </div>
                        </div>
                        
                        <p style={{ color: '#b0b0b0', lineHeight: '1.6', fontSize: '0.95rem', marginBottom: '1rem' }}>{session.description}</p>
                        
                        {isRegistered ? (
                          <div style={{ padding: '0.75rem', background: 'rgba(34, 197, 94, 0.1)', color: '#4ade80', borderRadius: '8px', textAlign: 'center', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
                            ✓ Registered
                          </div>
                        ) : (
                          <button 
                            className="btn btn-student" 
                            style={{ width: '100%', padding: '0.75rem' }}
                            onClick={() => handleRegistration(session.id)}
                          >
                            Register for Session
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* My Registrations */}
            <div>
              <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '2rem' }}>🎫 My Registrations</h2>
              
              {userRegistrations.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#b0b0b0', background: '#1a1a2e', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <div style={{ fontSize: '4rem', marginBottom: '1rem', opacity: '0.5' }}>🎫</div>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>No registrations yet</h3>
                  <p>Register for conference sessions to see them here</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {userRegistrations.map(reg => {
                    const session = sessions.find(s => s.id === reg.sessionId);
                    if (!session) return null;
                    
                    return (
                      <div key={reg.id} style={{ background: '#1a1a2e', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '12px', padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <h4 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.25rem' }}>{session.title}</h4>
                          <p style={{ color: '#b0b0b0', fontSize: '0.9rem' }}>
                            {new Date(session.date).toLocaleDateString()} • {session.startTime} - {session.endTime} • {session.room}
                          </p>
                        </div>
                        <span style={{ padding: '0.5rem 1rem', background: 'rgba(34, 197, 94, 0.1)', color: '#4ade80', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '600', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
                          Confirmed
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    );
  };

  // Employee Dashboard (Reviewer)
  const EmployeeDashboard = () => {
    const assignedPapers = papers.filter(p => p.assignedReviewers?.includes(currentUser.email));
    const myReviews = reviews.filter(r => r.reviewerEmail === currentUser.email);
    const reviewedPaperIds = myReviews.map(r => r.paperId);
    
    return (
      <div className="theme-employee">
        <nav className="nav">
          <div className="nav-content">
            <div className="nav-logo">
              <span>👨‍🏫</span>
              Conference Management System
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <span style={{ color: '#b0b0b0' }}>{currentUser.name}</span>
              <button className="btn" style={{ padding: '0.5rem 1rem', width: 'auto' }} onClick={() => { setCurrentUser(null); setCurrentView('portal-select'); }}>Logout</button>
            </div>
          </div>
        </nav>

        <main className="main">
          <div className="hero">
            <h1>Welcome, {currentUser.name}!</h1>
            <p>Review papers and provide valuable feedback to authors</p>
          </div>

          <div style={{ marginTop: '3rem' }}>
            {/* Statistics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
              <div style={{ background: '#1a1a2e', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '16px', padding: '1.5rem' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📋</div>
                <div style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.25rem' }}>{assignedPapers.length}</div>
                <div style={{ color: '#b0b0b0', fontSize: '0.9rem' }}>Assigned Papers</div>
              </div>
              <div style={{ background: '#1a1a2e', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '16px', padding: '1.5rem' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✍️</div>
                <div style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.25rem' }}>{myReviews.length}</div>
                <div style={{ color: '#b0b0b0', fontSize: '0.9rem' }}>Reviews Completed</div>
              </div>
              <div style={{ background: '#1a1a2e', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '16px', padding: '1.5rem' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏳</div>
                <div style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.25rem' }}>{assignedPapers.length - myReviews.length}</div>
                <div style={{ color: '#b0b0b0', fontSize: '0.9rem' }}>Pending Reviews</div>
              </div>
            </div>

            {/* Assigned Papers for Review */}
            <div style={{ marginBottom: '4rem' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '2rem' }}>📋 Papers Assigned for Review</h2>

              {assignedPapers.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#b0b0b0', background: '#1a1a2e', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <div style={{ fontSize: '4rem', marginBottom: '1rem', opacity: '0.5' }}>📋</div>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>No papers assigned</h3>
                  <p>Papers assigned to you by admin will appear here</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {assignedPapers.map(paper => {
                    const alreadyReviewed = reviewedPaperIds.includes(paper.id);
                    
                    return (
                      <div key={paper.id} style={{ background: '#1a1a2e', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '16px', padding: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', gap: '1rem' }}>
                          <div>
                            <h3 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '0.5rem' }}>{paper.title}</h3>
                            <p style={{ color: '#a78bfa', fontSize: '0.95rem', marginBottom: '0.25rem' }}>By {paper.authorName}</p>
                            <p style={{ color: '#b0b0b0', fontSize: '0.9rem' }}>Submitted on {new Date(paper.submittedAt).toLocaleDateString()}</p>
                          </div>
                          {alreadyReviewed && (
                            <span style={{ padding: '0.5rem 1rem', background: 'rgba(34, 197, 94, 0.1)', color: '#4ade80', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '600', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
                              ✓ Reviewed
                            </span>
                          )}
                        </div>
                        <p style={{ color: '#b0b0b0', lineHeight: '1.6', marginBottom: '1rem' }}>{paper.abstract}</p>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                          {paper.keywords.map((kw, idx) => (
                            <span key={idx} style={{ padding: '0.25rem 0.75rem', background: 'rgba(139, 92, 246, 0.1)', color: '#a78bfa', borderRadius: '6px', fontSize: '0.85rem' }}>{kw}</span>
                          ))}
                        </div>
                        
                        {!alreadyReviewed && (
                          <button 
                            className="btn btn-employee" 
                            style={{ width: 'auto', padding: '0.75rem 1.5rem' }}
                            onClick={() => {
                              setCurrentView('review-paper');
                              window.currentPaperId = paper.id;
                            }}
                          >
                            Write Review
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* My Reviews */}
            <div>
              <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '2rem' }}>✍️ My Reviews</h2>
              
              {myReviews.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#b0b0b0', background: '#1a1a2e', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <div style={{ fontSize: '4rem', marginBottom: '1rem', opacity: '0.5' }}>✍️</div>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>No reviews submitted</h3>
                  <p>Your completed reviews will appear here</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {myReviews.map(review => {
                    const paper = papers.find(p => p.id === review.paperId);
                    if (!paper) return null;
                    
                    return (
                      <div key={review.id} style={{ background: '#1a1a2e', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '16px', padding: '1.5rem' }}>
                        <div style={{ marginBottom: '1rem' }}>
                          <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '0.5rem' }}>{paper.title}</h3>
                          <p style={{ color: '#b0b0b0', fontSize: '0.9rem' }}>Reviewed on {new Date(review.submittedAt).toLocaleDateString()}</p>
                        </div>
                        
                        <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1rem', borderRadius: '12px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                            <span style={{ color: '#b0b0b0' }}>Rating:</span>
                            <span style={{ color: '#facc15', fontWeight: '600' }}>⭐ {review.rating}/5</span>
                          </div>
                          <div style={{ marginBottom: '0.75rem' }}>
                            <span style={{ color: '#b0b0b0', display: 'block', marginBottom: '0.5rem' }}>Comments:</span>
                            <p style={{ color: 'white', lineHeight: '1.6' }}>{review.comments}</p>
                          </div>
                          <div>
                            <span style={{ color: '#b0b0b0', marginRight: '0.5rem' }}>Recommendation:</span>
                            <span style={{ 
                              padding: '0.25rem 0.75rem', 
                              borderRadius: '6px', 
                              fontSize: '0.85rem', 
                              fontWeight: '600',
                              background: review.recommendation === 'Accept' ? 'rgba(34, 197, 94, 0.1)' : review.recommendation === 'Reject' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(234, 179, 8, 0.1)',
                              color: review.recommendation === 'Accept' ? '#4ade80' : review.recommendation === 'Reject' ? '#ef4444' : '#facc15'
                            }}>
                              {review.recommendation}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    );
  };

  // Submit Paper View
  const SubmitPaper = () => (
    <div className="theme-student">
      <nav className="nav">
        <div className="nav-content">
          <div className="nav-logo">
            <span>🎓</span>
            Conference Management System
          </div>
        </div>
      </nav>

      <main className="main">
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <button className="back-btn" onClick={() => setCurrentView('dashboard')}>
            ← Back to Dashboard
          </button>

          <div style={{ background: '#1a1a2e', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '20px', padding: '2rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '2rem' }}>Submit New Paper</h2>

            <form className="auth-form" onSubmit={handlePaperSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="paper-title">Paper Title</label>
                <input 
                  type="text" 
                  id="paper-title" 
                  name="title"
                  className="form-input" 
                  placeholder="Enter your paper title"
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="paper-abstract">Abstract</label>
                <textarea 
                  id="paper-abstract" 
                  name="abstract"
                  className="form-input" 
                  placeholder="Enter your paper abstract"
                  style={{ minHeight: '150px', resize: 'vertical', fontFamily: 'inherit' }}
                  required
                ></textarea>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="paper-keywords">Keywords (comma-separated)</label>
                <input 
                  type="text" 
                  id="paper-keywords" 
                  name="keywords"
                  className="form-input" 
                  placeholder="e.g., Machine Learning, AI, Neural Networks"
                  required 
                />
              </div>

              <button type="submit" className="btn btn-student">
                Submit Paper
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );

  // Review Paper View
  const ReviewPaper = () => {
    const paperId = window.currentPaperId;
    const paper = papers.find(p => p.id === paperId);
    
    if (!paper) {
      return <div>Paper not found</div>;
    }
    
    return (
      <div className="theme-employee">
        <nav className="nav">
          <div className="nav-content">
            <div className="nav-logo">
              <span>👨‍🏫</span>
              Conference Management System
            </div>
          </div>
        </nav>

        <main className="main">
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <button className="back-btn" onClick={() => setCurrentView('dashboard')}>
              ← Back to Dashboard
            </button>

            <div style={{ background: '#1a1a2e', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '20px', padding: '2rem', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.5rem' }}>{paper.title}</h2>
              <p style={{ color: '#a78bfa', marginBottom: '0.25rem' }}>By {paper.authorName}</p>
              <p style={{ color: '#b0b0b0', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Submitted on {new Date(paper.submittedAt).toLocaleDateString()}</p>
              
              <div style={{ marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem' }}>Abstract</h3>
                <p style={{ color: '#b0b0b0', lineHeight: '1.6' }}>{paper.abstract}</p>
              </div>
              
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem' }}>Keywords</h3>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {paper.keywords.map((kw, idx) => (
                    <span key={idx} style={{ padding: '0.25rem 0.75rem', background: 'rgba(139, 92, 246, 0.1)', color: '#a78bfa', borderRadius: '6px', fontSize: '0.85rem' }}>{kw}</span>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ background: '#1a1a2e', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '20px', padding: '2rem' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '2rem' }}>Submit Your Review</h2>

              <form className="auth-form" onSubmit={(e) => handleReviewSubmit(e, paperId)}>
                <div className="form-group">
                  <label className="form-label" htmlFor="rating">Rating (1-5)</label>
                  <select 
                    id="rating" 
                    name="rating"
                    className="form-input" 
                    required
                    style={{ cursor: 'pointer' }}
                  >
                    <option value="">Select rating...</option>
                    <option value="5">⭐⭐⭐⭐⭐ Excellent (5)</option>
                    <option value="4">⭐⭐⭐⭐ Good (4)</option>
                    <option value="3">⭐⭐⭐ Average (3)</option>
                    <option value="2">⭐⭐ Below Average (2)</option>
                    <option value="1">⭐ Poor (1)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="comments">Review Comments</label>
                  <textarea 
                    id="comments" 
                    name="comments"
                    className="form-input" 
                    placeholder="Provide detailed feedback on the paper..."
                    style={{ minHeight: '150px', resize: 'vertical', fontFamily: 'inherit' }}
                    required
                  ></textarea>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="recommendation">Recommendation</label>
                  <select 
                    id="recommendation" 
                    name="recommendation"
                    className="form-input" 
                    required
                    style={{ cursor: 'pointer' }}
                  >
                    <option value="">Select recommendation...</option>
                    <option value="Accept">Accept</option>
                    <option value="Minor Revisions">Minor Revisions</option>
                    <option value="Major Revisions">Major Revisions</option>
                    <option value="Reject">Reject</option>
                  </select>
                </div>

                <button type="submit" className="btn btn-employee">
                  Submit Review
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    );
  };

  // Create Session View
  const CreateSession = () => (
    <div className="theme-admin">
      <nav className="nav">
        <div className="nav-content">
          <div className="nav-logo">
            <span>⚙️</span>
            Conference Management System
          </div>
        </div>
      </nav>

      <main className="main">
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <button className="back-btn" onClick={() => setCurrentView('dashboard')}>
            ← Back to Dashboard
          </button>

          <div style={{ background: '#1a1a2e', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '20px', padding: '2rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '2rem' }}>Create Conference Session</h2>

            <form className="auth-form" onSubmit={handleSessionCreate}>
              <div className="form-group">
                <label className="form-label" htmlFor="session-title">Session Title</label>
                <input 
                  type="text" 
                  id="session-title" 
                  name="title"
                  className="form-input" 
                  placeholder="Enter session title"
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="session-track">Track</label>
                <select 
                  id="session-track" 
                  name="track"
                  className="form-input" 
                  required
                  style={{ cursor: 'pointer' }}
                >
                  <option value="">Select track...</option>
                  <option value="AI & Machine Learning">AI & Machine Learning</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Software Engineering">Software Engineering</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                  <option value="Cloud Computing">Cloud Computing</option>
                  <option value="IoT">IoT</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="session-date">Date</label>
                <input 
                  type="date" 
                  id="session-date" 
                  name="date"
                  className="form-input" 
                  min={new Date().toISOString().split('T')[0]}
                  required 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="session-start">Start Time</label>
                  <input 
                    type="time" 
                    id="session-start" 
                    name="startTime"
                    className="form-input" 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="session-end">End Time</label>
                  <input 
                    type="time" 
                    id="session-end" 
                    name="endTime"
                    className="form-input" 
                    required 
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="session-room">Room/Location</label>
                <input 
                  type="text" 
                  id="session-room" 
                  name="room"
                  className="form-input" 
                  placeholder="e.g., Hall A, Room 101"
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="session-description">Description</label>
                <textarea 
                  id="session-description" 
                  name="description"
                  className="form-input" 
                  placeholder="Enter session description"
                  style={{ minHeight: '100px', resize: 'vertical', fontFamily: 'inherit' }}
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn btn-admin">
                Create Session
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );

  // Main render
  return (
    <div className="app">
      {currentView === 'portal-select' && <PortalSelect />}
      {currentView === 'login' && <Login userType={currentUserType} />}
      {currentView === 'signup' && <Signup userType={currentUserType} />}
      {currentView === 'dashboard' && currentUserType === 'admin' && <AdminDashboard />}
      {currentView === 'dashboard' && currentUserType === 'student' && <StudentDashboard />}
      {currentView === 'dashboard' && currentUserType === 'employee' && <EmployeeDashboard />}
      {currentView === 'submit-paper' && <SubmitPaper />}
      {currentView === 'review-paper' && <ReviewPaper />}
      {currentView === 'create-session' && <CreateSession />}
    </div>
  );
}

export default App;