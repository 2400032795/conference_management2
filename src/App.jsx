import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // Initial view is now 'landing-page'
  const [currentView, setCurrentView] = useState('landing-page'); 
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
    { email: 'employee1@test.com', password: 'pass123', name: 'Dr. David Wilson', type: 'employee', department: 'Computer Science' },
    { email: 'employee2@test.com', password: 'pass123', name: 'Dr. Emma Brown', type: 'employee', department: 'AI Research' },
  ];

  // --- Utility Functions ---

  const showToast = (message, type) => {
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      top: 2rem;
      right: 2rem;
      background: #ffffff; 
      border: 1px solid rgba(0, 0, 0, 0.1);
      border-left: 4px solid ${type === 'success' ? '#ec4899' : '#ef4444'}; 
      border-radius: 12px;
      padding: 1rem 1.5rem;
      min-width: 300px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
      z-index: 2000;
      color: #1f2937; 
      transition: opacity 0.3s ease-in-out;
    `;
    toast.innerHTML = `
      <div style="font-weight: 600; margin-bottom: 0.25rem;">${type === 'success' ? 'Success' : 'Error'}</div>
      <div style="color: #6b7280; font-size: 0.9rem;">${message}</div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getThemeColors = (userType) => {
    switch (userType) {
      case 'admin':
        return { 
          bg: '#06b6d4', // Teal (Admin)
          btnClass: 'btn-admin',
          accent: '#0e7490' // Darker Teal
        };
      case 'student':
        return { 
          bg: '#4f46e5', // Indigo (Student/Participant)
          btnClass: 'btn-student',
          accent: '#4338ca' // Darker Indigo
        };
      case 'employee':
        return { 
          bg: '#9333ea', // Purple (Reviewer/Employee)
          btnClass: 'btn-employee',
          accent: '#7e22ce' // Darker Purple
        };
      default:
        return { 
          bg: '#6b7280', 
          btnClass: 'btn',
          accent: '#374151'
        };
    }
  };
  
  // --- Authentication Handlers ---

  const handleLogin = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const email = formData.get('email');
    const password = formData.get('password');
    
    // Find account regardless of type
    const account = testAccounts.find(acc => acc.email === email && acc.password === password);
    
    if (account) {
      setCurrentUser(account);
      // After generic login, force user to select their portal/role
      setCurrentView('portal-select'); 
    } else {
      showToast('Invalid email or password. Please use a test account.', 'error');
    }
  };

  const handleSignup = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password');
    const userType = formData.get('userType'); // New: Select type on signup
    
    // Check if account already exists
    if (testAccounts.find(acc => acc.email === email)) {
        showToast('Account with this email already exists.', 'error');
        return;
    }

    // Create a temporary new account (in memory only for this demo)
    const newAccount = { 
      email, 
      password, 
      name, 
      type: userType,
      university: userType === 'student' ? 'New University' : undefined,
      department: userType === 'employee' ? 'New Department' : undefined
    };
    
    // In a real app, you would add this to your database
    testAccounts.push(newAccount);

    setCurrentUser(newAccount);
    setCurrentView('portal-select');
    showToast('Account created successfully! Please select your portal.', 'success');
  };

  // --- Core Action Handlers (Kept from previous version) ---

  const handlePaperSubmit = (event) => {
    // ... (logic remains the same)
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
    // ... (logic remains the same)
    event.preventDefault();
    const formData = new FormData(event.target);
    const professorEmail = formData.get('professor');
    const date = formData.get('date');
    const time = formData.get('time');
    const topic = formData.get('topic');
    
    const professor = testAccounts.find(acc => acc.email === professorEmail && acc.type === 'employee');
    
    if (!professor) {
        showToast('Professor not found.', 'error');
        return;
    }

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
    setCurrentView('dashboard');
  };

  const handleReviewSubmit = (event, paperId) => {
    // ... (logic remains the same)
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
    // ... (logic remains the same)
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
    // ... (logic remains the same)
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
    // ... (logic remains the same)
    setPapers(papers.map(p => p.id === paperId ? { ...p, status: newStatus } : p));
    showToast(`Paper ${newStatus.toLowerCase()} successfully!`, 'success');
  };

  const updateMeetingStatus = (meetingId, newStatus) => {
    // ... (logic remains the same)
    setMeetings(meetings.map(m => m.id === meetingId ? { ...m, status: newStatus } : m));
    showToast(`Meeting ${newStatus.toLowerCase()} successfully!`, 'success');
  };

  const assignReviewer = (paperId, reviewerEmail) => {
    // ... (logic remains the same)
    const paper = papers.find(p => p.id === paperId);
    const reviewer = testAccounts.find(acc => acc.email === reviewerEmail);
    
    if (!paper) {
        showToast('Paper not found!', 'error');
        return;
    }
    if (!reviewer) {
        showToast('Reviewer not found!', 'error');
        return;
    }

    if (paper.assignedReviewers && paper.assignedReviewers.includes(reviewerEmail)) {
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
    // ... (logic remains the same)
    setSessions(sessions.filter(s => s.id !== sessionId));
    setRegistrations(registrations.filter(r => r.sessionId !== sessionId));
    showToast('Session deleted successfully!', 'success');
  };

  // --- NEW: Centralized Login/Signup View ---

  const LandingPage = () => {
    const [isLogin, setIsLogin] = useState(true);

    return (
      // Base background for the whole page (Light Blue)
      <div className="auth-container" style={{ background: '#eef7ff' }}>
        <div className="auth-card auth-form-card" style={{ background: '#ffffff', color: '#1f2937' }}>
          
          <div className="auth-header">
            <h1 className="auth-title">Welcome to CMS</h1>
            <p className="auth-subtitle" style={{ color: '#6b7280' }}>Conference Management System</p>
          </div>

          {/* Login Form */}
          {isLogin ? (
            <form className="auth-form" onSubmit={handleLogin}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', color: '#1f2937' }}>Sign In</h2>
              <div className="form-group">
                <label className="form-label" htmlFor="email-login" style={{ color: '#1f2937' }}>Email Address</label>
                <input 
                  type="email" 
                  id="email-login" 
                  name="email"
                  className="form-input" 
                  placeholder="Enter your email"
                  required 
                  style={{ background: '#f9fafb', border: '1px solid #d1d5db', color: '#1f2937' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="password-login" style={{ color: '#1f2937' }}>Password</label>
                <input 
                  type="password" 
                  id="password-login" 
                  name="password"
                  className="form-input" 
                  placeholder="Enter your password"
                  required 
                  style={{ background: '#f9fafb', border: '1px solid #d1d5db', color: '#1f2937' }}
                />
              </div>

              <button type="submit" className="btn" style={{ background: '#ec4899', width: '100%', marginTop: '1rem' }}>
                Sign In
              </button>
              
            </form>
          ) : (
            /* Signup Form */
            <form className="auth-form" onSubmit={handleSignup}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', color: '#1f2937' }}>Create Account</h2>
              
              <div className="form-group">
                <label className="form-label" htmlFor="name-signup" style={{ color: '#1f2937' }}>Full Name</label>
                <input 
                  type="text" 
                  id="name-signup" 
                  name="name"
                  className="form-input" 
                  placeholder="Enter your full name"
                  required 
                  style={{ background: '#f9fafb', border: '1px solid #d1d5db', color: '#1f2937' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="email-signup" style={{ color: '#1f2937' }}>Email Address</label>
                <input 
                  type="email" 
                  id="email-signup" 
                  name="email"
                  className="form-input" 
                  placeholder="Enter your email"
                  required 
                  style={{ background: '#f9fafb', border: '1px solid #d1d5db', color: '#1f2937' }}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label" htmlFor="password-signup" style={{ color: '#1f2937' }}>Password</label>
                <input 
                  type="password" 
                  id="password-signup" 
                  name="password"
                  className="form-input" 
                  placeholder="Create a password"
                  minLength="6"
                  required 
                  style={{ background: '#f9fafb', border: '1px solid #d1d5db', color: '#1f2937' }}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label" htmlFor="userType-signup" style={{ color: '#1f2937' }}>Account Type</label>
                <select 
                    id="userType-signup" 
                    name="userType" 
                    className="form-input" 
                    required 
                    style={{ background: '#f9fafb', border: '1px solid #d1d5db', color: '#1f2937' }}
                >
                    <option value="">Select your role</option>
                    <option value="student">Participant (Student)</option>
                    <option value="employee">Reviewer (Employee/Professor)</option>
                    <option value="admin">Admin</option>
                </select>
              </div>

              <button type="submit" className="btn" style={{ background: '#ec4899', width: '100%', marginTop: '1rem' }}>
                Create Account
              </button>
            </form>
          )}

          <div className="auth-switch">
            <p style={{ color: '#6b7280' }}>
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button 
                className="link-btn" 
                style={{ color: '#ec4899', marginLeft: '0.5rem' }} 
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
            <p style={{ color: '#9ca3af', marginTop: '1rem', fontSize: '0.9rem', textAlign: 'center' }}>
                **TEST ACCOUNTS** (e.g., admin@test.com/admin123, student1@test.com/pass123, employee1@test.com/pass123)
            </p>
          </div>
        </div>
      </div>
    );
  };
  
  // --- Portal Selection View (Updated to use currentUser data) ---

  const PortalSelect = () => (
    <div className="auth-container" style={{ background: '#eef7ff' }}> 
      <div className="auth-card" style={{ background: '#ffffff', color: '#1f2937' }}>
        <div className="auth-header">
          <h1 className="auth-title">Select Your Portal, {currentUser.name}</h1>
          <p className="auth-subtitle" style={{ color: '#6b7280' }}>Choose the role you wish to enter the system as for this session.</p>
          <button className="back-btn" style={{ color: '#6b7280', marginTop: '1rem' }} onClick={() => { setCurrentUser(null); setCurrentView('landing-page'); }}>
            ← Switch Account
          </button>
        </div>
        
        <div className="portal-selection">
          {currentUser.type === 'admin' && (
            <div className="portal-card admin-portal" style={{ background: '#ccfbf1', color: '#0e7490', border: '1px solid #06b6d4' }} onClick={() => { setCurrentUserType('admin'); setCurrentView('dashboard'); }}>
              <div className="portal-icon">⚙️</div>
              <h3>Admin Portal</h3>
              <p style={{ color: '#0e7490' }}>Manage conferences, schedules, reviews, and registrations</p>
              <button className="btn btn-admin">Enter as Admin</button>
            </div>
          )}

          {(currentUser.type === 'student' || currentUser.type === 'admin') && (
            <div className="portal-card student-portal" style={{ background: '#e0e7ff', color: '#4338ca', border: '1px solid #4f46e5' }} onClick={() => { setCurrentUserType('student'); setCurrentView('dashboard'); }}>
              <div className="portal-icon">🎓</div>
              <h3>Participant Portal</h3>
              <p style={{ color: '#4338ca' }}>Submit papers, register for sessions, and view schedules</p>
              <button className="btn btn-student">Enter as Participant</button>
            </div>
          )}

          {(currentUser.type === 'employee' || currentUser.type === 'admin') && (
            <div className="portal-card employee-portal" style={{ background: '#f3e8ff', color: '#7e22ce', border: '1px solid #9333ea' }} onClick={() => { setCurrentUserType('employee'); setCurrentView('dashboard'); }}>
              <div className="portal-icon">👨‍🏫</div>
              <h3>Reviewer Portal</h3>
              <p style={{ color: '#7e22ce' }}>Review papers, provide feedback, and manage sessions</p>
              <button className="btn btn-employee">Enter as Reviewer</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // --- Dashboards (Only the student dashboard has a new feature) ---

  const AdminDashboard = () => {
    // ... (existing logic) ...
    const employees = testAccounts.filter(acc => acc.type === 'employee');
    const { bg, accent } = getThemeColors('admin');

    return (
      <div className="theme-admin" style={{ background: '#eef7ff', color: '#1f2937' }}> 
        <nav className="nav" style={{ background: bg, color: '#ffffff', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <div className="nav-content">
            <div className="nav-logo">
              <span>⚙️</span>
              Admin Portal
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <span style={{ color: '#ffffff' }}>{currentUser.name}</span>
              <button className="btn" style={{ padding: '0.5rem 1rem', width: 'auto', background: '#ec4899', border: 'none' }} onClick={() => { setCurrentUser(null); setCurrentView('landing-page'); }}>Logout</button>
            </div>
          </div>
        </nav>

        <main className="main" style={{ background: '#eef7ff' }}>
          <div className="hero">
            <h1 style={{ color: '#1f2937' }}>{getGreeting()}, {currentUser.name}!</h1> 
            <p style={{ color: '#6b7280' }}>Manage conference schedules, paper submissions, and peer reviews</p>
          </div>

          <div style={{ marginTop: '3rem' }}>
            {/* Statistics Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
              <div style={{ background: '#ffffff', border: '1px solid #d1d5db', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📄</div>
                <div style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.25rem', color: accent }}>{papers.length}</div>
                <div style={{ color: '#6b7280' }}>Total Submissions</div>
              </div>
              <div style={{ background: '#ffffff', border: '1px solid #d1d5db', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📅</div>
                <div style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.25rem', color: accent }}>{sessions.length}</div>
                <div style={{ color: '#6b7280' }}>Conference Sessions</div>
              </div>
              <div style={{ background: '#ffffff', border: '1px solid #d1d5db', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>✍️</div>
                <div style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.25rem', color: accent }}>{reviews.length}</div>
                <div style={{ color: '#6b7280' }}>Peer Reviews</div>
              </div>
              <div style={{ background: '#ffffff', border: '1px solid #d1d5db', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>👥</div>
                <div style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.25rem', color: accent }}>{registrations.length}</div>
                <div style={{ color: '#6b7280' }}>Registrations</div>
              </div>
            </div>

            {/* Paper Management (unchanged logic) */}
            <div style={{ marginBottom: '4rem' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '2rem', color: '#1f2937' }}>📋 Paper Submissions Management</h2>
              {/* ... (Paper mapping logic) ... */}
              {papers.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#6b7280', background: '#ffffff', borderRadius: '16px', border: '1px solid #d1d5db', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                  <div style={{ fontSize: '4rem', marginBottom: '1rem', opacity: '0.5' }}>📋</div>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#1f2937' }}>No submissions yet</h3>
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
                      <div key={paper.id} style={{ background: '#ffffff', border: '1px solid #d1d5db', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', gap: '1rem' }}>
                          <div>
                            <h3 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1f2937' }}>{paper.title}</h3>
                            <p style={{ color: accent, fontSize: '0.95rem', marginBottom: '0.25rem' }}>By {paper.authorName}</p>
                            <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>Submitted on {new Date(paper.submittedAt).toLocaleDateString()}</p>
                          </div>
                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <span style={{ 
                              padding: '0.5rem 1rem', 
                              borderRadius: '8px', 
                              fontSize: '0.85rem', 
                              fontWeight: '600', 
                              whiteSpace: 'nowrap',
                              background: paper.status === 'Accepted' ? 'rgba(34, 197, 94, 0.1)' : paper.status === 'Rejected' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255, 127, 80, 0.1)', 
                              color: paper.status === 'Accepted' ? '#10b981' : paper.status === 'Rejected' ? '#ef4444' : '#ff7f50',
                              border: paper.status === 'Accepted' ? '1px solid rgba(34, 197, 94, 0.3)' : paper.status === 'Rejected' ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(255, 127, 80, 0.3)'
                            }}>
                              {paper.status}
                            </span>
                          </div>
                        </div>
                        
                        <p style={{ color: '#6b7280', lineHeight: '1.6', marginBottom: '1rem' }}>{paper.abstract}</p>
                        
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                          {paper.keywords.map((kw, idx) => (
                            <span key={idx} style={{ padding: '0.25rem 0.75rem', background: 'rgba(236, 72, 153, 0.1)', color: '#ec4899', borderRadius: '6px', fontSize: '0.85rem' }}>{kw}</span>
                          ))}
                        </div>

                        <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '12px', marginBottom: '1rem', border: '1px solid #e5e7eb' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                            <span style={{ color: '#6b7280' }}>Reviews: {paperReviews.length}</span>
                            <span style={{ color: '#6b7280' }}>Avg Rating: ⭐ {avgRating}</span>
                          </div>
                          
                          <div style={{ marginBottom: '1rem' }}>
                            <label style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '0.5rem', display: 'block' }}>Assign Reviewer:</label>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <select 
                                id={`reviewer-${paper.id}`}
                                style={{ 
                                  flex: 1,
                                  padding: '0.5rem',
                                  background: '#ffffff',
                                  border: '1px solid #d1d5db',
                                  borderRadius: '8px',
                                  color: '#1f2937',
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
                                style={{ padding: '0.5rem 1rem', width: 'auto', background: 'rgba(236, 72, 153, 0.1)', color: '#ec4899', border: '1px solid rgba(236, 72, 153, 0.3)' }}
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
                              <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>Assigned Reviewers:</span>
                              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                                {paper.assignedReviewers.map((email, idx) => {
                                  const reviewer = testAccounts.find(acc => acc.email === email);
                                  return (
                                    <span key={idx} style={{ padding: '0.25rem 0.75rem', background: 'rgba(236, 72, 153, 0.1)', color: '#ec4899', borderRadius: '6px', fontSize: '0.85rem' }}>
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
                            <button className="btn" style={{ padding: '0.5rem 1rem', width: 'auto', background: 'rgba(34, 197, 94, 0.1)', color: '#10b981', border: '1px solid rgba(34, 197, 94, 0.3)' }} onClick={() => updatePaperStatus(paper.id, 'Accepted')}>
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

            {/* Session Management (CONTINUED LOGIC) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: '700', color: '#1f2937' }}>📅 Conference Schedule Management</h2>
                <button className="btn btn-admin" style={{ width: 'auto' }} onClick={() => setCurrentView('create-session')}>
                  + Create Session
                </button>
              </div>

              {sessions.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#6b7280', background: '#ffffff', borderRadius: '16px', border: '1px solid #d1d5db', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                  <div style={{ fontSize: '4rem', marginBottom: '1rem', opacity: '0.5' }}>📅</div>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#1f2937' }}>No sessions created yet</h3>
                  <p>Create conference sessions here.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {sessions.map(session => {
                    const sessionRegistrations = registrations.filter(r => r.sessionId === session.id);
                    return (
                      <div key={session.id} style={{ background: '#ffffff', border: '1px solid #d1d5db', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                          <div>
                            <h3 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1f2937' }}>{session.title}</h3>
                            <p style={{ color: accent, fontSize: '0.95rem' }}>Track: {session.track}</p>
                            <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>{session.date} | {session.startTime} - {session.endTime} in Room {session.room}</p>
                          </div>
                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <span style={{ padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '600', whiteSpace: 'nowrap', background: 'rgba(236, 72, 153, 0.1)', color: '#ec4899', border: '1px solid rgba(236, 72, 153, 0.3)' }}>
                              Attendees: {sessionRegistrations.length}
                            </span>
                            <button className="btn" style={{ padding: '0.5rem 1rem', width: 'auto', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)' }} onClick={() => deleteSession(session.id)}>
                              Delete
                            </button>
                          </div>
                        </div>
                        <p style={{ color: '#6b7280', lineHeight: '1.6' }}>{session.description}</p>
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

  // --- Employee/Reviewer Dashboard ---

  const EmployeeDashboard = () => {
    const { bg, accent } = getThemeColors('employee');
    const assignedPapers = papers.filter(p => p.assignedReviewers && p.assignedReviewers.includes(currentUser.email));
    const pendingMeetings = meetings.filter(m => m.professorEmail === currentUser.email && m.status === 'Pending');
    const reviewedPapers = reviews.filter(r => r.reviewerEmail === currentUser.email).map(r => r.paperId);
    
    return (
      <div className="theme-employee" style={{ background: '#f3e8ff', color: '#1f2937' }}> 
        <nav className="nav" style={{ background: bg, color: '#ffffff', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <div className="nav-content">
            <div className="nav-logo">
              <span>👨‍🏫</span>
              Reviewer Portal
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <span style={{ color: '#ffffff' }}>{currentUser.name}</span>
              <button className="btn" style={{ padding: '0.5rem 1rem', width: 'auto', background: '#ec4899', border: 'none' }} onClick={() => { setCurrentUser(null); setCurrentView('landing-page'); }}>Logout</button>
            </div>
          </div>
        </nav>
        
        <main className="main" style={{ background: '#f3e8ff' }}>
          <div className="hero">
            <h1 style={{ color: '#1f2937' }}>{getGreeting()}, {currentUser.name}!</h1> 
            <p style={{ color: '#6b7280' }}>Manage assigned papers and student meeting requests.</p>
          </div>

          <div style={{ marginTop: '3rem' }}>
            {/* Paper Review Queue */}
            <div style={{ marginBottom: '4rem' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '2rem', color: '#1f2937' }}>✍️ Paper Review Queue ({assignedPapers.length} Papers)</h2>
              
              {assignedPapers.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#6b7280', background: '#ffffff', borderRadius: '16px', border: '1px solid #d1d5db', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                  <div style={{ fontSize: '4rem', marginBottom: '1rem', opacity: '0.5' }}>🎉</div>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#1f2937' }}>All caught up!</h3>
                  <p>You have no new papers assigned for review.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {assignedPapers.map(paper => {
                    const isReviewed = reviewedPapers.includes(paper.id);
                    return (
                      <div key={paper.id} style={{ background: '#ffffff', border: '1px solid #d1d5db', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                          <div>
                            <h3 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1f2937' }}>{paper.title}</h3>
                            <p style={{ color: accent, fontSize: '0.95rem', marginBottom: '0.25rem' }}>Author: {paper.authorName}</p>
                            <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>Status: {paper.status} | Submitted: {new Date(paper.submittedAt).toLocaleDateString()}</p>
                          </div>
                          <div>
                            {isReviewed ? (
                              <span style={{ padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '600', whiteSpace: 'nowrap', background: 'rgba(34, 197, 94, 0.1)', color: '#10b981', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
                                Review Submitted
                              </span>
                            ) : (
                              <button 
                                className="btn btn-employee" 
                                style={{ width: 'auto' }} 
                                onClick={() => setCurrentView(`review-form-${paper.id}`)}
                              >
                                Submit Review
                              </button>
                            )}
                          </div>
                        </div>
                        <p style={{ color: '#6b7280', lineHeight: '1.6' }}>{paper.abstract}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            
            {/* Meeting Requests */}
            <div style={{ marginBottom: '4rem' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '2rem', color: '#1f2937' }}>🤝 Pending Meeting Requests ({pendingMeetings.length} Requests)</h2>
              
              {pendingMeetings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#6b7280', background: '#ffffff', borderRadius: '16px', border: '1px solid #d1d5db', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                  <div style={{ fontSize: '4rem', marginBottom: '1rem', opacity: '0.5' }}>☕</div>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#1f2937' }}>Quiet day</h3>
                  <p>No students have requested a meeting yet.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {pendingMeetings.map(meeting => (
                    <div key={meeting.id} style={{ background: '#ffffff', border: '1px solid #d1d5db', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <div>
                          <h3 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1f2937' }}>Meeting with {meeting.studentName}</h3>
                          <p style={{ color: accent, fontSize: '0.95rem' }}>Topic: {meeting.topic}</p>
                          <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>Requested for: **{meeting.date}** at **{meeting.time}**</p>
                        </div>
                        <span style={{ padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '600', whiteSpace: 'nowrap', background: 'rgba(251, 191, 36, 0.1)', color: '#d97706', border: '1px solid rgba(251, 191, 36, 0.3)' }}>
                          {meeting.status}
                        </span>
                      </div>

                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <button className="btn" style={{ padding: '0.5rem 1rem', width: 'auto', background: 'rgba(34, 197, 94, 0.1)', color: '#10b981', border: '1px solid rgba(34, 197, 94, 0.3)' }} onClick={() => updateMeetingStatus(meeting.id, 'Confirmed')}>
                          Confirm
                        </button>
                        <button className="btn" style={{ padding: '0.5rem 1rem', width: 'auto', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)' }} onClick={() => updateMeetingStatus(meeting.id, 'Declined')}>
                          Decline
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </main>
      </div>
    );
  };

  // --- Student/Participant Dashboard ---

  const StudentDashboard = () => {
    const { bg, accent } = getThemeColors('student');
    const myPapers = papers.filter(p => p.authorEmail === currentUser.email);
    const availableSessions = sessions; // All sessions are visible
    const myRegistrations = registrations.filter(r => r.userEmail === currentUser.email).map(r => r.sessionId);
    const myMeetings = meetings.filter(m => m.studentEmail === currentUser.email);
    const professors = testAccounts.filter(acc => acc.type === 'employee');
    
    // NEW: Get meeting status for display
    const pendingMeetingsCount = myMeetings.filter(m => m.status === 'Pending').length;
    const confirmedMeetingsCount = myMeetings.filter(m => m.status === 'Confirmed').length;


    return (
      <div className="theme-student" style={{ background: '#e0e7ff', color: '#1f2937' }}> 
        <nav className="nav" style={{ background: bg, color: '#ffffff', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <div className="nav-content">
            <div className="nav-logo">
              <span>🎓</span>
              Participant Portal
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <span style={{ color: '#ffffff' }}>{currentUser.name}</span>
              <button className="btn" style={{ padding: '0.5rem 1rem', width: 'auto', background: '#ec4899', border: 'none' }} onClick={() => { setCurrentUser(null); setCurrentView('landing-page'); }}>Logout</button>
            </div>
          </div>
        </nav>
        
        <main className="main" style={{ background: '#e0e7ff' }}>
          <div className="hero">
            <h1 style={{ color: '#1f2937' }}>{getGreeting()}, {currentUser.name}!</h1> 
            <p style={{ color: '#6b7280' }}>Welcome to the conference participant management system from {currentUser.university}.</p>
          </div>

          <div style={{ marginTop: '3rem' }}>
            {/* Action Buttons & Quick Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
              <button className="btn btn-student" style={{ height: '100%', padding: '1.5rem' }} onClick={() => setCurrentView('submit-paper')}>
                📄 Submit New Paper
              </button>
              <button className="btn btn-student" style={{ height: '100%', padding: '1.5rem' }} onClick={() => setCurrentView('schedule-meeting')}>
                🤝 Schedule Meeting
              </button>
              {/* NEW STATS */}
              <div style={{ background: '#ffffff', border: '1px solid #d1d5db', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: accent }}>{confirmedMeetingsCount}</div>
                <div style={{ color: '#6b7280' }}>Confirmed Meetings</div>
              </div>
              <div style={{ background: '#ffffff', border: '1px solid #d1d5db', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: accent }}>{pendingMeetingsCount}</div>
                <div style={{ color: '#6b7280' }}>Pending Meetings</div>
              </div>
            </div>

            {/* My Submissions */}
            <div style={{ marginBottom: '4rem' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '2rem', color: '#1f2937' }}>📄 My Paper Submissions ({myPapers.length})</h2>
              
              {myPapers.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#6b7280', background: '#ffffff', borderRadius: '16px', border: '1px solid #d1d5db', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                  <div style={{ fontSize: '4rem', marginBottom: '1rem', opacity: '0.5' }}>📝</div>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#1f2937' }}>No papers submitted</h3>
                  <p>Click 'Submit New Paper' to get started!</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {myPapers.map(paper => {
                    const paperReviews = reviews.filter(r => r.paperId === paper.id);
                    const avgRating = paperReviews.length > 0 ? (paperReviews.reduce((sum, r) => sum + r.rating, 0) / paperReviews.length).toFixed(1) : 'N/A';
                    
                    return (
                      <div key={paper.id} style={{ background: '#ffffff', border: '1px solid #d1d5db', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                          <div>
                            <h3 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1f2937' }}>{paper.title}</h3>
                            <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>Submitted on {new Date(paper.submittedAt).toLocaleDateString()}</p>
                          </div>
                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <span style={{ 
                              padding: '0.5rem 1rem', 
                              borderRadius: '8px', 
                              fontSize: '0.85rem', 
                              fontWeight: '600', 
                              whiteSpace: 'nowrap',
                              background: paper.status === 'Accepted' ? 'rgba(34, 197, 94, 0.1)' : paper.status === 'Rejected' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255, 127, 80, 0.1)', 
                              color: paper.status === 'Accepted' ? '#10b981' : paper.status === 'Rejected' ? '#ef4444' : '#ff7f50',
                              border: paper.status === 'Accepted' ? '1px solid rgba(34, 197, 94, 0.3)' : paper.status === 'Rejected' ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(255, 127, 80, 0.3)'
                            }}>
                              {paper.status}
                            </span>
                          </div>
                        </div>
                        
                        <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '12px', marginTop: '1rem', border: '1px solid #e5e7eb' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: '#6b7280' }}>Reviews Received: {paperReviews.length}</span>
                            <span style={{ color: '#6b7280' }}>Avg Rating: ⭐ {avgRating}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Conference Sessions */}
            <div style={{ marginBottom: '4rem' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '2rem', color: '#1f2937' }}>📅 Conference Sessions ({availableSessions.length})</h2>
              
              {availableSessions.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#6b7280', background: '#ffffff', borderRadius: '16px', border: '1px solid #d1d5db', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                  <div style={{ fontSize: '4rem', marginBottom: '1rem', opacity: '0.5' }}>⏳</div>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#1f2937' }}>Schedule pending</h3>
                  <p>The conference schedule hasn't been posted yet.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {availableSessions.map(session => {
                    const isRegistered = myRegistrations.includes(session.id);
                    return (
                      <div key={session.id} style={{ background: '#ffffff', border: '1px solid #d1d5db', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                          <div>
                            <h3 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1f2937' }}>{session.title}</h3>
                            <p style={{ color: accent, fontSize: '0.95rem' }}>Track: {session.track} | Room: {session.room}</p>
                            <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>**{session.date}** at **{session.startTime}** - {session.endTime}</p>
                          </div>
                          <div>
                            {isRegistered ? (
                              <span style={{ padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '600', whiteSpace: 'nowrap', background: 'rgba(34, 197, 94, 0.1)', color: '#10b981', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
                                Registered
                              </span>
                            ) : (
                              <button className="btn btn-student" style={{ width: 'auto' }} onClick={() => handleRegistration(session.id)}>
                                Register
                              </button>
                            )}
                          </div>
                        </div>
                        <p style={{ color: '#6b7280', lineHeight: '1.6' }}>{session.description}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            
            {/* My Meetings */}
            <div>
              <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '2rem', color: '#1f2937' }}>🤝 My Meeting Requests ({myMeetings.length})</h2>
              
              {myMeetings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#6b7280', background: '#ffffff', borderRadius: '16px', border: '1px solid #d1d5db', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                  <div style={{ fontSize: '4rem', marginBottom: '1rem', opacity: '0.5' }}>📅</div>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#1f2937' }}>No meetings scheduled</h3>
                  <p>Click 'Schedule Meeting' to request time with a faculty member.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {myMeetings.map(meeting => (
                    <div key={meeting.id} style={{ background: '#ffffff', border: '1px solid #d1d5db', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <div>
                          <h3 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1f2937' }}>Meeting with {meeting.professorName}</h3>
                          <p style={{ color: accent, fontSize: '0.95rem' }}>Topic: {meeting.topic} | Dept: {meeting.department}</p>
                          <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>Scheduled for: **{meeting.date}** at **{meeting.time}**</p>
                        </div>
                        <span style={{ 
                            padding: '0.5rem 1rem', 
                            borderRadius: '8px', 
                            fontSize: '0.85rem', 
                            fontWeight: '600', 
                            whiteSpace: 'nowrap',
                            background: meeting.status === 'Confirmed' ? 'rgba(34, 197, 94, 0.1)' : meeting.status === 'Declined' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(251, 191, 36, 0.1)', 
                            color: meeting.status === 'Confirmed' ? '#10b981' : meeting.status === 'Declined' ? '#ef4444' : '#d97706',
                            border: meeting.status === 'Confirmed' ? '1px solid rgba(34, 197, 94, 0.3)' : meeting.status === 'Declined' ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(251, 191, 36, 0.3)'
                        }}>
                          {meeting.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </main>
      </div>
    );
  };
  
  // --- Form Views ---

  const FormContainer = ({ title, description, children }) => {
    const { bg, accent } = getThemeColors(currentUserType);
    return (
      <div className="form-container" style={{ background: '#eef7ff', color: '#1f2937' }}>
        <nav className="nav" style={{ background: bg, color: '#ffffff', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <div className="nav-content">
            <div className="nav-logo">
              <span>{currentUserType === 'admin' ? '⚙️' : currentUserType === 'student' ? '🎓' : '👨‍🏫'}</span>
              {currentUserType.charAt(0).toUpperCase() + currentUserType.slice(1)} Portal
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <button className="btn" style={{ padding: '0.5rem 1rem', width: 'auto', background: '#ec4899', border: 'none' }} onClick={() => setCurrentView('dashboard')}>Back to Dashboard</button>
            </div>
          </div>
        </nav>
        <div className="form-card" style={{ background: '#ffffff', border: '1px solid #d1d5db', borderRadius: '16px', padding: '2rem 2.5rem', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem', color: accent }}>{title}</h1>
          <p style={{ color: '#6b7280', marginBottom: '2rem' }}>{description}</p>
          {children}
        </div>
      </div>
    );
  };

  const PaperSubmissionForm = () => (
    <FormContainer title="Submit New Research Paper" description="Please fill in the details of your submission.">
      <form className="form" onSubmit={handlePaperSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="title">Paper Title</label>
          <input type="text" id="title" name="title" className="form-input" required placeholder="e.g., A Novel Approach to Deep Learning" />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="abstract">Abstract (Max 500 characters)</label>
          <textarea id="abstract" name="abstract" className="form-input" maxLength="500" rows="5" required placeholder="Provide a brief summary of your work." />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="keywords">Keywords (Comma Separated)</label>
          <input type="text" id="keywords" name="keywords" className="form-input" required placeholder="e.g., AI, Machine Learning, Data Science" />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="file">Upload File (PDF Only - Demo Placeholder)</label>
          <input type="file" id="file" name="file" className="form-input" accept=".pdf" />
        </div>
        <button type="submit" className={`btn ${getThemeColors(currentUserType).btnClass}`} style={{ marginTop: '1.5rem' }}>Submit Paper</button>
      </form>
    </FormContainer>
  );
  
  const ScheduleMeetingForm = () => {
    const professors = testAccounts.filter(acc => acc.type === 'employee');
    return (
      <FormContainer title="Schedule Meeting with Faculty" description="Request a one-on-one meeting with a professor/employee.">
        <form className="form" onSubmit={handleScheduleMeeting}>
          <div className="form-group">
            <label className="form-label" htmlFor="professor">Select Faculty Member</label>
            <select id="professor" name="professor" className="form-input" required>
              <option value="">Choose Professor</option>
              {professors.map(p => (
                <option key={p.email} value={p.email}>{p.name} ({p.department})</option>
              ))}
            </select>
          </div>
          <div className="form-group-inline">
            <div className="form-group">
              <label className="form-label" htmlFor="date">Date</label>
              <input type="date" id="date" name="date" className="form-input" required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="time">Time</label>
              <input type="time" id="time" name="time" className="form-input" required />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="topic">Meeting Topic/Reason</label>
            <textarea id="topic" name="topic" className="form-input" rows="3" required placeholder="Briefly describe the purpose of the meeting." />
          </div>
          <button type="submit" className={`btn ${getThemeColors(currentUserType).btnClass}`} style={{ marginTop: '1.5rem' }}>Send Request</button>
        </form>
      </FormContainer>
    );
  };
  
  const CreateSessionForm = () => (
    <FormContainer title="Create Conference Session" description="Define a new time slot and details for the conference schedule.">
      <form className="form" onSubmit={handleSessionCreate}>
        <div className="form-group">
          <label className="form-label" htmlFor="title">Session Title</label>
          <input type="text" id="title" name="title" className="form-input" required placeholder="e.g., Keynote on Future of AI" />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="track">Track/Category</label>
          <input type="text" id="track" name="track" className="form-input" required placeholder="e.g., Computer Science, Robotics, Humanities" />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="room">Room/Venue</label>
          <input type="text" id="room" name="room" className="form-input" required placeholder="e.g., Grand Ballroom, Room 301, Online" />
        </div>
        <div className="form-group-inline">
          <div className="form-group">
            <label className="form-label" htmlFor="date">Date</label>
            <input type="date" id="date" name="date" className="form-input" required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="startTime">Start Time</label>
            <input type="time" id="startTime" name="startTime" className="form-input" required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="endTime">End Time</label>
            <input type="time" id="endTime" name="endTime" className="form-input" required />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="description">Session Description</label>
          <textarea id="description" name="description" className="form-input" rows="4" required placeholder="Provide a detailed description of the session content." />
        </div>
        <button type="submit" className={`btn ${getThemeColors(currentUserType).btnClass}`} style={{ marginTop: '1.5rem' }}>Create Session</button>
      </form>
    </FormContainer>
  );
  
  const ReviewForm = ({ paperId }) => {
    const paper = papers.find(p => p.id === paperId);
    if (!paper) {
      // Fallback for direct link/state issue
      return (
        <FormContainer title="Error" description="Paper not found.">
          <p>The paper you tried to review could not be loaded.</p>
          <button className={`btn ${getThemeColors(currentUserType).btnClass}`} onClick={() => setCurrentView('dashboard')}>Go to Dashboard</button>
        </FormContainer>
      );
    }
    return (
      <FormContainer title={`Reviewing: ${paper.title}`} description={`Provide your confidential review for the paper by ${paper.authorName}.`}>
        <form className="form" onSubmit={(e) => handleReviewSubmit(e, paperId)}>
          <div className="form-group">
            <label className="form-label" htmlFor="rating">Overall Quality Rating (1=Poor, 5=Excellent)</label>
            <input type="number" id="rating" name="rating" className="form-input" min="1" max="5" required placeholder="Enter a rating from 1 to 5" />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="recommendation">Recommendation</label>
            <select id="recommendation" name="recommendation" className="form-input" required>
              <option value="">Select recommendation...</option>
              <option value="Strong Accept">Strong Accept</option>
              <option value="Weak Accept">Weak Accept</option>
              <option value="Borderline">Borderline</option>
              <option value="Weak Reject">Weak Reject</option>
              <option value="Strong Reject">Strong Reject</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="comments">Detailed Comments</label>
            <textarea id="comments" name="comments" className="form-input" rows="6" required placeholder="Provide constructive feedback, focusing on strengths and weaknesses." />
          </div>
          <button type="submit" className={`btn ${getThemeColors(currentUserType).btnClass}`} style={{ marginTop: '1.5rem' }}>Submit Review</button>
        </form>
      </FormContainer>
    );
  };

  // --- Main App Logic to Render Current View ---
  
  const renderView = () => {
    // 1. Landing and Authentication Views
    if (currentView === 'landing-page') return <LandingPage />;
    if (currentView === 'portal-select') return <PortalSelect />;
    
    // 2. Dashboard Views
    if (currentView === 'dashboard') {
      if (!currentUser || !currentUserType) return <LandingPage />; // Safety net
      switch (currentUserType) {
        case 'admin':
          return <AdminDashboard />;
        case 'student':
          return <StudentDashboard />;
        case 'employee':
          return <EmployeeDashboard />;
        default:
          return <LandingPage />;
      }
    }

    // 3. Form Views
    if (currentView === 'submit-paper') return <PaperSubmissionForm />;
    if (currentView === 'schedule-meeting') return <ScheduleMeetingForm />;
    if (currentView === 'create-session') return <CreateSessionForm />;

    // Handle dynamic review-form views
    if (currentView.startsWith('review-form-')) {
      const paperId = currentView.split('-')[2];
      return <ReviewForm paperId={paperId} />;
    }
    
    return <LandingPage />; // Default fallback
  };

  return (
    <div className="App">
      {renderView()}
    </div>
  );
}

export default App;