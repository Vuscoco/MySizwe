import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HubSpotLayout from '../components/HubSpotLayout';
import '../css/SolDankaClientCreation.css';

const SolDankaClientCreation = () => {
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
        monthlyRetainer: '',
        paymentTerms: '30',
        qualificationType: '',
        qualificationLevel: '',
        costPerLearner: '',
        services: [{ type: 'trench1', rate: '', recurring: false }]
    });

    const [slaFile, setSlaFile] = useState(null);
    const [slaFileName, setSlaFileName] = useState('');
    const [attachments, setAttachments] = useState([]);

    // Qualification levels mapping
    const qualificationLevels = [
        { value: 'nqf1', text: 'NQF Level 1' },
        { value: 'nqf2', text: 'NQF Level 2' },
        { value: 'nqf3', text: 'NQF Level 3' },
        { value: 'nqf4', text: 'NQF Level 4' },
        { value: 'nqf5', text: 'NQF Level 5' },
        { value: 'nqf6', text: 'NQF Level 6' },
        { value: 'nqf7', text: 'NQF Level 7' },
        { value: 'nqf8', text: 'NQF Level 8' }
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Update qualification levels when qualification type changes
        if (name === 'qualificationType') {
            updateQualificationLevels(value);
        }
    };

    const updateQualificationLevels = (qualificationType) => {
        // Reset qualification level when type changes
        setFormData(prev => ({
            ...prev,
            qualificationLevel: ''
        }));
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
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.pdf,.doc,.docx';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                setSlaFile(file);
                setSlaFileName(file.name);
            }
        };
        input.click();
    };

    const removeService = (index) => {
        if (formData.services.length > 1) {
            const updatedServices = formData.services.filter((_, i) => i !== index);
            setFormData(prev => ({ ...prev, services: updatedServices }));
        }
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
        
        // Calculate total value
        const totalValue = formData.monthlyRetainer * 12;
        
        const clientData = {
            id: Date.now(),
            clientName: formData.clientName,
            clientReg: formData.clientReg,
            clientAddress: formData.clientAddress,
            contactPerson: formData.contactPerson,
            contactPosition: formData.contactPosition,
            contactPhone: formData.contactPhone,
            contactEmail: formData.contactEmail,
            seta: formData.seta,
            service: formData.service,
            sdlNumber: formData.sdlNumber,
            moderator: formData.moderator,
            monthlyRetainer: parseFloat(formData.monthlyRetainer),
            paymentTerms: formData.paymentTerms,
            qualificationType: formData.qualificationType,
            qualificationLevel: formData.qualificationLevel,
            costPerLearner: parseFloat(formData.costPerLearner),
            totalValue: totalValue,
            services: formData.services,
            status: 'Active',
            lastContact: new Date().toISOString().split('T')[0],
            nextFollowUp: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            createdAt: new Date().toISOString()
        };

        // Save to localStorage
        const existingClients = JSON.parse(localStorage.getItem('clientsData') || '[]');
        existingClients.push(clientData);
        localStorage.setItem('clientsData', JSON.stringify(existingClients));

        alert('Sol Danka client created successfully!');
        navigate('/clients');
    };

    const previewSLA = () => {
        const dataToStore = {
            ...formData,
            slaFileName: slaFileName,
            slaFile: slaFile
        };
        sessionStorage.setItem('solDankaSlaPreviewData', JSON.stringify(dataToStore));
        navigate('/sla-preview');
    };

    // (move all code from return into a variable)
    const pageContent = (
        <>
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
                                <label htmlFor="monthlyRetainer">Monthly Retainer (R)</label>
                                <input 
                                    type="number" 
                                    id="monthlyRetainer" 
                                    name="monthlyRetainer" 
                                    step="0.01" 
                                    value={formData.monthlyRetainer}
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
                                <i className="fas fa-save"></i> Save Sol Danka Client
                            </button>
                            <button type="button" className="cancel-btn" onClick={() => navigate('/clients')}>
                                <i className="fas fa-times"></i> Cancel
                            </button>
                        </div>
                    </section>
                </form>
            </main>
        </>
    );

    return (
        <HubSpotLayout 
            title="Create Sol Danka Client" 
            description="Create a new Sol Danka client record"
        >
            {pageContent}
        </HubSpotLayout>
    );
};

export default SolDankaClientCreation; 