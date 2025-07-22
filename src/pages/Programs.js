import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HubSpotLayout from '../components/HubSpotLayout';
import '../css/Programs.css';

const Programs = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('modules');
    const [searchTerm, setSearchTerm] = useState('');

    // Sample modules data
    const modulesData = [
        {
            id: 1,
            name: 'Calling ethos',
            status: 'In Progress',
            dates: 'Jan 1, 2024 - Jan 31, 2027',
            groups: 4,
            credits: 11,
            hours: 45,
            wlDays: 30
        },
        {
            id: 2,
            name: 'Cold Calling',
            status: 'In Progress',
            dates: 'Jan 1, 2024 - Jan 14, 2027',
            groups: 1,
            credits: 4,
            hours: 10,
            wlDays: 20
        },
        {
            id: 3,
            name: 'Dealing with customers',
            status: 'In Progress',
            dates: 'Jan 1, 2024 - Jan 23, 2027',
            groups: 2,
            credits: 10,
            hours: 30,
            wlDays: 20
        }
    ];

    const filteredModules = modulesData.filter(module =>
        module.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const pageContent = (
        <>
            {/* Top Bar */}
            <div className="top-bar">
                <div className="breadcrumb">
                    <span className="back-arrow">&lt;</span>
                    <a href="#" className="back-link">Back</a>
                    <span className="separator">|</span>
                    <span className="current-page">PROGRAMME</span>
                </div>
                <div className="settings-link">
                    <svg className="settings-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    <span>Programme Settings</span>
                </div>
            </div>

            {/* Header Section */}
            <h1 className="program-title">Customer Success Management</h1>

            {/* Program Info Cards */}
            <div className="info-cards">
                <div className="info-card">
                    <p className="card-label">In Progress</p>
                    <p className="card-value">1/1/2024 - 31/1/2027</p>
                </div>
                <div className="info-card">
                    <p className="card-label">Learners</p>
                    <p className="card-value">20 Learners</p>
                </div>
                <div className="info-card">
                    <p className="card-label">Credits</p>
                    <p className="card-value">30 Credits</p>
                </div>
                <div className="info-card">
                    <p className="card-label">Location</p>
                    <p className="card-value">Durban, South Africa</p>
                </div>
            </div>

            {/* Metrics Section */}
            <div className="metrics-section">
                <div className="metrics-grid">
                    <div className="metric-item">
                        <p className="metric-value primary">20/100</p>
                        <p className="metric-label">Learners</p>
                    </div>
                    <div className="metric-item">
                        <p className="metric-value">8</p>
                        <p className="metric-label">Completed</p>
                    </div>
                    <div className="metric-item">
                        <p className="metric-value">0</p>
                        <p className="metric-label">Drop-Offs</p>
                    </div>
                    <div className="metric-item">
                        <p className="metric-value">0</p>
                        <p className="metric-label">AI Roll</p>
                    </div>
                </div>
            </div>

            {/* Modules Section */}
            <div className="modules-section">
                <div className="modules-header">
                    <h2 className="modules-title">Modules</h2>
                    <button className="add-module-btn">
                        + Add Module
                    </button>
                </div>

                {/* Tabs */}
                <div className="tabs-container">
                    <button 
                        className={`tab ${activeTab === 'modules' ? 'active' : ''}`}
                        onClick={() => setActiveTab('modules')}
                    >
                        Modules
                    </button>
                    <button 
                        className={`tab ${activeTab === 'workplace' ? 'active' : ''}`}
                        onClick={() => setActiveTab('workplace')}
                    >
                        Workplace Experience
                    </button>
                    <button 
                        className={`tab ${activeTab === 'schedule' ? 'active' : ''}`}
                        onClick={() => setActiveTab('schedule')}
                    >
                        Schedule
                    </button>
                    <button 
                        className={`tab ${activeTab === 'learners' ? 'active' : ''}`}
                        onClick={() => setActiveTab('learners')}
                    >
                        Learners
                    </button>
                    <button 
                        className={`tab ${activeTab === 'groups' ? 'active' : ''}`}
                        onClick={() => setActiveTab('groups')}
                    >
                        Groups
                    </button>
                </div>

                {/* Search Bar */}
                <div className="search-container">
                    <input 
                        type="text" 
                        placeholder="Search..." 
                        className="search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                </div>

                {/* Modules Table */}
                <div className="table-container">
                    <table className="modules-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Status</th>
                                <th>Dates</th>
                                <th>Groups</th>
                                <th>Credits</th>
                                <th>Hours</th>
                                <th>WL Days</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredModules.map((module) => (
                                <tr key={module.id}>
                                    <td className="module-name">{module.name}</td>
                                    <td>
                                        <span className="status-badge in-progress">{module.status}</span>
                                    </td>
                                    <td>{module.dates}</td>
                                    <td>{module.groups}</td>
                                    <td>{module.credits}</td>
                                    <td>{module.hours}</td>
                                    <td>{module.wlDays}</td>
                                    <td className="actions-cell">
                                        <a href="#" className="action-link">...</a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );

    return (
        <HubSpotLayout title="Programs" description="Manage your training programs and modules.">
            {pageContent}
        </HubSpotLayout>
    );
};

export default Programs; 