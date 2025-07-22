import React, { useState, useEffect } from 'react';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import HubSpotLayout from '../components/HubSpotLayout';
import WelcomeModal from '../components/WelcomeModal';
import './Dashboard.css';
import '../css/WelcomeModal.css';
import { useNavigate } from 'react-router-dom';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
    const [modalMode, setModalMode] = useState('view');
    const [showWelcomeModal, setShowWelcomeModal] = useState(false);
    const [userName, setUserName] = useState('');
    
    // Dashboard metrics state
    const [dashboardMetrics, setDashboardMetrics] = useState({
        leads: 0,
        active_leads: 0,
        conversion_rate: 0,
        total_value: 'R 0'
    });
    const [leadsData, setLeadsData] = useState([]);
    const [quotationsData, setQuotationsData] = useState([]);
    const [showQuotationsModal, setShowQuotationsModal] = useState(false);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    // Load dashboard data from API
    useEffect(() => {
        loadDashboardData();
        
        // Check if user just logged in and show welcome modal
        const storedUserName = localStorage.getItem('userName');
        if (storedUserName) {
            setUserName(storedUserName);
            // Show welcome modal on first visit
            const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
            if (!hasSeenWelcome) {
                setTimeout(() => {
                    setShowWelcomeModal(true);
                    localStorage.setItem('hasSeenWelcome', 'true');
                }, 1000);
            }
        }
        
        // Refresh dashboard data every 30 seconds
        const interval = setInterval(() => {
            loadDashboardData();
        }, 30000);
        
        return () => clearInterval(interval);
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            
            // Calculate metrics from localStorage data
            const leadsData = JSON.parse(localStorage.getItem('leadsData') || '[]');
            const totalLeads = leadsData.filter(lead => lead.status === 'new' || lead.status === 'pending').length;
            const activeLeads = leadsData.filter(lead => lead.status === 'converted').length;
            const conversionRate = totalLeads > 0 ? ((activeLeads / totalLeads) * 100).toFixed(1) : 0;
            const totalValue = leadsData
                .filter(lead => lead.status === 'converted')
                .reduce((sum, lead) => sum + (parseFloat(lead.estimated_value) || 0), 0);
            
            setDashboardMetrics({
                leads: totalLeads,
                active_leads: activeLeads,
                conversion_rate: parseFloat(conversionRate),
                total_value: `R ${(totalValue / 1000000).toFixed(1)}M`
            });
            
            setLeadsData(leadsData.slice(-5));
            setQuotationsData(leadsData.filter(lead => lead.status === 'converted').slice(-5));
            
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            setDashboardMetrics({
                leads: 342,
                active_leads: 128,
                conversion_rate: 37.4,
                total_value: 'R 2.5M'
            });
        } finally {
            setLoading(false);
        }
    };

    const refreshDashboard = () => {
        loadDashboardData();
    };

    const handleMetricClick = (metricType) => {
        switch (metricType) {
            case 'leads':
                navigate('/leads');
                break;
            case 'active_leads':
                setQuotationsData(JSON.parse(localStorage.getItem('leadsData') || '[]').filter(lead => lead.status === 'converted'));
                setShowQuotationsModal(true);
                break;
            case 'conversion_rate':
                alert(`Current conversion rate: ${dashboardMetrics.conversion_rate}%`);
                break;
            case 'total_value':
                alert(`Total quotation value: ${dashboardMetrics.total_value}`);
                break;
            case 'management_fee':
                alert(`Management & Delivery Fee: R 45,000`);
                break;
            default:
                break;
        }
    };

    // Chart configurations
    const leadsChartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: 'New Leads',
            data: [85, 79, 95, 91, 76, 75],
            borderColor: '#4CAF50',
            backgroundColor: 'rgba(76, 175, 80, 0.2)',
            tension: 0.4,
            fill: true
        }]
    };

    const leadsOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: 'Monthly Lead Generation',
                font: { size: 16, weight: '600' },
                color: '#2c3e50'
            },
            legend: {
                position: 'top',
                labels: {
                    padding: 20,
                    usePointStyle: true,
                    font: { size: 12 }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: 'rgba(0,0,0,0.05)' },
                ticks: { color: '#7f8c8d' }
            },
            x: {
                grid: { color: 'rgba(0,0,0,0.05)' },
                ticks: { color: '#7f8c8d' }
            }
        }
    };

    const revenueData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: 'Monthly Revenue',
            data: [250000, 280000, 320000, 295000, 340000, 380000],
            borderColor: '#2196F3',
            backgroundColor: 'rgba(33, 150, 243, 0.2)',
            tension: 0.4,
            fill: true
        }]
    };

    const revenueOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: 'Monthly Revenue Trends',
                font: { size: 16, weight: '600' },
                color: '#2c3e50'
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function(value) {
                        return 'R ' + (value / 1000) + 'K';
                    },
                    color: '#7f8c8d'
                },
                grid: { color: 'rgba(0,0,0,0.05)' }
            },
            x: {
                grid: { color: 'rgba(0,0,0,0.05)' },
                ticks: { color: '#7f8c8d' }
            }
        }
    };

    const setaData = {
        labels: ['WRSETA', 'CHIETA', 'BANKSETA', 'FASSET', 'CETA'],
        datasets: [{
            data: [35, 30, 25, 15, 15],
            backgroundColor: [
                '#4CAF50',
                '#2196F3',
                '#FF9800',
                '#9C27B0',
                '#F44336'
            ],
            borderWidth: 0
        }]
    };

    const setaOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: 'Client Distribution by SETA',
                font: { size: 16, weight: '600' },
                color: '#2c3e50'
            },
            legend: {
                position: 'bottom',
                labels: {
                    padding: 15,
                    usePointStyle: true,
                    font: { size: 12 }
                }
            }
        }
    };

    const serviceData = {
        labels: ['WSP', 'HR', 'Both WSP & HR'],
        datasets: [{
            label: 'Number of Clients',
            data: [55, 40, 35],
            backgroundColor: [
                'rgba(76, 175, 80, 0.8)',
                'rgba(33, 150, 243, 0.8)',
                'rgba(255, 152, 0, 0.8)'
            ],
            borderColor: [
                '#4CAF50',
                '#2196F3',
                '#FF9800'
            ],
            borderWidth: 2
        }]
    };

    const serviceOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: 'Service Type Distribution',
                font: { size: 16, weight: '600' },
                color: '#2c3e50'
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: 'rgba(0,0,0,0.05)' },
                ticks: { color: '#7f8c8d' }
            },
            x: {
                grid: { color: 'rgba(0,0,0,0.05)' },
                ticks: { color: '#7f8c8d' }
            }
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString();
    };

    const formatCurrency = (amount) => {
        if (!amount) return 'R 0.00';
        return new Intl.NumberFormat('en-ZA', {
            style: 'currency',
            currency: 'ZAR'
        }).format(amount);
    };



    return (
        <HubSpotLayout>
            <div className="hubspot-dashboard">

                {/* Key Metrics Cards */}
                <div className="metrics-section">
                    <div className="metrics-grid">
                        <div 
                            className="metric-card" 
                            onClick={() => handleMetricClick('leads')}
                        >
                            <div className="metric-icon">
                                <i className="fas fa-users"></i>
                            </div>
                            <div className="metric-content">
                                <h3 className="metric-value">{loading ? '...' : dashboardMetrics.leads}</h3>
                                <p className="metric-label">Total Leads</p>
                                <span className="metric-change positive">+18% this month</span>
                            </div>
                        </div>

                        <div 
                            className="metric-card" 
                            onClick={() => handleMetricClick('active_leads')}
                        >
                            <div className="metric-icon">
                                <i className="fas fa-handshake"></i>
                            </div>
                            <div className="metric-content">
                                <h3 className="metric-value">{loading ? '...' : dashboardMetrics.active_leads}</h3>
                                <p className="metric-label">Active Leads</p>
                                <span className="metric-change positive">+15% this month</span>
                            </div>
                        </div>

                        <div 
                            className="metric-card" 
                            onClick={() => handleMetricClick('conversion_rate')}
                        >
                            <div className="metric-icon">
                                <i className="fas fa-chart-line"></i>
                            </div>
                            <div className="metric-content">
                                <h3 className="metric-value">{loading ? '...' : `${dashboardMetrics.conversion_rate}%`}</h3>
                                <p className="metric-label">Conversion Rate</p>
                                <span className="metric-change positive">+12% this month</span>
                            </div>
                        </div>

                        <div 
                            className="metric-card" 
                            onClick={() => handleMetricClick('total_value')}
                        >
                            <div className="metric-icon">
                                <i className="fas fa-dollar-sign"></i>
                            </div>
                            <div className="metric-content">
                                <h3 className="metric-value">{loading ? '...' : dashboardMetrics.total_value}</h3>
                                <p className="metric-label">Total Value</p>
                                <span className="metric-change positive">+25% this month</span>
                            </div>
                        </div>

                        <div 
                            className="metric-card" 
                            onClick={() => handleMetricClick('management_fee')}
                        >
                            <div className="metric-icon">
                                <i className="fas fa-cogs"></i>
                            </div>
                            <div className="metric-content">
                                <h3 className="metric-value">{loading ? '...' : 'R 45,000'}</h3>
                                <p className="metric-label">Management & Delivery Fee</p>
                                <span className="metric-change positive">+8% this month</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="charts-section">
                    <div className="charts-grid">
                        <div className="chart-card">
                            <div className="chart-header">
                                <h3>Revenue Trends</h3>
                                <div className="chart-actions">
                                    <button className="chart-btn">
                                        <i className="fas fa-download"></i>
                                    </button>
                                    <button className="chart-btn">
                                        <i className="fas fa-expand"></i>
                                    </button>
                                </div>
                            </div>
                            <div className="chart-container">
                                <Line data={revenueData} options={revenueOptions} />
                            </div>
                        </div>

                        <div className="chart-card">
                            <div className="chart-header">
                                <h3>SETA Distribution</h3>
                                <div className="chart-actions">
                                    <button className="chart-btn">
                                        <i className="fas fa-download"></i>
                                    </button>
                                    <button className="chart-btn">
                                        <i className="fas fa-expand"></i>
                                    </button>
                                </div>
                            </div>
                            <div className="chart-container">
                                <Doughnut data={setaData} options={setaOptions} />
                            </div>
                        </div>

                        <div className="chart-card">
                            <div className="chart-header">
                                <h3>Service Types</h3>
                                <div className="chart-actions">
                                    <button className="chart-btn">
                                        <i className="fas fa-download"></i>
                                    </button>
                                    <button className="chart-btn">
                                        <i className="fas fa-expand"></i>
                                    </button>
                                </div>
                            </div>
                            <div className="chart-container">
                                <Bar data={serviceData} options={serviceOptions} />
                            </div>
                        </div>
                    </div>
                </div>



            </div>

            {/* Active Leads Modal */}
            {showQuotationsModal && (
                <div className="hubspot-modal-overlay">
                    <div className="hubspot-modal">
                        <div className="modal-header">
                            <h2>Active Leads</h2>
                            <button className="modal-close" onClick={() => setShowQuotationsModal(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="modal-body">
                            <table className="hubspot-table">
                                <thead>
                                    <tr>
                                        <th>Company</th>
                                        <th>Contact Person</th>
                                        <th>Position</th>
                                        <th>Service</th>
                                        <th>Estimated Value</th>
                                        <th>SETA</th>
                                        <th>Created Date</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {quotationsData.map((lead) => (
                                        <tr key={lead.id}>
                                            <td>{lead.company_name}</td>
                                            <td>{lead.contact_person}</td>
                                            <td>{lead.contact_position}</td>
                                            <td>{lead.service_interest}</td>
                                            <td className="currency">{formatCurrency(lead.estimated_value)}</td>
                                            <td>{lead.seta}</td>
                                            <td>{formatDate(lead.created_date)}</td>
                                            <td>
                                                <span className={`status-badge ${lead.status}`}>
                                                    {lead.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {quotationsData.length === 0 && (
                                        <tr>
                                            <td colSpan="8" style={{textAlign: 'center'}}>
                                                No active leads found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Welcome Modal */}
            <WelcomeModal 
                isOpen={showWelcomeModal}
                onClose={() => setShowWelcomeModal(false)}
                userName={userName}
            />
        </HubSpotLayout>
    );
};

export default Dashboard; 