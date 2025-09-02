import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HubSpotLayout from '../components/HubSpotLayout';
import '../css/SkillsProgram.css';

const SkillsProgram = () => {
    const navigate = useNavigate();
    const [unitStandards, setUnitStandards] = useState([{ code: '', name: '', credits: '' }]);

    const addUnitStandard = () => {
        setUnitStandards([...unitStandards, { code: '', name: '', credits: '' }]);
    };

    const updateUnitStandard = (index, field, value) => {
        const updatedStandards = [...unitStandards];
        updatedStandards[index][field] = value;
        setUnitStandards(updatedStandards);
    };

    const removeUnitStandard = (index) => {
        if (unitStandards.length > 1) {
            const updatedStandards = unitStandards.filter((_, i) => i !== index);
            setUnitStandards(updatedStandards);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission here
        console.log('Skills Program form submitted');
        // You can add API call here
    };

    // (move all code from return into a variable)
    const pageContent = (
        <>
            <main className="skills-form">
                <form id="skillsProgram" onSubmit={handleSubmit}>
                    {/* Program Definition Section */}
                    <section className="program-section">
                        <h2><i className="fas fa-graduation-cap"></i> Program Definition</h2>
                        
                        <div className="form-grid">
                            <div className="form-group">
                                <label htmlFor="programName">Program Name</label>
                                <input type="text" id="programName" name="programName" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="seta">SETA</label>
                                <select id="seta" name="seta" required>
                                    <option value="">Select SETA</option>
                                    <option value="services">SERVICES SETA</option>
                                    <option value="lgseta">LGSETA</option>
                                    <option value="wrseta">W&RSETA</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="nqfLevel">NQF Level</label>
                                <select id="nqfLevel" name="nqfLevel" required>
                                    <option value="">Select Level</option>
                                    <option value="1">NQF Level 1</option>
                                    <option value="2">NQF Level 2</option>
                                    <option value="3">NQF Level 3</option>
                                    <option value="4">NQF Level 4</option>
                                    <option value="5">NQF Level 5</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="totalCredits">Total Credits</label>
                                <input type="number" id="totalCredits" name="totalCredits" min="0" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="providerName">Provider Name</label>
                                <input type="text" id="providerName" name="providerName" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="providerAccreditation">Provider Accreditation Number</label>
                                <input type="text" id="providerAccreditation" name="providerAccreditation" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="programCost">Program Cost per Learner (R)</label>
                                <input type="number" id="programCost" name="programCost" step="0.01" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="programDuration">Program Duration</label>
                                <div className="duration-input">
                                    <input type="number" id="durationValue" name="durationValue" min="1" required />
                                    <select id="durationUnit" name="durationUnit" required>
                                        <option value="days">Days</option>
                                        <option value="weeks">Weeks</option>
                                        <option value="months">Months</option>
                                        <option value="hours">Hours</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="programStatus">Program Status</label>
                                <select id="programStatus" name="programStatus" required>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="planned">Planned</option>
                                    <option value="archived">Archived</option>
                                </select>
                            </div>
                            <div className="form-group full-width">
                                <label htmlFor="programDescription">Program Description</label>
                                <textarea id="programDescription" name="programDescription" rows="4" required></textarea>
                            </div>
                        </div>
                    </section>

                    {/* Unit Standards Section */}
                    <section className="program-section">
                        <h2><i className="fas fa-list-check"></i> Unit Standards</h2>
                        
                        <div id="unitStandardsList">
                            {unitStandards.map((standard, index) => (
                                <div key={index} className="unit-standard-item">
                                    <div className="form-grid">
                                        <div className="form-group">
                                            <label>Unit Standard Code</label>
                                            <input 
                                                type="text" 
                                                value={standard.code}
                                                onChange={(e) => updateUnitStandard(index, 'code', e.target.value)}
                                                required 
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Unit Standard Name</label>
                                            <input 
                                                type="text" 
                                                value={standard.name}
                                                onChange={(e) => updateUnitStandard(index, 'name', e.target.value)}
                                                required 
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Credits</label>
                                            <input 
                                                type="number" 
                                                value={standard.credits}
                                                onChange={(e) => updateUnitStandard(index, 'credits', e.target.value)}
                                                min="0" 
                                                required 
                                            />
                                        </div>
                                        {unitStandards.length > 1 && (
                                            <div className="form-group">
                                                <button 
                                                    type="button" 
                                                    onClick={() => removeUnitStandard(index)}
                                                    style={{
                                                        background: '#dc3545',
                                                        color: 'white',
                                                        border: 'none',
                                                        padding: '8px 15px',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    <i className="fas fa-trash"></i> Remove
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button type="button" className="add-unit-btn" onClick={addUnitStandard}>
                            <i className="fas fa-plus"></i> Add Unit Standard
                        </button>
                    </section>

                    {/* Enrollment Details Section */}
                    <section className="program-section">
                        <h2><i className="fas fa-users"></i> Enrollment Details</h2>
                        
                        <div className="form-grid">
                            <div className="form-group">
                                <label htmlFor="enrollmentDate">Enrollment Date</label>
                                <input type="date" id="enrollmentDate" name="enrollmentDate" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="expectedCompletion">Expected Completion Date</label>
                                <input type="date" id="expectedCompletion" name="expectedCompletion" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="learnerStatus">Learner Status</label>
                                <select id="learnerStatus" name="learnerStatus" required>
                                    <option value="enrolled">Enrolled</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                    <option value="withdrawn">Withdrawn</option>
                                    <option value="failed">Failed</option>
                                    <option value="unemployed">Unemployed</option>
                                    <option value="employed">Employed</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="learnerId">Learner ID</label>
                                <input type="text" id="learnerId" name="learnerId" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="fundingSource">Funding Source</label>
                                <select id="fundingSource" name="fundingSource" required>
                                    <option value="company">Company Budget</option>
                                    <option value="seta">SETA Grant</option>
                                    <option value="employee">Employee Contribution</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="certificationStatus">Certification Status</label>
                                <select id="certificationStatus" name="certificationStatus" required>
                                    <option value="pending">Pending Certificate</option>
                                    <option value="certified">Certified</option>
                                    <option value="issued">Certificate Issued</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="certificateDate">Certificate Issue Date</label>
                                <input type="date" id="certificateDate" name="certificateDate" />
                            </div>
                            <div className="form-group full-width">
                                <label htmlFor="progressNotes">Progress Notes</label>
                                <textarea id="progressNotes" name="progressNotes" rows="4"></textarea>
                            </div>
                            <div className="form-group full-width">
                                <label htmlFor="attachments">Attachments</label>
                                <input type="file" id="attachments" name="attachments" multiple />
                                <small>Upload certificates, progress reports, or assessment results</small>
                            </div>
                        </div>
                    </section>

                    {/* Submit Section */}
                    <section className="program-section">
                        <div className="form-actions">
                            <button type="submit" className="submit-btn">
                                <i className="fas fa-save"></i> Save Program
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
            title="Skills Program" 
            description="Manage skills development programs and training"
        >
            {pageContent}
        </HubSpotLayout>
    );
};

export default SkillsProgram; 