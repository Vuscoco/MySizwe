import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import HubSpotLayout from '../components/HubSpotLayout';
import '../css/SLAPreview.css';

const SLAPreview = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [previewData, setPreviewData] = useState({});

    useEffect(() => {
        // Get data from sessionStorage or location state
        const storedData = sessionStorage.getItem('slaPreviewData');
        if (storedData) {
            setPreviewData(JSON.parse(storedData));
        } else if (location.state?.formData) {
            setPreviewData(location.state.formData);
        }
    }, [location.state]);

    const formatCurrency = (amount) => {
        if (!amount) return 'R 0.00';
        return new Intl.NumberFormat('en-ZA', {
            style: 'currency',
            currency: 'ZAR'
        }).format(parseFloat(amount));
    };

    const formatQualificationType = (type) => {
        if (!type) return 'N/A';
        return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    const goBack = () => {
        navigate(-1);
    };

    const printPreview = () => {
        window.print();
    };

    // (move all code from return into a variable)
    const pageContent = (
        <>
            <div className="preview-container">
                <div className="preview-header">
                    <h1 className="preview-title">
                        <i className="fas fa-file-contract"></i>
                        SLA Preview
                    </h1>
                    <div className="preview-actions">
                        <button className="btn secondary" onClick={printPreview}>
                            <i className="fas fa-print"></i> Print
                        </button>
                        <button className="btn primary" onClick={goBack}>
                            <i className="fas fa-arrow-left"></i> Back to Form
                        </button>
                    </div>
                </div>

                <div className="preview-grid">
                    {/* Basic Information Card */}
                    <div className="preview-card">
                        <div className="card-header">
                            <i className="fas fa-user"></i>
                            <h2>Basic Information</h2>
                        </div>
                        <div className="info-grid">
                            <div className="info-item">
                                <span className="info-label">Company/Client Name</span>
                                <span className="info-value">{previewData.clientName || 'N/A'}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Registration Number</span>
                                <span className="info-value">{previewData.clientReg || 'N/A'}</span>
                            </div>
                            <div className="info-item full-width">
                                <span className="info-label">Registered Address</span>
                                <span className="info-value">{previewData.clientAddress || 'N/A'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Contact Information Card */}
                    <div className="preview-card">
                        <div className="card-header">
                            <i className="fas fa-address-book"></i>
                            <h2>Contact Information</h2>
                        </div>
                        <div className="info-grid">
                            <div className="info-item">
                                <span className="info-label">Contact Person</span>
                                <span className="info-value">{previewData.contactPerson || 'N/A'}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Position</span>
                                <span className="info-value">{previewData.contactPosition || 'N/A'}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Phone Number</span>
                                <span className="info-value">{previewData.contactPhone || 'N/A'}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Email Address</span>
                                <span className="info-value">{previewData.contactEmail || 'N/A'}</span>
                            </div>
                        </div>
                    </div>

                    {/* SETA and Service Details Card */}
                    <div className="preview-card">
                        <div className="card-header">
                            <i className="fas fa-certificate"></i>
                            <h2>SETA and Service Details</h2>
                        </div>
                        <div className="info-grid">
                            <div className="info-item">
                                <span className="info-label">SETA</span>
                                <span className="info-value">{previewData.seta || 'N/A'}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Service Type</span>
                                <span className="info-value">{previewData.service || 'N/A'}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">SDL Number</span>
                                <span className="info-value">{previewData.sdlNumber || 'N/A'}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Skills Program Manager</span>
                                <span className="info-value">{previewData.moderator || 'N/A'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Financial Details Card */}
                    <div className="preview-card">
                        <div className="card-header">
                            <i className="fas fa-money-bill-wave"></i>
                            <h2>Financial Details</h2>
                        </div>
                        <div className="info-grid">
                            <div className="info-item">
                                <span className="info-label">Monthly Retainer</span>
                                <span className="info-value currency">{formatCurrency(previewData.retainer)}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Payment Terms</span>
                                <span className="info-value">{previewData.paymentTerms || 'N/A'} Days</span>
                            </div>
                        </div>
                    </div>

                    {/* Additional Services Card */}
                    {previewData.services && previewData.services.length > 0 && (
                        <div className="preview-card">
                            <div className="card-header">
                                <i className="fas fa-list"></i>
                                <h2>Additional Services</h2>
                            </div>
                            <div className="services-list">
                                {previewData.services.map((service, index) => (
                                    <div key={index} className="service-card sla-service">
                                        <div className="service-header">
                                            <i className="fas fa-file-contract"></i>
                                            Service {index + 1}
                                            <span className="sla-badge">SLA</span>
                                        </div>
                                        <div className="service-details">
                                            <div className="service-detail">
                                                <strong>SLA Type</strong>
                                                {service.type}
                                            </div>
                                            <div className="service-detail">
                                                <strong>Rate</strong>
                                                {formatCurrency(service.rate)}
                                            </div>
                                            <div className="service-detail">
                                                <strong>Recurring</strong>
                                                {service.recurring ? 'Yes' : 'No'}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Qualification Details Card */}
                    <div className="preview-card">
                        <div className="card-header">
                            <i className="fas fa-graduation-cap"></i>
                            <h2>Qualification Details</h2>
                        </div>
                        <div className="info-grid">
                            <div className="info-item">
                                <span className="info-label">Qualification Type</span>
                                <span className="info-value">{formatQualificationType(previewData.qualificationType)}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Qualification Level</span>
                                <span className="info-value">{previewData.qualificationLevel || 'N/A'}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Cost per Learner</span>
                                <span className="info-value currency">{formatCurrency(previewData.costPerLearner)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <footer className="preview-footer">
                    <p>&copy; 2025 CRM. All rights reserved.</p>
                </footer>
            </div>
        </>
    );

    return (
        <HubSpotLayout 
            title="SLA Preview" 
            description="Preview and manage Service Level Agreements"
        >
            {pageContent}
        </HubSpotLayout>
    );
};

export default SLAPreview; 