import React, { useState } from 'react';
import HubSpotLayout from '../components/HubSpotLayout';
import '../css/Reports.css';

const Reports = () => {
    const [selectedReport, setSelectedReport] = useState('overview');
    const [dateRange, setDateRange] = useState('month');

    // Function to get active clients count
    const getActiveClientsCount = () => {
        const clientsData = JSON.parse(localStorage.getItem('clientsData') || '[]');
        const activeClients = clientsData.filter(client => {
            const status = (client.status || '').toLowerCase();
            return status === 'active' || status === 'converted' || !status;
        });
        return activeClients.length;
    };

    // Function to get total revenue from active clients
    const getActiveClientsRevenue = () => {
        const clientsData = JSON.parse(localStorage.getItem('clientsData') || '[]');
        const activeClients = clientsData.filter(client => {
            const status = (client.status || '').toLowerCase();
            return status === 'active' || status === 'converted' || !status;
        });
        return activeClients.reduce((sum, client) => sum + (parseFloat(client.totalValue) || 0), 0);
    };

    // Function to get new leads count
    const getNewLeadsCount = () => {
        const leadsData = JSON.parse(localStorage.getItem('leadsData') || '[]');
        return leadsData.filter(lead => lead.status === 'new' || lead.status === 'pending').length;
    };

    const reports = [
        { id: 'overview', name: 'Overview Dashboard', icon: 'fas fa-chart-pie', color: '#10b981' },
        { id: 'leads', name: 'Leads Analysis', icon: 'fas fa-lightbulb', color: '#3b82f6' },
        { id: 'clients', name: 'Client Performance', icon: 'fas fa-users', color: '#f59e0b' },
        { id: 'accreditation', name: 'Accreditation Status', icon: 'fas fa-certificate', color: '#8b5cf6' },
        { id: 'training', name: 'Training Metrics', icon: 'fas fa-graduation-cap', color: '#ef4444' },
        { id: 'financial', name: 'Financial Reports', icon: 'fas fa-dollar-sign', color: '#06b6d4' }
    ];

    const renderOverviewDashboard = () => (
        <div className="dashboard-overview">
            {/* Header Stats */}
            <div className="stats-header">
                <div className="stat-card primary">
                    <div className="stat-icon">
                        <i className="fas fa-chart-line"></i>
                    </div>
                    <div className="stat-content">
                        <h3>Total Revenue</h3>
                        <div className="stat-value">R {getActiveClientsRevenue().toLocaleString()}</div>
                        <div className="stat-change positive">
                            <i className="fas fa-arrow-up"></i>
                            <span>+18.5% vs last month</span>
                        </div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">
                        <i className="fas fa-users"></i>
                    </div>
                    <div className="stat-content">
                        <h3>Active Clients</h3>
                        <div className="stat-value">{getActiveClientsCount()}</div>
                        <div className="stat-change positive">
                            <i className="fas fa-arrow-up"></i>
                            <span>+12 this month</span>
                        </div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">
                        <i className="fas fa-lightbulb"></i>
                    </div>
                    <div className="stat-content">
                        <h3>New Leads</h3>
                        <div className="stat-value">{getNewLeadsCount()}</div>
                        <div className="stat-change positive">
                            <i className="fas fa-arrow-up"></i>
                            <span>+23 this month</span>
                        </div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">
                        <i className="fas fa-certificate"></i>
                    </div>
                    <div className="stat-content">
                        <h3>Accreditations</h3>
                        <div className="stat-value">23</div>
                        <div className="stat-change neutral">
                            <i className="fas fa-minus"></i>
                            <span>No change</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Performance Metrics */}
            <div className="performance-section">
                <h3>Performance Metrics</h3>
                <div className="metrics-grid">
                    <div className="metric-item">
                        <div className="metric-header">
                            <i className="fas fa-bullseye"></i>
                            <span>Conversion Rate</span>
                        </div>
                        <div className="metric-value">23.4%</div>
                        <div className="metric-bar">
                            <div className="bar-fill" style={{width: '23.4%'}}></div>
                        </div>
                        <div className="metric-change positive">+2.1%</div>
                    </div>
                    <div className="metric-item">
                        <div className="metric-header">
                            <i className="fas fa-clock"></i>
                            <span>Response Time</span>
                        </div>
                        <div className="metric-value">2.3 hrs</div>
                        <div className="metric-bar">
                            <div className="bar-fill" style={{width: '65%'}}></div>
                        </div>
                        <div className="metric-change negative">+0.5 hrs</div>
                    </div>
                    <div className="metric-item">
                        <div className="metric-header">
                            <i className="fas fa-star"></i>
                            <span>Client Satisfaction</span>
                        </div>
                        <div className="metric-value">4.8/5</div>
                        <div className="metric-bar">
                            <div className="bar-fill" style={{width: '96%'}}></div>
                        </div>
                        <div className="metric-change positive">+0.2</div>
                    </div>
                    <div className="metric-item">
                        <div className="metric-header">
                            <i className="fas fa-chart-line"></i>
                            <span>Growth Rate</span>
                        </div>
                        <div className="metric-value">15.2%</div>
                        <div className="metric-bar">
                            <div className="bar-fill" style={{width: '76%'}}></div>
                        </div>
                        <div className="metric-change positive">+3.1%</div>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="activity-section">
                <h3>Recent Activity</h3>
                <div className="activity-list">
                    <div className="activity-item">
                        <div className="activity-icon success">
                            <i className="fas fa-user-plus"></i>
                        </div>
                        <div className="activity-content">
                            <h4>New Client Onboarded</h4>
                            <p>ABC Corporation signed up for premium package</p>
                            <span className="activity-time">2 hours ago</span>
                        </div>
                    </div>
                    <div className="activity-item">
                        <div className="activity-icon info">
                            <i className="fas fa-certificate"></i>
                        </div>
                        <div className="activity-content">
                            <h4>Accreditation Renewed</h4>
                            <p>SETAS accreditation successfully renewed for 2024</p>
                            <span className="activity-time">1 day ago</span>
                        </div>
                    </div>
                    <div className="activity-item">
                        <div className="activity-icon warning">
                            <i className="fas fa-exclamation-triangle"></i>
                        </div>
                        <div className="activity-content">
                            <h4>Lead Follow-up Required</h4>
                            <p>15 leads pending follow-up from sales team</p>
                            <span className="activity-time">3 days ago</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderLeadsAnalysis = () => (
        <div className="leads-analysis">
            <div className="analysis-header">
                <h3>Lead Source Breakdown</h3>
                <div className="date-filter">
                    <select value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
                        <option value="week">Last Week</option>
                        <option value="month">Last Month</option>
                        <option value="quarter">Last Quarter</option>
                        <option value="year">Last Year</option>
                    </select>
                </div>
            </div>

            <div className="leads-overview">
                <div className="leads-stats">
                    <div className="lead-stat">
                        <div className="stat-number">1,247</div>
                        <div className="stat-label">Total Leads</div>
                        <div className="stat-trend positive">+12% vs last period</div>
                    </div>
                    <div className="lead-stat">
                        <div className="stat-number">234</div>
                        <div className="stat-label">Converted</div>
                        <div className="stat-trend positive">+8% vs last period</div>
                    </div>
                    <div className="lead-stat">
                        <div className="stat-number">18.8%</div>
                        <div className="stat-label">Conversion Rate</div>
                        <div className="stat-trend positive">+2.1% vs last period</div>
                    </div>
                </div>

                <div className="source-breakdown">
                    <h4>Lead Sources</h4>
                    <div className="source-chart">
                        <div className="source-item">
                            <div className="source-info">
                                <span className="source-name">Website</span>
                                <span className="source-count">456 leads</span>
                            </div>
                            <div className="source-bar">
                                <div className="bar-fill" style={{width: '45%'}}></div>
                            </div>
                            <span className="source-percentage">45%</span>
                        </div>
                        <div className="source-item">
                            <div className="source-info">
                                <span className="source-name">Referrals</span>
                                <span className="source-count">234 leads</span>
                            </div>
                            <div className="source-bar">
                                <div className="bar-fill" style={{width: '28%'}}></div>
                            </div>
                            <span className="source-percentage">28%</span>
                        </div>
                        <div className="source-item">
                            <div className="source-info">
                                <span className="source-name">Social Media</span>
                                <span className="source-count">189 leads</span>
                            </div>
                            <div className="source-bar">
                                <div className="bar-fill" style={{width: '15%'}}></div>
                            </div>
                            <span className="source-percentage">15%</span>
                        </div>
                        <div className="source-item">
                            <div className="source-info">
                                <span className="source-name">Cold Calls</span>
                                <span className="source-count">78 leads</span>
                            </div>
                            <div className="source-bar">
                                <div className="bar-fill" style={{width: '12%'}}></div>
                            </div>
                            <span className="source-percentage">12%</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="leads-table">
                <h4>Recent Leads</h4>
                <table>
                                <thead>
                                    <tr>
                            <th>Company</th>
                            <th>Contact</th>
                            <th>Source</th>
                                        <th>Value</th>
                            <th>Status</th>
                            <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                            <td>
                                <div className="company-cell">
                                    <div className="company-avatar">TC</div>
                                    <div className="company-info">
                                        <div className="company-name">TechCorp Solutions</div>
                                        <div className="company-industry">Technology</div>
                                    </div>
                                </div>
                            </td>
                            <td>John Smith<br/><small>john@techcorp.com</small></td>
                            <td><span className="source-badge website">Website</span></td>
                            <td>R 45,000</td>
                            <td><span className="status-badge qualified">Qualified</span></td>
                            <td>
                                <button className="action-btn">
                                    <i className="fas fa-eye"></i>
                                </button>
                            </td>
                                    </tr>
                                    <tr>
                            <td>
                                <div className="company-cell">
                                    <div className="company-avatar">MF</div>
                                    <div className="company-info">
                                        <div className="company-name">Manufacturing First</div>
                                        <div className="company-industry">Manufacturing</div>
                                    </div>
                                </div>
                            </td>
                            <td>Sarah Johnson<br/><small>sarah@mfgfirst.com</small></td>
                            <td><span className="source-badge referral">Referral</span></td>
                            <td>R 78,000</td>
                            <td><span className="status-badge contacted">Contacted</span></td>
                            <td>
                                <button className="action-btn">
                                    <i className="fas fa-eye"></i>
                                </button>
                            </td>
                                    </tr>
                                    <tr>
                            <td>
                                <div className="company-cell">
                                    <div className="company-avatar">ED</div>
                                    <div className="company-info">
                                        <div className="company-name">EduTech Dynamics</div>
                                        <div className="company-industry">Education</div>
                                    </div>
                                </div>
                            </td>
                            <td>Mike Davis<br/><small>mike@edutech.com</small></td>
                            <td><span className="source-badge social">Social Media</span></td>
                            <td>R 32,000</td>
                            <td><span className="status-badge new">New</span></td>
                            <td>
                                <button className="action-btn">
                                    <i className="fas fa-eye"></i>
                                </button>
                            </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                );

    const renderClientPerformance = () => (
        <div className="client-performance">
            <div className="performance-header">
                <h3>Client Performance Overview</h3>
                <div className="performance-summary">
                    <div className="summary-item">
                        <div className="summary-number">89</div>
                        <div className="summary-label">Active Clients</div>
                    </div>
                    <div className="summary-item">
                        <div className="summary-number">94%</div>
                        <div className="summary-label">Retention Rate</div>
                    </div>
                    <div className="summary-item">
                        <div className="summary-number">R 2.4M</div>
                        <div className="summary-label">Total Revenue</div>
                    </div>
                </div>
            </div>

            <div className="client-segments">
                <h4>Client Segments</h4>
                <div className="segments-grid">
                    <div className="segment-card premium">
                        <div className="segment-header">
                            <i className="fas fa-crown"></i>
                            <h5>Premium Clients</h5>
                        </div>
                        <div className="segment-stats">
                            <div className="segment-number">23</div>
                            <div className="segment-percentage">26%</div>
                        </div>
                        <div className="segment-revenue">R 1.2M Revenue</div>
                    </div>
                    <div className="segment-card standard">
                        <div className="segment-header">
                            <i className="fas fa-building"></i>
                            <h5>Standard Clients</h5>
                        </div>
                        <div className="segment-stats">
                            <div className="segment-number">45</div>
                            <div className="segment-percentage">51%</div>
                        </div>
                        <div className="segment-revenue">R 850K Revenue</div>
                    </div>
                    <div className="segment-card basic">
                        <div className="segment-header">
                            <i className="fas fa-user"></i>
                            <h5>Basic Clients</h5>
                        </div>
                        <div className="segment-stats">
                            <div className="segment-number">21</div>
                            <div className="segment-percentage">23%</div>
                        </div>
                        <div className="segment-revenue">R 350K Revenue</div>
                    </div>
                </div>
            </div>

            <div className="top-clients">
                <h4>Top Performing Clients</h4>
                <div className="clients-list">
                    <div className="client-item">
                        <div className="client-rank">1</div>
                        <div className="client-info">
                            <div className="client-name">TechCorp Solutions</div>
                            <div className="client-package">Premium Package</div>
                        </div>
                        <div className="client-revenue">R 180,000</div>
                        <div className="client-growth positive">+15%</div>
                    </div>
                    <div className="client-item">
                        <div className="client-rank">2</div>
                        <div className="client-info">
                            <div className="client-name">Manufacturing First</div>
                            <div className="client-package">Standard Package</div>
                        </div>
                        <div className="client-revenue">R 145,000</div>
                        <div className="client-growth positive">+8%</div>
                    </div>
                    <div className="client-item">
                        <div className="client-rank">3</div>
                        <div className="client-info">
                            <div className="client-name">EduTech Dynamics</div>
                            <div className="client-package">Premium Package</div>
                        </div>
                        <div className="client-revenue">R 132,000</div>
                        <div className="client-growth positive">+12%</div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderReportContent = () => {
        switch(selectedReport) {
            case 'overview':
                return renderOverviewDashboard();
            case 'leads':
                return renderLeadsAnalysis();
            case 'clients':
                return renderClientPerformance();
            case 'financial':
                return (
                    <div className="financial-reports">
                        <h3>Financial Performance</h3>
                        <div className="financial-overview">
                            <div className="financial-card primary">
                                <div className="financial-icon">
                                    <i className="fas fa-dollar-sign"></i>
                                </div>
                                <div className="financial-content">
                                    <h4>Total Revenue</h4>
                                    <div className="financial-value">R 2,450,000</div>
                                    <div className="financial-change positive">
                                        <i className="fas fa-arrow-up"></i>
                                        <span>+18.5% vs last year</span>
                                    </div>
                                </div>
                            </div>
                            <div className="financial-card">
                                <div className="financial-icon">
                                    <i className="fas fa-chart-pie"></i>
                                </div>
                                <div className="financial-content">
                                    <h4>Profit Margin</h4>
                                    <div className="financial-value">32.4%</div>
                                    <div className="financial-change positive">
                                        <i className="fas fa-arrow-up"></i>
                                        <span>+2.1% vs last year</span>
                                    </div>
                                </div>
                            </div>
                            <div className="financial-card">
                                <div className="financial-icon">
                                    <i className="fas fa-trending-up"></i>
                                </div>
                                <div className="financial-content">
                                    <h4>Growth Rate</h4>
                                    <div className="financial-value">15.2%</div>
                                    <div className="financial-change positive">
                                        <i className="fas fa-arrow-up"></i>
                                        <span>+3.8% vs last year</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            default:
                return (
                    <div className="coming-soon">
                        <div className="coming-soon-icon">
                            <i className="fas fa-tools"></i>
                        </div>
                        <h3>Report Under Development</h3>
                        <p>This report is currently being developed and will be available soon.</p>
                        <div className="progress-indicator">
                            <div className="progress-bar">
                                <div className="progress-fill" style={{width: '65%'}}></div>
                            </div>
                            <span className="progress-text">65% Complete</span>
                        </div>
                    </div>
                );
        }
    };

    return (
        <HubSpotLayout 
            title="Reports & Analytics" 
            description="Comprehensive business insights and performance metrics"
            actions={[
                {
                    label: 'Export Report',
                    variant: 'secondary',
                    icon: 'fas fa-download',
                    onClick: () => console.log('Export clicked')
                },
                {
                    label: 'Generate Report',
                    variant: 'primary',
                    icon: 'fas fa-chart-bar',
                    onClick: () => console.log('Generate clicked')
                }
            ]}
        >
            <div className="reports-container">
                <div className="reports-layout">
                    <div className="reports-sidebar">
                        <h3>Report Types</h3>
                        <ul className="report-types">
                            {reports.map(report => (
                                <li key={report.id}>
                                    <button
                                        className={`report-type-btn ${selectedReport === report.id ? 'active' : ''}`}
                                        onClick={() => setSelectedReport(report.id)}
                                        style={{'--accent-color': report.color}}
                                    >
                                        <i className={report.icon}></i>
                                        <span>{report.name}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="reports-main">
                        {renderReportContent()}
                    </div>
                </div>
            </div>
        </HubSpotLayout>
    );
};

export default Reports; 