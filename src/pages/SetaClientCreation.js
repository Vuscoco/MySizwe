import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HubSpotLayout from '../components/HubSpotLayout';
import '../css/SetaClientCreation.css';

const SetaClientCreation = () => {
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
            console.log('SETA Form data:', formData);
            
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
                    clientType: 'seta',
                    createdFrom: 'seta',
                    createdAt: new Date().toISOString()
                };
                
                const updatedClients = [...existingClients, newClient];
                localStorage.setItem('clientsData', JSON.stringify(updatedClients));
            }
            

            
            // Clear sessionStorage only after successful submission
            sessionStorage.removeItem('slaPreviewData');
            
            alert('SETA Client created successfully!');
            navigate('/clients');
        } catch (error) {
            console.error('Error creating SETA client:', error);
            alert('Error creating SETA client. Please try again.');
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

    // (move all code from return into a variable)
    const pageContent = (
        <>
            <div className="app-container">
                <div className="main-content" style={{ marginLeft: 0, width: '100%' }}>
                    <div className="header-container" style={{ display: 'flex', alignItems: 'center', padding: '1rem 2rem', backgroundColor: '#fff', borderBottom: '1px solid #e0e0e0' }}>
                        <button 
                            className="btn secondary" 
                            onClick={() => navigate(-1)}
                            style={{ marginRight: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        >
                            <i className="fas fa-arrow-left"></i>
                            Go Back
                        </button>
                        <div style={{ flex: 1 }}>
                            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600', color: '#333' }}>
                                <i className="fas fa-certificate" style={{ marginRight: '0.5rem', color: '#007bff' }}></i>
                                Create New SETA Client
                            </h1>
                            <p style={{ margin: '0.25rem 0 0 0', color: '#666', fontSize: '0.9rem' }}>
                                Capture a new SETA client for potential business opportunities
                            </p>
                        </div>
                    </div>
                    
                    <main className="client-form" style={{ padding: '2rem' }}>
                    <form id="clientForm" onSubmit={handleSubmit}>
                        {/* Basic Information Section */}
                        <section className="contract-section">
                            <h2><i className="fas fa-user"></i> Basic Information</h2>
                            
                            <div className="form-grid">
                                <div className="form-group">
                                    <label htmlFor="clientName">Company/Client Name</label>
                                    <input 
                                        type="text" 
                                        id="clientName" 
                                        name="clientName" 
                                        value={formData.clientName}
                                        onChange={handleInputChange}
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
                                        required 
                                    />
                                </div>
                                <div className="form-group full-width">
                                    <label htmlFor="clientAddress">Registered Address</label>
                                    <textarea 
                                        id="clientAddress" 
                                        name="clientAddress" 
                                        value={formData.clientAddress}
                                        onChange={handleInputChange}
                                        required 
                                    ></textarea>
                                </div>
                            </div>
                        </section>

                        {/* Contact Information Section */}
                        <section className="contract-section">
                            <h2><i className="fas fa-address-book"></i> Contact Information</h2>
                            
                            <div className="form-grid">
                                <div className="form-group">
                                    <label htmlFor="contactPerson">Contact Person</label>
                                    <input 
                                        type="text" 
                                        id="contactPerson" 
                                        name="contactPerson" 
                                        value={formData.contactPerson}
                                        onChange={handleInputChange}
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
                                        required 
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="contactPhone">Phone Number</label>
                                    <input 
                                        type="tel" 
                                        id="contactPhone" 
                                        name="contactPhone" 
                                        value={formData.contactPhone}
                                        onChange={handleInputChange}
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
                                        required 
                                    />
                                </div>
                            </div>
                        </section>

                        {/* SETA and Service Details Section */}
                        <section className="contract-section">
                            <h2><i className="fas fa-certificate"></i> SETA and Service Details</h2>
                            
                            <div className="form-grid">
                                <div className="form-group">
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
                                </div>
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
                                        required 
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="moderator">Project Manager</label>
                                    <input 
                                        type="text" 
                                        id="moderator" 
                                        name="moderator" 
                                        value={formData.moderator}
                                        onChange={handleInputChange}
                                        required 
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Financial Details Section */}
                        <section className="contract-section">
                            <h2><i className="fas fa-money-bill-wave"></i> Financial Details</h2>
                            
                            <div className="form-grid">
                                <div className="form-group">
                                    <label htmlFor="retainer">Monthly Retainer (R)</label>
                                    <input 
                                        type="number" 
                                        id="retainer" 
                                        name="retainer" 
                                        step="0.01" 
                                        value={formData.retainer}
                                        onChange={handleInputChange}
                                        required 
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="paymentTerms">Payment Terms</label>
                                    <select 
                                        id="paymentTerms" 
                                        name="paymentTerms" 
                                        value={formData.paymentTerms}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="30">30 Days</option>
                                        <option value="15">15 Days</option>
                                        <option value="7">7 Days</option>
                                    </select>
                                </div>
                            </div>

                            <div className="allowances-section">
                                <h3>Additional Services</h3>
                                <div id="servicesList">
                                    {formData.services.map((service, index) => (
                                        <div key={index} className="service-item">
                                            <div className="form-grid">
                                                <div className="form-group">
                                                    <label>SLA</label>
                                                    <select 
                                                        value={service.type}
                                                        onChange={(e) => handleServiceChange(index, 'type', e.target.value)}
                                                    >
                                                            <option value="trench1">Trenches 1</option>
                                                            <option value="trench2">Trenches 2</option>
                                                            <option value="trench3">Trenches 3</option>
                                                            <option value="trench4">Trenches 4</option>
                                                    </select>
                                                </div>
                                                <div className="form-group">
                                                    <label>Rate (R)</label>
                                                    <input 
                                                        type="number" 
                                                        value={service.rate}
                                                        onChange={(e) => handleServiceChange(index, 'rate', e.target.value)}
                                                        step="0.01"
                                                    />
                                                </div>
                                                <div className="form-group checkbox-group">
                                                    <label>
                                                        <input 
                                                            type="checkbox" 
                                                            checked={service.recurring}
                                                            onChange={(e) => handleServiceChange(index, 'recurring', e.target.checked)}
                                                        />
                                                        Recurring
                                                    </label>
                                                </div>
                                                {formData.services.length > 1 && (
                                                    <div className="form-group">
                                                        <button 
                                                            type="button" 
                                                            className="remove-service-btn" 
                                                            onClick={() => removeService(index)}
                                                        >
                                                            <i className="fas fa-trash"></i>
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                    <div className="form-group full-width">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <button type="button" className="add-service-btn" onClick={handleFileSelect}>
                                                <i className="fas fa-upload"></i> Upload attachment
                                        </button>

                                        </div>
                                    </div>
                            </div>

                            {/* Attachments Section */}
                            <div className="allowances-section">
                                {attachments.length > 0 && (
                                    <div className="attachments-list">
                                        {attachments
                                            .filter(attachment => attachment.documentType === getDocumentType())
                                            .map((attachment) => (
                                            <div key={attachment.id} className="attachment-item">
                                                <div className="attachment-info">
                                                    <i className="fas fa-file"></i>
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
                                                    <i className="fas fa-times"></i>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                            </div>
                        </section>

                        {/* Qualification Details Section */}
                        <section className="contract-section">
                            <h2><i className="fas fa-graduation-cap"></i> Qualification Details</h2>
                            
                            <div className="form-grid">
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
                                <div className="form-group">
                                    <label htmlFor="costPerLearner">Cost per Learner (R)</label>
                                    <input 
                                        type="number" 
                                        id="costPerLearner" 
                                        name="costPerLearner" 
                                        step="0.01" 
                                        value={formData.costPerLearner}
                                        onChange={handleInputChange}
                                        required 
                                    />
                                </div>
                            </div>
                        </section>



                        {/* Form Actions */}
                        <section className="contract-section">
                            <div className="form-actions">
                                <button type="submit" className="submit-btn">
                                    <i className="fas fa-save"></i> Save SETA Client
                                </button>
                                <button type="button" className="cancel-btn" onClick={() => navigate('/clients')}>
                                    <i className="fas fa-times"></i> Cancel
                                </button>
                            </div>
                        </section>
                    </form>
                </main>

                <footer>
                    <p>&copy; 2025 CRM. All rights reserved.</p>
                </footer>
                </div>
            </div>
        </>
    );

    return (
        <HubSpotLayout 
            title="Create Seta Client" 
            description="Create a new SETA client record"
        >
            {pageContent}
        </HubSpotLayout>
    );
};

export default SetaClientCreation; 