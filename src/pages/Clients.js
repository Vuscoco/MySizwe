import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import SLAModal from '../components/SLAModal';
import HubSpotLayout from '../components/HubSpotLayout';
import GridCardGuide from '../components/GridCardGuide';
import '../css/Clients.css';

const Clients = () => {
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);
    
    // Client data state
    const [clientsData, setClientsData] = useState([]);
    const [convertedLeadsCount, setConvertedLeadsCount] = useState(0);
    
    // Modal state for client actions
    const [slaModalOpen, setSlaModalOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);
    const [modalMode, setModalMode] = useState('view'); // 'view', 'edit'
    const [activeTab, setActiveTab] = useState('all'); // 'all', 'seta', 'industrial'
    const [showGuide, setShowGuide] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showDropdown && !event.target.closest('.dropdown')) {
                setShowDropdown(false);
            }
        };

        if (showDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showDropdown]);

    // Load data from localStorage on component mount
    useEffect(() => {
        loadClientsData();
        loadConvertedLeadsCount();
    }, []);

    const loadClientsData = () => {
        const storedClients = localStorage.getItem('clientsData');
        if (storedClients) {
            setClientsData(JSON.parse(storedClients));
        }
    };

    const loadConvertedLeadsCount = () => {
        const storedLeads = localStorage.getItem('leadsData');
        if (storedLeads) {
            const leadsData = JSON.parse(storedLeads);
            const convertedLeads = leadsData.filter(lead => lead.status === 'converted');
            setConvertedLeadsCount(convertedLeads.length);
        }
    };

    // Calculate total value from converted leads
    const getConvertedLeadsValue = () => {
        const storedLeads = localStorage.getItem('leadsData');
        if (storedLeads) {
            const leadsData = JSON.parse(storedLeads);
            const convertedLeads = leadsData.filter(lead => lead.status === 'converted');
            return convertedLeads.reduce((sum, lead) => sum + (parseFloat(lead.estimated_value) || 0), 0);
        }
        return 0;
    };

    // Get converted leads data for table display
    const getConvertedLeadsData = () => {
        const storedLeads = localStorage.getItem('leadsData');
        if (storedLeads) {
            const leadsData = JSON.parse(storedLeads);
            return leadsData
                .filter(lead => lead.status === 'converted')
                .map(lead => ({
                    id: `converted-${lead.id}`,
                    clientName: lead.company_name || 'N/A',
                    seta: lead.seta || 'N/A',
                    service: lead.service_interest || 'N/A',
                    status: 'Converted',
                    contactPerson: lead.contact_person || 'N/A',
                    monthlyRetainer: parseFloat(lead.estimated_value) / 12 || 0,
                    totalValue: parseFloat(lead.estimated_value) || 0,
                    lastContact: lead.created_date || 'N/A',
                    isConvertedLead: true,
                    originalLead: lead
                }));
        }
        return [];
    };

    // Filter clients based on active tab
    const getFilteredClients = () => {
        if (activeTab === 'all') {
            return clientsData;
        } else if (activeTab === 'seta') {
            // Filter for SETA-funded clients (created from SETA form or marked as SETA type)
            return clientsData.filter(client => 
                client.clientType === 'seta' || 
                client.createdFrom === 'seta' ||
                (client.seta && client.seta !== 'N/A' && client.seta !== '')
            );
        } else if (activeTab === 'industrial') {
            // Filter for Industrial-funded clients (created from Industrial form)
            return clientsData.filter(client => 
                client.clientType === 'industrial' || 
                client.createdFrom === 'industrial'
            );
        }
        return clientsData;
    };

    // Filter converted leads based on active tab
    const getFilteredConvertedLeads = () => {
        const convertedLeads = getConvertedLeadsData();
        if (activeTab === 'all') {
            return convertedLeads;
        } else if (activeTab === 'seta') {
            // Show converted leads that have SETA information
            return convertedLeads.filter(lead => lead.seta && lead.seta !== 'N/A' && lead.seta !== '');
        } else if (activeTab === 'industrial') {
            // For industrial tab, don't show converted leads as they're typically SETA-funded
            return [];
        }
        return convertedLeads;
    };

    // Get total leads count (only new/pending leads)
    const getTotalLeadsCount = () => {
        const storedLeads = localStorage.getItem('leadsData');
        if (storedLeads) {
            const leadsData = JSON.parse(storedLeads);
            // Count only new and pending leads
            const newLeads = leadsData.filter(lead => lead.status === 'new' || lead.status === 'pending');
            return newLeads.length;
        }
        return 0;
    };

    // Get pending leads count
    const getPendingLeadsCount = () => {
        const storedLeads = localStorage.getItem('leadsData');
        if (storedLeads) {
            const leadsData = JSON.parse(storedLeads);
            return leadsData.filter(lead => lead.status === 'pending' || lead.status === 'new').length;
        }
        return 0;
    };

    // Get overdue leads count
    const getOverdueLeadsCount = () => {
        const storedLeads = localStorage.getItem('leadsData');
        if (storedLeads) {
            const leadsData = JSON.parse(storedLeads);
            const today = new Date();
            return leadsData.filter(lead => {
                if (lead.status === 'converted') return false; // Exclude converted leads
                if (!lead.next_follow_up) return false;
                const followUpDate = new Date(lead.next_follow_up);
                return followUpDate < today;
            }).length;
        }
        return 0;
    };

    // Function to add new client data
    const addNewClient = (clientData) => {
        const newClient = {
            id: Date.now(), // Simple ID generation
            clientName: clientData.clientName || '',
            clientReg: clientData.clientReg || '',
            clientAddress: clientData.clientAddress || '',
            seta: clientData.seta?.toUpperCase() || '',
            service: clientData.service?.toUpperCase() || '',
            status: 'Active', // Default status
            contactPerson: clientData.contactPerson || '',
            contactPosition: clientData.contactPosition || '',
            contactPhone: clientData.contactPhone || '',
            contactEmail: clientData.contactEmail || '',
            sdlNumber: clientData.sdlNumber || '',
            moderator: clientData.moderator || '',
            monthlyRetainer: parseFloat(clientData.retainer) || 0,
            paymentTerms: `${clientData.paymentTerms || '30'} Days`,
            qualificationType: clientData.qualificationType || '',
            qualificationLevel: clientData.qualificationLevel || '',
            costPerLearner: parseFloat(clientData.costPerLearner) || 0,
            totalValue: (parseFloat(clientData.retainer) || 0) * 12, // Annual value
            lastContact: new Date().toISOString().split('T')[0],
            nextFollowUp: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 15 days from now
            services: clientData.services || [],
            clientType: clientData.clientType || 'regular',
            createdFrom: clientData.createdFrom || 'regular',
            createdAt: new Date().toISOString()
        };

        const updatedClients = [...clientsData, newClient];
        setClientsData(updatedClients);
        localStorage.setItem('clientsData', JSON.stringify(updatedClients));
    };

    // Listen for storage events to update data when forms are submitted
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'clientsData') {
                loadClientsData();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // Expose functions globally so forms can call them
    useEffect(() => {
        window.addNewClientToClientsPage = addNewClient;
        
        return () => {
            delete window.addNewClientToClientsPage;
        };
    }, [clientsData]);

    // Handle SLA Modal actions
    const handleViewClient = (client) => {
        setSelectedClient(client);
        setModalMode('view');
        setSlaModalOpen(true);
    };

    const handleEditClient = (client) => {
        setSelectedClient(client);
        setModalMode('edit');
        setSlaModalOpen(true);
    };

    const handleSaveClient = (updatedClient) => {
        const updatedClients = clientsData.map(client => 
            client.id === updatedClient.id ? updatedClient : client
        );
        setClientsData(updatedClients);
        localStorage.setItem('clientsData', JSON.stringify(updatedClients));
        setSlaModalOpen(false);
        setSelectedClient(null);
    };

    const handleDeleteClient = (clientId) => {
        // Add confirmation dialog to prevent accidental deletion
        if (!window.confirm('Are you sure you want to delete this client record? This action cannot be undone.')) {
            return; // User cancelled the deletion
        }
        
        const updatedClients = clientsData.filter(client => client.id !== clientId);
        setClientsData(updatedClients);
        localStorage.setItem('clientsData', JSON.stringify(updatedClients));
        setSlaModalOpen(false);
        setSelectedClient(null);
    };

    const handleDeleteConvertedLead = (convertedLeadId) => {
        // Add confirmation dialog to prevent accidental deletion
        if (!window.confirm('Are you sure you want to delete this converted lead? This action cannot be undone.')) {
            return; // User cancelled the deletion
        }
        
        // Remove the converted lead from localStorage
        const storedLeads = localStorage.getItem('leadsData');
        if (storedLeads) {
            const leadsData = JSON.parse(storedLeads);
            const updatedLeads = leadsData.filter(lead => lead.id !== convertedLeadId.replace('converted-', ''));
            localStorage.setItem('leadsData', JSON.stringify(updatedLeads));
        }
        
        // Force a re-render by updating the state
        loadConvertedLeadsCount();
    };



    const closeSlaModal = () => {
        setSlaModalOpen(false);
        setSelectedClient(null);
    };

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    // Combined guide steps: Cards first, then Table
    const combinedGuideSteps = [
        // Info Cards Section
        {
            title: "Active Clients",
            description: "This card shows the total number of active clients in your system, including both converted leads and regular clients.",
            target: ".info-cards .info-card:nth-child(1)"
        },
        {
            title: "Total Value",
            description: "Displays the combined total value of all your clients in Rands. This represents your total portfolio value.",
            target: ".info-cards .info-card:nth-child(2)"
        },
        {
            title: "Monthly Revenue",
            description: "Shows your recurring monthly revenue from all clients. This helps track your steady income stream.",
            target: ".info-cards .info-card:nth-child(3)"
        },
        {
            title: "Total Learners",
            description: "Displays the total number of learners across all your client programs and training initiatives.",
            target: ".info-cards .info-card:nth-child(4)"
        },
        // Metrics Section
        {
            title: "Client Metrics",
            description: "These metrics provide quick insights into your client base, lead pipeline, and follow-up requirements.",
            target: ".metrics-section"
        },
        {
            title: "Client Count",
            description: "Shows your current client count against your target of 50 clients. Track your growth progress here.",
            target: ".metrics-grid .metric-item:nth-child(1)"
        },
        {
            title: "Total Leads",
            description: "The total number of leads in your system. This includes all stages from new to converted.",
            target: ".metrics-grid .metric-item:nth-child(2)"
        },
        {
            title: "Pending Leads",
            description: "Leads that require follow-up or are waiting for a response. These need your attention.",
            target: ".metrics-grid .metric-item:nth-child(3)"
        },
        {
            title: "Overdue Leads",
            description: "Leads that are past their follow-up date. These should be prioritized for immediate action.",
            target: ".metrics-grid .metric-item:nth-child(4)"
        },
        // Table Section
        {
            title: "Client Records Section",
            description: "This is your main client management area. Here you can view, manage, and track all your clients in a comprehensive table format.",
            target: ".modules-section"
        },
        {
            title: "Add Client Button",
            description: "Click this dropdown button to create a new client. Choose between SETA Funded or Industrial Funded clients.",
            target: ".add-module-btn"
        },
        {
            title: "Client Tabs",
            description: "Filter your clients by type: All Clients, SETA Funded, or Industrial Funded. Click to switch between views.",
            target: ".tabs-container"
        },
        {
            title: "Search Function",
            description: "Search through your clients by name, contact person, or any other details. Type to filter results instantly.",
            target: ".search-container"
        },
        {
            title: "Client Name Column",
            description: "Shows the company or organization name for each client. This is the primary identifier for each client record.",
            target: ".modules-table thead th:nth-child(1)"
        },
        {
            title: "Fund Type",
            description: "Displays the funding source for each client (SETA, Industrial, etc.). This helps categorize your clients.",
            target: ".modules-table thead th:nth-child(2)"
        },
        {
            title: "Service Type",
            description: "Shows what type of service or training program the client is enrolled in.",
            target: ".modules-table thead th:nth-child(3)"
        },
        {
            title: "Status",
            description: "Current status of the client relationship (Active, In Progress, Completed, etc.).",
            target: ".modules-table thead th:nth-child(4)"
        },
        {
            title: "Contact Person",
            description: "The main contact person's name for each client. This is who you communicate with.",
            target: ".modules-table thead th:nth-child(5)"
        },
        {
            title: "Monthly Retainer",
            description: "The monthly payment amount from each client. This shows your recurring revenue per client.",
            target: ".modules-table thead th:nth-child(6)"
        },
        {
            title: "Total Value",
            description: "The total contract value for each client. This represents the full value of the client relationship.",
            target: ".modules-table thead th:nth-child(7)"
        },
        {
            title: "Last Contact",
            description: "When you last communicated with the client. Useful for tracking follow-up timing.",
            target: ".modules-table thead th:nth-child(8)"
        },
        // Action Buttons for Converted Leads
        {
            title: "View Lead Details",
            description: "Click this button to view all the details of a converted lead in a popup modal.",
            target: ".action-buttons .btn-icon:first-child"
        },
        {
            title: "Convert to Client",
            description: "This button converts a lead into a full client record. Creates a permanent client profile.",
            target: ".action-buttons .btn-icon:nth-child(2)"
        },
        {
            title: "Delete Converted Lead",
            description: "Removes the converted lead from your system. Use with caution - this action cannot be undone.",
            target: ".action-buttons .btn-icon:last-child"
        },
        // Action Buttons for Regular Clients
        {
            title: "View Client Details",
            description: "Click this button to view all the details of a client in a popup modal.",
            target: ".action-buttons .btn-icon:first-child"
        },
        {
            title: "Edit Client",
            description: "This button opens an edit form where you can modify any client information.",
            target: ".action-buttons .btn-icon:nth-child(2)"
        },
        {
            title: "Delete Client",
            description: "Removes the client from your system. Use with caution - this action cannot be undone.",
            target: ".action-buttons .btn-icon:last-child"
        }
    ];

    const handleGuideComplete = () => {
        setShowGuide(false);
        localStorage.setItem('clientsCombinedGuideSeen', 'true');
    };

    const handleGuideSkip = () => {
        setShowGuide(false);
        localStorage.setItem('clientsCombinedGuideSeen', 'true');
    };

    const startGuide = () => {
        setShowGuide(true);
    };

    // Modern main content matching the HTML mockup design
    const pageContent = (
        <>
            {/* Top Bar */}
            <div className="top-bar">
                <div className="top-bar-actions">
                    <button 
                        className="guide-trigger-btn"
                        onClick={startGuide}
                        title="Start comprehensive guide"
                    >
                        <i className="fas fa-question-circle"></i>
                        <span>Start Guide</span>
                    </button>
                </div>
            </div>

            {/* Header Section */}
            <h1 className="program-title">Client Management</h1>

            {/* Client Info Cards */}
            <div className="info-cards">
                <div className="info-card">
                    <p className="card-label">Active Clients</p>
                    <p className="card-value">{convertedLeadsCount + clientsData.length} Clients</p>
                </div>
                <div className="info-card">
                    <p className="card-label">Total Value</p>
                    <p className="card-value">R {(clientsData.reduce((sum, client) => sum + (client.totalValue || 0), 0) + getConvertedLeadsValue()).toLocaleString()}</p>
                </div>
                <div className="info-card">
                    <p className="card-label">Monthly Revenue</p>
                    <p className="card-value">R {(clientsData.reduce((sum, client) => sum + (client.monthlyRetainer || 0), 0) + (getConvertedLeadsValue() / 12)).toLocaleString()}</p>
                </div>
                <div className="info-card">
                    <p className="card-label">Total Learners</p>
                    <p className="card-value">120 Learners</p>
                </div>
            </div>

            {/* Metrics Section */}
            <div className="metrics-section">
                <div className="metrics-grid">
                    <div className="metric-item">
                        <p className="metric-value primary">{convertedLeadsCount + clientsData.length}/50</p>
                        <p className="metric-label">Clients</p>
                    </div>
                    <div className="metric-item">
                        <p className="metric-value">{getTotalLeadsCount()}</p>
                        <p className="metric-label">Total Leads</p>
                    </div>
                    <div className="metric-item">
                        <p className="metric-value">{getPendingLeadsCount()}</p>
                        <p className="metric-label">Pending</p>
                    </div>
                    <div className="metric-item">
                        <p className="metric-value">{getOverdueLeadsCount()}</p>
                        <p className="metric-label">Overdue</p>
                    </div>
                </div>
            </div>

            {/* Clients Section */}
            <div className="modules-section">
                <div className="modules-header">
                    <h2 className="modules-title">Client Records</h2>
                    <div className="header-actions">
                        <div className={`dropdown ${showDropdown ? 'show' : ''}`}>
                            <button className="add-module-btn" onClick={toggleDropdown}>
                                + Add Client
                            </button>
                            <div className="dropdown-content">
                                <Link to="/client-creation">
                                    <i className="fas fa-users"></i> SETA Funded
                                </Link>
                                <Link to="/industrial-client-creation">
                                    <i className="fas fa-industry"></i> Industrial Funded
                                </Link>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Tabs */}
                <div className="tabs-container">
                    <button 
                        className={`tab ${activeTab === 'all' ? 'active' : ''}`}
                        onClick={() => setActiveTab('all')}
                    >
                        All Clients
                    </button>
                    <button 
                        className={`tab ${activeTab === 'seta' ? 'active' : ''}`}
                        onClick={() => setActiveTab('seta')}
                    >
                        SETA Funded
                    </button>
                    <button 
                        className={`tab ${activeTab === 'industrial' ? 'active' : ''}`}
                        onClick={() => setActiveTab('industrial')}
                    >
                        Industrial Funded
                    </button>
                </div>

                {/* Search Bar */}
                <div className="search-container">
                    <input 
                        type="text" 
                        placeholder="Search clients..." 
                        className="search-input"
                    />
                    <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                </div>

                {/* Clients Table */}
                <div className="table-container">
                    <table className="modules-table">
                        <thead>
                            <tr>
                                <th>Client Name</th>
                                <th>Fund</th>
                                <th>Service</th>
                                <th>Status</th>
                                <th>Contact Person</th>
                                <th>Monthly Retainer</th>
                                <th>Total Value</th>
                                <th>Last Contact</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Converted leads data */}
                            {getFilteredConvertedLeads().map((convertedLead) => (
                                <tr 
                                    key={convertedLead.id}
                                    className="client-row clickable"
                                    onClick={() => handleViewClient(convertedLead)}
                                >
                                    <td className="module-name">
                                        {convertedLead.clientName}
                                        <span className="converted-badge">Converted</span>
                                    </td>
                                    <td>{convertedLead.seta}</td>
                                    <td>{convertedLead.service}</td>
                                    <td>
                                        <span className="status-badge converted">{convertedLead.status}</span>
                                    </td>
                                    <td>{convertedLead.contactPerson}</td>
                                    <td>R {(convertedLead.monthlyRetainer).toLocaleString()}</td>
                                    <td>R {(convertedLead.totalValue).toLocaleString()}</td>
                                    <td>{convertedLead.lastContact}</td>
                                    <td className="actions-cell">
                                        <div className="action-buttons">
                                            <button 
                                                className="btn-icon" 
                                                title="View Lead Details"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleViewClient(convertedLead);
                                                }}
                                            >
                                                <i className="fas fa-eye"></i>
                                            </button>
                                            <button 
                                                className="btn-icon" 
                                                title="Convert to Client"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    // Convert lead to client
                                                    const newClient = {
                                                        id: Date.now(),
                                                        clientName: convertedLead.clientName,
                                                        clientReg: `CONV-${Date.now()}`,
                                                        clientAddress: convertedLead.originalLead.company_address || 'N/A',
                                                        seta: convertedLead.seta,
                                                        service: convertedLead.service,
                                                        status: 'Active',
                                                        contactPerson: convertedLead.contactPerson,
                                                        contactPosition: convertedLead.originalLead.contact_position || 'N/A',
                                                        contactPhone: convertedLead.originalLead.contact_phone || 'N/A',
                                                        contactEmail: convertedLead.originalLead.contact_email || 'N/A',
                                                        sdlNumber: convertedLead.originalLead.sdl_number || 'N/A',
                                                        moderator: 'N/A',
                                                        monthlyRetainer: convertedLead.monthlyRetainer,
                                                        paymentTerms: '30 Days',
                                                        qualificationType: 'employed_learnership',
                                                        qualificationLevel: 'nqf5',
                                                        costPerLearner: convertedLead.totalValue / 12,
                                                        totalValue: convertedLead.totalValue,
                                                        lastContact: convertedLead.lastContact,
                                                        nextFollowUp: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                                                        services: [
                                                            { type: 'trench1', rate: convertedLead.monthlyRetainer, recurring: true }
                                                        ],
                                                        createdAt: new Date().toISOString()
                                                    };
                                                    addNewClient(newClient);
                                                    alert('Lead successfully converted to client!');
                                                }}
                                            >
                                                <i className="fas fa-user-plus"></i>
                                            </button>
                                            <button 
                                                className="btn-icon" 
                                                title="Delete Converted Lead"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteConvertedLead(convertedLead.id);
                                                }}
                                            >
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            
                            {/* Dynamic data from forms */}
                            {getFilteredClients().map((client) => (
                                <tr 
                                    key={client.id}
                                    className="client-row clickable"
                                    onClick={() => handleViewClient(client)}
                                >
                                    <td className="module-name">{client.clientName || 'N/A'}</td>
                                    <td>{client.seta || 'N/A'}</td>
                                    <td>{client.service || 'N/A'}</td>
                                    <td>
                                        <span className="status-badge in-progress">{client.status || 'Active'}</span>
                                    </td>
                                    <td>{client.contactPerson || 'N/A'}</td>
                                    <td>R {(client.monthlyRetainer || 0).toLocaleString()}</td>
                                    <td>R {(client.totalValue || 0).toLocaleString()}</td>
                                    <td>{client.lastContact || 'N/A'}</td>
                                    <td className="actions-cell">
                                        <div className="action-buttons">
                                            <button 
                                                className="btn-icon" 
                                                title="View Details"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleViewClient(client);
                                                }}
                                            >
                                                <i className="fas fa-eye"></i>
                                            </button>
                                            <button 
                                                className="btn-icon" 
                                                title="Edit"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEditClient(client);
                                                }}
                                            >
                                                <i className="fas fa-edit"></i>
                                            </button>
                                            <button 
                                                className="btn-icon" 
                                                title="Delete"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteClient(client.id);
                                                }}
                                            >
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            
                            {/* Show message when no records */}
                            {getFilteredClients().length === 0 && getFilteredConvertedLeads().length === 0 && (
                                <tr>
                                    <td colSpan="9" className="no-records-message">
                                        <div className="empty-state">
                                            <i className="fas fa-users"></i>
                                            <h3>No Client Records</h3>
                                            <p>No client records found. Use the "Add Client" button above to create your first client record.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {slaModalOpen && (
                <SLAModal
                    isOpen={slaModalOpen}
                    onClose={closeSlaModal}
                    client={selectedClient}
                    mode={modalMode}
                    onSave={handleSaveClient}
                    onDelete={handleDeleteClient}
                />
            )}

            {/* Combined Guide */}
            <GridCardGuide 
                isActive={showGuide}
                onComplete={handleGuideComplete}
                onSkip={handleGuideSkip}
                steps={combinedGuideSteps}
            />
        </>
    );

    return (
        <HubSpotLayout title="Clients" description="View and manage all your client information.">
            {pageContent}
        </HubSpotLayout>
    );
};

export default Clients; 