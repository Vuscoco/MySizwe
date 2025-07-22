import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HubSpotLayout from '../components/HubSpotLayout';
import '../css/ClientCreation.css';

const ClientCreation = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        clientType: 'regular', // 'regular' or 'seta'
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
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [progress, setProgress] = useState(25);

    // Calculate form completion progress
    useEffect(() => {
        const requiredFields = {
            basic: ['clientName', 'clientReg', 'clientAddress'],
            contact: ['contactPerson', 'contactPosition', 'contactPhone', 'contactEmail'],
            business: ['seta', 'service', 'sdlNumber', 'moderator', 'qualificationType', 'qualificationLevel'],
            financial: ['retainer', 'costPerLearner']
        };

        let completedFields = 0;
        let totalFields = 0;

        Object.keys(requiredFields).forEach(tab => {
            requiredFields[tab].forEach(field => {
                totalFields++;
                if (formData[field] && formData[field].toString().trim() !== '') {
                    completedFields++;
                }
            });
        });

        const newProgress = Math.round((completedFields / totalFields) * 100);
        setProgress(newProgress);
    }, [formData]);

    // Restore form data from sessionStorage when component mounts
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

    const validateField = (name, value) => {
        const errors = {};
        
        switch (name) {
            case 'contactEmail':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (value && !emailRegex.test(value)) {
                    errors[name] = 'Please enter a valid email address';
                }
                break;
            case 'contactPhone':
                const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
                if (value && !phoneRegex.test(value.replace(/\s/g, ''))) {
                    errors[name] = 'Please enter a valid phone number';
                }
                break;
            case 'retainer':
            case 'costPerLearner':
                if (value && (isNaN(value) || parseFloat(value) < 0)) {
                    errors[name] = 'Please enter a valid amount';
                }
                break;
            default:
                if (value && value.trim() === '') {
                    errors[name] = 'This field is required';
                }
        }
        
        return errors;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }

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
            case 'skills_18_1':
                for(let i = 2; i <= 5; i++) {
                    levels.push({ value: `nqf${i}`, text: `NQF Level ${i}` });
                }
                break;
            case 'tvet_18_2':
            case 'skills_18_2':
                for(let i = 2; i <= 5; i++) {
                    levels.push({ value: `nqf${i}`, text: `NQF Level ${i}` });
                }
                break;
            case 'diploma':
                levels.push({ value: `level7`, text: `Level 6` });
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
                default:
                    return 'Document';
            }
        }
        return 'Document';
    };

    const removeAttachment = (attachmentId) => {
        setAttachments(prev => prev.filter(att => att.id !== attachmentId));
    };

    const validateForm = () => {
        const errors = {};
        const requiredFields = {
            clientName: 'Company Name',
            clientReg: 'Registration Number',
            clientAddress: 'Registered Address',
            contactPerson: 'Contact Person',
            contactPosition: 'Position',
            contactPhone: 'Phone Number',
            contactEmail: 'Email Address',
            seta: 'SETA',
            service: 'Service Type',
            sdlNumber: 'SDL Number',
            moderator: 'Project Manager',
            retainer: 'Monthly Retainer',
            qualificationType: 'Qualification Type',
            qualificationLevel: 'Qualification Level',
            costPerLearner: 'Cost per Learner'
        };

        Object.keys(requiredFields).forEach(field => {
            const value = formData[field];
            if (!value || value.toString().trim() === '') {
                errors[field] = `${requiredFields[field]} is required`;
            } else {
                const fieldErrors = validateField(field, value);
                Object.assign(errors, fieldErrors);
            }
        });

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        setIsSubmitting(true);
        
        try {
            // Calculate total number of learners from all services
            const totalLearners = formData.services.reduce((total, service) => {
                return total + (parseInt(service.rate) || 0);
            }, 0);

            // Create new client data for the Clients.js table with ALL form fields
            const newClient = {
                id: Date.now(),
                // Basic Information
                clientType: formData.clientType || 'regular',
                clientName: formData.clientName.trim(),
                clientReg: formData.clientReg.trim(),
                clientAddress: formData.clientAddress.trim(),
                
                // Contact Information
                contactPerson: formData.contactPerson.trim(),
                contactPosition: formData.contactPosition.trim(),
                contactPhone: formData.contactPhone.trim(),
                contactEmail: formData.contactEmail.trim(),
                
                // Business Details
                seta: formData.seta?.toUpperCase() || '',
                service: formData.service?.toUpperCase() || '',
                sdlNumber: formData.sdlNumber.trim(),
                moderator: formData.moderator.trim(),
                qualificationType: formData.qualificationType || '',
                qualificationLevel: formData.qualificationLevel || '',
                
                // Financial Information
                monthlyRetainer: parseFloat(formData.retainer) || 0,
                paymentTerms: `${formData.paymentTerms || '30'} Days`,
                costPerLearner: parseFloat(formData.costPerLearner) || 0,
                totalValue: (parseFloat(formData.retainer) || 0) * 12, // Annual value
                
                // Additional Services with precise learner count
                services: formData.services || [],
                
                // Metadata
                createdFrom: 'regular',
                lastContact: new Date().toISOString().split('T')[0],
                nextFollowUp: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                createdAt: new Date().toISOString(),
                totalLearners: totalLearners, // Precise tally of all learners
                
                // Files and Attachments
                slaFile: slaFileName || null,
                attachments: attachments || [],
                
                // System Fields
                status: 'Active',
                lastContact: new Date().toISOString().split('T')[0],
                nextFollowUp: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 15 days from now
                createdAt: new Date().toISOString()
            };

            // Save to localStorage for Clients.js table
            const existingClients = JSON.parse(localStorage.getItem('clientsData') || '[]');
            const updatedClients = [...existingClients, newClient];
            localStorage.setItem('clientsData', JSON.stringify(updatedClients));

            // Clear sessionStorage after successful submission
            sessionStorage.removeItem('slaPreviewData');
            
            console.log('Client saved successfully:', newClient);
            
            // Show success message and navigate to Clients page
            alert('Client created successfully!');
            navigate('/clients');
            
        } catch (error) {
            console.error('Error creating client:', error);
            alert('Error creating client. Please try again.');
        } finally {
            setIsSubmitting(false);
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
            business: ['seta', 'service', 'sdlNumber', 'moderator', 'qualificationType', 'qualificationLevel'],
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
                                <p>Enter the fundamental details about this client organization</p>
                            </div>
                            
                            <div className="form-section">
                                <div className="form-group">
                                    <label htmlFor="clientType">Client Type</label>
                                    <select 
                                        id="clientType" 
                                        name="clientType" 
                                        value={formData.clientType}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="regular">Regular Client</option>
                                        <option value="seta">SETA Client</option>
                                    </select>
                                    <small>Select whether this is a regular client or a SETA (Sector Education and Training Authority) client</small>
                                </div>
                                
                                <div className="form-row">
                                    <div className={`form-group ${formErrors.clientName ? 'error' : ''}`}>
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
                                        {formErrors.clientName && (
                                            <div className="error-message">{formErrors.clientName}</div>
                                        )}
                                    </div>
                                    <div className={`form-group ${formErrors.clientReg ? 'error' : ''}`}>
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
                                        {formErrors.clientReg && (
                                            <div className="error-message">{formErrors.clientReg}</div>
                                        )}
                                    </div>
                                </div>
                                
                                <div className={`form-group ${formErrors.clientAddress ? 'error' : ''}`}>
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
                                    {formErrors.clientAddress && (
                                        <div className="error-message">{formErrors.clientAddress}</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Contact Details Tab */}
                    {activeTab === 'contact' && (
                        <div className="tab-content">
                            <div className="section-header">
                                <h2>Contact Information</h2>
                                <p>Primary contact details for this client organization</p>
                            </div>
                            
                            <div className="form-section">
                                <div className="form-row">
                                    <div className={`form-group ${formErrors.contactPerson ? 'error' : ''}`}>
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
                                        {formErrors.contactPerson && (
                                            <div className="error-message">{formErrors.contactPerson}</div>
                                        )}
                                    </div>
                                    <div className={`form-group ${formErrors.contactPosition ? 'error' : ''}`}>
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
                                        {formErrors.contactPosition && (
                                            <div className="error-message">{formErrors.contactPosition}</div>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="form-row">
                                    <div className={`form-group ${formErrors.contactPhone ? 'error' : ''}`}>
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
                                        {formErrors.contactPhone && (
                                            <div className="error-message">{formErrors.contactPhone}</div>
                                        )}
                                    </div>
                                    <div className={`form-group ${formErrors.contactEmail ? 'error' : ''}`}>
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
                                        {formErrors.contactEmail && (
                                            <div className="error-message">{formErrors.contactEmail}</div>
                                        )}
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
                                <p>SETA and service information for this client</p>
                            </div>
                            
                            <div className="form-section">
                                <div className="form-row">
                                    <div className={`form-group ${formErrors.seta ? 'error' : ''}`}>
                                        <label htmlFor="seta">SETA</label>
                                        <select 
                                            id="seta" 
                                            name="seta" 
                                            value={formData.seta}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="" disabled>Select SETA</option>
                                            <option value="wrseta">WRSETA</option>
                                            <option value="chieta">CHIETA</option>
                                            <option value="bankseta">BANKSETA</option>
                                            <option value="fasset">FASSET</option>
                                            <option value="cftl">CFTL</option>
                                            <option value="ceta">CETA</option>
                                            <option value="ctfl">CTFL</option>
                                            <option value="eseta">ESETA</option>
                                            <option value="hwseta">HWSETA</option>
                                            <option value="isett">ISETT</option>
                                            <option value="inseta">INSETA</option>
                                            <option value="lgseta">LGSETA</option>
                                            <option value="merseta">MERSETA</option>
                                            <option value="sassetta">SASSETA</option>
                                            <option value="agriseta">AGRISETA</option>
                                            <option value="dseta">DSETA</option>
                                            <option value="theta">THETA</option>
                                            <option value="teta">TETA</option>
                                        </select>
                                        {formErrors.seta && (
                                            <div className="error-message">{formErrors.seta}</div>
                                        )}
                                    </div>
                                    <div className={`form-group ${formErrors.service ? 'error' : ''}`}>
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
                                        {formErrors.service && (
                                            <div className="error-message">{formErrors.service}</div>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="form-row">
                                    <div className={`form-group ${formErrors.sdlNumber ? 'error' : ''}`}>
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
                                        {formErrors.sdlNumber && (
                                            <div className="error-message">{formErrors.sdlNumber}</div>
                                        )}
                                    </div>
                                    <div className={`form-group ${formErrors.moderator ? 'error' : ''}`}>
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
                                        {formErrors.moderator && (
                                            <div className="error-message">{formErrors.moderator}</div>
                                        )}
                                    </div>
                                </div>

                                <div className="section-header">
                                    <h3>Qualification Details</h3>
                                </div>
                                
                                <div className="form-row">
                                    <div className={`form-group ${formErrors.qualificationType ? 'error' : ''}`}>
                                        <label htmlFor="qualificationType">Qualification Type</label>
                                        <select 
                                            id="qualificationType" 
                                            name="qualificationType" 
                                            value={formData.qualificationType}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="" disabled>Select Qualification</option>
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
                                        </select>
                                        {formErrors.qualificationType && (
                                            <div className="error-message">{formErrors.qualificationType}</div>
                                        )}
                                    </div>
                                    <div className={`form-group ${formErrors.qualificationLevel ? 'error' : ''}`}>
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
                                        {formErrors.qualificationLevel && (
                                            <div className="error-message">{formErrors.qualificationLevel}</div>
                                        )}
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
                                <p>Pricing and payment details for this client</p>
                            </div>
                            
                            <div className="form-section">
                                <div className="form-row">
                                    <div className={`form-group ${formErrors.retainer ? 'error' : ''}`}>
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
                                        {formErrors.retainer && (
                                            <div className="error-message">{formErrors.retainer}</div>
                                        )}
                                    </div>
                                    <div className={`form-group ${formErrors.costPerLearner ? 'error' : ''}`}>
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
                                        {formErrors.costPerLearner && (
                                            <div className="error-message">{formErrors.costPerLearner}</div>
                                        )}
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
                                        disabled={isSubmitting}
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
                                        {isSubmitting ? (
                                            <>
                                                <svg className="animate-spin" width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginRight: '8px' }}>
                                                    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="2" strokeDasharray="32" strokeDashoffset="32"/>
                                                </svg>
                                                Creating...
                                            </>
                                        ) : (
                                            'Create client'
                                        )}
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
            title="Create Client" 
            description="Create a new client record"
        >
            {pageContent}
        </HubSpotLayout>
    );
};

export default ClientCreation; 