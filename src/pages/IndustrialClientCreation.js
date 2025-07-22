import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HubSpotLayout from '../components/HubSpotLayout';
import '../css/ClientCreation.css';

const IndustrialClientCreation = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        clientName: '',
        clientReg: '',
        clientAddress: '',
        contactPerson: '',
        contactPosition: '',
        contactPhone: '',
        contactEmail: '',
        seta: '',
        service: '',
        sdlNumber: '',
        moderator: '',
        retainer: '',
        paymentTerms: '30',
        qualificationType: '',
        qualificationLevel: '',
        costPerLearner: '',
        services: [{ type: 'trench1', rate: '', recurring: false }]
    });

    const [qualificationLevels, setQualificationLevels] = useState([]);
    const [slaFile, setSlaFile] = useState(null);
    const [slaFileName, setSlaFileName] = useState('');
    const [attachments, setAttachments] = useState([]);
    const [activeTab, setActiveTab] = useState('basic');
    const [progress, setProgress] = useState(25);

    // Restore form data from sessionStorage when component mounts or returns from preview
    useEffect(() => {
        const savedData = sessionStorage.getItem('slaPreviewData');
        if (savedData) {
            try {
                const parsedData = JSON.parse(savedData);
                setFormData(parsedData);
                
                // Restore SLA file information if it exists
                if (parsedData.slaFileName) {
                    setSlaFileName(parsedData.slaFileName);
                }
                if (parsedData.slaFile) {
                    setSlaFile(parsedData.slaFile);
                }
                
                // Also restore qualification levels if qualification type exists
                if (parsedData.qualificationType) {
                    updateQualificationLevels(parsedData.qualificationType);
                }
            } catch (error) {
                console.error('Error restoring form data:', error);
            }
        }
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (name === 'qualificationType') {
            updateQualificationLevels(value);
        }
    };

    const updateQualificationLevels = (qualificationType) => {
        let levels = [];
        switch(qualificationType) {
            case 'ncv':
                for(let i = 1; i <= 4; i++) {
                    levels.push({ value: `level${i}`, text: `Level ${i}` });
                }
                break;
            case 'tvet_18_1':
            case 'tvet_18_2':
                for(let i = 1; i <= 6; i++) {
                    levels.push({ value: `nqf${i}`, text: `NQF Level ${i}` });
                }
                break;
            case 'diploma':
                for(let i = 3; i <= 6; i++) {
                    levels.push({ value: `level${i}`, text: `Level ${i}` });
                }
                break;
            case 'unemployed_learnership':
            case 'employed_learnership':
                for(let i = 1; i <= 8; i++) {
                    levels.push({ value: `nqf${i}`, text: `NQF Level ${i}` });
                }
                break;
            case 'graduate':
                for(let i = 5; i <= 10; i++) {
                    levels.push({ value: `nqf${i}`, text: `NQF Level ${i}` });
                }
                break;
            case 'degree':
                for(let i = 7; i <= 9; i++) {
                    levels.push({ value: `nqf${i}`, text: `NQF Level ${i}` });
                }
                break;
            case 'oc_18_1':
            case 'oc_18_2':
            case 'oc_18_4':
            case 'oc_18_5':
            case 'oc_18_6':
            case 'oc_18_7':
            case 'oc_18_8':
            case 'oc_18_9':
                for(let i = 1; i <= 8; i++) {
                    levels.push({ value: `nqf${i}`, text: `NQF Level ${i}` });
                }
                break;
            default:
                levels = [];
        }
        setQualificationLevels(levels);
        // Only reset qualificationLevel if it's not a restoration from sessionStorage
        if (!sessionStorage.getItem('slaPreviewData')) {
            setFormData(prev => ({ ...prev, qualificationLevel: '' }));
        }
    };

    const handleServiceChange = (index, field, value) => {
        const updatedServices = [...formData.services];
        updatedServices[index] = { ...updatedServices[index], [field]: value };
        setFormData(prev => ({ ...prev, services: updatedServices }));
    };

    const addService = () => {
        setFormData(prev => ({
            ...prev,
            services: [...prev.services, { type: 'trench1', rate: '', recurring: false }]
        }));
    };

    const handleSLAFileSelect = () => {
        // Create a hidden file input
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.pdf,.doc,.docx,.txt'; // Accept common document formats
        fileInput.style.display = 'none';
        
        fileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                setSlaFile(file);
                setSlaFileName(file.name);
            }
        };
        
        // Trigger file selection
        fileInput.click();
    };

    const removeService = (index) => {
        setFormData(prev => ({
            ...prev,
            services: prev.services.filter((_, i) => i !== index)
        }));
    };

    const handleFileSelect = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;
        input.accept = '*/*';
        
        input.onchange = (e) => {
            const files = Array.from(e.target.files);
            const currentDocumentType = getDocumentType();
            
            const newAttachments = files.map(file => ({
                id: Date.now() + Math.random(),
                name: file.name,
                size: file.size,
                type: file.type,
                file: file,
                documentType: currentDocumentType
            }));
            setAttachments(prev => [...prev, ...newAttachments]);
        };
        
        input.click();
    };

    const getDocumentType = () => {
        // Get the selected service type from the first service
        if (formData.services && formData.services.length > 0) {
            const serviceType = formData.services[0].type;
            switch(serviceType) {
                case 'trench1':
                    return 'Award Letter';
                case 'trench2':
                    return 'Seta Contract';
                case 'trench3':
                    return 'SLA';
                case 'trench4':
                    return 'SLA';
                default:
                    return 'Document';
            }
        }
        return 'Document';
    };

    const removeAttachment = (attachmentId) => {
        setAttachments(prev => prev.filter(att => att.id !== attachmentId));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            // Here you would typically send the data to your backend
            console.log('Industrial Form data:', formData);
            
            // Call the proper addNewClient function from Clients.js
            if (window.addNewClientToClientsPage) {
                window.addNewClientToClientsPage(formData);
            } else {
                // Fallback: Save to localStorage directly with complete data
                const existingClients = JSON.parse(localStorage.getItem('clientsData') || '[]');
                const newClient = {
                    id: Date.now(),
                    clientName: formData.clientName || '',
                    clientReg: formData.clientReg || '',
                    clientAddress: formData.clientAddress || '',
                    seta: formData.seta?.toUpperCase() || '',
                    service: formData.service?.toUpperCase() || '',
                    status: 'Active',
                    contactPerson: formData.contactPerson || '',
                    contactPosition: formData.contactPosition || '',
                    contactPhone: formData.contactPhone || '',
                    contactEmail: formData.contactEmail || '',
                    sdlNumber: formData.sdlNumber || '',
                    moderator: formData.moderator || '',
                    monthlyRetainer: parseFloat(formData.retainer) || 0,
                    paymentTerms: `${formData.paymentTerms || '30'} Days`,
                    qualificationType: formData.qualificationType || '',
                    qualificationLevel: formData.qualificationLevel || '',
                    costPerLearner: parseFloat(formData.costPerLearner) || 0,
                    totalValue: (parseFloat(formData.retainer) || 0) * 12,
                    lastContact: new Date().toISOString().split('T')[0],
                    nextFollowUp: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    services: formData.services || [],
                    slaFile: slaFileName || null,
                    clientType: 'industrial',
                    createdFrom: 'industrial',
                    createdAt: new Date().toISOString()
                };
                
                const updatedClients = [...existingClients, newClient];
                localStorage.setItem('clientsData', JSON.stringify(updatedClients));
            }
            

            
            // Clear sessionStorage only after successful submission
            sessionStorage.removeItem('slaPreviewData');
            
            alert('Industrial Client created successfully!');
            navigate('/clients');
        } catch (error) {
            console.error('Error creating Industrial client:', error);
            alert('Error creating Industrial client. Please try again.');
        }
    };

    const previewSLA = () => {
        // Store form data in sessionStorage for preview, including SLA file info
        const dataToStore = {
            ...formData,
            slaFileName: slaFileName,
            slaFile: slaFile
        };
        sessionStorage.setItem('slaPreviewData', JSON.stringify(dataToStore));
        // Navigate to preview page
        navigate('/sla-preview');
    };

    const getTabStatus = (tabName) => {
        const requiredFields = {
            basic: ['clientName', 'clientReg', 'clientAddress'],
            contact: ['contactPerson', 'contactPosition', 'contactPhone', 'contactEmail'],
            business: ['service', 'sdlNumber', 'moderator', 'qualificationType', 'qualificationLevel'],
            financial: ['retainer', 'costPerLearner']
        };

        const fields = requiredFields[tabName] || [];
        const completed = fields.every(field => formData[field] && formData[field].toString().trim() !== '');
        return completed ? 'completed' : 'incomplete';
    };

    // (move all code from return into a variable)
    const pageContent = (
        <>
            {/* Progress Indicator */}
            <div className="hubspot-content">
                <div className="progress-indicator">
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>
                        Form Completion: {progress}%
                    </span>
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>
            </div>

            {/* HubSpot-style Form Content */}
            <div className="hubspot-content">
                <form onSubmit={handleSubmit} className="hubspot-form">
                    
                    {/* Basic Information Tab */}
                    {activeTab === 'basic' && (
                        <div className="tab-content">
                            <div className="section-header">
                                <h2>Basic Information</h2>
                                <p>Enter the fundamental details about this industrial client organization</p>
                            </div>
                            
                            <div className="form-section">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="clientName">Company Name</label>
                                        <input 
                                            type="text" 
                                            id="clientName" 
                                            name="clientName" 
                                            value={formData.clientName}
                                            onChange={handleInputChange}
                                            placeholder="Enter the full company name"
                                            required 
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="clientReg">Registration Number</label>
                                        <input 
                                            type="text" 
                                            id="clientReg" 
                                            name="clientReg" 
                                            value={formData.clientReg}
                                            onChange={handleInputChange}
                                            placeholder="Enter company registration number"
                                            required 
                                        />
                                    </div>
                                </div>
                                
                                <div className="form-group">
                                    <label htmlFor="clientAddress">Registered Address</label>
                                    <textarea 
                                        id="clientAddress" 
                                        name="clientAddress" 
                                        value={formData.clientAddress}
                                        onChange={handleInputChange}
                                        placeholder="Enter the complete registered business address"
                                        rows="3"
                                        required 
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Contact Details Tab */}
                    {activeTab === 'contact' && (
                        <div className="tab-content">
                            <div className="section-header">
                                <h2>Contact Information</h2>
                                <p>Primary contact details for this industrial client organization</p>
                            </div>
                            
                            <div className="form-section">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="contactPerson">Contact Person</label>
                                        <input 
                                            type="text" 
                                            id="contactPerson" 
                                            name="contactPerson" 
                                            value={formData.contactPerson}
                                            onChange={handleInputChange}
                                            placeholder="Enter the primary contact person's name"
                                            required 
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="contactPosition">Position</label>
                                        <input 
                                            type="text" 
                                            id="contactPosition" 
                                            name="contactPosition" 
                                            value={formData.contactPosition}
                                            onChange={handleInputChange}
                                            placeholder="Enter their job title or position"
                                            required 
                                        />
                                    </div>
                                </div>
                                
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="contactPhone">Phone Number</label>
                                        <input 
                                            type="tel" 
                                            id="contactPhone" 
                                            name="contactPhone" 
                                            value={formData.contactPhone}
                                            onChange={handleInputChange}
                                            placeholder="Enter contact phone number"
                                            required 
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="contactEmail">Email Address</label>
                                        <input 
                                            type="email" 
                                            id="contactEmail" 
                                            name="contactEmail" 
                                            value={formData.contactEmail}
                                            onChange={handleInputChange}
                                            placeholder="Enter contact email address"
                                            required 
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Business Details Tab */}
                    {activeTab === 'business' && (
                        <div className="tab-content">
                            <div className="section-header">
                                <h2>Business Details</h2>
                                <p>SETA and service information for this industrial client</p>
                            </div>
                            
                            <div className="form-section">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="service">Service Type</label>
                                        <select 
                                            id="service" 
                                            name="service" 
                                            value={formData.service}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="" disabled>Select Service</option>
                                            <option value="wsp">WSP</option>
                                            <option value="hr">HR</option>
                                            <option value="both">Both WSP & HR</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="sdlNumber">SDL Number</label>
                                        <input 
                                            type="text" 
                                            id="sdlNumber" 
                                            name="sdlNumber" 
                                            value={formData.sdlNumber}
                                            onChange={handleInputChange}
                                            placeholder="Enter SDL number"
                                            required 
                                        />
                                    </div>
                                </div>
                                
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="moderator">Project Manager</label>
                                        <input 
                                            type="text" 
                                            id="moderator" 
                                            name="moderator" 
                                            value={formData.moderator}
                                            onChange={handleInputChange}
                                            placeholder="Enter project manager name"
                                            required 
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="qualificationType">Qualification Type</label>
                                        <select 
                                            id="qualificationType" 
                                            name="qualificationType" 
                                            value={formData.qualificationType}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="" disabled>Select Qualification</option>
                                            <option value="graduate">Graduate</option>
                                            <option value="diploma">Diploma (Graduate)</option>
                                            <option value="degree">Degree (Graduate)</option>
                                            <option value="ncv">NC(Vocational)</option>
                                            <option value="tvet_18_1">Learnership Programme (18.1)</option>
                                            <option value="tvet_18_2">Learnership Programme (18.2)</option>
                                            <option value="skills_18_1">Skills Programme (18.1)</option>
                                            <option value="skills_18_2">Skills Programme (18.2)</option>
                                            <option value="oc_18_1">Occupational Certificate (18.1)</option>
                                            <option value="oc_18_2">Occupational Certificate (18.2)</option>
                                            <option value="bursary">Bursary</option>
                                            <option value="oc_18_4">Occupational Certificate (18.1)</option>
                                            <option value="oc_18_5">Occupational Certificate (18.2)</option>
                                            <option value="oc_18_6">Occupational Certificate (18.1)</option>
                                            <option value="oc_18_7">Occupational Certificate (18.2)</option>
                                            <option value="oc_18_8">Occupational Certificate (18.1)</option>
                                            <option value="oc_18_9">Occupational Certificate (18.2)</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="qualificationLevel">Qualification Level</label>
                                        <select 
                                            id="qualificationLevel" 
                                            name="qualificationLevel" 
                                            value={formData.qualificationLevel}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="" disabled>Select Level</option>
                                            {qualificationLevels.map((level, index) => (
                                                <option key={index} value={level.value}>
                                                    {level.text}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Financial Information Tab */}
                    {activeTab === 'financial' && (
                        <div className="tab-content">
                            <div className="section-header">
                                <h2>Financial Information</h2>
                                <p>Pricing and payment details for this industrial client</p>
                            </div>
                            
                            <div className="form-section">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="retainer">Monthly Retainer (R)</label>
                                        <input 
                                            type="number" 
                                            id="retainer" 
                                            name="retainer" 
                                            step="0.01" 
                                            value={formData.retainer}
                                            onChange={handleInputChange}
                                            placeholder="0.00"
                                            required 
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="costPerLearner">Cost per Learner (R)</label>
                                        <input 
                                            type="number" 
                                            id="costPerLearner" 
                                            name="costPerLearner" 
                                            step="0.01" 
                                            value={formData.costPerLearner}
                                            onChange={handleInputChange}
                                            placeholder="0.00"
                                            required 
                                        />
                                    </div>
                                </div>

                                <div className="section-header">
                                    <h3>Additional Services</h3>
                                </div>
                                
                                <div className="services-section">
                                    {formData.services.map((service, index) => (
                                        <div key={index} className="service-item">
                                            <div className="form-row">
                                                <div className="form-group">
                                                    <label>Document Type</label>
                                                    <select 
                                                        value={service.type}
                                                        onChange={(e) => handleServiceChange(index, 'type', e.target.value)}
                                                    >
                                                        <option value="trench1">Award Letter</option>
                                                        <option value="trench2">Seta Contract</option>
                                                        <option value="trench3">SLA</option>
                                                    </select>
                                                </div>
                                                <div className="form-group">
                                                    <label>Number of Learners</label>
                                                    <input 
                                                        type="number" 
                                                        value={service.rate}
                                                        onChange={(e) => handleServiceChange(index, 'rate', e.target.value)}
                                                        step="1"
                                                        placeholder="0"
                                                    />
                                                </div>
                                                {formData.services.length > 1 && (
                                                    <div className="form-group">
                                                        <button 
                                                            type="button" 
                                                            className="remove-service-btn" 
                                                            onClick={() => removeService(index)}
                                                        >
                                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                                <path d="M3 3L13 13M13 3L3 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                                            </svg>
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    
                                    <button type="button" className="add-service-btn" onClick={handleFileSelect}>
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                            <path d="M8 1L8 15M1 8L15 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                        </svg>
                                        Upload attachment
                                    </button>
                                </div>

                                {/* Attachments Section */}
                                <div className="form-section">
                                    {attachments.length > 0 && (
                                        <div className="attachments-list">
                                            {attachments
                                                .filter(attachment => attachment.documentType === getDocumentType())
                                                .map((attachment) => (
                                                <div key={attachment.id} className="attachment-item">
                                                    <div className="attachment-info">
                                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                            <path d="M8 1L15 8L8 15M1 8H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                        </svg>
                                                        <span className="attachment-name">{attachment.name}</span>
                                                        <span className="attachment-type">({attachment.documentType})</span>
                                                        <span className="attachment-size">
                                                            ({(attachment.size / 1024 / 1024).toFixed(2)} MB)
                                                        </span>
                                                    </div>
                                                    <button 
                                                        type="button" 
                                                        className="remove-attachment-btn" 
                                                        onClick={() => removeAttachment(attachment.id)}
                                                        title="Remove attachment"
                                                    >
                                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                                            <path d="M3 3L9 9M9 3L3 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                                        </svg>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Create Client Button */}
                                <div className="form-section" style={{ marginTop: '2rem', textAlign: 'center' }}>
                                    <button 
                                        type="button"
                                        className="button" 
                                        onClick={handleSubmit}
                                        style={{ 
                                            padding: '12px 32px', 
                                            fontSize: '16px', 
                                            fontWeight: '600',
                                            borderRadius: '8px',
                                            border: 'none',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            backgroundColor: '#006400',
                                            color: 'white'
                                        }}
                                    >
                                        Create Industrial Client
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </form>
            </div>

            {/* HubSpot-style Navigation Tabs */}
            <div className="hubspot-tabs">
                <div className="tab-container">
                    <button 
                        className={`tab ${activeTab === 'basic' ? 'active' : ''} ${getTabStatus('basic') === 'completed' ? 'completed' : ''}`}
                        onClick={() => setActiveTab('basic')}
                    >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M8 8C10.21 8 12 6.21 12 4C12 1.79 10.21 0 8 0C5.79 0 4 1.79 4 4C4 6.21 5.79 8 8 8ZM8 10C5.33 10 0 11.34 0 14V16H16V14C16 11.34 10.67 10 8 10Z" fill="currentColor"/>
                        </svg>
                        Basic Information
                        {getTabStatus('basic') === 'completed' && (
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginLeft: '8px' }}>
                                <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" fill="#10b981"/>
                            </svg>
                        )}
                    </button>
                    <button 
                        className={`tab ${activeTab === 'contact' ? 'active' : ''} ${getTabStatus('contact') === 'completed' ? 'completed' : ''}`}
                        onClick={() => setActiveTab('contact')}
                    >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M14 2H2C1.45 2 1 2.45 1 3V13C1 13.55 1.45 14 2 14H14C14.55 14 15 13.55 15 13V3C15 2.45 14.55 2 14 2ZM14 4L8 8.5L2 4V3L8 7.5L14 3V4Z" fill="currentColor"/>
                        </svg>
                        Contact Details
                        {getTabStatus('contact') === 'completed' && (
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginLeft: '8px' }}>
                                <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" fill="#10b981"/>
                            </svg>
                        )}
                    </button>
                    <button 
                        className={`tab ${activeTab === 'business' ? 'active' : ''} ${getTabStatus('business') === 'completed' ? 'completed' : ''}`}
                        onClick={() => setActiveTab('business')}
                    >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M12 2H4C2.9 2 2 2.9 2 4V12C2 13.1 2.9 14 4 14H12C13.1 14 14 13.1 14 12V4C14 2.9 13.1 2 12 2ZM12 12H4V4H12V12Z" fill="currentColor"/>
                        </svg>
                        Business Details
                        {getTabStatus('business') === 'completed' && (
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginLeft: '8px' }}>
                                <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" fill="#10b981"/>
                            </svg>
                        )}
                    </button>
                    <button 
                        className={`tab ${activeTab === 'financial' ? 'active' : ''} ${getTabStatus('financial') === 'completed' ? 'completed' : ''}`}
                        onClick={() => setActiveTab('financial')}
                    >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M8 0C3.58 0 0 3.58 0 8C0 12.42 3.58 16 8 16C12.42 16 16 12.42 16 8C16 3.58 12.42 0 8 0ZM8 14C4.69 14 2 11.31 2 8C2 4.69 4.69 2 8 2C11.31 2 14 4.69 14 8C14 11.31 11.31 14 8 14ZM7 4H9V8H13V10H9V14H7V10H3V8H7V4Z" fill="currentColor"/>
                        </svg>
                        Financial Information
                        {getTabStatus('financial') === 'completed' && (
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginLeft: '8px' }}>
                                <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" fill="#10b981"/>
                            </svg>
                        )}
                    </button>
                </div>
            </div>
        </>
    );

    return (
        <HubSpotLayout 
            title="Create Industrial Client" 
            description="Create a new industrial client record"
        >
            {pageContent}
        </HubSpotLayout>
    );
};

export default IndustrialClientCreation; 