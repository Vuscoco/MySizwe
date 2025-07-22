import React, { useState, useEffect, useCallback, useRef } from 'react';
import HubSpotLayout from '../components/HubSpotLayout';
import GridCardGuide from '../components/GridCardGuide';
import '../css/global-layout.css';
import '../css/Facilitator.css';

// Mock data for the facilitation session report
const sessionData = {
  title: "Strategic Planning Workshop",
  date: "2025-07-16",
  duration: "4 hours",
  facilitator: "Jane Doe",
  overallSessionProgress: 80, // Percentage of agenda covered or objectives met
  participantsCount: 15,
  agendaItems: [
    { id: 1, name: "Welcome & Introductions", progress: 100, status: "Covered", created: "2025-01-10", due: "2025-01-15" },
    { id: 2, name: "Review Current State", progress: 100, status: "Covered", created: "2025-01-11", due: "2025-01-16" },
    { id: 3, name: "Brainstorming Future Vision", progress: 100, status: "Covered", created: "2025-01-12", due: "2025-01-17" },
    { id: 4, name: "Prioritizing Initiatives", progress: 70, status: "In Progress", created: "2025-01-13", due: "2025-01-20" },
    { id: 5, name: "Next Steps & Action Planning", progress: 30, status: "Pending", created: "2025-01-14", due: "2025-01-25" },
    { id: 6, name: "Wrap-up & Feedback", progress: 0, status: "Pending", created: "2025-01-15", due: "2025-01-30" },
  ],
};

// Reusable Card component
const Card = ({ title, children, className = "" }) => (
  <div className={`bg-white p-6 rounded-lg shadow-md border border-gray-200 ${className}`}>
    {title && <h3 className="text-xl font-semibold mb-4 text-gray-800">{title}</h3>}
    {children}
  </div>
);

// Reusable Progress component
const Progress = ({ value, className = "" }) => (
  <div className={`progress-bar ${className}`}>
    <div
      className="progress-fill"
      style={{ width: `${value}%` }}
    ></div>
  </div>
);

