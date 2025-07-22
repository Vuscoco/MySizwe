import React, { useState, useEffect } from 'react';
import '../css/slamodal.css';

const SLAModal = ({ isOpen, onClose, clientData, mode = 'view', onSave, onDelete }) => {
    const [formData, setFormData] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [qualificationLevels, setQualificationLevels] = useState([]);
    const [attachments, setAttachments] = useState([]);
    const [activeTab, setActiveTab] = useState('basic');
    const [progress, setProgress] = useState(25);

    useEffect(() => {
        if (clientData) {
            // Convert the client data format to match the SETA funded client creation form structure
            const convertedData = {
                id: clientData.id,
                clientType: clientData.clientType || 'regular',
                clientName: clientData.clientName || '',
                clientReg: clientData.clientReg || '',
                clientAddress: clientData.clientAddress || '',
                contactPerson: clientData.contactPerson || '',
                contactPosition: clientData.contactPosition || '',
                contactPhone: clientData.contactPhone || '',
                contactEmail: clientData.contactEmail || '',
                seta: clientData.seta || '',
                service: clientData.service || '',
                sdlNumber: clientData.sdlNumber || '',
                moderator: clientData.moderator || '',
                retainer: clientData.monthlyRetainer || clientData.retainer || '',
                paymentTerms: clientData.paymentTerms ? clientData.paymentTerms.replace(' Days', '') : '30',
                qualificationType: clientData.qualificationType || '',
                qualificationLevel: clientData.qualificationLevel || '',
                costPerLearner: clientData.costPerLearner || '',
                services: clientData.services || [{ type: 'trench1', rate: '', recurring: false }],
                // Additional fields that correlate with SETA funded form
                totalValue: clientData.totalValue || 0,
                lastContact: clientData.lastContact || '',
                nextFollowUp: clientData.nextFollowUp || '',
                status: clientData.status || 'Active',
                createdAt: clientData.createdAt || ''
            };
            setFormData(convertedData);
            if (convertedData.qualificationType) {
                updateQualificationLevels(convertedData.qualificationType);
            }
        }
    }, [clientData]);

    useEffect(() => {
        setIsEditing(mode === 'edit');
    }, [mode]);

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
    };

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

    const handleSave = () => {
        if (onSave) {
            // Convert back to the expected format, correlating with SETA funded form structure
            const saveData = {
                ...formData,
                monthlyRetainer: parseFloat(formData.retainer) || 0,
                paymentTerms: `${formData.paymentTerms} Days`,
                costPerLearner: parseFloat(formData.costPerLearner) || 0,
                totalValue: (parseFloat(formData.retainer) || 0) * 12,
                lastContact: formData.lastContact || new Date().toISOString().split('T')[0],
                nextFollowUp: formData.nextFollowUp || new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                status: formData.status || 'Active',
                createdAt: formData.createdAt || new Date().toISOString()
            };
            onSave(saveData);
        }
        setIsEditing(false);
    };

    const handleDelete = () => {
        const confirmDelete = window.confirm(
            'Are you sure you want to delete this client?\n\n' +
            'This action cannot be undone and will permanently remove all client data.'
        );
        
        if (confirmDelete) {
            if (onDelete) {
                onDelete(clientData.id);
            }
            onClose();
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        if (isEditing) {
            setIsEditing(false);
            // Reset to original data, correlating with SETA funded form structure
            if (clientData) {
                const convertedData = {
                    id: clientData.id,
                    clientType: clientData.clientType || 'regular',
                    clientName: clientData.clientName || '',
                    clientReg: clientData.clientReg || '',
                    clientAddress: clientData.clientAddress || '',
                    contactPerson: clientData.contactPerson || '',
                    contactPosition: clientData.contactPosition || '',
                    contactPhone: clientData.contactPhone || '',
                    contactEmail: clientData.contactEmail || '',
                    seta: clientData.seta || '',
                    service: clientData.service || '',
                    sdlNumber: clientData.sdlNumber || '',
                    moderator: clientData.moderator || '',
                    retainer: clientData.monthlyRetainer || clientData.retainer || '',
                    paymentTerms: clientData.paymentTerms ? clientData.paymentTerms.replace(' Days', '') : '30',
                    qualificationType: clientData.qualificationType || '',
                    qualificationLevel: clientData.qualificationLevel || '',
                    costPerLearner: clientData.costPerLearner || '',
                    services: clientData.services || [{ type: 'trench1', rate: '', recurring: false }],
                    // Additional fields that correlate with SETA funded form
                    totalValue: clientData.totalValue || 0,
                    lastContact: clientData.lastContact || '',
                    nextFollowUp: clientData.nextFollowUp || '',
                    status: clientData.status || 'Active',
                    createdAt: clientData.createdAt || ''
                };
                setFormData(convertedData);
            }
        } else {
            onClose();
        }
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

    if (!isOpen) return null;

    return (
        <div className="sla-modal-overlay">
            <div className="sla-modal">
                <div className="sla-modal-header">
                    <div className="header-content">
                        <div className="header-icon">
                            <i className="fas fa-file-contract"></i>
                        </div>
                        <div className="header-text">
                            <h2>{isEditing ? 'Edit Client' : 'Client Details'}</h2>
                            <p className="subtitle">
                                {isEditing ? 'Modify client information' : 'View complete client record'}
                            </p>
                        </div>
                    </div>
                    <div className="sla-modal-actions">
                        {!isEditing && mode === 'view' && (
                            <button className="action-btn edit-btn" onClick={handleEdit} title="Edit">
                                <i className="fas fa-edit"></i>
                            </button>
                        )}
                        {!isEditing && (
                            <button className="action-btn delete-btn" onClick={handleDelete} title="Delete">
                                <i className="fas fa-trash"></i>
                            </button>
                        )}
                        <button className="action-btn close-btn" onClick={handleCancel} title="Close">
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
                </div>

                {/* Progress Indicator */}
                <div className="progress-indicator">
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>
                        Form Completion: {progress}%
                    </span>
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>

                <div className="sla-modal-content">
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
                                    {isEditing ? (
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
                                    ) : (
                                        <span className="sla-value">{formData.clientType === 'seta' ? 'SETA Client' : 'Regular Client'}</span>
                                    )}
                                    <small>Select whether this is a regular client or a SETA (Sector Education and Training Authority) client</small>
                                </div>
                                
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="clientName">Company Name</label>
                                        {isEditing ? (
                                            <input 
                                                type="text" 
                                                id="clientName" 
                                                name="clientName" 
                                                value={formData.clientName}
                                                onChange={handleInputChange}
                                                placeholder="Enter the full company name"
                                                required 
                                            />
                                        ) : (
                                            <span className="sla-value">{formData.clientName || 'N/A'}</span>
                                        )}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="clientReg">Registration Number</label>
                                        {isEditing ? (
                                            <input 
                                                type="text" 
                                                id="clientReg" 
                                                name="clientReg" 
                                                value={formData.clientReg}
                                                onChange={handleInputChange}
                                                placeholder="Enter company registration number"
                                                required 
                                            />
                                        ) : (
                                            <span className="sla-value">{formData.clientReg || 'N/A'}</span>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="form-group">
                                    <label htmlFor="clientAddress">Registered Address</label>
                                    {isEditing ? (
                                        <textarea 
                                            id="clientAddress" 
                                            name="clientAddress" 
                                            value={formData.clientAddress}
                                            onChange={handleInputChange}
                                            placeholder="Enter the complete registered business address"
                                            rows="3"
                                            required 
                                        ></textarea>
                                    ) : (
                                        <span className="sla-value">{formData.clientAddress || 'N/A'}</span>
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
                                    <div className="form-group">
                                        <label htmlFor="contactPerson">Contact Person</label>
                                        {isEditing ? (
                                            <input 
                                                type="text" 
                                                id="contactPerson" 
                                                name="contactPerson" 
                                                value={formData.contactPerson}
                                                onChange={handleInputChange}
                                                placeholder="Enter the primary contact person's name"
                                                required 
                                            />
                                        ) : (
                                            <span className="sla-value">{formData.contactPerson || 'N/A'}</span>
                                        )}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="contactPosition">Position</label>
                                        {isEditing ? (
                                            <input 
                                                type="text" 
                                                id="contactPosition" 
                                                name="contactPosition" 
                                                value={formData.contactPosition}
                                                onChange={handleInputChange}
                                                placeholder="Enter their job title or position"
                                                required 
                                            />
                                        ) : (
                                            <span className="sla-value">{formData.contactPosition || 'N/A'}</span>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="contactPhone">Phone Number</label>
                                        {isEditing ? (
                                            <input 
                                                type="tel" 
                                                id="contactPhone" 
                                                name="contactPhone" 
                                                value={formData.contactPhone}
                                                onChange={handleInputChange}
                                                placeholder="Enter contact phone number"
                                                required 
                                            />
                                        ) : (
                                            <span className="sla-value">{formData.contactPhone || 'N/A'}</span>
                                        )}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="contactEmail">Email Address</label>
                                        {isEditing ? (
                                            <input 
                                                type="email" 
                                                id="contactEmail" 
                                                name="contactEmail" 
                                                value={formData.contactEmail}
                                                onChange={handleInputChange}
                                                placeholder="Enter contact email address"
                                                required 
                                            />
                                        ) : (
                                            <span className="sla-value">{formData.contactEmail || 'N/A'}</span>
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
                                    <div className="form-group">
                                        <label htmlFor="seta">SETA</label>
                                        {isEditing ? (
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
                                        ) : (
                                            <span className="sla-value">{formData.seta || 'N/A'}</span>
                                        )}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="service">Service Type</label>
                                        {isEditing ? (
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
                                        ) : (
                                            <span className="sla-value">{formData.service || 'N/A'}</span>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="sdlNumber">SDL Number</label>
                                        {isEditing ? (
                                            <input 
                                                type="text" 
                                                id="sdlNumber" 
                                                name="sdlNumber" 
                                                value={formData.sdlNumber}
                                                onChange={handleInputChange}
                                                placeholder="Enter SDL number"
                                                required 
                                            />
                                        ) : (
                                            <span className="sla-value">{formData.sdlNumber || 'N/A'}</span>
                                        )}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="moderator">Project Manager</label>
                                        {isEditing ? (
                                            <input 
                                                type="text" 
                                                id="moderator" 
                                                name="moderator" 
                                                value={formData.moderator}
                                                onChange={handleInputChange}
                                                placeholder="Enter project manager name"
                                                required 
                                            />
                                        ) : (
                                            <span className="sla-value">{formData.moderator || 'N/A'}</span>
                                        )}
                                    </div>
                                </div>

                                <div className="section-header">
                                    <h3>Qualification Details</h3>
                                </div>
                                
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="qualificationType">Qualification Type</label>
                                        {isEditing ? (
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
                                        ) : (
                                            <span className="sla-value">{formData.qualificationType || 'N/A'}</span>
                                        )}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="qualificationLevel">Qualification Level</label>
                                        {isEditing ? (
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
                                        ) : (
                                            <span className="sla-value">{formData.qualificationLevel || 'N/A'}</span>
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
                                    <div className="form-group">
                                        <label htmlFor="retainer">Monthly Retainer (R)</label>
                                        {isEditing ? (
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
                                        ) : (
                                            <span className="sla-value">R {formData.retainer || '0.00'}</span>
                                        )}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="costPerLearner">Cost per Learner (R)</label>
                                        {isEditing ? (
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
                                        ) : (
                                            <span className="sla-value">R {formData.costPerLearner || '0.00'}</span>
                                        )}
                                    </div>
                                </div>

                                <div className="section-header">
                                    <h3>Additional Services</h3>
                                </div>
                                
                                <div className="services-section">
                                    {formData.services && formData.services.map((service, index) => (
                                        <div key={index} className="service-item">
                                            <div className="form-row">
                                                <div className="form-group">
                                                    <label>Document Type</label>
                                                    {isEditing ? (
                                                        <select 
                                                            value={service.type}
                                                            onChange={(e) => handleServiceChange(index, 'type', e.target.value)}
                                                        >
                                                            <option value="trench1">Award Letter</option>
                                                            <option value="trench2">Seta Contract</option>
                                                            <option value="trench3">SLA</option>
                                                        </select>
                                                    ) : (
                                                        <span className="sla-value">{service.type}</span>
                                                    )}
                                                </div>
                                                <div className="form-group">
                                                    <label>Number of Learners</label>
                                                    {isEditing ? (
                                                        <input 
                                                            type="number" 
                                                            value={service.rate}
                                                            onChange={(e) => handleServiceChange(index, 'rate', e.target.value)}
                                                            step="1"
                                                            placeholder="0"
                                                        />
                                                    ) : (
                                                        <span className="sla-value">{service.rate || '0'}</span>
                                                    )}
                                                </div>
                                                {isEditing && formData.services.length > 1 && (
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
                                    
                                    {isEditing && (
                                        <button type="button" className="add-service-btn" onClick={handleFileSelect}>
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                <path d="M8 1L8 15M1 8L15 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                            </svg>
                                            Upload attachment
                                        </button>
                                    )}
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
                                                    {isEditing && (
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
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
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

                <div className="sla-modal-footer">
                    {isEditing ? (
                        <div className="footer-actions">
                            <button className="btn-secondary" onClick={handleCancel}>
                                <i className="fas fa-times"></i>
                                Cancel
                            </button>
                            <button className="btn-primary" onClick={handleSave}>
                                <i className="fas fa-save"></i>
                                Save Changes
                            </button>
                        </div>
                    ) : (
                        <div className="footer-actions">
                            <button className="btn-secondary" onClick={onClose}>
                                <i className="fas fa-times"></i>
                                Close
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SLAModal; 