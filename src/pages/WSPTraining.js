import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HubSpotLayout from '../components/HubSpotLayout';
import '../css/WSPTraining.css';

const WSPTraining = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [showTrainingForm, setShowTrainingForm] = useState(false);
    const [editingTraining, setEditingTraining] = useState(null);
    const [trainingData, setTrainingData] = useState({
        title: '',
        startDate: '',
        endDate: '',
        duration: '',
        facilitator: '',
        location: '',
        maxParticipants: '',
        description: '',
        status: 'Scheduled'
    });

    // Load training data from localStorage
    const [trainings, setTrainings] = useState([]);
    
    useEffect(() => {
        const storedTrainings = localStorage.getItem('wspTrainings');
        if (storedTrainings) {
            setTrainings(JSON.parse(storedTrainings));
        }
    }, []);

    const handleAddTraining = () => {
        setEditingTraining(null);
        setTrainingData({
            title: '',
            startDate: '',
            endDate: '',
            duration: '',
            facilitator: '',
            location: '',
            maxParticipants: '',
            description: '',
            status: 'Scheduled'
        });
        setShowTrainingForm(true);
    };

    const handleEditTraining = (training) => {
        setEditingTraining(training);
        setTrainingData({
            title: training.title || '',
            startDate: training.startDate || '',
            endDate: training.endDate || '',
            duration: training.duration || '',
            facilitator: training.facilitator || '',
            location: training.location || '',
            maxParticipants: training.maxParticipants || '',
            description: training.description || '',
            status: training.status || 'Scheduled'
        });
        setShowTrainingForm(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTrainingData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmitTraining = (e) => {
        e.preventDefault();
        
        if (!trainingData.title.trim()) {
            alert('Training title is required');
            return;
        }

        if (editingTraining) {
            // Update existing training
            const updatedTrainings = trainings.map(t => 
                t.id === editingTraining.id ? { ...t, ...trainingData } : t
            );
            setTrainings(updatedTrainings);
            localStorage.setItem('wspTrainings', JSON.stringify(updatedTrainings));
        } else {
            // Add new training
            const newTraining = {
                id: Date.now().toString(),
                ...trainingData
            };
            const updatedTrainings = [...trainings, newTraining];
            setTrainings(updatedTrainings);
            localStorage.setItem('wspTrainings', JSON.stringify(updatedTrainings));
        }
        
        setShowTrainingForm(false);
        setEditingTraining(null);
    };

    const handleCancelTraining = () => {
        setShowTrainingForm(false);
        setEditingTraining(null);
    };

    const handleDeleteTraining = (trainingId) => {
        if (window.confirm('Are you sure you want to delete this training?')) {
            const updatedTrainings = trainings.filter(t => t.id !== trainingId);
            setTrainings(updatedTrainings);
            localStorage.setItem('wspTrainings', JSON.stringify(updatedTrainings));
        }
    };

    const TrainingForm = () => (
        <div className="modal-overlay" onClick={handleCancelTraining}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{editingTraining ? 'Edit Training' : 'Add New Training'}</h2>
                    <button className="close-btn" onClick={handleCancelTraining}>&times;</button>
                </div>
                <form onSubmit={handleSubmitTraining} className="training-form">
                    <div className="form-group">
                        <label htmlFor="title">Training Title *</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={trainingData.title}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="startDate">Start Date *</label>
                            <input
                                type="date"
                                id="startDate"
                                name="startDate"
                                value={trainingData.startDate}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="endDate">End Date</label>
                            <input
                                type="date"
                                id="endDate"
                                name="endDate"
                                value={trainingData.endDate}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="duration">Duration</label>
                            <input
                                type="text"
                                id="duration"
                                name="duration"
                                value={trainingData.duration}
                                onChange={handleInputChange}
                                placeholder="e.g., 2 days, 4 hours"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="maxParticipants">Max Participants</label>
                            <input
                                type="number"
                                id="maxParticipants"
                                name="maxParticipants"
                                value={trainingData.maxParticipants}
                                onChange={handleInputChange}
                                min="1"
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="facilitator">Facilitator</label>
                        <input
                            type="text"
                            id="facilitator"
                            name="facilitator"
                            value={trainingData.facilitator}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="location">Location</label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            value={trainingData.location}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="status">Status</label>
                        <select
                            id="status"
                            name="status"
                            value={trainingData.status}
                            onChange={handleInputChange}
                        >
                            <option value="Scheduled">Scheduled</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={trainingData.description}
                            onChange={handleInputChange}
                            rows="3"
                            placeholder="Training description and objectives..."
                        />
                    </div>
                    <div className="form-actions">
                        <button type="button" className="btn-secondary" onClick={handleCancelTraining}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary">
                            {editingTraining ? 'Update' : 'Add'} Training
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    // (move all code from return into a variable)
    const pageContent = (
        <>
            {/* Header Section */}
            <div className="wsp-header">
                <div className="header-content">
                    <div className="header-title">
                        <h1>WSP & Training Management</h1>
                        <p>Comprehensive Workplace Skills Plan and Training Program Management</p>
                    </div>
                    <div className="header-actions">
                        <button className="btn-secondary">
                            <i className="fas fa-download"></i>
                            Export WSP
                        </button>
                        <button className="btn-primary" onClick={handleAddTraining}>
                            <i className="fas fa-plus"></i>
                            New Training
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="wsp-content">
                {/* Tab Navigation */}
                <div className="tab-navigation">
                    <button 
                        className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        <i className="fas fa-chart-line"></i>
                        WSP Overview
                    </button>
                </div>

            {/* WSP Overview Tab */}
            {activeTab === 'overview' && (
                <>
                    {/* WSP Overview Section */}
                    <section className="accreditation-overview">
                        <div className="section-header">
                            <h2>WSP & Training Summary</h2>
                            <p>Comprehensive overview of your Workplace Skills Plan and training initiatives</p>
                        </div>
                        
                        <div className="summary-metrics">
                            <div className="metric-card primary">
                                <div className="metric-icon">
                                    <i className="fas fa-file-alt"></i>
                                </div>
                                <div className="metric-content">
                                    <h3>Active WSPs</h3>
                                    <div className="metric-value">25</div>
                                    <div className="metric-trend positive">
                                        <i className="fas fa-arrow-up"></i>
                                        <span>+3 this month</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="metric-card secondary">
                                <div className="metric-icon">
                                    <i className="fas fa-graduation-cap"></i>
                                </div>
                                <div className="metric-content">
                                    <h3>Training Programs</h3>
                                    <div className="metric-value">{trainings.length}</div>
                                    <div className="metric-trend positive">
                                        <i className="fas fa-arrow-up"></i>
                                        <span>Active programs</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="metric-card tertiary">
                                <div className="metric-icon">
                                    <i className="fas fa-users"></i>
                                </div>
                                <div className="metric-content">
                                    <h3>Learners Enrolled</h3>
                                    <div className="metric-value">150</div>
                                    <div className="metric-trend positive">
                                        <i className="fas fa-arrow-up"></i>
                                        <span>+12 this week</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="metric-card success">
                                <div className="metric-icon">
                                    <i className="fas fa-certificate"></i>
                                </div>
                                <div className="metric-content">
                                    <h3>Completion Rate</h3>
                                    <div className="metric-value">87%</div>
                                    <div className="metric-trend positive">
                                        <i className="fas fa-arrow-up"></i>
                                        <span>+5% vs last year</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        

                    </section>

                    {/* WSP Management Section */}
                    <section className="wsp-management">
                        <h2>WSP Management</h2>
                        <div className="wsp-grid">
                            <div className="wsp-card">
                                <h3>Skills Gap Analysis</h3>
                                <ul>
                                    <li>Current Skills Audit</li>
                                    <li>Future Requirements</li>
                                    <li>Training Needs</li>
                                </ul>
                                <button className="action-button">View Analysis</button>
                            </div>
                            <div className="wsp-card">
                                <h3>Training Programs</h3>
                                <ul>
                                    <li>Learnerships</li>
                                    <li>Internships</li>
                                    <li>Apprenticeships</li>
                                </ul>
                                <button className="action-button">Manage Programs</button>
                            </div>
                            <div className="wsp-card">
                                <h3>Budget Allocation</h3>
                                <ul>
                                    <li>SDL Contributions</li>
                                    <li>Grant Claims</li>
                                    <li>Training Budget</li>
                                </ul>
                                <button className="action-button">View Budget</button>
                            </div>
                        </div>
                    </section>

                    {/* Compliance Section */}
                    <section className="compliance-section">
                        <h2>Compliance & Reporting</h2>
                        <div className="compliance-grid">
                            <div className="compliance-card">
                                <h3>WSP Submission Status</h3>
                                <div className="status-indicator">
                                    <span className="status-dot active"></span>
                                    <span>Current WSP: Submitted</span>
                                </div>
                                <div className="status-indicator">
                                    <span className="status-dot pending"></span>
                                    <span>ATR: Due in 30 days</span>
                                </div>
                            </div>
                            <div className="compliance-card">
                                <h3>B-BBEE Impact</h3>
                                <div className="bbee-score">
                                    <div className="score-circle">
                                        <span>85%</span>
                                    </div>
                                    <p>Skills Development Score</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Training Calendar Section */}
                    <section className="training-calendar">
                        <div className="section-header">
                            <h2>Training Schedule</h2>
                            <button className="btn-primary" onClick={handleAddTraining}>
                                <i className="fas fa-plus"></i>
                                Add Training
                            </button>
                        </div>
                        
                        {trainings.length === 0 ? (
                            <div className="empty-state">
                                <i className="fas fa-calendar-plus"></i>
                                <h3>No Training Scheduled</h3>
                                <p>Start by adding your first training program</p>
                                <button className="btn-primary" onClick={handleAddTraining}>
                                    Add Training
                                </button>
                            </div>
                        ) : (
                            <div className="training-grid">
                                {trainings.map((training) => (
                                    <div key={training.id} className="training-card">
                                        <div className="training-header">
                                            <h3>{training.title}</h3>
                                            <div className="training-actions">
                                                <button 
                                                    className="action-btn edit"
                                                    onClick={() => handleEditTraining(training)}
                                                >
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                                <button 
                                                    className="action-btn delete"
                                                    onClick={() => handleDeleteTraining(training.id)}
                                                >
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="training-details">
                                            <div className="detail-item">
                                                <i className="fas fa-calendar"></i>
                                                <span>Start: {training.startDate}</span>
                                            </div>
                                            {training.endDate && (
                                                <div className="detail-item">
                                                    <i className="fas fa-calendar-check"></i>
                                                    <span>End: {training.endDate}</span>
                                                </div>
                                            )}
                                            {training.duration && (
                                                <div className="detail-item">
                                                    <i className="fas fa-clock"></i>
                                                    <span>{training.duration}</span>
                                                </div>
                                            )}
                                            {training.facilitator && (
                                                <div className="detail-item">
                                                    <i className="fas fa-user"></i>
                                                    <span>{training.facilitator}</span>
                                                </div>
                                            )}
                                            {training.location && (
                                                <div className="detail-item">
                                                    <i className="fas fa-map-marker-alt"></i>
                                                    <span>{training.location}</span>
                                                </div>
                                            )}
                                            {training.maxParticipants && (
                                                <div className="detail-item">
                                                    <i className="fas fa-users"></i>
                                                    <span>Max: {training.maxParticipants}</span>
                                                </div>
                                            )}
                                        </div>
                                        {training.description && (
                                            <div className="training-description">
                                                <p>{training.description}</p>
                                            </div>
                                        )}
                                        <div className="training-status">
                                            <span className={`status-badge ${training.status.toLowerCase().replace(' ', '-')}`}>
                                                {training.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </>
            )}

            {/* Training Form Modal */}
            {showTrainingForm && <TrainingForm />}
            </div>
        </>
    );

    return (
        <HubSpotLayout 
            title="WSP & Training" 
            description="Manage Workplace Skills Plan and Skills Program training"
        >
            {pageContent}
        </HubSpotLayout>
    );
};

export default WSPTraining; 