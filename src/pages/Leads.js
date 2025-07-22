import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HubSpotLayout from '../components/HubSpotLayout';
import GridCardGuide from '../components/GridCardGuide';
import '../css/Leads.css';

const Leads = () => {
    const navigate = useNavigate();
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showConvertModal, setShowConvertModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedLead, setSelectedLead] = useState(null);
    const [editFormData, setEditFormData] = useState({});
    const [showGuide, setShowGuide] = useState(false);

    // Form data for creating new lead
    const [formData, setFormData] = useState({
        company_name: '',
        contact_person: '',
        contact_position: '',
        contact_phone: '',
        contact_email: '',
        source: '',
        seta: '',
        service_interest: '',
        estimated_value: '',
        notes: '',
        next_follow_up: ''
    });

    // Form data for converting to quotation
    const [quotationData, setQuotationData] = useState({
        title: '',
        total_value: '',
        payment_terms: '30',
        conception_date: '',
        valid_until: '',
        notes: ''
    });

    useEffect(() => {
        // Initialize sample data if localStorage is empty
        const existingLeads = localStorage.getItem('leadsData');
        if (!existingLeads) {
            const sampleLeads = [
                {
                    id: 1,
                    company_name: 'TechCorp Solutions',
                    contact_person: 'John Smith',
                    contact_position: 'CEO',
                    contact_phone: '+27 11 123 4567',
                    contact_email: 'john@techcorp.co.za',
                    service_interest: 'wsp',
                    seta: 'wrseta',
                    estimated_value: 50000,
                    status: 'pending',
                    created_date: '2024-01-15',
                    notes: 'Interested in WSP training programs'
                },
                {
                    id: 2,
                    company_name: 'Innovation Labs',
                    contact_person: 'Sarah Johnson',
                    contact_position: 'HR Manager',
                    contact_phone: '+27 21 987 6543',
                    contact_email: 'sarah@innovationlabs.co.za',
                    service_interest: 'accreditation',
                    seta: 'wrseta',
                    estimated_value: 75000,
                    status: 'converted',
                    created_date: '2024-01-10',
                    notes: 'Successfully converted to quotation'
                },
                {
                    id: 3,
                    company_name: 'Future Skills Academy',
                    contact_person: 'Mike Wilson',
                    contact_position: 'Training Director',
                    contact_phone: '+27 31 456 7890',
                    contact_email: 'mike@futureskills.co.za',
                    service_interest: 'skills_program',
                    seta: 'wrseta',
                    estimated_value: 120000,
                    status: 'converted',
                    created_date: '2024-01-05',
                    notes: 'Large skills development project'
                },
                {
                    id: 4,
                    company_name: 'Digital Dynamics',
                    contact_person: 'Lisa Brown',
                    contact_position: 'Operations Manager',
                    contact_phone: '+27 12 345 6789',
                    contact_email: 'lisa@digitaldynamics.co.za',
                    service_interest: 'wsp',
                    seta: 'wrseta',
                    estimated_value: 35000,
                    status: 'qualified',
                    created_date: '2024-01-20',
                    notes: 'Ready for quotation'
                },
                {
                    id: 5,
                    company_name: 'Smart Solutions',
                    contact_person: 'David Lee',
                    contact_position: 'CEO',
                    contact_phone: '+27 27 111 2222',
                    contact_email: 'david@smartsolutions.co.za',
                    service_interest: 'accreditation',
                    seta: 'wrseta',
                    estimated_value: 90000,
                    status: 'converted',
                    created_date: '2024-01-12',
                    notes: 'Accreditation services completed'
                }
            ];
            localStorage.setItem('leadsData', JSON.stringify(sampleLeads));
        }
        
        loadLeads();
    }, []);

    const loadLeads = async () => {
        try {
            setLoading(true);
            // Try API first, fallback to localStorage
            try {
                const response = await fetch('http://localhost:8000/api/leads/');
                if (response.ok) {
                    const data = await response.json();
                    setLeads(data);
                    // Also save to localStorage for consistency
                    localStorage.setItem('leadsData', JSON.stringify(data));
                } else {
                    throw new Error('API failed');
                }
            } catch (apiError) {
                // Fallback to localStorage
                const storedLeads = localStorage.getItem('leadsData');
                if (storedLeads) {
                    const parsedLeads = JSON.parse(storedLeads);
                    // Check if we need to update old 'new' status to 'pending' and ensure estimated_value is numeric
                    const updatedLeads = parsedLeads.map(lead => ({
                        ...lead,
                        status: lead.status === 'new' ? 'pending' : lead.status,
                        estimated_value: parseFloat(lead.estimated_value) || 0
                    }));
                    setLeads(updatedLeads);
                    localStorage.setItem('leadsData', JSON.stringify(updatedLeads));
                } else {
                    // Initialize with sample data if no localStorage data exists
                    const sampleLeads = [
                        {
                            id: 1,
                            company_name: 'TechCorp Solutions',
                            contact_person: 'John Smith',
                            contact_position: 'CEO',
                            contact_phone: '+27 11 123 4567',
                            contact_email: 'john@techcorp.co.za',
                            service_interest: 'wsp',
                            seta: 'wrseta',
                            estimated_value: 50000,
                            status: 'pending',
                            created_date: '2024-01-15',
                            notes: 'Interested in WSP training programs'
                        },
                        {
                            id: 2,
                            company_name: 'Innovation Labs',
                            contact_person: 'Sarah Johnson',
                            contact_position: 'HR Manager',
                            contact_phone: '+27 21 987 6543',
                            contact_email: 'sarah@innovationlabs.co.za',
                            service_interest: 'accreditation',
                            seta: 'wrseta',
                            estimated_value: 75000,
                            status: 'converted',
                            created_date: '2024-01-10',
                            notes: 'Successfully converted to quotation'
                        },
                        {
                            id: 3,
                            company_name: 'Future Skills Academy',
                            contact_person: 'Mike Wilson',
                            contact_position: 'Training Director',
                            contact_phone: '+27 31 456 7890',
                            contact_email: 'mike@futureskills.co.za',
                            service_interest: 'skills_program',
                            seta: 'wrseta',
                            estimated_value: 120000,
                            status: 'converted',
                            created_date: '2024-01-05',
                            notes: 'Large skills development project'
                        },
                        {
                            id: 4,
                            company_name: 'Digital Dynamics',
                            contact_person: 'Lisa Brown',
                            contact_position: 'Operations Manager',
                            contact_phone: '+27 12 345 6789',
                            contact_email: 'lisa@digitaldynamics.co.za',
                            service_interest: 'wsp',
                            seta: 'wrseta',
                            estimated_value: 35000,
                            status: 'qualified',
                            created_date: '2024-01-20',
                            notes: 'Ready for quotation'
                        },
                        {
                            id: 5,
                            company_name: 'Smart Solutions',
                            contact_person: 'David Lee',
                            contact_position: 'CEO',
                            contact_phone: '+27 27 111 2222',
                            contact_email: 'david@smartsolutions.co.za',
                            service_interest: 'accreditation',
                            seta: 'wrseta',
                            estimated_value: 90000,
                            status: 'converted',
                            created_date: '2024-01-12',
                            notes: 'Accreditation services completed'
                        }
                    ];
                    setLeads(sampleLeads);
                    localStorage.setItem('leadsData', JSON.stringify(sampleLeads));
                }
            }
        } catch (err) {
            console.error('Error loading leads:', err);
            setError('Error loading leads');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleQuotationInputChange = (e) => {
        const { name, value } = e.target;
        setQuotationData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCreateLead = async (e) => {
        e.preventDefault();
        try {
            // Create new lead object
            const newLead = {
                id: Date.now(),
                company_name: formData.company_name,
                contact_person: formData.contact_person,
                contact_position: formData.contact_position,
                contact_phone: formData.contact_phone,
                contact_email: formData.contact_email,
                source: formData.source,
                seta: formData.seta,
                service_interest: formData.service_interest,
                estimated_value: parseFloat(formData.estimated_value) || 0,
                notes: formData.notes,
                next_follow_up: formData.next_follow_up,
                status: 'pending',
                created_at: new Date().toISOString()
            };

            // Try API first
            try {
                const response = await fetch('http://localhost:8000/api/leads/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    const result = await response.json();
                    newLead.id = result.id || newLead.id;
                }
            } catch (apiError) {
                console.log('API not available, using localStorage only');
            }

            // Always update localStorage and state
            const existingLeads = JSON.parse(localStorage.getItem('leadsData') || '[]');
            const updatedLeads = [...existingLeads, newLead];
            localStorage.setItem('leadsData', JSON.stringify(updatedLeads));
            
            // Update state immediately
            setLeads(updatedLeads);
            
            // Close modal and reset form
            setShowCreateModal(false);
            setFormData({
                company_name: '',
                contact_person: '',
                contact_position: '',
                contact_phone: '',
                contact_email: '',
                source: '',
                seta: '',
                service_interest: '',
                estimated_value: '',
                notes: '',
                next_follow_up: ''
            });
            
            // Show success message
            alert('Lead created successfully!');
            
        } catch (err) {
            console.error('Error creating lead:', err);
            setError('Error creating lead');
        }
    };

    const handleConvertToQuotation = async (e) => {
        e.preventDefault();
        if (!selectedLead) return;

        try {
            // First, update the lead status to 'pending'
            const updatedLeads = leads.map(lead => 
                lead.id === selectedLead.id 
                    ? { ...lead, status: 'pending' }
                    : lead
            );
            setLeads(updatedLeads);
            localStorage.setItem('leadsData', JSON.stringify(updatedLeads));

            // Try API call, but don't fail if it doesn't work
            let apiSuccess = false;
            try {
                const response = await fetch(`http://localhost:8000/api/leads/${selectedLead.id}/convert_to_quotation/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        quotation_data: {
                            ...quotationData,
                            client_name: selectedLead.company_name,
                            contact_person: selectedLead.contact_person,
                            contact_position: selectedLead.contact_position,
                            contact_phone: selectedLead.contact_phone,
                            contact_email: selectedLead.contact_email,
                            seta: selectedLead.seta || 'wrseta',
                            service_type: selectedLead.service_interest || 'wsp',
                            sdl_number: ''
                        }
                    })
                });
                apiSuccess = response.ok;
            } catch (apiError) {
                console.log('API not available, continuing with localStorage only');
                apiSuccess = true; // Treat as success for localStorage flow
            }

            // Always update lead status to 'converted' after conversion attempt
            const finalUpdatedLeads = leads.map(lead => 
                lead.id === selectedLead.id 
                    ? { ...lead, status: 'converted' }
                    : lead
            );
            setLeads(finalUpdatedLeads);
            localStorage.setItem('leadsData', JSON.stringify(finalUpdatedLeads));

            // Close modal and reset form
            setShowConvertModal(false);
            setSelectedLead(null);
            setQuotationData({
                title: '',
                total_value: '',
                payment_terms: '30',
                conception_date: '',
                valid_until: '',
                notes: ''
            });
            
            // Show success message
            alert('Lead successfully converted to quotation!');
            
        } catch (err) {
            console.error('Error in conversion process:', err);
            // If there's any error, still try to convert the lead
            const finalUpdatedLeads = leads.map(lead => 
                lead.id === selectedLead.id 
                    ? { ...lead, status: 'converted' }
                    : lead
            );
            setLeads(finalUpdatedLeads);
            localStorage.setItem('leadsData', JSON.stringify(finalUpdatedLeads));
            
            setShowConvertModal(false);
            setSelectedLead(null);
            setQuotationData({
                title: '',
                total_value: '',
                payment_terms: '30',
                conception_date: '',
                valid_until: '',
                notes: ''
            });
            
            alert('Lead converted to quotation! (API unavailable, saved locally)');
        }
    };

    const openConvertModal = (lead) => {
        setSelectedLead(lead);
        setQuotationData({
            title: `${lead.company_name} - Quotation`,
            total_value: lead.estimated_value || '',
            payment_terms: '30',
            conception_date: new Date().toISOString().split('T')[0], // Today's date
            valid_until: '',
            notes: ''
        });
        setShowConvertModal(true);
    };

    const handleViewLead = (lead) => {
        setSelectedLead(lead);
        setShowViewModal(true);
    };

    const handleEditLead = (lead) => {
        setSelectedLead(lead);
        setEditFormData({
            company_name: lead.company_name || '',
            contact_person: lead.contact_person || '',
            contact_position: lead.contact_position || '',
            contact_phone: lead.contact_phone || '',
            contact_email: lead.contact_email || '',
            source: lead.source || '',
            seta: lead.seta || '',
            service_interest: lead.service_interest || '',
            estimated_value: lead.estimated_value || '',
            notes: lead.notes || '',
            next_follow_up: lead.next_follow_up || ''
        });
        setShowEditModal(true);
    };

    const handleDeleteLead = (lead) => {
        if (window.confirm(`Are you sure you want to delete the lead for ${lead.company_name}?`)) {
            const updatedLeads = leads.filter(l => l.id !== lead.id);
            setLeads(updatedLeads);
            localStorage.setItem('leadsData', JSON.stringify(updatedLeads));
            alert('Lead deleted successfully!');
        }
    };

    const handleUpdateLead = async (e) => {
        e.preventDefault();
        try {
            const updatedLead = {
                ...selectedLead,
                ...editFormData,
                estimated_value: parseFloat(editFormData.estimated_value) || 0
            };

            // Try API first
            try {
                const response = await fetch(`http://localhost:8000/api/leads/${selectedLead.id}/`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(editFormData)
                });
            } catch (apiError) {
                console.log('API not available, using localStorage only');
            }

            // Update localStorage and state
            const updatedLeads = leads.map(lead => 
                lead.id === selectedLead.id ? updatedLead : lead
            );
            setLeads(updatedLeads);
            localStorage.setItem('leadsData', JSON.stringify(updatedLeads));
            
            setShowEditModal(false);
            setSelectedLead(null);
            setEditFormData({});
            
            alert('Lead updated successfully!');
        } catch (err) {
            console.error('Error updating lead:', err);
            alert('Error updating lead');
        }
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({
            ...prev,
            [name]: value
        }));
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

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'new': return 'status-new';
            case 'contacted': return 'status-contacted';
            case 'qualified': return 'status-qualified';
            case 'pending': return 'status-pending';
            case 'converted': return 'status-converted';
            case 'lost': return 'status-lost';
            default: return 'status-pending';
        }
    };

    // Combined guide steps: Cards first, then Table
    const combinedGuideSteps = [
        // Grid Cards Section
        {
            title: "All Leads",
            description: "This card shows the total number of leads in your system. It gives you a quick overview of your entire lead database.",
            target: ".grid.grid-cols-2 .bg-white:nth-child(1)"
        },
        {
            title: "New Leads",
            description: "These are leads that are pending or newly created. They need immediate attention and follow-up.",
            target: ".grid.grid-cols-2 .bg-white:nth-child(2)"
        },
        {
            title: "Contacted Leads",
            description: "Leads you've already reached out to. Track your communication progress here.",
            target: ".grid.grid-cols-2 .bg-white:nth-child(3)"
        },
        {
            title: "Qualified Leads",
            description: "These leads have shown interest and are ready for more detailed discussions or proposals.",
            target: ".grid.grid-cols-2 .bg-white:nth-child(4)"
        },
        {
            title: "Converted Leads",
            description: "Successfully converted leads that have become clients. This represents your conversion success rate.",
            target: ".grid.grid-cols-2 .bg-white:nth-child(5)"
        },
        {
            title: "Lost Leads",
            description: "Leads that didn't convert. Review these to understand what went wrong and improve your process.",
            target: ".grid.grid-cols-2 .bg-white:nth-child(6)"
        },
        // Table Section
        {
            title: "Lead Records Section",
            description: "Now let's explore the detailed lead management area. Here you can view, manage, and track all your leads in a comprehensive table format.",
            target: ".modules-section"
        },
        {
            title: "Add Lead Button",
            description: "Click this button to create a new lead. It will open a form where you can enter all the lead's information.",
            target: ".add-module-btn"
        },
        {
            title: "Company Column",
            description: "Shows the company name for each lead. This is the primary identifier for each lead record.",
            target: ".modules-table thead th:nth-child(1)"
        },
        {
            title: "Contact Person",
            description: "Displays the main contact person's name for each lead. This is who you'll be communicating with.",
            target: ".modules-table thead th:nth-child(2)"
        },
        {
            title: "Email Address",
            description: "The contact person's email address. Use this for email communications and follow-ups.",
            target: ".modules-table thead th:nth-child(3)"
        },
        {
            title: "Lead Source",
            description: "Shows where the lead came from (website, referral, cold call, etc.). This helps track your marketing effectiveness.",
            target: ".modules-table thead th:nth-child(4)"
        },
        {
            title: "Status Badge",
            description: "Color-coded status indicators showing the current stage of each lead in your sales process.",
            target: ".modules-table thead th:nth-child(5)"
        },
        {
            title: "SETA Information",
            description: "Shows which SETA (Sector Education and Training Authority) the lead is associated with.",
            target: ".modules-table thead th:nth-child(6)"
        },
        {
            title: "Estimated Value",
            description: "The potential value of this lead in Rands. This helps prioritize high-value opportunities.",
            target: ".modules-table thead th:nth-child(7)"
        },
        {
            title: "Created Date",
            description: "When the lead was first added to your system. Useful for tracking lead age and follow-up timing.",
            target: ".modules-table thead th:nth-child(8)"
        },
        {
            title: "Convert to Quotation",
            description: "This button converts a lead into a quotation. Only available for leads that haven't been converted yet. Click to create a formal quote.",
            target: ".action-buttons .btn-icon:first-child"
        },
        {
            title: "View Details",
            description: "Click this button to view all the details of a lead in a popup modal. Useful for quick reference without editing.",
            target: ".action-buttons .btn-icon:nth-child(2)"
        },
        {
            title: "Edit Lead",
            description: "This button opens an edit form where you can modify any lead information. Perfect for updating contact details or status.",
            target: ".action-buttons .btn-icon:nth-child(3)"
        },
        {
            title: "Delete Lead",
            description: "Removes the lead from your system. Use with caution - this action cannot be undone.",
            target: ".action-buttons .btn-icon:last-child"
        }
    ];

    const handleGuideComplete = () => {
        setShowGuide(false);
        localStorage.setItem('leadsCombinedGuideSeen', 'true');
    };

    const handleGuideSkip = () => {
        setShowGuide(false);
        localStorage.setItem('leadsCombinedGuideSeen', 'true');
    };

    const startGuide = () => {
        setShowGuide(true);
    };



    // Modern main content matching the HTML mockup design
    const pageContent = (
        <>
            {error && (
                <div className="alert alert-error">
                    <i className="fas fa-exclamation-circle"></i>
                    {error}
                </div>
            )}

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
            <h1 className="program-title">Lead Management</h1>

            {/* Lead Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-center justify-center">
                    <p className="text-sm text-gray-500">All</p>
                    <p className="text-lg font-semibold text-gray-800 flex items-center">
                        <span className="text-orange-500 mr-1">&#9679;</span> {leads.length}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-center justify-center">
                    <p className="text-sm text-gray-500">New</p>
                    <p className="text-lg font-semibold text-gray-800 flex items-center">
                        <span className="text-blue-500 mr-1">&#9679;</span> {leads.filter(lead => lead.status === 'new' || lead.status === 'pending').length}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-center justify-center">
                    <p className="text-sm text-gray-500">Contacted</p>
                    <p className="text-lg font-semibold text-gray-800 flex items-center">
                        <span className="text-purple-500 mr-1">&#9679;</span> {leads.filter(lead => lead.status === 'contacted').length}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-center justify-center">
                    <p className="text-sm text-gray-500">Qualified</p>
                    <p className="text-lg font-semibold text-gray-800 flex items-center">
                        <span className="text-green-500 mr-1">&#9679;</span> {leads.filter(lead => lead.status === 'qualified').length}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-center justify-center">
                    <p className="text-sm text-gray-500">Converted</p>
                    <p className="text-lg font-semibold text-gray-800 flex items-center">
                        <span className="text-green-600 mr-1">&#9679;</span> {leads.filter(lead => lead.status === 'converted').length}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-center justify-center">
                    <p className="text-sm text-gray-500">Lost</p>
                    <p className="text-lg font-semibold text-gray-800 flex items-center">
                        <span className="text-red-500 mr-1">&#9679;</span> {leads.filter(lead => lead.status === 'lost').length}
                    </p>
                </div>
            </div>

            {/* Leads Section */}
            <div className="modules-section">
                <div className="modules-header">
                    <h2 className="modules-title">Lead Records</h2>
                    <button className="add-module-btn" onClick={() => setShowCreateModal(true)}>
                        + Add Lead
                    </button>
                </div>

                {/* Leads Table */}
                <div className="table-container">
                    <table className="modules-table">
                        <thead>
                            <tr>
                                <th>Company</th>
                                <th>Contact Person</th>
                                <th>Email</th>
                                <th>Source</th>
                                <th>Status</th>
                                <th>SETA</th>
                                <th>Estimated Value</th>
                                <th>Created</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="9" style={{textAlign: 'center'}}>
                                        <i className="fas fa-spinner fa-spin"></i> Loading leads...
                                    </td>
                                </tr>
                            ) : leads.length === 0 ? (
                                <tr>
                                    <td colSpan="9" style={{textAlign: 'center'}}>
                                        No leads found. Create your first lead!
                                    </td>
                                </tr>
                            ) : (
                                leads.map((lead) => (
                                    <tr key={lead.id}>
                                        <td className="module-name">{lead.company_name}</td>
                                        <td>{lead.contact_person}</td>
                                        <td>{lead.contact_email}</td>
                                        <td>{lead.source}</td>
                                        <td>
                                            <span className={`status-badge ${getStatusBadgeClass(lead.status)}`}>
                                                {lead.status}
                                            </span>
                                        </td>
                                        <td>{lead.seta || 'N/A'}</td>
                                        <td>{formatCurrency(lead.estimated_value)}</td>
                                        <td>{formatDate(lead.created_at)}</td>
                                        <td className="actions-cell">
                                            <div className="action-buttons">
                                                {lead.status !== 'converted' && (
                                                    <button 
                                                        className="btn-icon" 
                                                        title="Convert to Quotation"
                                                        onClick={() => openConvertModal(lead)}
                                                    >
                                                        <i className="fas fa-exchange-alt"></i>
                                                    </button>
                                                )}
                                                <button className="btn-icon" title="View Details" onClick={() => handleViewLead(lead)}>
                                                    <i className="fas fa-eye"></i>
                                                </button>
                                                <button className="btn-icon" title="Edit" onClick={() => handleEditLead(lead)}>
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                                <button className="btn-icon" title="Delete" onClick={() => handleDeleteLead(lead)}>
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Lead Modal */}
            {showCreateModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>Create New Lead</h2>
                            <button className="modal-close" onClick={() => setShowCreateModal(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleCreateLead}>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Company Name *</label>
                                        <input
                                            type="text"
                                            name="company_name"
                                            value={formData.company_name}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Contact Person *</label>
                                        <input
                                            type="text"
                                            name="contact_person"
                                            value={formData.contact_person}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Email *</label>
                                        <input
                                            type="email"
                                            name="contact_email"
                                            value={formData.contact_email}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Phone</label>
                                        <input
                                            type="tel"
                                            name="contact_phone"
                                            value={formData.contact_phone}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Source *</label>
                                        <select
                                            name="source"
                                            value={formData.source}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">Select Source</option>
                                            <option value="website">Website</option>
                                            <option value="referral">Referral</option>
                                            <option value="cold_call">Cold Call</option>
                                            <option value="social_media">Social Media</option>
                                            <option value="email">Email Campaign</option>
                                            <option value="event">Event/Conference</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>SETA</label>
                                        <select
                                            name="seta"
                                            value={formData.seta}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Select SETA</option>
                                            <option value="wrseta">WRSETA</option>
                                            <option value="chieta">CHIETA</option>
                                            <option value="bankseta">BANKSETA</option>
                                            <option value="fasset">FASSET</option>
                                            <option value="ceta">CETA</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Estimated Value (R)</label>
                                        <input
                                            type="number"
                                            name="estimated_value"
                                            step="0.01"
                                            value={formData.estimated_value}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="form-group full-width">
                                        <label>Notes</label>
                                        <textarea
                                            name="notes"
                                            rows="3"
                                            value={formData.notes}
                                            onChange={handleInputChange}
                                        ></textarea>
                                    </div>
                                </div>
                                <div className="modal-actions">
                                    <button type="button" className="btn secondary" onClick={() => setShowCreateModal(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn primary">
                                        Create Lead
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Convert to Quotation Modal */}
            {showConvertModal && selectedLead && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>Convert Lead to Quotation</h2>
                            <button className="modal-close" onClick={() => setShowConvertModal(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="lead-info">
                                <h4>Lead Information</h4>
                                <p><strong>Company:</strong> {selectedLead.company_name}</p>
                                <p><strong>Contact:</strong> {selectedLead.contact_person}</p>
                                <p><strong>Email:</strong> {selectedLead.contact_email}</p>
                            </div>
                            <form onSubmit={handleConvertToQuotation}>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Quotation Title *</label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={quotationData.title}
                                            onChange={handleQuotationInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Total Value (R) *</label>
                                        <input
                                            type="number"
                                            name="total_value"
                                            step="0.01"
                                            value={quotationData.total_value}
                                            onChange={handleQuotationInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Payment Terms</label>
                                        <select
                                            name="payment_terms"
                                            value={quotationData.payment_terms}
                                            onChange={handleQuotationInputChange}
                                        >
                                            <option value="7">7 Days</option>
                                            <option value="15">15 Days</option>
                                            <option value="30">30 Days</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Conception Date</label>
                                        <input
                                            type="date"
                                            name="conception_date"
                                            value={quotationData.conception_date}
                                            onChange={handleQuotationInputChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Valid Until *</label>
                                        <input
                                            type="date"
                                            name="valid_until"
                                            value={quotationData.valid_until}
                                            onChange={handleQuotationInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group full-width">
                                        <label>Notes</label>
                                        <textarea
                                            name="notes"
                                            rows="3"
                                            value={quotationData.notes}
                                            onChange={handleQuotationInputChange}
                                        ></textarea>
                                    </div>
                                </div>
                                <div className="modal-actions">
                                    <button type="button" className="btn secondary" onClick={() => setShowConvertModal(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn primary">
                                        Convert to Quotation
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* View Lead Modal */}
            {showViewModal && selectedLead && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>Lead Details</h2>
                            <button className="modal-close" onClick={() => setShowViewModal(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="lead-info">
                                <h4>Lead Information</h4>
                                <p><strong>Company:</strong> {selectedLead.company_name}</p>
                                <p><strong>Contact:</strong> {selectedLead.contact_person}</p>
                                <p><strong>Email:</strong> {selectedLead.contact_email}</p>
                                <p><strong>Phone:</strong> {selectedLead.contact_phone}</p>
                                <p><strong>Source:</strong> {selectedLead.source}</p>
                                <p><strong>SETA:</strong> {selectedLead.seta || 'N/A'}</p>
                                <p><strong>Estimated Value:</strong> {formatCurrency(selectedLead.estimated_value)}</p>
                                <p><strong>Created:</strong> {formatDate(selectedLead.created_at)}</p>
                                <p><strong>Notes:</strong> {selectedLead.notes || 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Lead Modal */}
            {showEditModal && selectedLead && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>Edit Lead</h2>
                            <button className="modal-close" onClick={() => setShowEditModal(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleUpdateLead}>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Company Name *</label>
                                        <input
                                            type="text"
                                            name="company_name"
                                            value={editFormData.company_name}
                                            onChange={handleEditInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Contact Person *</label>
                                        <input
                                            type="text"
                                            name="contact_person"
                                            value={editFormData.contact_person}
                                            onChange={handleEditInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Email *</label>
                                        <input
                                            type="email"
                                            name="contact_email"
                                            value={editFormData.contact_email}
                                            onChange={handleEditInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Phone</label>
                                        <input
                                            type="tel"
                                            name="contact_phone"
                                            value={editFormData.contact_phone}
                                            onChange={handleEditInputChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Source *</label>
                                        <select
                                            name="source"
                                            value={editFormData.source}
                                            onChange={handleEditInputChange}
                                            required
                                        >
                                            <option value="">Select Source</option>
                                            <option value="website">Website</option>
                                            <option value="referral">Referral</option>
                                            <option value="cold_call">Cold Call</option>
                                            <option value="social_media">Social Media</option>
                                            <option value="email">Email Campaign</option>
                                            <option value="event">Event/Conference</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>SETA</label>
                                        <select
                                            name="seta"
                                            value={editFormData.seta}
                                            onChange={handleEditInputChange}
                                        >
                                            <option value="">Select SETA</option>
                                            <option value="wrseta">WRSETA</option>
                                            <option value="chieta">CHIETA</option>
                                            <option value="bankseta">BANKSETA</option>
                                            <option value="fasset">FASSET</option>
                                            <option value="ceta">CETA</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Estimated Value (R)</label>
                                        <input
                                            type="number"
                                            name="estimated_value"
                                            step="0.01"
                                            value={editFormData.estimated_value}
                                            onChange={handleEditInputChange}
                                        />
                                    </div>
                                    <div className="form-group full-width">
                                        <label>Notes</label>
                                        <textarea
                                            name="notes"
                                            rows="3"
                                            value={editFormData.notes}
                                            onChange={handleEditInputChange}
                                        ></textarea>
                                    </div>
                                </div>
                                <div className="modal-actions">
                                    <button type="button" className="btn secondary" onClick={() => setShowEditModal(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn primary">
                                        Update Lead
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
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
        <HubSpotLayout 
            title="Leads Management" 
            description="Manage and track your sales leads and prospects"
        >
            {pageContent}
        </HubSpotLayout>
    );
};

export default Leads; 