import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import HubSpotLayout from '../components/HubSpotLayout';
import GridCardGuide from '../components/GridCardGuide';
import '../css/Leads.css';

// Utility function for comprehensive lead-to-client conversion
const convertLeadToClientData = (leadData, additionalData = {}) => {
    // Validate that we have the minimum required data
    if (!leadData || !leadData.company_name) {
        console.error('Invalid lead data for conversion:', leadData);
        throw new Error('Invalid lead data for conversion');
    }
    
    const convertedData = {
        id: Date.now(),
        // Basic Information - preserve all available data
        clientName: leadData.company_name || additionalData.clientName || 'N/A',
        clientReg: leadData.client_reg || '',
        clientAddress: leadData.company_address || leadData.client_address || 'N/A',
        province: leadData.province || additionalData.province || 'N/A',
        country: leadData.country || additionalData.country || 'N/A',
        city: leadData.city || additionalData.city || 'N/A',
        
        // Contact Information - preserve all contact details
        contactPerson: leadData.contact_person || additionalData.contactPerson || 'N/A',
        contactPosition: leadData.contact_position || additionalData.contactPosition || 'N/A',
        contactPhone: leadData.contact_phone || additionalData.contactPhone || 'N/A',
        contactEmail: leadData.contact_email || additionalData.contactEmail || 'N/A',
        companyContact: leadData.company_contact || 'N/A',
        
        // SETA and Service Information - preserve service preferences
        seta: leadData.seta || additionalData.seta || 'wrseta',
        service: leadData.service_interest || additionalData.service || 'wsp',
        sdlNumber: leadData.sdl_number || 'N/A',
        moderator: leadData.moderator || 'N/A',
        
        // Financial Information - preserve estimated values
        monthlyRetainer: additionalData.monthlyRetainer || (leadData.estimated_value ? parseFloat(leadData.estimated_value) / 12 : 0),
        totalValue: leadData.estimated_value || additionalData.totalValue || 0,
        costPerLearner: additionalData.totalValue ? additionalData.totalValue / 12 : (leadData.estimated_value ? parseFloat(leadData.estimated_value) / 12 : 0),
        
        // Additional Information - preserve all metadata
        documentType: leadData.documentType || additionalData.documentType || 'N/A',
        status: 'Active',
        paymentTerms: '30',
        qualificationType: leadData.qualification_type || 'employed_learnership',
        qualificationLevel: leadData.qualification_level || 'nqf5',
        
        // Follow-up and Contact Information
        lastContact: additionalData.lastContact || leadData.last_contact || new Date().toISOString(),
        nextFollowUp: additionalData.nextFollowUp || new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        
        // Services and Attachments - preserve all service details
        services: leadData.services || additionalData.services || [{ type: 'trench1', recurring: false }],
        attachments: leadData.attachments || additionalData.attachments || [],
        documentType: leadData.documentType || additionalData.documentType || '',
        
        // Source and Notes - preserve lead source and notes
        source: leadData.source || 'converted_lead',
        notes: leadData.notes || additionalData.notes || '',
        
        // Conversion tracking
        originalLeadId: leadData.id,
        convertedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        
        // Additional fields that might be available
        conceptionDate: leadData.conception_date || additionalData.conceptionDate || new Date().toISOString().split('T')[0],
        validUntil: leadData.valid_until || additionalData.validUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        
        // Preserve any additional custom fields
        ...(leadData.custom_fields && { customFields: leadData.custom_fields }),
        ...(additionalData.customFields && { customFields: additionalData.customFields }),
        
        // Additional data passed in
        ...additionalData
    };
    
    // Log the conversion for debugging
    console.log('Lead to Client Conversion:', {
        originalLead: leadData,
        additionalData: additionalData,
        convertedClient: convertedData
    });
    
    return convertedData;
};

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
    const [showServicesDropdown, setShowServicesDropdown] = useState(false);
    const [showLeadManagerDropdown, setShowLeadManagerDropdown] = useState(false);
    const [showCreateManagerModal, setShowCreateManagerModal] = useState(false);
    const [showEditServicesDropdown, setShowEditServicesDropdown] = useState(false);
    const [showRedactedModal, setShowRedactedModal] = useState(false);
    const [showRedactedActionModal, setShowRedactedActionModal] = useState(false);
    const [showHistoryMode, setShowHistoryMode] = useState(false);
    const [attachments, setAttachments] = useState([]);

    // Helper function to abbreviate document types
    const abbreviateDocumentType = (documentType, attachments = []) => {
        if (!documentType || documentType === 'N/A') return 'N/A';
        
        const docType = documentType.toLowerCase();
        const abbreviations = [];
        
        // Check for SDF (various forms)
        if (docType.includes('sdf') || 
            docType.includes('sdf appointment letter') || 
            docType.includes('sdf appointment') ||
            docType.includes('appointment letter')) {
            abbreviations.push('SDF');
        }
        
        // Check for SLA (various forms)
        if (docType.includes('sla') || 
            docType.includes('service level agreement') || 
            docType.includes('service level') ||
            docType.includes('level agreement')) {
            abbreviations.push('SLA');
        }
        
        // If we have attachments, check for additional document types
        if (attachments && attachments.length > 0) {
            const attachmentTypes = attachments.map(att => att.documentType?.toLowerCase());
            
            if (attachmentTypes.includes('sla') || attachmentTypes.includes('service level agreement')) {
                if (!abbreviations.includes('SLA')) {
                    abbreviations.push('SLA');
                }
            }
            
            if (attachmentTypes.includes('sdf') || attachmentTypes.includes('sdf appointment letter')) {
                if (!abbreviations.includes('SDF')) {
                    abbreviations.push('SDF');
                }
            }
        }
        
        // If no abbreviations found, return original
        return abbreviations.length > 0 ? abbreviations.join(', ') : documentType;
    };

    // Helper function to format services display for table
    const formatServicesDisplay = (services) => {
        if (!services || services.length === 0) return 'N/A';
        
        if (services.length === 1) {
            return services[0];
        }
        
        // If multiple services, show first service + "etc."
        return `${services[0]} etc.`;
    };
    const [showGuide, setShowGuide] = useState(false);

    // Form data for creating new lead
    const [formData, setFormData] = useState({
        company_name: '',
        contact_person: '',
        company_contact: '',
        conception_date: new Date().toISOString().split('T')[0],
        contact_position: '',
        contact_phone: '',
        contact_email: '',
        source: '',
        seta: '',
        service_interest: '',
        services: [],
        documentType: '',
        attachmentType: '',
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
        sla_sda: '',
        services: [],
        documentType: '',
        uploadedFiles: [],
        notes: ''
    });

    // Form data for redaction
    const [redactedFormData, setRedactedFormData] = useState({
        clientName: '',
        clientReg: '',
        clientAddress: '',
        province: '',
        country: '',
        city: '',
        contactPerson: '',
        contactPosition: '',
        contactPhone: '',
        contactEmail: '',
        companyContact: '',
        leadManager: '',
        conceptionDate: new Date().toISOString().split('T')[0],
        dg: '',
        wspSubmitted: '',
        wspReason: '',
        retainer: '',
        seta: '',
        services: [],
        sdlNumber: '',
        documentType: '',
        attachments: []
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



    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showServicesDropdown && !event.target.closest('.services-dropdown-container')) {
                setShowServicesDropdown(false);
            }
                            if (showLeadManagerDropdown && !event.target.closest('.lead-manager-dropdown-container')) {
            setShowLeadManagerDropdown(false);
        }
        if (showServicesDropdown && !event.target.closest('.services-dropdown-container')) {
            setShowServicesDropdown(false);
        }
        if (showEditServicesDropdown && !event.target.closest('.edit-services-dropdown-container')) {
            setShowEditServicesDropdown(false);
        }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showServicesDropdown, showLeadManagerDropdown]);

    const handleFileSelect = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;
        input.accept = '*/*';
        
        input.onchange = (e) => {
            const files = Array.from(e.target.files);
            const selectedDocumentType = formData.documentType || 'Other';
            
            const newAttachments = files.map(file => ({
                id: Date.now() + Math.random(),
                name: file.name,
                size: file.size,
                type: file.type,
                file: file,
                documentType: selectedDocumentType
            }));
            setAttachments(prev => [...prev, ...newAttachments]);
        };
        
        input.click();
    };

    const getDocumentType = () => {
        // Get the selected services from the form
        if (formData.services && formData.services.length > 0) {
            const serviceType = formData.services[0];
            switch(serviceType) {
                case 'Employment Equity':
                    return 'SLA';
                case 'BBBEE':
                    return 'SLA';
                case 'HR':
                case 'WSP':
                    return 'SDF Appointment Letter';
                default:
                    return 'SLA';
            }
        }
        return 'SLA';
    };

    // Handle service checkbox changes
    const handleServiceRadioChange = (service) => {
        setFormData(prev => {
            const currentServices = prev.services || [];
            const isSelected = currentServices.includes(service);
            
            let newServices;
            if (isSelected) {
                // Remove service if already selected
                newServices = currentServices.filter(s => s !== service);
            } else {
                // Add service if not selected
                newServices = [...currentServices, service];
            }

            return {
                ...prev,
                services: newServices
            };
        });
    };

    const handleEditServiceRadioChange = (service) => {
        setEditFormData(prev => {
            const currentServices = prev.services || [];
            const isSelected = currentServices.includes(service);
            
            let newServices;
            if (isSelected) {
                // Remove service if already selected
                newServices = currentServices.filter(s => s !== service);
            } else {
                // Add service if not selected
                newServices = [...currentServices, service];
            }

            return {
                ...prev,
                services: newServices
            };
        });
    };

    const removeAttachment = (attachmentId) => {
        setAttachments(prev => prev.filter(att => att.id !== attachmentId));
    };

    // File preview functionality - simplified to open directly
    const handleFilePreview = (attachment) => {
        const file = attachment.file;
        const fileType = file.type || '';
        const fileName = file.name.toLowerCase();
        
        // Check for Office file types and open directly in corresponding applications
        const officeExtensions = ['.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.odt', '.ods', '.odp'];
        const isOfficeFile = officeExtensions.some(ext => fileName.endsWith(ext));
        
        if (isOfficeFile) {
            // Automatically open Office files in their corresponding applications
            const link = document.createElement('a');
            link.href = URL.createObjectURL(file);
            link.download = file.name;
            link.click();
            
            // Clean up the object URL after a short delay
            setTimeout(() => {
                URL.revokeObjectURL(link.href);
            }, 1000);
            
            // Show a brief notification that the file is being opened
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #28a745;
                color: white;
                padding: 12px 20px;
                border-radius: 6px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                z-index: 10000;
                font-family: Arial, sans-serif;
                font-size: 14px;
            `;
            notification.textContent = `Opening ${file.name} in Office application...`;
            document.body.appendChild(notification);
            
            // Remove notification after 3 seconds
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 3000);
            
        } else if (fileType.startsWith('image/') || 
                   fileType === 'application/pdf' || 
                   fileType.startsWith('text/')) {
            
            const reader = new FileReader();
            reader.onload = (e) => {
                // Open the file directly in a new tab
                const newWindow = window.open();
                if (newWindow) {
                    newWindow.document.write(`
                        <html>
                            <head>
                                <title>${file.name}</title>
                                <style>
                                    body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
                                    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 1px solid #ddd; }
                                    .close-btn { background: #dc3545; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; }
                                    .close-btn:hover { background: #c82333; }
                                    .content { max-width: 100%; }
                                    img { max-width: 100%; height: auto; }
                                    iframe { width: 100%; height: 80vh; border: none; }
                                    pre { background: #f8f9fa; padding: 20px; border-radius: 8px; overflow-x: auto; white-space: pre-wrap; }
                                </style>
                            </head>
                            <body>
                                <div class="header">
                                    <h2>${file.name}</h2>
                                    <button class="close-btn" onclick="window.close()">Close</button>
                                </div>
                                <div class="content">
                                    ${fileType.startsWith('image/') 
                                        ? `<img src="${e.target.result}" alt="${file.name}">`
                                        : fileType === 'application/pdf'
                                        ? `<iframe src="${e.target.result}"></iframe>`
                                        : `<pre>${e.target.result}</pre>`
                                    }
                                </div>
                            </body>
                        </html>
                    `);
                    newWindow.document.close();
                }
            };
            
            if (fileType.startsWith('text/')) {
                reader.readAsText(file);
            } else {
                reader.readAsDataURL(file);
            }
        } else {
            // For other file types, show a message and offer download
            const newWindow = window.open();
            if (newWindow) {
                newWindow.document.write(`
                    <html>
                        <head>
                            <title>${file.name}</title>
                            <style>
                                body { margin: 0; padding: 20px; font-family: Arial, sans-serif; text-align: center; }
                                .container { max-width: 600px; margin: 50px auto; padding: 40px; background: #f8f9fa; border-radius: 8px; }
                                .icon { font-size: 48px; color: #6c757d; margin-bottom: 20px; }
                                .download-btn { background: #007bff; color: white; border: none; padding: 12px 24px; border-radius: 4px; cursor: pointer; margin: 10px; }
                                .download-btn:hover { background: #0056b3; }
                                .close-btn { background: #6c757d; color: white; border: none; padding: 12px 24px; border-radius: 4px; cursor: pointer; margin: 10px; }
                                .close-btn:hover { background: #545b62; }
                            </style>
                        </head>
                        <body>
                            <div class="container">
                                <div class="icon">📄</div>
                                <h2>${file.name}</h2>
                                <p>File Type: ${file.type || 'Unknown'}</p>
                                <p>Size: ${(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                <p>This file type cannot be previewed in the browser.</p>
                                <button class="download-btn" onclick="downloadFile()">Download File</button>
                                <button class="close-btn" onclick="window.close()">Close</button>
                            </div>
                            <script>
                                function downloadFile() {
                                    const link = document.createElement('a');
                                    link.href = '${URL.createObjectURL(file)}';
                                    link.download = '${file.name}';
                                    link.click();
                                }
                            </script>
                        </body>
                    </html>
                `);
                newWindow.document.close();
            }
        }
    };

    const handleQuotationInputChange = (e) => {
        const { name, value } = e.target;
        setQuotationData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleServicesChange = (service) => {
        setQuotationData(prev => {
            const currentServices = prev.services || [];
            const isSelected = currentServices.includes(service);
            
            if (isSelected) {
                // Remove service if already selected
                return {
                    ...prev,
                    services: currentServices.filter(s => s !== service)
                };
            } else {
                // Add service if not selected
                return {
                    ...prev,
                    services: [...currentServices, service]
                };
            }
        });
    };

    const handleDocumentTypeChange = (documentType) => {
        setQuotationData(prev => ({
            ...prev,
            documentType: documentType
        }));
    };

    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files);
        const newFiles = files.map(file => ({
            id: Date.now() + Math.random(),
            name: file.name,
            size: file.size,
            type: file.type,
            file: file,
            service: quotationData.services[0] || 'General',
            documentType: quotationData.documentType || 'Document'
        }));
        
        setQuotationData(prev => ({
            ...prev,
            uploadedFiles: [...(prev.uploadedFiles || []), ...newFiles]
        }));
    };

    const removeUploadedFile = (fileId) => {
        setQuotationData(prev => ({
            ...prev,
            uploadedFiles: prev.uploadedFiles.filter(file => file.id !== fileId)
        }));
    };

    const handleCreateLeadAndConvert = async (e) => {
        e.preventDefault();
        try {
            // First create the lead using existing function
            const newLead = {
                id: Date.now(),
                company_name: formData.company_name,
                contact_person: formData.contact_person,
                company_contact: formData.company_contact,
                conception_date: formData.conception_date,
                contact_position: formData.contact_position,
                contact_phone: formData.contact_phone,
                contact_email: formData.contact_email,
                source: formData.services.join(', ') || formData.source,
                seta: formData.seta,
                service_interest: formData.service_interest,
                services: formData.services,
                documentType: formData.documentType,
                attachmentType: formData.attachmentType,
                attachments: attachments,
                estimated_value: parseFloat(formData.estimated_value) || 0,
                notes: formData.notes,
                next_follow_up: formData.next_follow_up,
                status: 'converted', // Set status as converted immediately
                created_at: new Date().toISOString(),
                converted_at: new Date().toISOString()
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

            // Add to leads with converted status
            const existingLeads = JSON.parse(localStorage.getItem('leadsData') || '[]');
            const updatedLeads = [...existingLeads, newLead];
            localStorage.setItem('leadsData', JSON.stringify(updatedLeads));
            setLeads(updatedLeads);

            // Convert to client using existing conversion function
            const clientData = convertLeadToClientData(newLead, {
                quotationData: {
                    title: `${newLead.company_name} - Quotation`,
                    total_value: newLead.estimated_value || '',
                    payment_terms: '30',
                    conception_date: newLead.conception_date,
                    services: newLead.services || [],
                    documentType: newLead.documentType || '',
                    uploadedFiles: newLead.attachments || [],
                    notes: newLead.notes || ''
                }
            });

            // Add client to clients page using the proper function
            if (window.addNewClientToClientsPage) {
                window.addNewClientToClientsPage(clientData);
                console.log('Client added via window function:', clientData);
            } else {
                // Fallback: add directly to localStorage
                const existingClients = JSON.parse(localStorage.getItem('clientsData') || '[]');
                const updatedClients = [...existingClients, clientData];
                localStorage.setItem('clientsData', JSON.stringify(updatedClients));
                console.log('Client added directly to localStorage:', clientData);
            }

            // Close modal and reset form
            setShowCreateModal(false);
            setFormData({
                company_name: '',
                contact_person: '',
                company_contact: '',
                conception_date: new Date().toISOString().split('T')[0],
                contact_position: '',
                contact_phone: '',
                contact_email: '',
                source: '',
                seta: '',
                service_interest: '',
                services: [],
                documentType: '',
                attachmentType: '',
                estimated_value: '',
                notes: '',
                next_follow_up: ''
            });
            setAttachments([]);
            
            // Show success message
            alert('Lead created and converted to client successfully!');
            
        } catch (err) {
            console.error('Error creating lead and converting:', err);
            setError('Error creating lead and converting to client');
        }
    };

    const handleCreateLead = async (e) => {
        e.preventDefault();
        try {
            // Create new lead object
            const newLead = {
                id: Date.now(),
                company_name: formData.company_name,
                contact_person: formData.contact_person,
                company_contact: formData.company_contact,
                conception_date: formData.conception_date,
                contact_position: formData.contact_position,
                contact_phone: formData.contact_phone,
                contact_email: formData.contact_email,
                source: formData.services.join(', ') || formData.source, // Use services array or fallback to source
                seta: formData.seta,
                service_interest: formData.service_interest,
                services: formData.services, // Store the services array
                documentType: formData.documentType, // Store the document type
                attachmentType: formData.attachmentType, // Store the attachment type
                attachments: attachments, // Store the attachments
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
            setShowRedactedActionModal(false);
            setFormData({
                company_name: '',
                contact_person: '',
                company_contact: '',
                conception_date: new Date().toISOString().split('T')[0],
                contact_position: '',
                contact_phone: '',
                contact_email: '',
                source: '',
                seta: '',
                service_interest: '',
                services: [],
                documentType: '',
                attachmentType: '',
                estimated_value: '',
                notes: '',
                next_follow_up: ''
            });
            setAttachments([]);
            
            // Show success message
            alert('Lead created successfully!');
            
        } catch (err) {
            console.error('Error creating lead:', err);
            setError('Error creating lead');
        }
    };

    const handleConvertToQuotation = async () => {
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

            // Update lead status to 'history' (no duplication)
            const finalUpdatedLeads = leads.map(lead => 
                lead.id === selectedLead.id 
                    ? { 
                        ...lead, 
                        status: 'history', 
                        converted_at: new Date().toISOString(),
                        originalLeadId: lead.id,
                        convertedAt: new Date().toISOString()
                    }
                    : lead
            );
            
            setLeads(finalUpdatedLeads);
            localStorage.setItem('leadsData', JSON.stringify(finalUpdatedLeads));

            // Check if client already exists from this lead
            const existingClients = JSON.parse(localStorage.getItem('clientsData') || '[]');
            const clientAlreadyExists = existingClients.some(client => 
                client.originalLeadId === selectedLead.id || 
                (client.clientName === selectedLead.company_name && client.contactEmail === selectedLead.contact_email)
            );

            if (!clientAlreadyExists) {
                // Create client from lead data with comprehensive preservation
                const clientData = convertLeadToClientData(selectedLead, {
                    quotationData: quotationData
                });

                // Add client to clients page using the proper function
                if (window.addNewClientToClientsPage) {
                    window.addNewClientToClientsPage(clientData);
                    console.log('Client added via window function:', clientData);
                } else {
                    // Fallback: add directly to localStorage
                    const existingClients = JSON.parse(localStorage.getItem('clientsData') || '[]');
                    const updatedClients = [...existingClients, clientData];
                    localStorage.setItem('clientsData', JSON.stringify(updatedClients));
                    console.log('Client added directly to localStorage:', clientData);
                }
            }
            
            // Close modal and reset form
            setShowConvertModal(false);
            setSelectedLead(null);
            setQuotationData({
                title: '',
                total_value: '',
                payment_terms: '30',
                conception_date: '',
                sla_sda: '',
                services: [],
                documentType: '',
                uploadedFiles: [],
                notes: ''
            });
            
            // Show success message
            console.log('Lead conversion successful - client should be added to clients table');
            alert('Lead successfully converted to client and quotation!');
            
        } catch (err) {
            console.error('Error in conversion process:', err);
            // If there's any error, still try to convert the lead
            const finalUpdatedLeads = leads.map(lead => 
                lead.id === selectedLead.id 
                    ? { 
                        ...lead, 
                        status: 'history', 
                        converted_at: new Date().toISOString(),
                        originalLeadId: lead.id,
                        convertedAt: new Date().toISOString()
                    }
                    : lead
            );
            
            setLeads(finalUpdatedLeads);
            localStorage.setItem('leadsData', JSON.stringify(finalUpdatedLeads));

            // Check if client already exists from this lead (even in error case)
            const existingClients = JSON.parse(localStorage.getItem('clientsData') || '[]');
            const clientAlreadyExists = existingClients.some(client => 
                client.originalLeadId === selectedLead.id || 
                (client.clientName === selectedLead.company_name && client.contactEmail === selectedLead.contact_email)
            );

            if (!clientAlreadyExists) {
                // Create client from lead data with comprehensive preservation (even in error case)
                const clientData = convertLeadToClientData(selectedLead, {
                    quotationData: quotationData
                });

                // Add client to clients page using the proper function
                if (window.addNewClientToClientsPage) {
                    window.addNewClientToClientsPage(clientData);
                    console.log('Client added via window function:', clientData);
                } else {
                    // Fallback: add directly to localStorage
                    const existingClients = JSON.parse(localStorage.getItem('clientsData') || '[]');
                    const updatedClients = [...existingClients, clientData];
                    localStorage.setItem('clientsData', JSON.stringify(updatedClients));
                    console.log('Client added directly to localStorage:', clientData);
                }
            }
            
            setShowConvertModal(false);
            setSelectedLead(null);
            setQuotationData({
                title: '',
                total_value: '',
                payment_terms: '30',
                conception_date: '',
                sla_sda: '',
                services: [],
                documentType: '',
                uploadedFiles: [],
                notes: ''
            });
            
            alert('Lead converted to client and quotation! (API unavailable, saved locally)');
        }
    };

    const openConvertModal = (lead) => {
        setSelectedLead(lead);
        setQuotationData({
            title: `${lead.company_name} - Quotation`,
            total_value: lead.estimated_value || '',
            payment_terms: '30',
            conception_date: new Date().toISOString().split('T')[0], // Today's date
            sla_sda: '',
            services: [],
            documentType: '',
            uploadedFiles: [],
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
            company_contact: lead.company_contact || '',
            conception_date: lead.conception_date || new Date().toISOString().split('T')[0],
            contact_position: lead.contact_position || '',
            contact_phone: lead.contact_phone || '',
            contact_email: lead.contact_email || '',
            source: lead.source || '',
            seta: lead.seta || '',
            services: lead.services || [],
            documentType: lead.documentType || '',
            estimated_value: lead.estimated_value || '',
            notes: lead.notes || '',
            next_follow_up: lead.next_follow_up || '',
            attachments: lead.attachments || []
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
            setShowEditServicesDropdown(false);
            
            alert('Lead updated successfully!');
        } catch (err) {
            console.error('Error updating lead:', err);
            alert('Error updating lead');
        }
    };

    const handleRedactedInputChange = (e) => {
        const { name, value } = e.target;
        setRedactedFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleRedactedSubmit = (e) => {
        e.preventDefault();
        
        // Create a new history lead
        const newRedactedLead = {
            id: Date.now().toString(),
            ...redactedFormData,
            status: 'history',
            createdAt: new Date().toISOString()
        };

        // Add to leads array
        const updatedLeads = [...leads, newRedactedLead];
        setLeads(updatedLeads);
        localStorage.setItem('leadsData', JSON.stringify(updatedLeads));
        
        // Show success message
        alert('History lead added successfully!');
        
        // Close modal and reset form
        setShowRedactedModal(false);
        setRedactedFormData({
            clientName: '',
            clientReg: '',
            clientAddress: '',
            province: '',
            country: '',
            city: '',
            contactPerson: '',
            contactPosition: '',
            contactPhone: '',
            contactEmail: '',
            companyContact: '',
            leadManager: '',
            conceptionDate: new Date().toISOString().split('T')[0],
            dg: '',
            wspSubmitted: '',
            wspReason: '',
            retainer: '',
            seta: '',
            services: [],
            sdlNumber: '',
            documentType: '',
            attachments: []
        });
    };

    const closeRedactedModal = () => {
        setShowRedactedModal(false);
        setRedactedFormData({
            clientName: '',
            clientReg: '',
            clientAddress: '',
            province: '',
            country: '',
            city: '',
            contactPerson: '',
            contactPosition: '',
            contactPhone: '',
            contactEmail: '',
            companyContact: '',
            leadManager: '',
            conceptionDate: new Date().toISOString().split('T')[0],
            dg: '',
            wspSubmitted: '',
            wspReason: '',
            retainer: '',
            seta: '',
            services: [],
            sdlNumber: '',
            documentType: '',
            attachments: []
        });
    };

    const handleRedactedAction = (lead) => {
        // Reset form data to empty state for creating a new lead
        setFormData({
            company_name: '',
            contact_person: '',
            company_contact: '',
            conception_date: new Date().toISOString().split('T')[0],
            contact_position: '',
            contact_phone: '',
            contact_email: '',
            source: '',
            seta: '',
            service_interest: '',
            services: [],
            documentType: '',
            attachmentType: '',
            estimated_value: '',
            notes: '',
            next_follow_up: ''
        });
        setAttachments([]);
        setShowRedactedActionModal(true);
    };

    const closeRedactedActionModal = () => {
        setShowRedactedActionModal(false);
        setFormData({
            company_name: '',
            contact_person: '',
            company_contact: '',
            conception_date: new Date().toISOString().split('T')[0],
            contact_position: '',
            contact_phone: '',
            contact_email: '',
            source: '',
            seta: '',
            service_interest: '',
            services: [],
            documentType: '',
            attachmentType: '',
            estimated_value: '',
            notes: '',
            next_follow_up: ''
        });
        setAttachments([]);
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
                    <h2 className="modules-title">
                        {showHistoryMode ? 'Lead History' : 'Lead Records'}
                    </h2>
                    <div className="header-actions">
                        <button className="add-module-btn" onClick={() => setShowCreateModal(true)}>
                            + Add Lead
                        </button>
                        <button className={`redacted-btn ${showHistoryMode ? 'active' : ''}`} onClick={() => setShowHistoryMode(!showHistoryMode)}>
                            <i className="fas fa-history"></i>
                            {showHistoryMode ? 'Current Leads' : 'History'}
                        </button>
                    </div>
                </div>

                {/* Leads Table */}
                <div className="table-container">
                    <table className="modules-table">
                        <thead>
                            <tr>
                                <th>Company Name</th>
                                <th>Lead Manager</th>
                                <th>Company Contact</th>
                                <th>Conception Date</th>
                                <th>Services</th>
                                <th>SETA</th>
                                <th>Estimated Value</th>
                                <th>Document Type</th>
                                <th>Status</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="10" style={{textAlign: 'center'}}>
                                        <i className="fas fa-spinner fa-spin"></i> Loading leads...
                                    </td>
                                </tr>
                            ) : leads.length === 0 ? (
                                <tr>
                                    <td colSpan="10" style={{textAlign: 'center'}}>
                                        No leads found. Create your first lead!
                                    </td>
                                </tr>
                            ) : (
                                leads.filter(lead => {
                                    if (showHistoryMode) {
                                        // Show converted leads and history leads
                                        return lead.status === 'converted' || lead.status === 'history';
                                    } else {
                                        // Show current leads (not converted)
                                        return lead.status !== 'converted' && lead.status !== 'history';
                                    }
                                }).map((lead) => (
                                    <tr key={lead.id}>
                                        <td className="module-name">{lead.company_name}</td>
                                        <td>{lead.contact_person}</td>
                                        <td>{lead.company_contact || 'N/A'}</td>
                                        <td>{lead.conception_date || formatDate(lead.created_at)}</td>
                                        <td title={lead.services ? lead.services.join(', ') : 'N/A'}>
                                            {formatServicesDisplay(lead.services)}
                                        </td>
                                        <td>{lead.seta ? lead.seta.toUpperCase() : 'N/A'}</td>
                                        <td>{formatCurrency(lead.estimated_value)}</td>
                                        <td>{abbreviateDocumentType(lead.documentType, lead.attachments)}</td>
                                        <td>
                                            <span className={`status-badge ${getStatusBadgeClass(lead.status)}`}>
                                                {lead.status}
                                            </span>
                                        </td>
                                        <td className="actions-cell">
                                            <div className="action-buttons">
                                                {lead.status !== 'converted' && lead.status !== 'history' && (
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
                                                {lead.status !== 'history' && (
                                                    <button className="btn-icon" title="Edit" onClick={() => handleEditLead(lead)}>
                                                        <i className="fas fa-edit"></i>
                                                    </button>
                                                )}
                                                <button 
                                                    className="btn-icon redacted-action" 
                                                    title="Redacted Action" 
                                                    onClick={() => handleRedactedAction(lead)}
                                                    style={{ backgroundColor: '#dc3545', color: 'white' }}
                                                >
                                                    <i className="fas fa-user-secret"></i>
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
                    <div className="modal-content create-lead-modal">
                        <div className="modal-header">
                            <h2>Create New Lead</h2>
                            <button className="modal-close" onClick={() => setShowCreateModal(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleCreateLead}>
                                <div className="create-lead-form">
                                    {/* Company Information Section */}
                                    <div className="form-section">
                                        <h3 className="section-title">Company Information</h3>
                                        <div className="form-row">
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
                                        <label>Lead Manager *</label>
                                        <div className="lead-manager-dropdown-container">
                                            <div 
                                                className="lead-manager-dropdown-trigger"
                                                onClick={() => setShowLeadManagerDropdown(!showLeadManagerDropdown)}
                                            >
                                                <span className="lead-manager-placeholder">
                                                    {formData.contact_person || 'Select Lead Manager'}
                                                </span>
                                                <i className={`fas fa-chevron-down ${showLeadManagerDropdown ? 'rotated' : ''}`}></i>
                                            </div>
                                            {showLeadManagerDropdown && (
                                                <div className="lead-manager-dropdown-options">
                                                    {['Nasreen', 'Koketso', 'Shannon'].map((manager) => (
                                                        <div 
                                                            key={manager} 
                                                            className="lead-manager-option"
                                                            onClick={() => {
                                                                setFormData(prev => ({ ...prev, contact_person: manager }));
                                                                setShowLeadManagerDropdown(false);
                                                            }}
                                                        >
                                                            {manager}
                                                        </div>
                                                    ))}
                                                    <div 
                                                        className="lead-manager-option create-new"
                                                        onClick={() => {
                                                            setShowLeadManagerDropdown(false);
                                                            setShowCreateManagerModal(true);
                                                        }}
                                                    >
                                                        <i className="fas fa-plus"></i>
                                                        Create New Lead Manager
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Company Contact</label>
                                        <input
                                            type="text"
                                            name="company_contact"
                                            value={formData.company_contact}
                                            onChange={handleInputChange}
                                            placeholder="Enter company contact information"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Conception Date</label>
                                        <input
                                            type="date"
                                            name="conception_date"
                                            value={formData.conception_date || new Date().toISOString().split('T')[0]}
                                            onChange={handleInputChange}
                                            readOnly
                                        />
                                    </div>
                                    </div>
                                    </div>

                                    {/* Services & SETA Section */}
                                    <div className="form-section">
                                        <h3 className="section-title">Services & SETA</h3>
                                        <div className="form-row">
                                    <div className="form-group">
                                        <label>Services *</label>
                                        <div className="services-dropdown-container">
                                            <div 
                                                className="services-dropdown-trigger"
                                                onClick={() => setShowServicesDropdown(!showServicesDropdown)}
                                            >
                                                                                                 <span className={`services-placeholder ${formData.services && formData.services.length > 0 ? 'has-selections' : ''}`}>
                                                     {formData.services && formData.services.length > 0 
                                                         ? formData.services.join(', ') 
                                                         : 'Select Services'
                                                     }
                                                 </span>
                                                <i className={`fas fa-chevron-down ${showServicesDropdown ? 'rotated' : ''}`}></i>
                                            </div>
                                            {showServicesDropdown && (
                                                <div className="services-dropdown-options">
                                                            {['BBBEE', 'Employment Equity', 'HR', 'WSP'].map((service) => (
                                                        <label key={service} className="service-option">
                                                            <input
                                                                type="checkbox"
                                                                checked={formData.services?.includes(service) || false}
                                                                onChange={() => handleServiceRadioChange(service)}
                                                            />
                                                            <span className="option-label">{service}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
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
                                        </div>
                                    </div>

                                    {/* Financial & Documents Section */}
                                    <div className="form-section">
                                        <h3 className="section-title">Financial & Documents</h3>
                                        <div className="form-row">
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
                                        <div className="form-group">
                                            <label>Document Type</label>
                                            <select
                                                name="documentType"
                                                value={formData.documentType || ''}
                                                onChange={handleInputChange}
                                            >
                                                    <option value="" disabled>Select Document Type</option>
                                            <option value="SLA">SLA</option>
                                            <option value="SDF Appointment Letter">SDF Appointment Letter</option>
                                        </select>
                                    </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                        <label>Upload Documents</label>
                                        <div className="document-upload-section">
                                            <button type="button" className="add-service-btn" onClick={handleFileSelect}>
                                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                    <path d="M8 1L8 15M1 8L15 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                                </svg>
                                                Upload attachment
                                            </button>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Attachments Section */}
                                        {attachments.length > 0 && (
                                            <div className="attachments-list">
                                                {attachments
                                                    .filter(attachment => attachment.documentType === formData.documentType)
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
                                                        <div className="attachment-actions">
                                                            <button 
                                                                type="button" 
                                                                className="preview-btn" 
                                                                onClick={() => handleFilePreview(attachment)}
                                                                title="Open file"
                                                            >
                                                                <i className="fas fa-external-link-alt"></i>
                                                            </button>
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
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="modal-actions">
                                    <button type="button" className="btn secondary" onClick={() => setShowCreateModal(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn primary">
                                        Create Lead
                                    </button>
                                    <button 
                                        type="button" 
                                        className="btn primary" 
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleCreateLeadAndConvert(e);
                                        }}
                                        style={{
                                            background: '#28a745',
                                            color: 'white',
                                            border: 'none',
                                            padding: '8px 16px',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            fontSize: '14px',
                                            marginLeft: '10px'
                                        }}
                                    >
                                        Create Lead & Convert to Client
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
                    <div className="modal-content view-lead-modal">
                        <div className="modal-header">
                            <h2>Convert Lead to Client</h2>
                            <button className="modal-close" onClick={() => setShowConvertModal(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="view-lead-form">
                                {/* Company Information Section */}
                                <div className="form-section">
                                    <h3 className="section-title">Company Information</h3>
                                <div className="details-grid">
                                    <div className="detail-item">
                                        <strong>Company Name:</strong>
                                        <span>{selectedLead.company_name}</span>
                                    </div>
                                    <div className="detail-item">
                                            <strong>Lead Manager:</strong>
                                        <span>{selectedLead.contact_person}</span>
                                    </div>
                                    </div>
                                    </div>

                                {/* Services & SETA Section */}
                                <div className="form-section">
                                    <h3 className="section-title">Services & SETA</h3>
                                    <div className="details-grid">
                                    <div className="detail-item">
                                        <strong>Services:</strong>
                                        <span>{selectedLead.source || selectedLead.services?.join(', ') || 'N/A'}</span>
                                    </div>
                                    <div className="detail-item">
                                        <strong>SETA:</strong>
                                        <span>{selectedLead.seta || 'N/A'}</span>
                                    </div>
                                    </div>
                                </div>

                                {/* Financial & Documents Section */}
                                <div className="form-section">
                                    <h3 className="section-title">Financial & Documents</h3>
                                    <div className="details-grid">
                                    <div className="detail-item">
                                        <strong>Estimated Value:</strong>
                                        <span>{formatCurrency(selectedLead.estimated_value)}</span>
                                    </div>
                                    <div className="detail-item">
                                        <strong>Document Type:</strong>
                                        <span>{selectedLead.documentType || 'N/A'}</span>
                                    </div>
                                    </div>
                                    
                                    {/* Attachments Section */}
                                    {selectedLead.attachments && selectedLead.attachments.length > 0 && (
                                        <div className="detail-item full-width">
                                            <strong>Attachments:</strong>
                                            <div className="attachments-display">
                                                {selectedLead.attachments.map((attachment) => (
                                                    <div key={attachment.id} className="attachment-display-item">
                                                        <div className="attachment-info">
                                                            <span className="attachment-name">{attachment.name}</span>
                                                            <span className="attachment-type">({attachment.documentType})</span>
                                                            <span className="attachment-size">
                                                                ({(attachment.size / 1024 / 1024).toFixed(2)} MB)
                                                            </span>
                                                        </div>
                                                        <div className="attachment-actions">
                                                            <button 
                                                                type="button" 
                                                                className="preview-btn" 
                                                                onClick={() => handleFilePreview(attachment)}
                                                                title="Open file"
                                                            >
                                                                <i className="fas fa-external-link-alt"></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    </div>

                                {/* Lead Status Section */}
                                <div className="form-section">
                                    <h3 className="section-title">Lead Status</h3>
                                    <div className="details-grid">
                                    <div className="detail-item">
                                        <strong>Status:</strong>
                                        <span className={`status-badge ${getStatusBadgeClass(selectedLead.status)}`}>
                                            {selectedLead.status}
                                        </span>
                                        </div>
                                        <div className="detail-item">
                                            <strong>Created Date:</strong>
                                            <span>{formatDate(selectedLead.created_at)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn secondary" onClick={() => setShowConvertModal(false)}>
                                    Close
                                </button>
                                <button type="button" className="btn primary" onClick={handleConvertToQuotation}>
                                    Convert to Client
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* View Lead Modal */}
            {showViewModal && selectedLead && (
                <div className="modal-overlay">
                    <div className="modal-content view-lead-modal">
                        <div className="modal-header">
                            <h2>Lead Details</h2>
                            <button className="modal-close" onClick={() => setShowViewModal(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="view-lead-form">
                                {/* Company Information Section */}
                                <div className="form-section">
                                    <h3 className="section-title">Company Information</h3>
                                    <div className="details-grid">
                                        <div className="detail-item">
                                            <strong>Company Name:</strong>
                                            <span>{selectedLead.company_name}</span>
                            </div>
                                        <div className="detail-item">
                                            <strong>Lead Manager:</strong>
                                            <span>{selectedLead.contact_person}</span>
                        </div>
                                    </div>
                                </div>

                                {/* Services & SETA Section */}
                                <div className="form-section">
                                    <h3 className="section-title">Services & SETA</h3>
                                    <div className="details-grid">
                                        <div className="detail-item">
                                            <strong>Services:</strong>
                                            <span>{selectedLead.source || selectedLead.services?.join(', ') || 'N/A'}</span>
                                        </div>
                                        <div className="detail-item">
                                            <strong>SETA:</strong>
                                            <span>{selectedLead.seta || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Financial & Documents Section */}
                                <div className="form-section">
                                    <h3 className="section-title">Financial & Documents</h3>
                                    <div className="details-grid">
                                        <div className="detail-item">
                                            <strong>Estimated Value:</strong>
                                            <span>{formatCurrency(selectedLead.estimated_value)}</span>
                                        </div>
                                        <div className="detail-item">
                                            <strong>Document Type:</strong>
                                            <span>{selectedLead.documentType || 'N/A'}</span>
                                        </div>
                                    </div>
                                    
                                    {/* Attachments Section */}
                                    {selectedLead.attachments && selectedLead.attachments.length > 0 && (
                                        <div className="detail-item full-width">
                                            <strong>Attachments:</strong>
                                            <div className="attachments-display">
                                                {selectedLead.attachments.map((attachment) => (
                                                    <div key={attachment.id} className="attachment-display-item">
                                                        <span className="attachment-name">{attachment.name}</span>
                                                        <span className="attachment-type">({attachment.documentType})</span>
                                                        <span className="attachment-size">
                                                            ({(attachment.size / 1024 / 1024).toFixed(2)} MB)
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Lead Status Section */}
                                <div className="form-section">
                                    <h3 className="section-title">Lead Status</h3>
                                    <div className="details-grid">
                                        <div className="detail-item">
                                            <strong>Status:</strong>
                                            <span className={`status-badge ${getStatusBadgeClass(selectedLead.status)}`}>
                                                {selectedLead.status}
                                            </span>
                                        </div>
                                        <div className="detail-item">
                                            <strong>Created Date:</strong>
                                            <span>{formatDate(selectedLead.created_at)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn secondary" onClick={() => setShowViewModal(false)}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Lead Modal */}
            {showEditModal && selectedLead && (
                <div className="modal-overlay">
                    <div className="modal-content view-lead-modal">
                        <div className="modal-header">
                            <h2>Edit Lead</h2>
                            <button className="modal-close" onClick={() => setShowEditModal(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleUpdateLead}>
                                <div className="view-lead-form">
                                    {/* Company Information Section */}
                                    <div className="form-section">
                                        <h3 className="section-title">Company Information</h3>
                                        <div className="form-row">
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
                                                <label>Company Contact</label>
                                                <input
                                                    type="text"
                                                    name="company_contact"
                                                    value={editFormData.company_contact}
                                                    onChange={handleEditInputChange}
                                                    placeholder="Enter company contact information"
                                                />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Lead Manager *</label>
                                                <input
                                                    type="text"
                                                    name="contact_person"
                                                    value={editFormData.contact_person}
                                                    onChange={handleEditInputChange}
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Conception Date</label>
                                                <input
                                                    type="date"
                                                    name="conception_date"
                                                    value={editFormData.conception_date || new Date().toISOString().split('T')[0]}
                                                    onChange={handleEditInputChange}
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Services & SETA Section */}
                                    <div className="form-section">
                                        <h3 className="section-title">Services & SETA</h3>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Services *</label>
                                                <div className="edit-services-dropdown-container">
                                                    <div 
                                                        className="services-dropdown-trigger"
                                                        onClick={() => setShowEditServicesDropdown(!showEditServicesDropdown)}
                                                    >
                                                                                                         <span className={`services-placeholder ${editFormData.services && editFormData.services.length > 0 ? 'has-selections' : ''}`}>
                                                     {editFormData.services && editFormData.services.length > 0 
                                                         ? editFormData.services.join(', ') 
                                                         : 'Select Services'
                                                     }
                                                 </span>
                                                        <i className={`fas fa-chevron-down ${showEditServicesDropdown ? 'rotated' : ''}`}></i>
                                                    </div>
                                                    {showEditServicesDropdown && (
                                                        <div className="services-dropdown-options">
                                                            {['BBBEE', 'Employment Equity', 'HR', 'WSP'].map((service) => (
                                                                <label key={service} className="service-option">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={editFormData.services?.includes(service) || false}
                                                                        onChange={() => handleEditServiceRadioChange(service)}
                                                                    />
                                                                    <span className="option-label">{service}</span>
                                                                </label>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
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
                                        </div>
                                    </div>

                                    {/* Financial & Documents Section */}
                                    <div className="form-section">
                                        <h3 className="section-title">Financial & Documents</h3>
                                        <div className="form-row">
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
                                            <div className="form-group">
                                                <label>Document Type</label>
                                                <select
                                                    name="documentType"
                                                    value={editFormData.documentType || ''}
                                                    onChange={handleEditInputChange}
                                                >
                                                    <option value="" disabled>Select Document Type</option>
                                                    <option value="SLA">SLA</option>
                                                    <option value="SDF Appointment Letter">SDF Appointment Letter</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Upload Documents</label>
                                                <div className="document-upload-section">
                                                    <button type="button" className="add-service-btn" onClick={handleFileSelect}>
                                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                            <path d="M8 1L8 15M1 8L15 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                                        </svg>
                                                        Upload attachment
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-actions">
                                    <button type="button" className="btn secondary" onClick={() => {
                                        setShowEditModal(false);
                                        setShowEditServicesDropdown(false);
                                    }}>
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

            {/* Create New Lead Manager Modal */}
            {showCreateManagerModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>Create New Lead Manager</h2>
                            <button className="modal-close" onClick={() => setShowCreateManagerModal(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                const newManagerName = e.target.managerName.value.trim();
                                if (newManagerName) {
                                    setFormData(prev => ({ ...prev, contact_person: newManagerName }));
                                    setShowCreateManagerModal(false);
                                }
                            }}>
                                <div className="form-group">
                                    <label>Lead Manager Name *</label>
                                    <input
                                        type="text"
                                        name="managerName"
                                        placeholder="Enter lead manager name"
                                        required
                                    />
                                </div>
                                <div className="modal-actions">
                                    <button type="button" className="btn secondary" onClick={() => setShowCreateManagerModal(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn primary">
                                        Create Manager
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Redacted Lead Modal */}
            {showRedactedModal && (
                <div className="modal-overlay" onClick={closeRedactedModal}>
                    <div className="modal-content create-lead-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Add History Lead</h2>
                            <button className="modal-close" onClick={closeRedactedModal}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleRedactedSubmit}>
                                <div className="create-lead-form">
                                    {/* Client Information Section */}
                                    <div className="form-section">
                                        <h3 className="section-title">Client Information</h3>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Client Name *</label>
                                                <input
                                                    type="text"
                                                    name="clientName"
                                                    value={redactedFormData.clientName}
                                                    onChange={handleRedactedInputChange}
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Client Registration</label>
                                                <input
                                                    type="text"
                                                    name="clientReg"
                                                    value={redactedFormData.clientReg}
                                                    onChange={handleRedactedInputChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Client Address</label>
                                                <input
                                                    type="text"
                                                    name="clientAddress"
                                                    value={redactedFormData.clientAddress}
                                                    onChange={handleRedactedInputChange}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Province</label>
                                                <input
                                                    type="text"
                                                    name="province"
                                                    value={redactedFormData.province}
                                                    onChange={handleRedactedInputChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Country</label>
                                                <input
                                                    type="text"
                                                    name="country"
                                                    value={redactedFormData.country}
                                                    onChange={handleRedactedInputChange}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>City</label>
                                                <input
                                                    type="text"
                                                    name="city"
                                                    value={redactedFormData.city}
                                                    onChange={handleRedactedInputChange}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Contact Information Section */}
                                    <div className="form-section">
                                        <h3 className="section-title">Contact Information</h3>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Contact Person</label>
                                                <input
                                                    type="text"
                                                    name="contactPerson"
                                                    value={redactedFormData.contactPerson}
                                                    onChange={handleRedactedInputChange}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Contact Position</label>
                                                <input
                                                    type="text"
                                                    name="contactPosition"
                                                    value={redactedFormData.contactPosition}
                                                    onChange={handleRedactedInputChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Contact Phone</label>
                                                <input
                                                    type="text"
                                                    name="contactPhone"
                                                    value={redactedFormData.contactPhone}
                                                    onChange={handleRedactedInputChange}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Contact Email</label>
                                                <input
                                                    type="email"
                                                    name="contactEmail"
                                                    value={redactedFormData.contactEmail}
                                                    onChange={handleRedactedInputChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Company Contact</label>
                                                <input
                                                    type="text"
                                                    name="companyContact"
                                                    value={redactedFormData.companyContact}
                                                    onChange={handleRedactedInputChange}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Lead Manager</label>
                                                <input
                                                    type="text"
                                                    name="leadManager"
                                                    value={redactedFormData.leadManager}
                                                    onChange={handleRedactedInputChange}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Additional Information Section */}
                                    <div className="form-section">
                                        <h3 className="section-title">Additional Information</h3>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Conception Date</label>
                                                <input
                                                    type="date"
                                                    name="conceptionDate"
                                                    value={redactedFormData.conceptionDate}
                                                    onChange={handleRedactedInputChange}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>DG</label>
                                                <input
                                                    type="text"
                                                    name="dg"
                                                    value={redactedFormData.dg}
                                                    onChange={handleRedactedInputChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>WSP Submitted</label>
                                                <input
                                                    type="text"
                                                    name="wspSubmitted"
                                                    value={redactedFormData.wspSubmitted}
                                                    onChange={handleRedactedInputChange}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>WSP Reason</label>
                                                <input
                                                    type="text"
                                                    name="wspReason"
                                                    value={redactedFormData.wspReason}
                                                    onChange={handleRedactedInputChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Retainer</label>
                                                <input
                                                    type="text"
                                                    name="retainer"
                                                    value={redactedFormData.retainer}
                                                    onChange={handleRedactedInputChange}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>SETA</label>
                                                <input
                                                    type="text"
                                                    name="seta"
                                                    value={redactedFormData.seta}
                                                    onChange={handleRedactedInputChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>SDL Number</label>
                                                <input
                                                    type="text"
                                                    name="sdlNumber"
                                                    value={redactedFormData.sdlNumber}
                                                    onChange={handleRedactedInputChange}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Document Type</label>
                                                <input
                                                    type="text"
                                                    name="documentType"
                                                    value={redactedFormData.documentType}
                                                    onChange={handleRedactedInputChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-actions">
                                    <button type="button" className="btn secondary" onClick={closeRedactedModal}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn primary">
                                        Add History Lead
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Redacted Action Modal - Empty Content */}
            {showRedactedActionModal && (
                <div className="modal-overlay" style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                        width: '90%',
                        maxWidth: '1500px',
                        maxHeight: '80vh',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden'
                    }}>
                        <div className="modal-header" style={{
                            padding: '20px',
                            borderBottom: '1px solid #e0e0e0',
                            backgroundColor: '#f8f9fa',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexShrink: 0
                        }}>
                            <h2 style={{ margin: 0, color: '#dc3545', fontWeight: 'bold' }}>Redacted</h2>
                            <button className="modal-close" onClick={closeRedactedActionModal} style={{
                                background: 'none',
                                border: 'none',
                                fontSize: '20px',
                                cursor: 'pointer',
                                color: '#666',
                                padding: '5px'
                            }}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="modal-body create-lead-form" style={{
                            padding: '20px',
                            overflowY: 'auto',
                            flex: 1,
                            minHeight: '200px'
                        }}>
                            <form onSubmit={handleCreateLead}>
                                    {/* Company Information Section */}
                                    <div className="form-section">
                                        <h3 className="section-title">Company Information</h3>
                                        <div className="form-row">
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
                                                <label>Lead Manager *</label>
                                                <div className="lead-manager-dropdown-container">
                                                    <div 
                                                        className="lead-manager-dropdown-trigger"
                                                        onClick={() => setShowLeadManagerDropdown(!showLeadManagerDropdown)}
                                                    >
                                                        <span className="lead-manager-placeholder">
                                                            {formData.contact_person || 'Select Lead Manager'}
                                                        </span>
                                                        <i className={`fas fa-chevron-down ${showLeadManagerDropdown ? 'rotated' : ''}`}></i>
                                                    </div>
                                                    {showLeadManagerDropdown && (
                                                        <div className="lead-manager-dropdown-options">
                                                            {['Nasreen', 'Koketso', 'Shannon'].map((manager) => (
                                                                <div 
                                                                    key={manager} 
                                                                    className="lead-manager-option"
                                                                    onClick={() => {
                                                                        setFormData(prev => ({ ...prev, contact_person: manager }));
                                                                        setShowLeadManagerDropdown(false);
                                                                    }}
                                                                >
                                                                    {manager}
                                                                </div>
                                                            ))}
                                                            <div 
                                                                className="lead-manager-option create-new"
                                                                onClick={() => {
                                                                    setShowLeadManagerDropdown(false);
                                                                    setShowCreateManagerModal(true);
                                                                }}
                                                            >
                                                                <i className="fas fa-plus"></i>
                                                                Create New Lead Manager
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label>Company Contact</label>
                                                <input
                                                    type="text"
                                                    name="company_contact"
                                                    value={formData.company_contact}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter company contact information"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Conception Date</label>
                                                <input
                                                    type="date"
                                                    name="conception_date"
                                                    value={formData.conception_date || new Date().toISOString().split('T')[0]}
                                                    onChange={handleInputChange}
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Services & SETA Section */}
                                    <div className="form-section">
                                        <h3 className="section-title">Services & SETA</h3>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Services *</label>
                                                <div className="services-dropdown-container">
                                                    <div 
                                                        className="services-dropdown-trigger"
                                                        onClick={() => setShowServicesDropdown(!showServicesDropdown)}
                                                    >
                                                        <span className={`services-placeholder ${formData.services && formData.services.length > 0 ? 'has-selections' : ''}`}>
                                                            {formData.services && formData.services.length > 0 
                                                                ? formData.services.join(', ') 
                                                                : 'Select Services'
                                                            }
                                                        </span>
                                                        <i className={`fas fa-chevron-down ${showServicesDropdown ? 'rotated' : ''}`}></i>
                                                    </div>
                                                    {showServicesDropdown && (
                                                        <div className="services-dropdown-options">
                                                            {['BBBEE', 'Employment Equity', 'HR', 'WSP'].map((service) => (
                                                                <label key={service} className="service-option">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={formData.services?.includes(service) || false}
                                                                        onChange={() => handleServiceRadioChange(service)}
                                                                    />
                                                                    <span className="option-label">{service}</span>
                                                                </label>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
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
                                        </div>
                                    </div>

                                    {/* Financial & Documents Section */}
                                    <div className="form-section">
                                        <h3 className="section-title">Financial & Documents</h3>
                                        <div className="form-row">
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
                                            <div className="form-group">
                                                <label>Document Type</label>
                                                <select
                                                    name="documentType"
                                                    value={formData.documentType || ''}
                                                    onChange={handleInputChange}
                                                >
                                                    <option value="" disabled>Select Document Type</option>
                                                    <option value="SLA">SLA</option>
                                                    <option value="SDF Appointment Letter">SDF Appointment Letter</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Upload Documents</label>
                                                <div className="document-upload-section">
                                                    <button type="button" className="add-service-btn" onClick={handleFileSelect}>
                                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                            <path d="M8 1L8 15M1 8L15 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                                        </svg>
                                                        Upload attachment
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Attachments Section */}
                                        {attachments.length > 0 && (
                                            <div className="attachments-list">
                                                {attachments
                                                    .filter(attachment => attachment.documentType === formData.documentType)
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
                                                        <div className="attachment-actions">
                                                            <button 
                                                                type="button" 
                                                                className="preview-btn" 
                                                                onClick={() => handleFilePreview(attachment)}
                                                                title="Open file"
                                                            >
                                                                <i className="fas fa-external-link-alt"></i>
                                                            </button>
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
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                            </form>
                        </div>
                        <div className="modal-footer" style={{ 
                            borderTop: '1px solid #e0e0e0', 
                            padding: '15px 20px', 
                            backgroundColor: '#f8f9fa',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexShrink: 0
                        }}>
                            <button 
                                type="button" 
                                className="btn secondary" 
                                onClick={closeRedactedActionModal}
                                style={{
                                    background: '#6c757d',
                                    color: 'white',
                                    border: 'none',
                                    padding: '8px 16px',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '14px'
                                }}
                            >
                                Cancel
                            </button>
                            <div style={{ fontWeight: 'bold', color: '#dc3545' }}>
                                Redacted
                            </div>
                            <button 
                                type="button" 
                                className="btn primary" 
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleCreateLead(e);
                                }}
                                style={{
                                    background: '#dc3545',
                                    color: 'white',
                                    border: 'none',
                                    padding: '8px 16px',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '14px'
                                }}
                            >
                                Redacted
                            </button>
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