// Reusable Badge component
const Badge = ({ children, variant = "default", className = "" }) => {
  let bgColor = "bg-gray-200 text-gray-800";
  if (variant === "success") bgColor = "bg-green-100 text-green-800";
  if (variant === "info") bgColor = "bg-blue-100 text-blue-800";
  if (variant === "warning") bgColor = "bg-yellow-100 text-yellow-800";
  if (variant === "destructive") bgColor = "bg-red-100 text-red-800";

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${className}`}>
      {children}
    </span>
  );
};

const Facilitator = () => {
    const [facilitators, setFacilitators] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('All Facilitators');
    const [activeHub, setActiveHub] = useState('Talent Hub');
    const [activeStatus, setActiveStatus] = useState('Module 1');
    const [session, setSession] = useState(sessionData);
    const [showAgendaForm, setShowAgendaForm] = useState(false);
    const [showFacilitatorForm, setShowFacilitatorForm] = useState(false);
    const [agendaFormData, setAgendaFormData] = useState({
        name: '',
        progress: 0,
        status: 'Pending',
        created: '',
        due: ''
    });
    const [facilitatorFormData, setFacilitatorFormData] = useState({
        name: '',
        company: '',
        program: '',
        nqfLevel: 'Level 1',
        id: '',
        learnerName: '',
        status: 'Module 1',
        unitStandardTitle: '',
        credit: ''
    });
    const formRef = useRef(null);
    const [showGuide, setShowGuide] = useState(false);

    useEffect(() => {
        // Load facilitators data from localStorage
        const storedFacilitators = localStorage.getItem('facilitatorsData');
        if (storedFacilitators) {
            setFacilitators(JSON.parse(storedFacilitators));
        }
        
        setLoading(false);
    }, []);

    // Focus first input when form opens
    useEffect(() => {
        if (showFacilitatorForm && formRef.current) {
            const firstInput = formRef.current.querySelector('input');
            if (firstInput) {
                setTimeout(() => firstInput.focus(), 100);
            }
        }
    }, [showFacilitatorForm]);

    const handleAgendaInputChange = (e) => {
        const { name, value, type } = e.target;
        setAgendaFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? (value === '' ? 0 : Number(value)) : value
        }));
    };

    const handleAddAgenda = () => {
        // Auto-fill created date with current date
        const currentDate = new Date().toISOString().split('T')[0];
        setAgendaFormData(prev => ({
            ...prev,
            created: currentDate
        }));
        setShowAgendaForm(true);
    };

    const handleSubmitAgenda = (e) => {
        e.preventDefault();
        
        if (!agendaFormData.name.trim()) {
            alert('Agenda Item Name is required');
            return;
        }
        
        if (agendaFormData.progress < 0 || agendaFormData.progress > 100) {
            alert('Progress must be between 0 and 100');
            return;
        }
        
        const newAgendaItem = {
            id: Date.now(),
            ...agendaFormData
        };
        
        const updatedSession = {
            ...session,
            agendaItems: [...session.agendaItems, newAgendaItem]
        };
        
        setSession(updatedSession);
        
        // Save agenda item to localStorage for Timetable integration
        const existingAgendaEvents = JSON.parse(localStorage.getItem('agendaEvents') || '[]');
        const agendaEvent = {
            id: newAgendaItem.id,
            title: newAgendaItem.name,
            description: `Progress: ${newAgendaItem.progress}% | Status: ${newAgendaItem.status}`,
            facilitator: 'Agenda Item',
            client: 'Facilitator Log',
            duration: 60, // Default 1 hour
            type: 'agenda',
            date: new Date(newAgendaItem.due || newAgendaItem.created),
            agendaData: newAgendaItem // Store full agenda data
        };
        
        const updatedAgendaEvents = [...existingAgendaEvents, agendaEvent];
        localStorage.setItem('agendaEvents', JSON.stringify(updatedAgendaEvents));
        
        setShowAgendaForm(false);
        setAgendaFormData({
            name: '',
            progress: 0,
            status: 'Pending',
            created: '',
            due: ''
        });
    };

    const handleCancelAgenda = () => {
        setShowAgendaForm(false);
        setAgendaFormData({
            name: '',
            progress: 0,
            status: 'Pending',
            created: '',
            due: ''
        });
    };

    const handleFacilitatorInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setFacilitatorFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }, []);

    // Prevent form from losing focus
    const handleFormClick = useCallback((e) => {
        e.stopPropagation();
        e.preventDefault();
    }, []);

    // Prevent input focus loss
    const handleInputFocus = useCallback((e) => {
        e.target.focus();
    }, []);

    const handleAddFacilitator = () => {
        setShowFacilitatorForm(true);
        // Reset form data when opening
        setFacilitatorFormData({
            name: '',
            company: '',
            program: '',
            nqfLevel: 'Level 1',
            id: '',
            learnerName: '',
            status: 'Module 1',
            unitStandardTitle: '',
            credit: ''
        });
    };

    const handleSubmitFacilitator = (e) => {
        e.preventDefault();
        
        if (!facilitatorFormData.name.trim()) {
            alert('Facilitator Name is required');
            return;
        }
        
        const newFacilitator = {
            id: Date.now(),
            ...facilitatorFormData
        };
        
        const updatedFacilitators = [...facilitators, newFacilitator];
        setFacilitators(updatedFacilitators);
        localStorage.setItem('facilitatorsData', JSON.stringify(updatedFacilitators));
        
        setShowFacilitatorForm(false);
        setFacilitatorFormData({
            name: '',
            company: '',
            program: '',
            nqfLevel: 'Level 1',
            id: '',
            learnerName: '',
            status: 'Module 1',
            unitStandardTitle: '',
            credit: ''
        });
    };

    const handleCancelFacilitator = () => {
        setShowFacilitatorForm(false);
        setFacilitatorFormData({
            name: '',
            company: '',
            program: '',
            nqfLevel: 'Level 1',
            id: '',
            learnerName: '',
            status: 'Module 1',
            unitStandardTitle: '',
            credit: ''
        });
    };



    // Status Filter Component
    // Determine badge variant based on status
    const getStatusBadgeVariant = (status) => {
        switch (status) {
            case "Covered":
            case "Completed": return "success";
            case "In Progress": return "info";
            case "Pending":
            case "Open": return "warning";
            default: return "default";
        }
    };

    const StatusFilter = ({ status, count, isActive, isSuccess, isDanger, onClick }) => {
        let className = 'arrow-filter';
        
        if (isSuccess) {
            className += ' success';
        } else if (isDanger) {
            className += ' danger';
        } else if (isActive) {
            className += ' active';
        }

        return (
            <button
                onClick={onClick}
                className={className}
            >
                <span>{status}</span>
                <span className="count">{count}</span>
            </button>
        );
    };

    // Combined guide steps: Agenda first, then Facilitator Records
    const combinedGuideSteps = [
        // Agenda Items Section
        {
            title: "Agenda Items & Progress",
            description: "This section tracks the progress of your training session agenda items. Monitor completion status and timelines for each agenda component.",
            target: ".agenda-items-section"
        },
        {
            title: "Add Agenda Item",
            description: "Click this button to add new agenda items to your training session. Define the item name, progress, status, and due dates.",
            target: ".agenda-items-section .add-module-btn"
        },
        {
            title: "Agenda Item Column",
            description: "Shows the name or title of each agenda item in your training session. This is the main identifier for each agenda component.",
            target: ".agenda-items-section table thead th:nth-child(1)"
        },
        {
            title: "Progress Column",
            description: "Displays the completion percentage for each agenda item. Visual progress bars show how much of each item has been completed.",
            target: ".agenda-items-section table thead th:nth-child(2)"
        },
        {
            title: "Status Column",
            description: "Shows the current status of each agenda item: Covered (completed), In Progress, or Pending. Color-coded badges make status easy to identify.",
            target: ".agenda-items-section table thead th:nth-child(3)"
        },
        {
            title: "Created Date",
            description: "The date when each agenda item was created. Useful for tracking when items were added to the session plan.",
            target: ".agenda-items-section table thead th:nth-child(4)"
        },
        {
            title: "Due Date",
            description: "The target completion date for each agenda item. Helps ensure timely completion of training session components.",
            target: ".agenda-items-section table thead th:nth-child(5)"
        },
        // Facilitator Records Section
        {
            title: "Facilitator Records",
            description: "This section manages all your facilitator information and learner progress tracking. View and update facilitator details and module progress.",
            target: ".facilitator-records"
        },
        {
            title: "Module Status Filters",
            description: "Filter facilitator records by module status. Click on any module to view only facilitators in that specific module stage.",
            target: ".facilitator-records .grid"
        },
        {
            title: "Module 1 Filter",
            description: "View facilitators who are currently in Module 1. Shows the count of facilitators in this module.",
            target: ".facilitator-records .grid button:nth-child(1)"
        },
        {
            title: "Module 2 Filter",
            description: "View facilitators who are currently in Module 2. Shows the count of facilitators in this module.",
            target: ".facilitator-records .grid button:nth-child(2)"
        },
        {
            title: "Module 3 Filter",
            description: "View facilitators who are currently in Module 3. Shows the count of facilitators in this module.",
            target: ".facilitator-records .grid button:nth-child(3)"
        },
        {
            title: "Module 4 Filter",
            description: "View facilitators who are currently in Module 4. Shows the count of facilitators in this module.",
            target: ".facilitator-records .grid button:nth-child(4)"
        },
        {
            title: "Facilitate Button",
            description: "Click this button to add a new facilitator record. Opens a form to enter facilitator and learner information.",
            target: ".facilitator-records .add-module-btn"
        },
        {
            title: "Search Facilitators",
            description: "Search through your facilitator records by name, company, program, or any other details. Type to filter results instantly.",
            target: ".facilitator-records .relative"
        },
        // Facilitator Table Columns
        {
            title: "Facilitator Name",
            description: "The name of the facilitator conducting the training. This is the primary identifier for each facilitator record.",
            target: ".facilitator-records table thead th:nth-child(1)"
        },
        {
            title: "Company",
            description: "The company or organization that the facilitator represents or works for.",
            target: ".facilitator-records table thead th:nth-child(2)"
        },
        {
            title: "Program",
            description: "The specific training program or course that the facilitator is delivering.",
            target: ".facilitator-records table thead th:nth-child(3)"
        },
        {
            title: "NQF Level",
            description: "The National Qualifications Framework level of the training program. Color-coded badges show different levels.",
            target: ".facilitator-records table thead th:nth-child(4)"
        },
        {
            title: "ID",
            description: "The unique identifier for the facilitator or learner record.",
            target: ".facilitator-records table thead th:nth-child(5)"
        },
        {
            title: "Learner Name",
            description: "The name of the learner or participant in the training program.",
            target: ".facilitator-records table thead th:nth-child(6)"
        },
        {
            title: "Status Dropdown",
            description: "Update the module status for each facilitator. Use this dropdown to track progress through different modules.",
            target: ".facilitator-records table thead th:nth-child(7)"
        },
        {
            title: "Unit Standard Title",
            description: "The specific unit standard or qualification title being delivered in the training program.",
            target: ".facilitator-records table thead th:nth-child(8)"
        },
        {
            title: "Credit",
            description: "The credit value assigned to the unit standard or qualification being delivered.",
            target: ".facilitator-records table thead th:nth-child(9)"
        }
    ];

    const handleGuideComplete = () => {
        setShowGuide(false);
        localStorage.setItem('facilitatorCombinedGuideSeen', 'true');
    };

    const handleGuideSkip = () => {
        setShowGuide(false);
        localStorage.setItem('facilitatorCombinedGuideSeen', 'true');
    };

    const startGuide = () => {
        setShowGuide(true);
    };

    const AgendaForm = () => (
        <div className="modal-overlay" onClick={handleCancelAgenda}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Add New Agenda Item</h2>
                    <button className="close-btn" onClick={handleCancelAgenda}>&times;</button>
                </div>
                <form onSubmit={handleSubmitAgenda} className="facilitator-form">
                    <div className="form-group">
                        <label htmlFor="name">Agenda Item Name *</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={agendaFormData.name}
                            onChange={handleAgendaInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="progress">Progress (%)</label>
                        <input
                            type="number"
                            id="progress"
                            name="progress"
                            value={agendaFormData.progress}
                            onChange={handleAgendaInputChange}
                            min="0"
                            max="100"
                            step="1"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="status">Status</label>
                        <select
                            id="status"
                            name="status"
                            value={agendaFormData.status}
                            onChange={handleAgendaInputChange}
                        >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Covered">Covered</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="created">Created Date</label>
                        <input
                            type="date"
                            id="created"
                            name="created"
                            value={agendaFormData.created}
                            onChange={handleAgendaInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="due">Due Date</label>
                        <input
                            type="date"
                            id="due"
                            name="due"
                            value={agendaFormData.due}
                            onChange={handleAgendaInputChange}
                        />
                    </div>
                    <div className="form-actions">
                        <button type="button" className="btn-secondary" onClick={handleCancelAgenda}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary">
                            Add Agenda Item
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    const FacilitatorForm = () => (
        <div className="modal-overlay" onClick={handleCancelFacilitator}>
            <div className="modal-content" onClick={handleFormClick}>
                <div className="modal-header">
                    <h2>Add New Facilitator Record</h2>
                    <button className="close-btn" onClick={handleCancelFacilitator}>&times;</button>
                </div>
                <form ref={formRef} onSubmit={handleSubmitFacilitator} className="facilitator-form" onClick={handleFormClick}>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="name">Facilitator Name *</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={facilitatorFormData.name}
                                onChange={handleFacilitatorInputChange}
                                onFocus={handleInputFocus}
                                placeholder="Enter facilitator name"
                                required
                                autoFocus
                                autoComplete="off"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="company">Company</label>
                            <input
                                type="text"
                                id="company"
                                name="company"
                                value={facilitatorFormData.company}
                                onChange={handleFacilitatorInputChange}
                                onFocus={handleInputFocus}
                                placeholder="Enter company name"
                                autoComplete="off"
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="program">Program</label>
                            <input
                                type="text"
                                id="program"
                                name="program"
                                value={facilitatorFormData.program}
                                onChange={handleFacilitatorInputChange}
                                onFocus={handleInputFocus}
                                placeholder="Enter program name"
                                autoComplete="off"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="nqfLevel">NQF Level</label>
                            <select
                                id="nqfLevel"
                                name="nqfLevel"
                                value={facilitatorFormData.nqfLevel}
                                onChange={handleFacilitatorInputChange}
                                onFocus={handleInputFocus}
                                autoComplete="off"
                            >
                                <option value="Level 1">Level 1</option>
                                <option value="Level 2">Level 2</option>
                                <option value="Level 3">Level 3</option>
                                <option value="Level 4">Level 4</option>
                                <option value="Level 5">Level 5</option>
                                <option value="Level 6">Level 6</option>
                                <option value="Level 7">Level 7</option>
                                <option value="Level 8">Level 8</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="id">ID</label>
                            <input
                                type="text"
                                id="id"
                                name="id"
                                value={facilitatorFormData.id}
                                onChange={handleFacilitatorInputChange}
                                onFocus={handleInputFocus}
                                placeholder="Enter ID number"
                                autoComplete="off"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="learnerName">Learner Name</label>
                            <input
                                type="text"
                                id="learnerName"
                                name="learnerName"
                                value={facilitatorFormData.learnerName}
                                onChange={handleFacilitatorInputChange}
                                onFocus={handleInputFocus}
                                placeholder="Enter learner name"
                                autoComplete="off"
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="status">Status</label>
                            <select
                                id="status"
                                name="status"
                                value={facilitatorFormData.status}
                                onChange={handleFacilitatorInputChange}
                                onFocus={handleInputFocus}
                                autoComplete="off"
                            >
                                <option value="Module 1">Module 1</option>
                                <option value="Module 2">Module 2</option>
                                <option value="Module 3">Module 3</option>
                                <option value="Module 4">Module 4</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="unitStandardTitle">Unit Standard Title</label>
                            <input
                                type="text"
                                id="unitStandardTitle"
                                name="unitStandardTitle"
                                value={facilitatorFormData.unitStandardTitle}
                                onChange={handleFacilitatorInputChange}
                                onFocus={handleInputFocus}
                                placeholder="Enter unit standard title"
                                autoComplete="off"
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="credit">Credit</label>
                            <input
                                type="text"
                                id="credit"
                                name="credit"
                                value={facilitatorFormData.credit}
                                onChange={handleFacilitatorInputChange}
                                onFocus={handleInputFocus}
                                placeholder="Enter credit value"
                                autoComplete="off"
                            />
                        </div>
                    </div>
                    <div className="form-actions">
                        <button type="button" className="btn-secondary" onClick={handleCancelFacilitator}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary">
                            Add Facilitator Record
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    const pageContent = (
        <div className="flex h-screen bg-gray-100 font-inter">
            {/* Main Content Area */}
            <main className="flex-1 flex flex-col overflow-auto p-6">
                {/* Content Header */}
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold text-gray-800">Facilitator Information and Documentation</h1>
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

                    {/* Progress Report Section */}
                    <div className="mb-8">

                        {/* Agenda Items Section */}
                        <Card title="Agenda Items & Progress" className="mb-6 agenda-items-section">
                            <div className="mb-4 flex justify-end">
                                <button 
                                    className="add-module-btn"
                                    onClick={handleAddAgenda}
                                >
                                    + Add Agenda Item
                                </button>
                            </div>
                            <table className="min-w-full bg-white rounded-lg overflow-hidden">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="table-header-concrete px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" scope="col">Agenda Item</th>
                                            <th className="table-header-concrete px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider progress-column" scope="col">Progress</th>
                                            <th className="table-header-concrete px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider status-column" scope="col">Status</th>
                                            <th className="table-header-concrete px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider created-column" scope="col">Created</th>
                                            <th className="table-header-concrete px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider due-column" scope="col">Due</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {session.agendaItems.map((item) => (
                                            <tr key={item.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 progress-column">
                                                    <div className="progress-container">
                                                        <span className="progress-text">{item.progress}%</span>
                                                        <Progress value={item.progress} />
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm status-column">
                                                    <Badge variant={getStatusBadgeVariant(item.status)}>{item.status}</Badge>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 created-column">
                                                    {item.created ? new Date(item.created).toLocaleDateString() : 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 due-column">
                                                    {item.due ? new Date(item.due).toLocaleDateString() : 'N/A'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                        </Card>

                        {/* Report Footer */}
                        <div className="text-center text-gray-500 text-sm mb-6">
                            Report Generated on {new Date().toLocaleDateString()}
                        </div>
                    </div>

                    {/* Facilitators Section */}
                    <Card title="Facilitator Records" className="mb-6 facilitator-records">
                        {/* Status Filters */}
                        <div className="flex justify-between items-center mb-6">
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                                <StatusFilter status="Module 1" count={facilitators.filter(f => f.status === 'Module 1' || !f.status).length} isActive={activeStatus === 'Module 1'} onClick={() => setActiveStatus('Module 1')} />
                                <StatusFilter status="Module 2" count={facilitators.filter(f => f.status === 'Module 2').length} isActive={activeStatus === 'Module 2'} onClick={() => setActiveStatus('Module 2')} />
                                <StatusFilter status="Module 3" count={facilitators.filter(f => f.status === 'Module 3').length} isActive={activeStatus === 'Module 3'} onClick={() => setActiveStatus('Module 3')} />
                                <StatusFilter status="Module 4" count={facilitators.filter(f => f.status === 'Module 4').length} isActive={activeStatus === 'Module 4'} onClick={() => setActiveStatus('Module 4')} />
                            </div>
                            <button 
                                className="add-module-btn"
                                onClick={handleAddFacilitator}
                            >
                                Facilitate
                            </button>
                        </div>

                        {/* Search Bar */}
                        <div className="mb-6">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search facilitators..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <svg
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    ></path>
                                </svg>
                            </div>
                        </div>

                        {/* Facilitators Table */}
                        <table className="min-w-full divide-y divide-gray-200 rounded-lg border border-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="table-header-concrete px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg" scope="col">Facilitator Name</th>
                                    <th className="table-header-concrete px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" scope="col">Company</th>
                                    <th className="table-header-concrete px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" scope="col">Program</th>
                                    <th className="table-header-concrete px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" scope="col">NQF Level</th>
                                    <th className="table-header-concrete px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" scope="col">ID</th>
                                    <th className="table-header-concrete px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" scope="col">Learner Name</th>
                                    <th className="table-header-concrete px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" scope="col">Status</th>
                                    <th className="table-header-concrete px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" scope="col">Unit Standard Title</th>
                                    <th className="table-header-concrete px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg" scope="col">Credit</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {facilitators.length === 0 ? (
                                    <tr>
                                        <td colSpan="9" className="px-4 py-8 text-center">
                                            <div className="flex flex-col items-center">
                                                <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h-2a4 4 0 01-4-4V8a4 4 0 014-4h2a4 4 0 014 4v8a4 4 0 01-4 4zM7 20h-2a4 4 0 01-4-4V8a4 4 0 014-4h2a4 4 0 014 4v8a4 4 0 01-4 4z"></path>
                                                </svg>
                                                <h3 className="text-lg font-medium text-gray-900 mb-2">No Facilitator Records</h3>
                                                <p className="text-gray-500 mb-4">No facilitator records found.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    facilitators.map((facilitator) => (
                                        <tr 
                                            key={facilitator.id} 
                                            className="hover:bg-gray-50 transition-colors duration-200"
                                        >
                                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{facilitator.name || 'N/A'}</td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{facilitator.company || 'N/A'}</td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{facilitator.program || 'N/A'}</td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                    facilitator.nqfLevel === 'Level 1' ? 'bg-blue-100 text-blue-800' :
                                                    facilitator.nqfLevel === 'Level 2' ? 'bg-green-100 text-green-800' :
                                                    facilitator.nqfLevel === 'Level 3' ? 'bg-yellow-100 text-yellow-800' :
                                                    facilitator.nqfLevel === 'Level 4' ? 'bg-purple-100 text-purple-800' :
                                                    facilitator.nqfLevel === 'Level 5' ? 'bg-indigo-100 text-indigo-800' :
                                                    facilitator.nqfLevel === 'Level 6' ? 'bg-pink-100 text-pink-800' :
                                                    facilitator.nqfLevel === 'Level 7' ? 'bg-red-100 text-red-800' :
                                                    facilitator.nqfLevel === 'Level 8' ? 'bg-gray-100 text-gray-800' :
                                                    'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {facilitator.nqfLevel || 'Level 1'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{facilitator.id || 'N/A'}</td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{facilitator.learnerName || 'N/A'}</td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm">
                                                <select
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    value={facilitator.status}
                                                    onChange={(e) => {
                                                        const updatedFacilitators = facilitators.map(f => 
                                                            f.id === facilitator.id ? { ...f, status: e.target.value } : f
                                                        );
                                                        setFacilitators(updatedFacilitators);
                                                        localStorage.setItem('facilitatorsData', JSON.stringify(updatedFacilitators));
                                                    }}
                                                >
                                                    <option value="Module 1">Module 1</option>
                                                    <option value="Module 2">Module 2</option>
                                                    <option value="Module 3">Module 3</option>
                                                    <option value="Module 4">Module 4</option>
                                                </select>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{facilitator.unitStandardTitle || 'N/A'}</td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{facilitator.credit || 'N/A'}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </Card>
                    
                    {/* Bottom spacing to prevent cut-off */}
                    <div className="h-8"></div>
            </main>

            {/* Agenda Modal Form */}
            {showAgendaForm && <AgendaForm />}
            
            {/* Facilitator Modal Form */}
            {showFacilitatorForm && <FacilitatorForm key="facilitator-form" />}
            
            {/* Combined Guide */}
            <GridCardGuide 
                isActive={showGuide}
                onComplete={handleGuideComplete}
                onSkip={handleGuideSkip}
                steps={combinedGuideSteps}
            />

        </div>
    );

    return (
        <HubSpotLayout 
            title="Facilitator Log Book" 
            description="Facilitator log book and records"
        >
            {pageContent}
        </HubSpotLayout>
    );
};

export default Facilitator; 