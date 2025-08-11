import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HubSpotLayout from '../components/HubSpotLayout';
import '../css/WSPTraining.css';

const ProjectManagement = () => {
    const navigate = useNavigate();
    const [showTrainingForm, setShowTrainingForm] = useState(false);
    const [showAddProjectModal, setShowAddProjectModal] = useState(false);
    const [showViewProjectModal, setShowViewProjectModal] = useState(false);
    const [showEditProjectModal, setShowEditProjectModal] = useState(false);
    const [showAddManagerModal, setShowAddManagerModal] = useState(false);
    const [showAddYearRangeModal, setShowAddYearRangeModal] = useState(false);
    const [showRedactedModal, setShowRedactedModal] = useState(false);
    const [showHistoryMode, setShowHistoryMode] = useState(false);
    const [showLeadManagerDropdown, setShowLeadManagerDropdown] = useState(false);
    const [showServicesDropdown, setShowServicesDropdown] = useState(false);
    const [showCreateManagerModal, setShowCreateManagerModal] = useState(false);
    const [editingTraining, setEditingTraining] = useState(null);
    const [currentProject, setCurrentProject] = useState(null);
    const [redactedFormData, setRedactedFormData] = useState({
        // Client Information Fields
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
        attachments: [],
        // Project Information Fields
        projectManager: '',
        yearRange: '',
        description: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        intervention: '',
        selectedInterventions: [],
        interventionCosts: {},
        selectedCostIntervention: '',
        interventionLearners: {},
        selectedLearnersIntervention: '',
        budget: '',
        client: '',
        costPerLearner: '',
        numberOfLearners: '',
        skillsProgramType: '',
        unitStandards: '',
        modules: '',
        modulesDropdown: '',
        separateModules: '',
        credits: '',
        accreditationModules: '',
        accreditationCredits: '',
        accreditingBody: 'QCTO',
        accreditationNumber: '',
        qualifications: '',
        nqfLevel: '',
        ofoNumber: '',
        issuedBy: new Date().toISOString().split('T')[0],
        expires: '',
        duration: '5 years',
        selectedLegacyQualifications: [],
        independentNqfLevel: '',
        independentCredits: ''
    });
    const [trainingData, setTrainingData] = useState({
        title: '',
        startDate: '',
        endDate: '',
        duration: '',
        facilitator: '',
        location: '',
        maxParticipants: '',
        description: '',
        status: 'Scheduled'
    });
    const [projectForm, setProjectForm] = useState({
        projectManager: '',
        yearRange: '',
        description: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        attachments: '',
        intervention: '',
        selectedInterventions: [], // New field for multiple interventions
        interventionCosts: {}, // New field for storing intervention costs
        selectedCostIntervention: '', // Track which intervention's cost is displayed
        interventionLearners: {}, // New field for storing intervention learners
        selectedLearnersIntervention: '', // Track which intervention's learners is displayed

        budget: '',
        client: '',
        costPerLearner: '',
        numberOfLearners: '',
        documentType: '', // New field for document type dropdown
        qualificationTitle: '', // New field for qualification title dropdown
        skillsProgramType: '', // New field for skills program type dropdown
        unitStandards: '', // New field for unit standards
        modules: '', // New field for modules
        modulesDropdown: '', // New field for modules dropdown (separate from dynamic modules)
        separateModules: '', // New field for separate modules dropdown
        credits: '', // New field for credits
        accreditationModules: '', // New field for accreditation modules
        accreditationCredits: '', // New field for accreditation credits
        accreditingBody: 'QCTO', // New field for accrediting body
        accreditationNumber: '', // New field for accreditation number
        qualifications: '', // New field for qualifications
        nqfLevel: '', // New field for NQF level
        ofoNumber: '', // New field for OFO code
        issuedBy: new Date().toISOString().split('T')[0], // New field for issued by date
        expires: '', // New field for expires date
        duration: '5 years', // New field for duration
        selectedLegacyQualifications: [], // New field for multiple legacy qualification selection
        independentNqfLevel: '', // New field for independent NQF level
        independentCredits: '' // New field for independent credits
    });

    // State for intervention dropdown visibility
    const [showInterventionDropdown, setShowInterventionDropdown] = useState(false);
    
    // State for cost dropdown visibility
    const [showCostDropdown, setShowCostDropdown] = useState(false);
    
    // State for learners dropdown visibility
    const [showLearnersDropdown, setShowLearnersDropdown] = useState(false);
    
    // State for legacy qualifications dropdown visibility
    const [showLegacyQualificationsDropdown, setShowLegacyQualificationsDropdown] = useState(false);
    
    // State for current legacy qualifications to display
    const [currentLegacyQualifications, setCurrentLegacyQualifications] = useState([]);
    
    // State for independent dropdowns visibility
    const [showIndependentNqfDropdown, setShowIndependentNqfDropdown] = useState(false);
    const [showIndependentCreditsDropdown, setShowIndependentCreditsDropdown] = useState(false);
    
    // State for modules dropdown visibility (for unit standards)
    const [showModulesDropdown, setShowModulesDropdown] = useState(false);
    
    // State for separate modules dropdown visibility
    const [showSeparateModulesDropdown, setShowSeparateModulesDropdown] = useState(false);
    
    // State for attachments
    const [attachments, setAttachments] = useState([]);
    
    // Ensure attachments is always an array
    const safeAttachments = Array.isArray(attachments) ? attachments : [];
    
    // Helper function to safely filter attachments
    const getFilteredAttachments = (documentType) => {
        if (!Array.isArray(attachments)) return [];
        return attachments.filter(attachment => attachment.documentType === documentType);
    };
    
    // Ensure attachments is always an array to prevent errors
    useEffect(() => {
        if (!Array.isArray(attachments)) {
            setAttachments([]);
        }
    }, [attachments]);

    // Ensure redacted form attachments is always an array
    useEffect(() => {
        if (!Array.isArray(redactedFormData.attachments)) {
            setRedactedFormData(prev => ({
                ...prev,
                attachments: []
            }));
        }
    }, [redactedFormData.attachments]);

    // Load training data from localStorage
    const [trainings, setTrainings] = useState([]);
    
    // Load projects data from localStorage
    const [projects, setProjects] = useState([]);

    // Qualifications data for accreditation numbers (only those with "05-QCTO/SDP...")
    const qualificationsData = {
        '05-QCTO/SDP010524113839': [
            { name: 'Retail Supervisor (Occupational Certificate)', nqf: 'NQF L4', ofo: '99573', modules: '8', credits: '150' },
            { name: 'Visual Merchandiser (Occupational Certificate)', nqf: 'NQF L3', ofo: '99688', modules: '6', credits: '120' },
            { name: 'Retail Manager/Retail Store Manager (Occupational Certificate)', nqf: 'NQF L6', ofo: '91789', modules: '10', credits: '200' },
            { name: 'Retail Buyer (Occupational Certificate)', nqf: 'NQF L5', ofo: '103145', modules: '9', credits: '180' }
        ],
        '05-QCTO/SDP040325132739': [
            { name: 'Food and Dev\' Process Machine Operator (Intermediate Occupational Certificate)', nqf: 'NQF L3', ofo: '121149', modules: '7', credits: '140' }
        ]
    };

    // OFO Number mapping based on NQF Level
    const ofoMapping = {
        'NQF 2': '99688',
        'NQF 3': '99688', 
        'NQF L2': '99707',
        'NQF L3': '121149',
        'NQF L4': '99573',
        'NQF 4': '99573',
        'NQF L5': '103145',
        'NQF 5': '103145',
        'NQF L6': '91789',
        'NQF 6': '91789'
    };
    
    useEffect(() => {
        const storedTrainings = localStorage.getItem('wspTrainings');
        if (storedTrainings) {
            setTrainings(JSON.parse(storedTrainings));
        }
        
        // Load projects data
        const storedProjects = localStorage.getItem('projectData');
        if (storedProjects) {
            setProjects(JSON.parse(storedProjects));
        }
    }, []);

    // Legacy qualifications data for W&R SETA
    const wrsetaLegacyQualifications = [
        { value: 'nc_wholesale_retail_operations_50206', label: 'Skills: Visual Merchandiser (W&R SETA)' },
        
        { value: 'nc_retail_management_50208', label: 'NC Wholesale and Retail Operations (58206) (W&R SETA)' },
        { value: 'nc_wholesale_management_50209', label: 'NC Informal and Small Business Practice (58308) (W&R SETA)' },
        { value: 'nc_informal_small_business', label: 'FETC Generic Management (63333)(W&R SETA)' }
    ];

    // Legacy qualifications data for FPM SETA
    const fpmLegacyQualifications = [
        { value: 'nc_financial_management_50210', label: 'NC Furniture Making: Wood (49091) (FPM SETA)' },
        { value: 'nc_accounting_50211', label: 'GETCM Clothing Manufacturing Processes(50584) (FPM SETA)' }

    ];


    // Independent NQF Level options
    const independentNqfLevels = [
        { value: 'nqf1', label: 'NQF Level 1' },
        { value: 'nqf2', label: 'NQF Level 2' },
        { value: 'nqf3', label: 'NQF Level 3' },
        { value: 'nqf4', label: 'NQF Level 4' },
        { value: 'nqf5', label: 'NQF Level 5' },
        { value: 'nqf6', label: 'NQF Level 6' },
        { value: 'nqf7', label: 'NQF Level 7' },
        { value: 'nqf8', label: 'NQF Level 8' }
    ];

    // Independent Credits options
    const independentCreditsOptions = [
        { value: '100', label: '24 Credits' },
        { value: '120', label: '120 Credits' },
        { value: '130', label: '130 Credits' },
        { value: '140', label: '140 Credits' },
        { value: '150', label: '150 Credits' },
        { value: '160', label: '160 Credits' },
        { value: '170', label: '170 Credits' },
        { value: '180', label: '180 Credits' },
        { value: '190', label: '190 Credits' },
        { value: '200', label: '200 Credits' },
        { value: '220', label: '220 Credits' },
        { value: '250', label: '250 Credits' }
    ];

    // Modules options (for unit standards)
    const modulesOptions = [
        { value: '1', label: '258221' },
        { value: '2', label: '258215' },
        { value: '3', label: '258217' }
    ];

    // Separate modules options
    const separateModulesOptions = [
        { value: 'mod1', label: 'Module 1' },
        { value: 'mod2', label: 'Module 2' },
        { value: 'mod3', label: 'Module 3' },
        { value: 'mod4', label: 'Module 4' },
        { value: 'mod5', label: 'Module 5' },
        { value: 'mod6', label: 'Module 6' },
        { value: 'mod7', label: 'Module 7' },
        { value: 'mod8', label: 'Module 8' }
    ];

    // Handle clicking outside intervention dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showInterventionDropdown && !event.target.closest('.intervention-dropdown-container')) {
                setShowInterventionDropdown(false);
            }
            if (showCostDropdown && !event.target.closest('.cost-dropdown-container')) {
                setShowCostDropdown(false);
            }
            if (showLearnersDropdown && !event.target.closest('.learners-dropdown-container')) {
                setShowLearnersDropdown(false);
            }
            if (showLegacyQualificationsDropdown && !event.target.closest('.intervention-dropdown-container')) {
                setShowLegacyQualificationsDropdown(false);
            }
            if (showIndependentNqfDropdown && !event.target.closest('.intervention-dropdown-container')) {
                setShowIndependentNqfDropdown(false);
            }
            if (showIndependentCreditsDropdown && !event.target.closest('.intervention-dropdown-container')) {
                setShowIndependentCreditsDropdown(false);
            }
            if (showModulesDropdown && !event.target.closest('.intervention-dropdown-container')) {
                setShowModulesDropdown(false);
            }
            if (showSeparateModulesDropdown && !event.target.closest('.intervention-dropdown-container')) {
                setShowSeparateModulesDropdown(false);
            }
        };

        if (showInterventionDropdown || showCostDropdown || showLearnersDropdown || showLegacyQualificationsDropdown || showIndependentNqfDropdown || showIndependentCreditsDropdown || showModulesDropdown || showSeparateModulesDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showInterventionDropdown, showCostDropdown, showLearnersDropdown, showLegacyQualificationsDropdown, showIndependentNqfDropdown, showIndependentCreditsDropdown, showModulesDropdown, showSeparateModulesDropdown]);

    // Update qualifications when accreditation number changes
    useEffect(() => {
        if (projectForm.accreditationNumber) {
            updateQualifications();
        }
    }, [projectForm.accreditationNumber]);

    // Update NQF level when qualifications change
    useEffect(() => {
        if (projectForm.qualifications) {
            updateNQFLevel();
        }
    }, [projectForm.qualifications]);

    // Debug currentLegacyQualifications changes
    useEffect(() => {
        console.log('currentLegacyQualifications changed:', currentLegacyQualifications);
    }, [currentLegacyQualifications]);

    // Debug selectedInterventions changes
    useEffect(() => {
        console.log('selectedInterventions changed:', projectForm.selectedInterventions);
    }, [projectForm.selectedInterventions]);

    // Debug selectedLegacyQualifications changes
    useEffect(() => {
        console.log('selectedLegacyQualifications changed:', projectForm.selectedLegacyQualifications);
    }, [projectForm.selectedLegacyQualifications]);

    // Helper function to check if learnership interventions are selected
    const hasLearnershipIntervention = () => {
        if (!projectForm.selectedInterventions || projectForm.selectedInterventions.length === 0) {
            return false;
        }
        return projectForm.selectedInterventions.some(intervention => 
            intervention.value === 'learnship_18_1' || intervention.value === 'learnship_18_2'
        );
    };

    // Helper function to check if skills programs are selected
    const hasSkillsProgramIntervention = () => {
        if (!projectForm.selectedInterventions || projectForm.selectedInterventions.length === 0) {
            return false;
        }
        return projectForm.selectedInterventions.some(intervention => 
            intervention.value === 'skills_programs_18_1' || intervention.value === 'skills_programs_18_2'
        );
    };

    // Helper function to check if unit standards should be disabled (for learnership only)
    const shouldDisableUnitStandards = () => {
        return hasLearnershipIntervention();
    };

    // Helper function to check if modules should be disabled (for skills programs only)
    const shouldDisableModules = () => {
        return hasSkillsProgramIntervention();
    };

    // Helper function to check if modules should be enabled (for learnership only)
    const shouldEnableModules = () => {
        return hasLearnershipIntervention();
    };

    // Helper function to check if unit standards should be enabled (for skills programs only)
    const shouldEnableUnitStandards = () => {
        return hasSkillsProgramIntervention();
    };

    // Helper function to check if learnership interventions are selected (for redacted form)
    const hasRedactedLearnershipIntervention = () => {
        if (!redactedFormData.selectedInterventions || redactedFormData.selectedInterventions.length === 0) {
            return false;
        }
        return redactedFormData.selectedInterventions.some(intervention => 
            intervention.value === 'learnship_18_1' || intervention.value === 'learnship_18_2'
        );
    };

    // Helper function to check if skills programs are selected (for redacted form)
    const hasRedactedSkillsProgramIntervention = () => {
        if (!redactedFormData.selectedInterventions || redactedFormData.selectedInterventions.length === 0) {
            return false;
        }
        return redactedFormData.selectedInterventions.some(intervention => 
            intervention.value === 'skills_programs_18_1' || intervention.value === 'skills_programs_18_2'
        );
    };

    // Helper function to check if unit standards should be disabled (for redacted form - learnership only)
    const shouldDisableRedactedUnitStandards = () => {
        return hasRedactedLearnershipIntervention();
    };

    // Helper function to check if modules should be disabled (for redacted form - skills programs only)
    const shouldDisableRedactedModules = () => {
        return hasRedactedSkillsProgramIntervention();
    };

    // Helper function to format legacy qualifications placeholder
    const formatLegacyQualificationsPlaceholder = (selectedQualifications) => {
        if (!selectedQualifications || selectedQualifications.length === 0) {
            return 'Select legacy qualifications';
        }
        
        const labels = selectedQualifications.map(item => item.label);
        const fullText = labels.join(', ');
        
        // If text is longer than 50 characters, truncate and add "..."
        if (fullText.length > 50) {
            const truncated = labels.slice(0, 2).join(', ');
            return `${truncated}...`;
        }
        
        return fullText;
    };

    const handleAddTraining = () => {
        setEditingTraining(null);
        setTrainingData({
            title: '',
            startDate: '',
            endDate: '',
            duration: '',
            facilitator: '',
            location: '',
            maxParticipants: '',
            description: '',
            status: 'Scheduled'
        });
        setShowTrainingForm(true);
    };

    const handleEditTraining = (training) => {
        setEditingTraining(training);
        setTrainingData({
            title: training.title || '',
            startDate: training.startDate || '',
            endDate: training.endDate || '',
            duration: training.duration || '',
            facilitator: training.facilitator || '',
            location: training.location || '',
            maxParticipants: training.maxParticipants || '',
            description: training.description || '',
            status: training.status || 'Scheduled'
        });
        setShowTrainingForm(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTrainingData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmitTraining = (e) => {
        e.preventDefault();
        
        if (!trainingData.title.trim()) {
            alert('Training title is required');
            return;
        }

        if (editingTraining) {
            // Update existing training
            const updatedTrainings = trainings.map(t => 
                t.id === editingTraining.id ? { ...t, ...trainingData } : t
            );
            setTrainings(updatedTrainings);
            localStorage.setItem('wspTrainings', JSON.stringify(updatedTrainings));
        } else {
            // Add new training
            const newTraining = {
                id: Date.now().toString(),
                ...trainingData
            };
            const updatedTrainings = [...trainings, newTraining];
            setTrainings(updatedTrainings);
            localStorage.setItem('wspTrainings', JSON.stringify(updatedTrainings));
        }
        
        setShowTrainingForm(false);
        setEditingTraining(null);
    };

    const handleCancelTraining = () => {
        setShowTrainingForm(false);
        setEditingTraining(null);
    };

    const handleDeleteTraining = (trainingId) => {
        if (window.confirm('Are you sure you want to delete this training?')) {
            const updatedTrainings = trainings.filter(t => t.id !== trainingId);
            setTrainings(updatedTrainings);
            localStorage.setItem('wspTrainings', JSON.stringify(updatedTrainings));
        }
    };

    const openAddProjectModal = () => {
        setShowAddProjectModal(true);
        // Reset project form data when opening modal
        setProjectForm({
            projectManager: '',
            yearRange: '',
            description: '',
            startDate: new Date().toISOString().split('T')[0],
            endDate: '',
            attachments: '',
            intervention: '',
            selectedInterventions: [], // Reset selected interventions
            interventionCosts: {}, // Reset intervention costs
            selectedCostIntervention: '', // Reset selected cost intervention
            status: 'Employment Equity',
            budget: '',
            client: '',
            costPerLearner: '',
            numberOfLearners: '',
            skillsProgramType: '', // Reset skills program type field
            unitStandards: '', // Reset unit standards field
            modules: '', // Reset modules field
            modulesDropdown: '', // Reset modules dropdown field
            credits: '', // Reset credits field
            accreditationModules: '', // Reset accreditation modules field
            accreditationCredits: '', // Reset accreditation credits field
            selectedLegacyQualifications: [], // Reset selected legacy qualifications
            independentNqfLevel: '', // Reset independent NQF level
            independentCredits: '' // Reset independent credits
        });
        setShowInterventionDropdown(false);
        setShowCostDropdown(false);
        setShowLearnersDropdown(false);
        setAttachments([]); // Reset attachments
    };

    const closeAddProjectModal = () => {
        setShowAddProjectModal(false);
        // Reset project form data when closing modal
        setProjectForm({
            projectManager: '',
            yearRange: '',
            startDate: new Date().toISOString().split('T')[0],
            endDate: '',
            attachments: '',
            intervention: '',
            selectedInterventions: [], // Reset selected interventions
            interventionCosts: {}, // Reset intervention costs
            selectedCostIntervention: '', // Reset selected cost intervention
            interventionLearners: {}, // Reset intervention learners
            selectedLearnersIntervention: '', // Reset selected learners intervention
            costPerLearner: '',
            numberOfLearners: '',
            skillsProgramType: '', // Reset skills program type field
            unitStandards: '', // Reset unit standards field
            modules: '', // Reset modules field
            modulesDropdown: '', // Reset modules dropdown field
            credits: '', // Reset credits field
            accreditationModules: '', // Reset accreditation modules field
            accreditationCredits: '', // Reset accreditation credits field
            accreditingBody: 'QCTO', // Reset accrediting body
            accreditationNumber: '', // Reset accreditation number
            qualifications: '', // Reset qualifications
            nqfLevel: '', // Reset NQF level
            ofoNumber: '', // Reset OFO code
            issuedBy: new Date().toISOString().split('T')[0], // Reset issued by date
            expires: '', // Reset expires date
            duration: '5 years', // Reset duration
            selectedLegacyQualifications: [], // Reset selected legacy qualifications
            independentNqfLevel: '', // Reset independent NQF level
            independentCredits: '' // Reset independent credits
        });
        setShowInterventionDropdown(false);
        setShowCostDropdown(false);
        setShowLearnersDropdown(false);
        setAttachments([]); // Reset attachments
    };

    const closeViewProjectModal = () => {
        setShowViewProjectModal(false);
        setCurrentProject(null);
    };

    const closeEditProjectModal = () => {
        setShowEditProjectModal(false);
        setCurrentProject(null);
        // Reset form data when closing edit modal
        setProjectForm({
            projectManager: '',
            yearRange: '',
            startDate: new Date().toISOString().split('T')[0],
            endDate: '',
            attachments: '',
            intervention: '',
            selectedInterventions: [], // Reset selected interventions
            interventionCosts: {}, // Reset intervention costs
            selectedCostIntervention: '', // Reset selected cost intervention
            interventionLearners: {}, // Reset intervention learners
            selectedLearnersIntervention: '', // Reset selected learners intervention
            costPerLearner: '',
            numberOfLearners: '',
            skillsProgramType: '', // Reset skills program type field
            unitStandards: '', // Reset unit standards field
            modules: '', // Reset modules field
            modulesDropdown: '', // Reset modules dropdown field
            credits: '', // Reset credits field
            accreditationModules: '', // Reset accreditation modules field
            accreditationCredits: '', // Reset accreditation credits field
            accreditingBody: 'QCTO', // Reset accrediting body
            accreditationNumber: '', // Reset accreditation number
            qualifications: '', // Reset qualifications
            nqfLevel: '', // Reset NQF level
            ofoNumber: '', // Reset OFO code
            issuedBy: new Date().toISOString().split('T')[0], // Reset issued by date
            expires: '', // Reset expires date
            duration: '5 years', // Reset duration
            selectedLegacyQualifications: [], // Reset selected legacy qualifications
            independentNqfLevel: '', // Reset independent NQF level
            independentCredits: '' // Reset independent credits
        });
        setShowInterventionDropdown(false);
        setShowCostDropdown(false);
        setShowLearnersDropdown(false);
        setAttachments([]); // Reset attachments
    };

    const handleProjectInputChange = (e) => {
        const { name, value } = e.target;
        
        // Handle "Add Project Manager" selection
        if (name === 'projectManager' && value === 'add_new') {
            setShowAddManagerModal(true);
            return;
        }
        
        // Handle "Add New Year Range" selection
        if (name === 'yearRange' && value === 'add_new') {
            setShowAddYearRangeModal(true);
            return;
        }
        
        // Handle issued by date changes and auto-populate expires and duration
        if (name === 'issuedBy') {
            if (value) {
                // Calculate expires date (48 months from issued by date)
                const issuedDate = new Date(value);
                const expiresDate = new Date(issuedDate);
                expiresDate.setMonth(expiresDate.getMonth() + 48);
                
                setProjectForm(prev => ({
                    ...prev,
                    [name]: value,
                    expires: expiresDate.toISOString().split('T')[0],
                    duration: '5 years'
                }));
            } else {
                setProjectForm(prev => ({
                    ...prev,
                    [name]: value,
                    expires: '',
                    duration: '5 years'
                }));
            }
            return;
        }
        
        // Handle skills program selection and auto-populate fields
        if (name === 'skillsProgramType') {
            const programDetails = getSkillsProgramDetails(value);
            setProjectForm(prev => ({
                ...prev,
                [name]: value,
                unitStandards: programDetails.unitStandards || '',
                modules: programDetails.modules,
                credits: programDetails.credits
            }));
            return;
        }

        // Handle accreditation number changes and auto-populate qualifications
        if (name === 'accreditationNumber') {
            setProjectForm(prev => ({
                ...prev,
                [name]: value,
                qualifications: '',
                nqfLevel: '',
                ofoNumber: ''
            }));
            return;
        }

        // Handle qualification title changes
        if (name === 'qualificationTitle') {
            let qualificationsToShow = [];
            
            if (value === 'wrseta_legacy') {
                qualificationsToShow = wrsetaLegacyQualifications;
                console.log('Setting W&R SETA qualifications:', qualificationsToShow);
            } else if (value === 'fpm_legacy') {
                qualificationsToShow = fpmLegacyQualifications;
                console.log('Setting FPM SETA qualifications:', qualificationsToShow);
            }
            
            setCurrentLegacyQualifications(qualificationsToShow);
            
            setProjectForm(prev => ({
                ...prev,
                [name]: value,
                selectedLegacyQualifications: [],
                independentNqfLevel: '',
                independentCredits: ''
            }));
            return;
        }

        // Handle qualifications changes and auto-populate NQF level and OFO code
        if (name === 'qualifications') {
            const accNumber = projectForm.accreditationNumber;
            const qualifications = qualificationsData[accNumber] || [];
            const selectedQual = qualifications.find(q => q.name === value);
            
            if (selectedQual) {
                setProjectForm(prev => ({
                    ...prev,
                    [name]: value,
                    nqfLevel: selectedQual.nqf,
                    ofoNumber: selectedQual.ofo || ofoMapping[selectedQual.nqf] || '',
                    accreditationModules: selectedQual.modules || '',
                    accreditationCredits: selectedQual.credits || ''
                }));
            } else {
                setProjectForm(prev => ({
                    ...prev,
                    [name]: value,
                    nqfLevel: '',
                    ofoNumber: '',
                    accreditationModules: '',
                    accreditationCredits: ''
                }));
            }
            return;
        }
        
        setProjectForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // File handling functions
    const handleFileSelect = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;
        input.accept = '*/*';
        
        input.onchange = (e) => {
            const files = Array.from(e.target.files);
            const selectedDocumentType = projectForm.documentType || 'Other';
            
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

    const removeAttachment = (attachmentId) => {
        setAttachments(prev => prev.filter(att => att.id !== attachmentId));
    };

    const handleFilePreview = (attachment) => {
        const file = attachment.file;
        const fileType = file.type || '';
        const fileName = file.name.toLowerCase();
        
        // Check for Office file types and open directly in corresponding applications
        const officeExtensions = ['.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.odt', '.ods', '.odp'];
        const isOfficeFile = officeExtensions.some(ext => fileName.endsWith(ext));
        
        if (isOfficeFile) {
            // For Office files, try to open with default application
            const url = URL.createObjectURL(file);
            window.open(url, '_blank');
            return;
        }
        
        // For PDFs and images, open in new tab
        if (fileType.includes('pdf') || fileType.includes('image/')) {
            const url = URL.createObjectURL(file);
            window.open(url, '_blank');
            return;
        }
        
        // For other files, trigger download
        const url = URL.createObjectURL(file);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    // New function to handle intervention selection
    // Cost mapping based on interventions - with editable values
    const getCostOptions = (selectedInterventions) => {
        if (!selectedInterventions || selectedInterventions.length === 0) {
            return [];
        }

        return selectedInterventions.map(intervention => ({
            label: intervention.label,
            cost: projectForm.interventionCosts?.[intervention.value] || '',
            interventionValue: intervention.value
        }));
    };

    const getLearnersOptions = (selectedInterventions) => {
        if (!selectedInterventions || selectedInterventions.length === 0) {
            return [];
        }

        return selectedInterventions.map(intervention => ({
            label: intervention.label,
            learners: projectForm.interventionLearners?.[intervention.value] || '',
            interventionValue: intervention.value
        }));
    };



    // Function to get skills program details based on selection
    const getSkillsProgramDetails = (skillsProgramType) => {
        const skillsProgramMap = {
            'visual_merchandiser_level_3': {
                unitStandards: '3',
                credits: '24'
            },
            'wholesale_retail_operations_level_2': {
                modules: '8',
                credits: '120'
            },
            'generic_management_level_4': {
                modules: '8',
                credits: '150'
            },
            'informal_small_business_practice': {
                modules: '7',
                credits: '120'
            }
        };
        
        return skillsProgramMap[skillsProgramType] || { unitStandards: '', modules: '', credits: '' };
    };

    // Function to update qualifications based on accreditation number
    const updateQualifications = () => {
        const accNumber = projectForm.accreditationNumber;
        const qualifications = qualificationsData[accNumber] || [];
        
        setProjectForm(prev => ({
            ...prev,
            qualifications: '',
            nqfLevel: '',
            ofoNumber: '',
            accreditationModules: '',
            accreditationCredits: ''
        }));
    };

    // Function to update NQF level and OFO code based on qualification selection
    const updateNQFLevel = () => {
        const accNumber = projectForm.accreditationNumber;
        const qualification = projectForm.qualifications;
        const qualifications = qualificationsData[accNumber] || [];
        const selectedQual = qualifications.find(q => q.name === qualification);
        
        if (selectedQual) {
            setProjectForm(prev => ({
                ...prev,
                nqfLevel: selectedQual.nqf,
                ofoNumber: selectedQual.ofo || ofoMapping[selectedQual.nqf] || '',
                accreditationModules: selectedQual.modules || '',
                accreditationCredits: selectedQual.credits || ''
            }));
        } else {
            setProjectForm(prev => ({
                ...prev,
                nqfLevel: '',
                ofoNumber: '',
                accreditationModules: '',
                accreditationCredits: ''
            }));
        }
    };



    const handleInterventionSelection = (interventionValue, interventionLabel) => {
        setProjectForm(prev => {
            const currentInterventions = prev.selectedInterventions || [];
            const isSelected = currentInterventions.some(item => item.value === interventionValue);
            
            let updatedInterventions;
            if (isSelected) {
                // Remove if already selected
                updatedInterventions = currentInterventions.filter(item => item.value !== interventionValue);
                console.log('Removing intervention:', interventionLabel);
            } else {
                // Add if not selected
                updatedInterventions = [...currentInterventions, { value: interventionValue, label: interventionLabel }];
                console.log('Adding intervention:', interventionLabel);
            }
            
            console.log('Updated interventions:', updatedInterventions);
            
            // Check if skills programs are still selected
            const hasSkillsPrograms = updatedInterventions.some(intervention => 
                intervention.value === 'skills_programs_18_1' || intervention.value === 'skills_programs_18_2'
            );
            
            return {
                ...prev,
                selectedInterventions: updatedInterventions,
                intervention: updatedInterventions.map(item => item.value).join(', '), // Keep backward compatibility
                qualificationTitle: '', // Reset qualification title when interventions change
                accreditingBody: 'QCTO', // Reset accrediting body
                accreditationNumber: '', // Reset accreditation number
                qualifications: '', // Reset qualifications
                nqfLevel: '', // Reset NQF level
                ofoNumber: '', // Reset OFO code
                issuedBy: new Date().toISOString().split('T')[0], // Reset issued by date
                expires: '', // Reset expires date
                duration: '5 years', // Reset duration
                selectedLegacyQualifications: [], // Reset selected legacy qualifications
                independentNqfLevel: '', // Reset independent NQF level
                independentCredits: '', // Reset independent credits
                // Clear skills program selection if skills programs are no longer selected
                skillsProgramType: hasSkillsPrograms ? prev.skillsProgramType : ''
            };
        });
        setCurrentLegacyQualifications([]); // Reset legacy qualifications
    };

    const handleCostSelection = (cost, interventionValue) => {
        setProjectForm(prev => ({
            ...prev,
            costPerLearner: cost.toString()
        }));
        setShowCostDropdown(false);
    };

    const handleInterventionCostChange = (interventionValue, cost) => {
        // If no cost is set for this intervention, prompt user to enter one
        if (!cost || cost === '') {
            const newCost = prompt(`Enter cost for ${projectForm.selectedInterventions.find(i => i.value === interventionValue)?.label}:`);
            if (newCost && !isNaN(newCost)) {
                setProjectForm(prev => ({
                    ...prev,
                    interventionCosts: {
                        ...prev.interventionCosts,
                        [interventionValue]: newCost
                    },
                    costPerLearner: newCost,
                    selectedCostIntervention: interventionValue
                }));
            }
        } else {
            // If cost exists, just switch to display this intervention's cost
            setProjectForm(prev => ({
                ...prev,
                costPerLearner: cost,
                selectedCostIntervention: interventionValue
            }));
        }
        setShowCostDropdown(false);
    };

    const handleInterventionLearnersChange = (interventionValue, learners) => {
        // If no learners is set for this intervention, prompt user to enter one
        if (!learners || learners === '') {
            const newLearners = prompt(`Enter number of learners for ${projectForm.selectedInterventions.find(i => i.value === interventionValue)?.label}:`);
            if (newLearners && !isNaN(newLearners) && parseInt(newLearners) > 0) {
                setProjectForm(prev => ({
                    ...prev,
                    interventionLearners: {
                        ...prev.interventionLearners,
                        [interventionValue]: newLearners
                    },
                    numberOfLearners: newLearners,
                    selectedLearnersIntervention: interventionValue
                }));
            }
        } else {
            // If learners exists, just switch to display this intervention's learners
            setProjectForm(prev => ({
                ...prev,
                numberOfLearners: learners,
                selectedLearnersIntervention: interventionValue
            }));
        }
        setShowLearnersDropdown(false);
    };

    const handleLegacyQualificationSelection = (qualificationValue, qualificationLabel) => {
        console.log('Selecting legacy qualification:', qualificationValue, qualificationLabel);
        setProjectForm(prev => {
            const currentQualifications = prev.selectedLegacyQualifications || [];
            const isSelected = currentQualifications.some(item => item.value === qualificationValue);
            
            let updatedQualifications;
            if (isSelected) {
                // Remove if already selected
                updatedQualifications = currentQualifications.filter(item => item.value !== qualificationValue);
                console.log('Removing legacy qualification:', qualificationLabel);
            } else {
                // Add if not selected
                updatedQualifications = [...currentQualifications, { value: qualificationValue, label: qualificationLabel }];
                console.log('Adding legacy qualification:', qualificationLabel);
            }
            
            console.log('Updated legacy qualifications:', updatedQualifications);
            
            const updated = {
                ...prev,
                selectedLegacyQualifications: updatedQualifications
            };
            console.log('Updated form state:', updated);
            return updated;
        });
    };

    const handleIndependentNqfSelection = (nqfValue, nqfLabel) => {
        setProjectForm(prev => ({
            ...prev,
            independentNqfLevel: nqfValue
        }));
        setShowIndependentNqfDropdown(false);
    };

    const handleIndependentCreditsSelection = (creditsValue, creditsLabel) => {
        setProjectForm(prev => ({
            ...prev,
            independentCredits: creditsValue
        }));
        setShowIndependentCreditsDropdown(false);
    };

    const handleModulesSelection = (modulesValue, modulesLabel) => {
        setProjectForm(prev => ({
            ...prev,
            modulesDropdown: modulesValue
        }));
        setShowModulesDropdown(false);
    };

    const handleSeparateModulesSelection = (modulesValue, modulesLabel) => {
        setProjectForm(prev => ({
            ...prev,
            separateModules: modulesValue
        }));
        setShowSeparateModulesDropdown(false);
    };

    const handleProjectSubmit = (e) => {
        e.preventDefault();
        
        // Create new project object
        const newProject = {
            id: Date.now().toString(),
            ...projectForm,
            intervention: projectForm.selectedInterventions.map(item => item.value).join(', '), // Use selected interventions
            attachments: attachments, // Include attachments
            status: 'active', // Set initial status
            createdAt: new Date().toISOString()
        };

        // Save to localStorage (you can modify this to save to your backend)
        const existingProjects = JSON.parse(localStorage.getItem('projectData') || '[]');
        const updatedProjects = [...existingProjects, newProject];
        localStorage.setItem('projectData', JSON.stringify(updatedProjects));

        // Update projects state
        setProjects(updatedProjects);

        // Show success message
        alert('Project added successfully!');
        
        // Close modal and reset form
        closeAddProjectModal();
    };

    const handleEditProjectSubmit = (e) => {
        e.preventDefault();
        
        // Update existing project object
        const updatedProject = {
            ...currentProject,
            ...projectForm,
            intervention: projectForm.selectedInterventions.map(item => item.value).join(', '), // Use selected interventions
            attachments: attachments, // Include attachments
            updatedAt: new Date().toISOString()
        };

        // Update in localStorage
        const existingProjects = JSON.parse(localStorage.getItem('projectData') || '[]');
        const updatedProjects = existingProjects.map(p => 
            p.id === currentProject.id ? updatedProject : p
        );
        localStorage.setItem('projectData', JSON.stringify(updatedProjects));

        // Update projects state
        setProjects(updatedProjects);

        // Show success message
        alert('Project updated successfully!');
        
        // Close modal and reset form
        closeEditProjectModal();
    };

    const handleAddManager = (managerName) => {
        // Add the new manager to the dropdown options (you could save this to localStorage)
        setProjectForm(prev => ({
            ...prev,
            projectManager: managerName
        }));
        setShowAddManagerModal(false);
    };

    const handleAddYearRange = (yearRange) => {
        // Add the new year range to the dropdown options (you could save this to localStorage)
        setProjectForm(prev => ({
            ...prev,
            yearRange: yearRange
        }));
        setShowAddYearRangeModal(false);
    };

    const handleEditProject = (project) => {
        // Populate form with project data for editing
        const interventionArray = project.intervention ? project.intervention.split(', ') : [];
        const selectedInterventions = interventionArray.map(value => {
            // Map the values back to their labels
            const interventionMap = {
                'learnship_18_1': 'Learnership(18.1)',
                'learnship_18_2': 'Learnership(18.2)',
                'graduates_diploma': 'Graduates(Diploma)',
                'graduates_degree': 'Graduates(Degree)',
                'bursary_employed': 'Bursary(Employed)',
                'bursary_unemployed': 'Bursary(Unemployed)',
                'skills_programs_18_1': 'Skills Programs (18.1)',
                'skills_programs_18_2': 'Skills Programs (18.2)',
                'het_3_months': 'HET (3 months)',
                'tvet': 'TVET',
                'ncv': 'NCV'
            };
            return { value: value.trim(), label: interventionMap[value.trim()] || value.trim() };
        });

        setProjectForm({
            projectManager: project.projectManager || '',
            yearRange: project.yearRange || '',
            description: project.description || '',
            startDate: project.startDate || new Date().toISOString().split('T')[0],
            attachments: Array.isArray(project.attachments) ? project.attachments : [],
            intervention: project.intervention || '',
            selectedInterventions: selectedInterventions,
            budget: project.budget || '',
            client: project.client || '',
            costPerLearner: project.costPerLearner || '',
            numberOfLearners: project.numberOfLearners || '',
            skillsProgramType: project.skillsProgramType || '',
            unitStandards: project.unitStandards || '',
            modules: project.modules || '',
            credits: project.credits || '',
            accreditingBody: project.accreditingBody || 'QCTO',
            accreditationNumber: project.accreditationNumber || '',
            qualifications: project.qualifications || '',
            nqfLevel: project.nqfLevel || '',
            ofoNumber: project.ofoNumber || '',
            issuedBy: project.issuedBy || new Date().toISOString().split('T')[0],
            expires: project.expires || '',
            duration: project.duration || '5 years',
            selectedLegacyQualifications: project.selectedLegacyQualifications || [],
            independentNqfLevel: project.independentNqfLevel || '',
            independentCredits: project.independentCredits || ''
        });
        setAttachments(Array.isArray(project.attachments) ? project.attachments : []); // Load attachments
        setCurrentProject(project);
        setShowEditProjectModal(true);
    };

    const handleDeleteProject = (projectId) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            const updatedProjects = projects.filter(p => p.id !== projectId);
            setProjects(updatedProjects);
            localStorage.setItem('projectData', JSON.stringify(updatedProjects));
        }
    };

    const handleCompleteProject = (project) => {
        if (window.confirm('Are you sure you want to complete this project? This will create a history record.')) {
            // Create a history record of the project before completion
            const historyProject = {
                ...project,
                id: `history_${project.id}_${Date.now()}`,
                originalProjectId: project.id,
                completedAt: new Date().toISOString(),
                status: 'history'
            };

            // Update the original project status to completed
            const updatedProjects = projects.map(p => 
                p.id === project.id 
                    ? { ...p, status: 'completed', completedAt: new Date().toISOString() }
                    : p
            );
            
            // Add the history record to projects
            const projectsWithHistory = [...updatedProjects, historyProject];
            setProjects(projectsWithHistory);
            localStorage.setItem('projectData', JSON.stringify(projectsWithHistory));
            
            alert('Project completed successfully! A history record has been created.');
        }
    };

    const handleViewProject = (project) => {
        setCurrentProject(project);
        setShowViewProjectModal(true);
    };

    const handleRedactedProject = (project) => {
        setCurrentProject(project);
        setRedactedFormData({
            // Client Information Fields
            clientName: project.clientName || project.client || '',
            clientReg: project.clientReg || '',
            clientAddress: project.clientAddress || '',
            province: project.province || '',
            country: project.country || '',
            city: project.city || '',
            contactPerson: project.contactPerson || '',
            contactPosition: project.contactPosition || '',
            contactPhone: project.contactPhone || '',
            contactEmail: project.contactEmail || '',
            companyContact: project.companyContact || '',
            leadManager: project.leadManager || project.projectManager || '',
            conceptionDate: project.conceptionDate || project.startDate || new Date().toISOString().split('T')[0],
            dg: project.dg || '',
            wspSubmitted: project.wspSubmitted || '',
            wspReason: project.wspReason || '',
            retainer: project.retainer || project.monthlyRetainer || '',
            seta: project.seta || '',
            services: project.services || [],
            sdlNumber: project.sdlNumber || '',
            documentType: project.documentType || '',
            attachments: project.attachments || [],
            // Project Information Fields
            projectManager: project.projectManager || '',
            yearRange: project.yearRange || '',
            description: project.description || '',
            startDate: project.startDate || new Date().toISOString().split('T')[0],
            endDate: project.endDate || '',
            intervention: project.intervention || '',
            selectedInterventions: project.selectedInterventions || [],
            interventionCosts: project.interventionCosts || {},
            selectedCostIntervention: project.selectedCostIntervention || '',
            interventionLearners: project.interventionLearners || {},
            selectedLearnersIntervention: project.selectedLearnersIntervention || '',
            budget: project.budget || '',
            client: project.client || '',
            costPerLearner: project.costPerLearner || '',
            numberOfLearners: project.numberOfLearners || '',
            skillsProgramType: project.skillsProgramType || '',
            unitStandards: project.unitStandards || '',
            modules: project.modules || '',
            modulesDropdown: project.modulesDropdown || '',
            credits: project.credits || '',
            accreditationModules: project.accreditationModules || '',
            accreditationCredits: project.accreditationCredits || '',
            accreditingBody: project.accreditingBody || 'QCTO',
            accreditationNumber: project.accreditationNumber || '',
            qualifications: project.qualifications || '',
            nqfLevel: project.nqfLevel || '',
            ofoNumber: project.ofoNumber || '',
            issuedBy: project.issuedBy || new Date().toISOString().split('T')[0],
            expires: project.expires || '',
            duration: project.duration || '5 years',
            selectedLegacyQualifications: project.selectedLegacyQualifications || [],
            independentNqfLevel: project.independentNqfLevel || '',
            independentCredits: project.independentCredits || '',
            qualificationTitle: project.qualificationTitle || ''
        });
        setAttachments(Array.isArray(project.attachments) ? project.attachments : []);
        setShowRedactedModal(true);
    };

    const handleRedactedInputChange = (e) => {
        const { name, value } = e.target;
        
        // Handle "Add New DG" selection
        if (name === 'dg' && value === 'add_new') {
            const newDg = prompt('Enter new DG (e.g., 29-30):');
            if (newDg && newDg.trim()) {
                setRedactedFormData(prev => ({
                    ...prev,
                    [name]: newDg.trim()
                }));
            }
            return;
        }
        
        // Handle "Add New Project Manager" selection
        if (name === 'projectManager' && value === 'add_new') {
            const newManager = prompt('Enter new project manager name:');
            if (newManager && newManager.trim()) {
                setRedactedFormData(prev => ({
                    ...prev,
                    [name]: newManager.trim()
                }));
            }
            return;
        }
        
        // Handle "Add New Year Range" selection
        if (name === 'yearRange' && value === 'add_new') {
            const newYearRange = prompt('Enter new year range (e.g., 29-30):');
            if (newYearRange && newYearRange.trim()) {
                setRedactedFormData(prev => ({
                    ...prev,
                    [name]: newYearRange.trim()
                }));
            }
            return;
        }
        
        // Handle qualification title changes
        if (name === 'qualificationTitle') {
            handleRedactedQualificationTitleChange(value);
            return;
        }
        
        setRedactedFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handler for qualification title changes in redacted form
    const handleRedactedQualificationTitleChange = (value) => {
        let qualificationsToShow = [];
        
        if (value === 'wrseta_legacy') {
            qualificationsToShow = wrsetaLegacyQualifications;
            console.log('Setting W&R SETA qualifications in redacted form:', qualificationsToShow);
        } else if (value === 'fpm_legacy') {
            qualificationsToShow = fpmLegacyQualifications;
            console.log('Setting FPM SETA qualifications in redacted form:', qualificationsToShow);
        }
        
        setCurrentLegacyQualifications(qualificationsToShow);
        
        setRedactedFormData(prev => ({
            ...prev,
            qualificationTitle: value,
            selectedLegacyQualifications: [],
            independentNqfLevel: '',
            independentCredits: ''
        }));
    };

    // Handler for intervention selection in redacted form
    const handleRedactedInterventionSelection = (interventionValue, interventionLabel) => {
        setRedactedFormData(prev => {
            const existingInterventions = prev.selectedInterventions || [];
            const isSelected = existingInterventions.some(item => item.value === interventionValue);
            
            let updatedInterventions;
            if (isSelected) {
                updatedInterventions = existingInterventions.filter(item => item.value !== interventionValue);
            } else {
                updatedInterventions = [...existingInterventions, { value: interventionValue, label: interventionLabel }];
            }
            
            // Check if skills programs are still selected
            const hasSkillsPrograms = updatedInterventions.some(intervention => 
                intervention.value === 'skills_programs_18_1' || intervention.value === 'skills_programs_18_2'
            );
            
            return {
                ...prev,
                selectedInterventions: updatedInterventions,
                intervention: updatedInterventions.map(item => item.value).join(', '),
                // Clear skills program selection if skills programs are no longer selected
                skillsProgramType: hasSkillsPrograms ? prev.skillsProgramType : ''
            };
        });
    };

    // Handler for legacy qualification selection in redacted form
    const handleRedactedLegacyQualificationSelection = (qualificationValue, qualificationLabel) => {
        setRedactedFormData(prev => {
            const existingQualifications = prev.selectedLegacyQualifications || [];
            const isSelected = existingQualifications.some(item => item.value === qualificationValue);
            
            let updatedQualifications;
            if (isSelected) {
                updatedQualifications = existingQualifications.filter(item => item.value !== qualificationValue);
            } else {
                updatedQualifications = [...existingQualifications, { value: qualificationValue, label: qualificationLabel }];
            }
            
            return {
                ...prev,
                selectedLegacyQualifications: updatedQualifications
            };
        });
    };

    // Handler for independent NQF selection in redacted form
    const handleRedactedIndependentNqfSelection = (nqfValue, nqfLabel) => {
        setRedactedFormData(prev => ({
            ...prev,
            independentNqfLevel: nqfValue
        }));
        setShowIndependentNqfDropdown(false);
    };

    // Handler for independent credits selection in redacted form
    const handleRedactedIndependentCreditsSelection = (creditsValue, creditsLabel) => {
        setRedactedFormData(prev => ({
            ...prev,
            independentCredits: creditsValue
        }));
        setShowIndependentCreditsDropdown(false);
    };

    // Handler for modules selection in redacted form
    const handleRedactedModulesSelection = (modulesValue, modulesLabel) => {
        setRedactedFormData(prev => ({
            ...prev,
            modulesDropdown: modulesValue
        }));
        setShowModulesDropdown(false);
    };

    // Handler for intervention cost change in redacted form
    const handleRedactedInterventionCostChange = (interventionValue, cost) => {
        setRedactedFormData(prev => ({
            ...prev,
            interventionCosts: {
                ...prev.interventionCosts,
                [interventionValue]: cost
            },
            selectedCostIntervention: interventionValue,
            costPerLearner: cost
        }));
        setShowCostDropdown(false);
    };

    // Handler for intervention learners change in redacted form
    const handleRedactedInterventionLearnersChange = (interventionValue, learners) => {
        setRedactedFormData(prev => ({
            ...prev,
            interventionLearners: {
                ...prev.interventionLearners,
                [interventionValue]: learners
            },
            selectedLearnersIntervention: interventionValue,
            numberOfLearners: learners
        }));
        setShowLearnersDropdown(false);
    };

    const handleRedactedSubmit = (e) => {
        e.preventDefault();
        
        // Update project with client details and toggle redacted status
        const updatedProjects = projects.map(p => {
            if (p.id === currentProject.id) {
                return {
                    ...p,
                    isRedacted: !p.isRedacted,
                    // Client Information
                    clientName: redactedFormData.clientName,
                    clientReg: redactedFormData.clientReg,
                    clientAddress: redactedFormData.clientAddress,
                    province: redactedFormData.province,
                    country: redactedFormData.country,
                    city: redactedFormData.city,
                    contactPerson: redactedFormData.contactPerson,
                    contactPosition: redactedFormData.contactPosition,
                    contactPhone: redactedFormData.contactPhone,
                    contactEmail: redactedFormData.contactEmail,
                    companyContact: redactedFormData.companyContact,
                    leadManager: redactedFormData.leadManager,
                    conceptionDate: redactedFormData.conceptionDate,
                    dg: redactedFormData.dg,
                    wspSubmitted: redactedFormData.wspSubmitted,
                    wspReason: redactedFormData.wspReason,
                    retainer: redactedFormData.retainer,
                    seta: redactedFormData.seta,
                    services: redactedFormData.services,
                    sdlNumber: redactedFormData.sdlNumber,
                    documentType: redactedFormData.documentType,
                    attachments: Array.isArray(attachments) ? attachments : [],
                    // Project Information
                    projectManager: redactedFormData.projectManager,
                    yearRange: redactedFormData.yearRange,
                    description: redactedFormData.description,
                    startDate: redactedFormData.startDate,
                    endDate: redactedFormData.endDate,
                    intervention: redactedFormData.intervention,
                    selectedInterventions: redactedFormData.selectedInterventions,
                    interventionCosts: redactedFormData.interventionCosts,
                    selectedCostIntervention: redactedFormData.selectedCostIntervention,
                    interventionLearners: redactedFormData.interventionLearners,
                    selectedLearnersIntervention: redactedFormData.selectedLearnersIntervention,
                    budget: redactedFormData.budget,
                    client: redactedFormData.client,
                    costPerLearner: redactedFormData.costPerLearner,
                    numberOfLearners: redactedFormData.numberOfLearners,
                    skillsProgramType: redactedFormData.skillsProgramType,
                    unitStandards: redactedFormData.unitStandards,
                    modules: redactedFormData.modules,
                    modulesDropdown: redactedFormData.modulesDropdown,
                    credits: redactedFormData.credits,
                    accreditationModules: redactedFormData.accreditationModules,
                    accreditationCredits: redactedFormData.accreditationCredits,
                    accreditingBody: redactedFormData.accreditingBody,
                    accreditationNumber: redactedFormData.accreditationNumber,
                    qualifications: redactedFormData.qualifications,
                    nqfLevel: redactedFormData.nqfLevel,
                    ofoNumber: redactedFormData.ofoNumber,
                    issuedBy: redactedFormData.issuedBy,
                    expires: redactedFormData.expires,
                    duration: redactedFormData.duration,
                    selectedLegacyQualifications: redactedFormData.selectedLegacyQualifications,
                    independentNqfLevel: redactedFormData.independentNqfLevel,
                    independentCredits: redactedFormData.independentCredits,
                    qualificationTitle: redactedFormData.qualificationTitle
                };
            }
            return p;
        });
        
        setProjects(updatedProjects);
        localStorage.setItem('projectData', JSON.stringify(updatedProjects));
        
        // Show feedback to user
        const status = currentProject.isRedacted ? 'unredacted' : 'redacted';
        alert(`Project has been ${status} successfully!`);
        
        // Close modal and reset form
        setShowRedactedModal(false);
        setRedactedFormData({
            // Client Information Fields
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
            // Client Information Fields
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
            attachments: [],
            // Project Information Fields
            projectManager: '',
            yearRange: '',
            description: '',
            startDate: new Date().toISOString().split('T')[0],
            endDate: '',
            intervention: '',
            selectedInterventions: [],
            interventionCosts: {},
            selectedCostIntervention: '',
            interventionLearners: {},
            selectedLearnersIntervention: '',
            budget: '',
            client: '',
            costPerLearner: '',
            numberOfLearners: '',
            skillsProgramType: '',
            unitStandards: '',
            modules: '',
            modulesDropdown: '',
            credits: '',
            accreditationModules: '',
            accreditationCredits: '',
            accreditingBody: 'QCTO',
            accreditationNumber: '',
            qualifications: '',
            nqfLevel: '',
            ofoNumber: '',
            issuedBy: new Date().toISOString().split('T')[0],
            expires: '',
            duration: '5 years',
            selectedLegacyQualifications: [],
            independentNqfLevel: '',
            independentCredits: '',
            qualificationTitle: ''
        });
        setAttachments([]);
    };

    const TrainingForm = () => (
        <div className="modal-overlay" onClick={handleCancelTraining}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{editingTraining ? 'Edit Training' : 'Add New Training'}</h2>
                    <button className="close-btn" onClick={handleCancelTraining}>&times;</button>
                </div>
                <form onSubmit={handleSubmitTraining} className="training-form">
                    <div className="form-group">
                        <label htmlFor="title">Training Title *</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={trainingData.title}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="startDate">Start Date *</label>
                            <input
                                type="date"
                                id="startDate"
                                name="startDate"
                                value={trainingData.startDate}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="endDate">End Date</label>
                            <input
                                type="date"
                                id="endDate"
                                name="endDate"
                                value={trainingData.endDate}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="duration">Duration</label>
                            <input
                                type="text"
                                id="duration"
                                name="duration"
                                value={trainingData.duration}
                                onChange={handleInputChange}
                                placeholder="e.g., 2 days, 4 hours"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="maxParticipants">Max Participants</label>
                            <input
                                type="number"
                                id="maxParticipants"
                                name="maxParticipants"
                                value={trainingData.maxParticipants}
                                onChange={handleInputChange}
                                min="1"
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="facilitator">Facilitator</label>
                        <input
                            type="text"
                            id="facilitator"
                            name="facilitator"
                            value={trainingData.facilitator}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="location">Location</label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            value={trainingData.location}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="status">Status</label>
                        <select
                            id="status"
                            name="status"
                            value={trainingData.status}
                            onChange={handleInputChange}
                        >
                            <option value="Scheduled">Scheduled</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={trainingData.description}
                            onChange={handleInputChange}
                            rows="3"
                            placeholder="Training description and objectives..."
                        />
                    </div>
                    <div className="form-actions">
                        <button type="button" className="btn-secondary" onClick={handleCancelTraining}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary">
                            {editingTraining ? 'Update' : 'Add'} Training
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

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

    // Helper function to format intervention display
    const formatInterventionDisplay = (interventionString) => {
        if (!interventionString) return '-';
        
        const interventionMap = {
            'learnship_18_1': 'Learnership(18.1)',
            'learnship_18_2': 'Learnership(18.2)',
            'graduates_diploma': 'Graduates(Diploma)',
            'graduates_degree': 'Graduates(Degree)',
            'bursary_employed': 'Bursary(Employed)',
            'bursary_unemployed': 'Bursary(Unemployed)',
            'skills_programs_18_1': 'Skills Programs (18.1)',
            'skills_programs_18_2': 'Skills Programs (18.2)',
            'het_3_months': 'HET (3 months)',
            'tvet': 'TVET',
            'ncv': 'NCV'
        };
        
        const interventions = interventionString.split(', ');
        const formattedInterventions = interventions.map(value => 
            interventionMap[value.trim()] || value.trim()
        );
        
        // If there's only one intervention, return it as is
        if (formattedInterventions.length === 1) {
            return formattedInterventions[0];
        }
        
        // If there are multiple interventions, show only the first one with "..."
        if (formattedInterventions.length > 1) {
            return `${formattedInterventions[0]}...`;
        }
        
        return formattedInterventions.join(', ');
    };

    // (move all code from return into a variable)
    const pageContent = (
        <>
            {/* Header Section */}
            <div className="wsp-header">
                <div className="header-content">
                    <div className="header-title">
                        <h1>Project Management</h1>
                        <p>Comprehensive project planning, tracking, and delivery management</p>
                    </div>
                    <div className="header-actions">
                        <button className="btn-secondary">
                            <i className="fas fa-download"></i>
                            Export Projects
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="wsp-content">
                {/* Project Overview Section */}
                    <section className="accreditation-overview">
                        <div className="summary-metrics">
                            <div className="metric-card primary">
                                <div className="metric-icon">
                                    <i className="fas fa-project-diagram"></i>
                                </div>
                                <div className="metric-content">
                                    <h3>Active Projects</h3>
                                    <div className="metric-value">25</div>
                                    <div className="metric-trend positive">
                                        <i className="fas fa-arrow-up"></i>
                                        <span>+3 this month</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="metric-card secondary">
                                <div className="metric-icon">
                                    <i className="fas fa-tasks"></i>
                                </div>
                                <div className="metric-content">
                                    <h3>Project Tasks</h3>
                                    <div className="metric-value">{trainings.length}</div>
                                    <div className="metric-trend positive">
                                        <i className="fas fa-arrow-up"></i>
                                        <span>Active tasks</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="metric-card tertiary">
                                <div className="metric-icon">
                                    <i className="fas fa-users"></i>
                                </div>
                                <div className="metric-content">
                                    <h3>Number of Learners(Terminated)</h3>
                                    <div className="metric-value">150</div>
                                    <div className="metric-trend positive">
                                        <i className="fas fa-arrow-up"></i>
                                        <span>+12 this week</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        

                    </section>

                {/* Add Project Prompt */}
                <div className="accreditation-prompt">
                    <div className="prompt-content">
                        <h2>Add New Project</h2>
                        <p>Click the button below to add a new project to your portfolio</p>
                        <div className="button-group">
                            <button className="btn-primary" onClick={openAddProjectModal}>
                                <i className="fas fa-plus"></i>
                                Add New Project
                            </button>
                        </div>
                    </div>
                </div>

                {/* Projects Table Section */}
                <section className="projects-table-section">
                    <div className="section-header">
                        <h2>{showHistoryMode ? 'Project History' : 'Project Records'}</h2>
                        <p>View all added projects from the form</p>
                        <div className="header-actions">
                            <button className={`history-btn ${showHistoryMode ? 'active' : ''}`} onClick={() => setShowHistoryMode(!showHistoryMode)}>
                                <i className="fas fa-history"></i>
                                {showHistoryMode ? 'Current Projects' : 'History'}
                            </button>
                        </div>
                    </div>
                    
                    {projects.length === 0 ? (
                        <div className="empty-state">
                            <i className="fas fa-folder-open"></i>
                            <h3>No Projects Added</h3>
                            <p>Start by adding your first project using the form above</p>
                        </div>
                    ) : (
                        <div className="table-container">
                            <table className="modules-table">
                                <thead>
                                    <tr>
                                        <th>Project Manager</th>
                                        <th>DG</th>
                                        <th>Attachments</th>
                                        <th>Intervention</th>
                                        <th>Start Date</th>
                                        <th>End Date</th>
                                        <th>Cost Per Learner</th>
                                        <th>Number of Learners</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {projects.filter(project => {
                                        if (showHistoryMode) {
                                            // Show history records and completed projects
                                            return project.status === 'history' || project.status === 'completed';
                                        } else {
                                            // Show current projects (not history records)
                                            return project.status !== 'history';
                                        }
                                    }).map((project) => (
                                        <tr 
                                            key={project.id}
                                            className="project-row clickable"
                                            onClick={() => handleViewProject(project)}
                                        >
                                            <td className="module-name">{project.projectManager}</td>
                                            <td>{project.yearRange}</td>
                                            <td>{abbreviateDocumentType(project.documentType, project.attachments)}</td>
                                            <td>{formatInterventionDisplay(project.intervention)}</td>
                                            <td>{project.startDate}</td>
                                            <td>{project.endDate || '-'}</td>
                                            <td>R {project.costPerLearner ? parseFloat(project.costPerLearner).toLocaleString() : '-'}</td>
                                            <td>{project.numberOfLearners}</td>
                                            <td className="actions-cell">
                                                <div className="action-buttons">
                                                    <button 
                                                        className="btn-icon" 
                                                        title="View Project"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleRedactedProject(project);
                                                        }}
                                                    >
                                                        <i className="fas fa-eye"></i>
                                                    </button>
                                                    {project.status !== 'history' && (
                                                        <button 
                                                            className="btn-icon" 
                                                            title="Edit Project"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleRedactedProject(project);
                                                            }}
                                                        >
                                                            <i className="fas fa-edit"></i>
                                                        </button>
                                                    )}

                                                    <button 
                                                        className="btn-icon" 
                                                        title="Delete Project"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteProject(project.id);
                                                        }}
                                                    >
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>

                    {/* Project Management Section */}
                    <section className="wsp-management">
                        <h2>Project Management</h2>
                        <div className="wsp-grid">
                            <div className="wsp-card">
                                <h3>Project Planning</h3>
                                <ul>
                                    <li>Scope Definition</li>
                                    <li>Timeline Planning</li>
                                    <li>Resource Allocation</li>
                                </ul>
                                <button className="action-button">View Planning</button>
                            </div>
                            <div className="wsp-card">
                                <h3>Task Management</h3>
                                <ul>
                                    <li>Task Breakdown</li>
                                    <li>Dependencies</li>
                                    <li>Milestones</li>
                                </ul>
                                <button className="action-button">Manage Tasks</button>
                            </div>
                            <div className="wsp-card">
                                <h3>Budget Management</h3>
                                <ul>
                                    <li>Cost Tracking</li>
                                    <li>Resource Costs</li>
                                    <li>Project Budget</li>
                                </ul>
                                <button className="action-button">View Budget</button>
                            </div>
                        </div>
                    </section>

                    {/* Project Status Section */}
                    <section className="compliance-section">
                        <h2>Project Status & Reporting</h2>
                        <div className="compliance-grid">
                            <div className="compliance-card">
                                <h3>Project Status</h3>
                                <div className="status-indicator">
                                    <span className="status-dot active"></span>
                                    <span>Current Project: In Progress</span>
                                </div>
                                <div className="status-indicator">
                                    <span className="status-dot pending"></span>
                                    <span>Next Milestone: Due in 30 days</span>
                                </div>
                            </div>
                            <div className="compliance-card">
                                <h3>Project Performance</h3>
                                <div className="bbee-score">
                                    <div className="score-circle">
                                        <span>85%</span>
                                    </div>
                                    <p>On-Time Delivery Rate</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Project Schedule Section */}
                    <section className="training-calendar">
                        <div className="section-header">
                            <h2>Project Schedule</h2>
                            <button className="btn-primary" onClick={handleAddTraining}>
                                <i className="fas fa-plus"></i>
                                Add Project
                            </button>
                        </div>
                        
                        {trainings.length === 0 ? (
                            <div className="empty-state">
                                <i className="fas fa-calendar-plus"></i>
                                <h3>No Projects Scheduled</h3>
                                <p>Start by adding your first project</p>
                                <button className="btn-primary" onClick={handleAddTraining}>
                                    Add Project
                                </button>
                            </div>
                        ) : (
                            <div className="training-grid">
                                {trainings.map((training) => (
                                    <div key={training.id} className="training-card">
                                        <div className="training-header">
                                            <h3>{training.title}</h3>
                                            <div className="training-actions">
                                                <button 
                                                    className="action-btn edit"
                                                    onClick={() => handleEditTraining(training)}
                                                >
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                                <button 
                                                    className="action-btn delete"
                                                    onClick={() => handleDeleteTraining(training.id)}
                                                >
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="training-details">
                                            <div className="detail-item">
                                                <i className="fas fa-calendar"></i>
                                                <span>Start: {training.startDate}</span>
                                            </div>
                                            {training.endDate && (
                                                <div className="detail-item">
                                                    <i className="fas fa-calendar-check"></i>
                                                    <span>End: {training.endDate}</span>
                                                </div>
                                            )}
                                            {training.duration && (
                                                <div className="detail-item">
                                                    <i className="fas fa-clock"></i>
                                                    <span>{training.duration}</span>
                                                </div>
                                            )}
                                            {training.facilitator && (
                                                <div className="detail-item">
                                                    <i className="fas fa-user"></i>
                                                    <span>Manager: {training.facilitator}</span>
                                                </div>
                                            )}
                                            {training.location && (
                                                <div className="detail-item">
                                                    <i className="fas fa-map-marker-alt"></i>
                                                    <span>Location: {training.location}</span>
                                                </div>
                                            )}
                                            {training.maxParticipants && (
                                                <div className="detail-item">
                                                    <i className="fas fa-users"></i>
                                                    <span>Team Size: {training.maxParticipants}</span>
                                                </div>
                                            )}
                                        </div>
                                        {training.description && (
                                            <div className="training-description">
                                                <p>{training.description}</p>
                                            </div>
                                        )}
                                        <div className="training-status">
                                            <span className={`status-badge ${training.status.toLowerCase().replace(' ', '-')}`}>
                                                {training.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

            {/* Training Form Modal */}
            {showTrainingForm && <TrainingForm />}

            {/* Add Project Modal */}
            {showAddProjectModal && (
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
                            <h2 style={{ margin: 0, color: '#006400', fontWeight: 'bold' }}>
                                Add New Project
                            </h2>
                            <button className="modal-close" onClick={closeAddProjectModal} style={{
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
                            <form id="project-form" onSubmit={handleProjectSubmit}>
                                    {/* Project Information Section */}
                                    <div className="form-section" style={{
                                        marginBottom: '30px',
                                        padding: '20px',
                                        backgroundColor: '#f8f9fa',
                                        borderRadius: '8px',
                                        border: '1px solid #e0e0e0'
                                    }}>
                                        <h3 className="section-title" style={{
                                            color: '#006400',
                                            fontSize: '18px',
                                            fontWeight: 'bold',
                                            marginBottom: '20px',
                                            paddingBottom: '10px',
                                            borderBottom: '2px solid #006400'
                                        }}>Project Information</h3>
                                        <div className="form-row">
                                            <div className="form-group" style={{
                                                marginBottom: '20px'
                                            }}>
                                                <label style={{
                                                    display: 'block',
                                                    marginBottom: '8px',
                                                    fontWeight: '600',
                                                    color: '#333',
                                                    fontSize: '14px'
                                                }}>Project Manager *</label>
                                                <select 
                                                    name="projectManager" 
                                                    value={projectForm.projectManager}
                                                    onChange={handleProjectInputChange}
                                                    required
                                                    style={{
                                                        width: '100%',
                                                        padding: '10px 12px',
                                                        border: '1px solid #ddd',
                                                        borderRadius: '4px',
                                                        fontSize: '14px',
                                                        backgroundColor: 'white'
                                                    }}
                                                >
                                                    <option value="" disabled>Select project manager</option>
                                                    <option value="Shannon">Shannon</option>
                                                    <option value="Koketso">Koketso</option>
                                                    <option value="Nasreen">Nasreen</option>
                                                    <option value="add_new">+ Add Project Manager</option>
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label>DG *</label>
                                                <select 
                                                    name="yearRange" 
                                                    value={projectForm.yearRange}
                                                    onChange={handleProjectInputChange}
                                                    required
                                                >
                                                    <option value="" disabled>Select DG</option>
                                                    <option value="23-24">23-24</option>
                                                    <option value="25-26">25-26</option>
                                                    <option value="27-28">27-28</option>
                                                    <option value="add_new">+ Add New</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Start Date *</label>
                                                <input 
                                                    type="date" 
                                                    name="startDate" 
                                                    value={projectForm.startDate}
                                                    onChange={handleProjectInputChange}
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>End Date *</label>
                                                <input 
                                                    type="date" 
                                                    name="endDate" 
                                                    value={projectForm.endDate}
                                                    onChange={handleProjectInputChange}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Interventions & Programs Section */}
                                    <div className="form-section" style={{
                                        marginBottom: '30px',
                                        padding: '20px',
                                        backgroundColor: '#f8f9fa',
                                        borderRadius: '8px',
                                        border: '1px solid #e0e0e0'
                                    }}>
                                        <h3 className="section-title" style={{
                                            color: '#006400',
                                            fontSize: '18px',
                                            fontWeight: 'bold',
                                            marginBottom: '20px',
                                            paddingBottom: '10px',
                                            borderBottom: '2px solid #006400'
                                        }}>Interventions & Programs</h3>
                                        <div className="form-group">
                                            <label>Interventions *</label>
                                            <div className="intervention-dropdown-container">
                                                <div 
                                                    className="intervention-dropdown-trigger"
                                                    onClick={() => setShowInterventionDropdown(!showInterventionDropdown)}
                                                >
                                                    <span className={`intervention-placeholder ${projectForm.selectedInterventions && projectForm.selectedInterventions.length > 0 ? 'has-selections' : ''}`}>
                                                        {projectForm.selectedInterventions && projectForm.selectedInterventions.length > 0 
                                                            ? projectForm.selectedInterventions.map(item => item.label).join(', ') 
                                                            : 'Select interventions'
                                                        }
                                                    </span>
                                                    <i className={`fas fa-chevron-down ${showInterventionDropdown ? 'rotated' : ''}`}></i>
                                                </div>
                                                {showInterventionDropdown && (
                                                    <div className="intervention-dropdown-options">
                                                        {[
                                                            { value: 'learnship_18_1', label: 'Learnership(18.1)' },
                                                            { value: 'learnship_18_2', label: 'Learnership(18.2)' },
                                                            { value: 'graduates_diploma', label: 'Graduates(Diploma)' },
                                                            { value: 'graduates_degree', label: 'Graduates(Degree)' },
                                                            { value: 'bursary_employed', label: 'Bursary(Employed)' },
                                                            { value: 'bursary_unemployed', label: 'Bursary(Unemployed)' },
                                                            { value: 'skills_programs_18_1', label: 'Skills Programs (18.1)' },
                                                            { value: 'skills_programs_18_2', label: 'Skills Programs (18.2)' },
                                                            { value: 'het_3_months', label: 'HET (3 months)' },
                                                            { value: 'tvet', label: 'TVET' },
                                                            { value: 'ncv', label: 'NCV' }
                                                        ].map((intervention) => (
                                                            <div 
                                                                key={intervention.value} 
                                                                className="intervention-option"
                                                                onClick={() => handleInterventionSelection(intervention.value, intervention.label)}
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    checked={projectForm.selectedInterventions && projectForm.selectedInterventions.some(item => item.value === intervention.value)}
                                                                    readOnly
                                                                />
                                                                <span>{intervention.label}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Qualification Title</label>
                                                <select
                                                    name="qualificationTitle" 
                                                    value={projectForm.qualificationTitle}
                                                    onChange={handleProjectInputChange}
                                                >
                                                    <option value="" disabled>Select qualification type</option>
                                                    <option value="wrseta_legacy">Legacy Qualification (W&R SETA)</option>
                                                    <option value="fpm_legacy">Legacy Qualification (FPM SETA)</option>
                                                    
                                                </select>
                                            </div>

                                            <div className="form-group">
                                                <label>Legacy Qualifications</label>
                                                <div className="intervention-dropdown-container">
                                                    <div 
                                                        className="intervention-dropdown-trigger"
                                                        onClick={() => setShowLegacyQualificationsDropdown(!showLegacyQualificationsDropdown)}
                                                    >
                                                        <span className={`intervention-placeholder ${projectForm.selectedLegacyQualifications && projectForm.selectedLegacyQualifications.length > 0 ? 'has-selections' : ''}`}>
                                                            {formatLegacyQualificationsPlaceholder(projectForm.selectedLegacyQualifications)}
                                                        </span>
                                                        <i className={`fas fa-chevron-down ${showLegacyQualificationsDropdown ? 'rotated' : ''}`}></i>
                                                    </div>
                                                    {showLegacyQualificationsDropdown && (
                                                        <div className="intervention-dropdown-options">
                                                            {(currentLegacyQualifications.length > 0 ? currentLegacyQualifications : wrsetaLegacyQualifications).map((qualification) => (
                                                                <div 
                                                                    key={qualification.value} 
                                                                    className="intervention-option"
                                                                    onClick={() => handleLegacyQualificationSelection(qualification.value, qualification.label)}
                                                                >
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={projectForm.selectedLegacyQualifications && projectForm.selectedLegacyQualifications.some(item => item.value === qualification.value)}
                                                                        readOnly
                                                                    />
                                                                    <span>{qualification.label}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label>NQF Level</label>
                                                <div className="intervention-dropdown-container">
                                                    <div 
                                                        className="intervention-dropdown-trigger"
                                                        onClick={() => setShowIndependentNqfDropdown(!showIndependentNqfDropdown)}
                                                    >
                                                        <span className={`intervention-placeholder ${projectForm.independentNqfLevel ? 'has-selections' : ''}`}>
                                                            {projectForm.independentNqfLevel 
                                                                ? independentNqfLevels.find(level => level.value === projectForm.independentNqfLevel)?.label || 'Select NQF Level'
                                                                : 'Select NQF Level'
                                                            }
                                                        </span>
                                                        <i className={`fas fa-chevron-down ${showIndependentNqfDropdown ? 'rotated' : ''}`}></i>
                                                    </div>
                                                    {showIndependentNqfDropdown && (
                                                        <div className="intervention-dropdown-options">
                                                            {independentNqfLevels.map((level) => (
                                                                <div 
                                                                    key={level.value} 
                                                                    className="intervention-option"
                                                                    onClick={() => handleIndependentNqfSelection(level.value, level.label)}
                                                                >
                                                                    <input
                                                                        type="radio"
                                                                        checked={projectForm.independentNqfLevel === level.value}
                                                                        readOnly
                                                                    />
                                                                    <span>{level.label}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label>Credits</label>
                                                <div className="intervention-dropdown-container">
                                                    <div 
                                                        className="intervention-dropdown-trigger"
                                                        onClick={() => setShowIndependentCreditsDropdown(!showIndependentCreditsDropdown)}
                                                    >
                                                        <span className={`intervention-placeholder ${projectForm.independentCredits ? 'has-selections' : ''}`}>
                                                            {projectForm.independentCredits 
                                                                ? independentCreditsOptions.find(credits => credits.value === projectForm.independentCredits)?.label || 'Select Credits'
                                                                : 'Select Credits'
                                                            }
                                                        </span>
                                                        <i className={`fas fa-chevron-down ${showIndependentCreditsDropdown ? 'rotated' : ''}`}></i>
                                                    </div>
                                                    {showIndependentCreditsDropdown && (
                                                        <div className="intervention-dropdown-options">
                                                            {independentCreditsOptions.map((credits) => (
                                                                <div 
                                                                    key={credits.value} 
                                                                    className="intervention-option"
                                                                    onClick={() => handleIndependentCreditsSelection(credits.value, credits.label)}
                                                                >
                                                                    <input
                                                                        type="radio"
                                                                        checked={projectForm.independentCredits === credits.value}
                                                                        readOnly
                                                                    />
                                                                    <span>{credits.label}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            {hasSkillsProgramIntervention() && (
                                                <div className="form-group">
                                                    <label>Skills Program</label>
                                                    <select 
                                                        name="skillsProgramType" 
                                                        value={projectForm.skillsProgramType}
                                                        onChange={handleProjectInputChange}
                                                    >
                                                        <option value="" disabled>Select Skills Program Title</option>
                                                        <option value="wholesale_retail_operations_level_2">Visual Merchandiser: NQF 3: 27/SP-343203/Vis3/00254 </option>
                                                       
                                                        
                                                    </select>
                                                </div>
                                            )}
                                            <div className="form-group">
                                                <label>Unit Standards</label>
                                                <div className={`intervention-dropdown-container ${shouldDisableUnitStandards() ? 'disabled' : ''}`}>
                                                    <div 
                                                        className={`intervention-dropdown-trigger ${shouldDisableUnitStandards() ? 'disabled' : ''}`}
                                                        onClick={() => !shouldDisableUnitStandards() && setShowModulesDropdown(!showModulesDropdown)}
                                                    >
                                                        <span className={`intervention-placeholder ${projectForm.modulesDropdown ? 'has-selections' : ''} ${shouldDisableUnitStandards() ? 'disabled' : ''}`}>
                                                            {shouldDisableUnitStandards() 
                                                                ? 'Disabled for Learnership' 
                                                                : (projectForm.modulesDropdown 
                                                                    ? modulesOptions.find(module => module.value === projectForm.modulesDropdown)?.label || 'Select Modules'
                                                                    : 'Select Unit Standards'
                                                                )
                                                            }
                                                        </span>
                                                        <i className={`fas fa-chevron-down ${showModulesDropdown ? 'rotated' : ''} ${shouldDisableUnitStandards() ? 'disabled' : ''}`}></i>
                                                    </div>
                                                    {showModulesDropdown && !shouldDisableUnitStandards() && (
                                                        <div className="intervention-dropdown-options">
                                                            {modulesOptions.map((module) => (
                                                                <div 
                                                                    key={module.value} 
                                                                    className="intervention-option"
                                                                    onClick={() => handleModulesSelection(module.value, module.label)}
                                                                >
                                                                    <input
                                                                        type="radio"
                                                                        checked={projectForm.modulesDropdown === module.value}
                                                                        readOnly
                                                                    />
                                                                    <span>{module.label}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label>Modules</label>
                                                <div className={`intervention-dropdown-container ${shouldDisableModules() ? 'disabled' : ''}`}>
                                                    <div 
                                                        className={`intervention-dropdown-trigger ${shouldDisableModules() ? 'disabled' : ''}`}
                                                        onClick={() => !shouldDisableModules() && setShowSeparateModulesDropdown(!showSeparateModulesDropdown)}
                                                    >
                                                        <span className={`intervention-placeholder ${projectForm.separateModules ? 'has-selections' : ''} ${shouldDisableModules() ? 'disabled' : ''}`}>
                                                            {shouldDisableModules() 
                                                                ? 'Disabled for Skills Programs' 
                                                                : (projectForm.separateModules 
                                                                    ? separateModulesOptions.find(module => module.value === projectForm.separateModules)?.label || 'Select Modules'
                                                                    : 'Select Modules'
                                                                )
                                                            }
                                                        </span>
                                                        <i className={`fas fa-chevron-down ${showSeparateModulesDropdown ? 'rotated' : ''} ${shouldDisableModules() ? 'disabled' : ''}`}></i>
                                                    </div>
                                                    {showSeparateModulesDropdown && !shouldDisableModules() && (
                                                        <div className="intervention-dropdown-options">
                                                            {separateModulesOptions.map((module) => (
                                                                <div 
                                                                    key={module.value} 
                                                                    className="intervention-option"
                                                                    onClick={() => handleSeparateModulesSelection(module.value, module.label)}
                                                                >
                                                                    <input
                                                                        type="radio"
                                                                        checked={projectForm.separateModules === module.value}
                                                                        readOnly
                                                                    />
                                                                    <span>{module.label}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Financial & Learners Section */}
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Cost per Learner (R) *</label>
                                                <div className="cost-dropdown-container">
                                                    <input 
                                                        type="number" 
                                                        name="costPerLearner" 
                                                        value={projectForm.costPerLearner}
                                                        onChange={handleProjectInputChange}
                                                        placeholder={projectForm.selectedCostIntervention ? 
                                                            `Cost for ${projectForm.selectedInterventions.find(i => i.value === projectForm.selectedCostIntervention)?.label || 'selected intervention'}` : 
                                                            'Select intervention and enter cost'
                                                        }
                                                        min="0"
                                                        step="0.01"
                                                        readOnly
                                                        onClick={() => {
                                                            const costOptions = getCostOptions(projectForm.selectedInterventions);
                                                            if (costOptions.length > 0) {
                                                                setShowCostDropdown(!showCostDropdown);
                                                            } else {
                                                                alert('Please select interventions first to set costs.');
                                                            }
                                                        }}
                                                    />
                                                    {showCostDropdown && (
                                                        <div className="cost-dropdown-options">
                                                            {getCostOptions(projectForm.selectedInterventions).length > 0 ? (
                                                                getCostOptions(projectForm.selectedInterventions).map((option) => (
                                                                    <div 
                                                                        key={option.interventionValue} 
                                                                        className="cost-option"
                                                                        onClick={() => handleInterventionCostChange(option.interventionValue, option.cost || '')}
                                                                    >
                                                                        <span className="cost-label">{option.label}</span>
                                                                        <span className="cost-value">
                                                                            {option.cost ? `R ${option.cost}` : 'Click to set cost'}
                                                                        </span>
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <div className="cost-option no-interventions">
                                                                    <span>No interventions selected</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label>Number of Learners *</label>
                                                <div className="learners-dropdown-container">
                                                    <input 
                                                        type="number" 
                                                        name="numberOfLearners" 
                                                        value={projectForm.numberOfLearners}
                                                        onChange={handleProjectInputChange}
                                                        placeholder={projectForm.selectedLearnersIntervention ? 
                                                            `Learners for ${projectForm.selectedInterventions.find(i => i.value === projectForm.selectedLearnersIntervention)?.label || 'selected intervention'}` : 
                                                            'Select intervention and enter learners'
                                                        }
                                                        min="1"
                                                        required
                                                        readOnly
                                                        onClick={() => {
                                                            const learnersOptions = getLearnersOptions(projectForm.selectedInterventions);
                                                            if (learnersOptions.length > 0) {
                                                                setShowLearnersDropdown(!showLearnersDropdown);
                                                            } else {
                                                                alert('Please select interventions first to set learners.');
                                                            }
                                                        }}
                                                    />
                                                    {showLearnersDropdown && (
                                                        <div className="learners-dropdown-options">
                                                            {getLearnersOptions(projectForm.selectedInterventions).length > 0 ? (
                                                                getLearnersOptions(projectForm.selectedInterventions).map((option) => (
                                                                    <div 
                                                                        key={option.interventionValue} 
                                                                        className="learners-option"
                                                                        onClick={() => handleInterventionLearnersChange(option.interventionValue, option.learners || '')}
                                                                    >
                                                                        <span className="learners-label">{option.label}</span>
                                                                        <span className="learners-value">
                                                                            {option.learners ? `${option.learners} learners` : 'Click to set learners'}
                                                                        </span>
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <div className="learners-option no-interventions">
                                                                    <span>No interventions selected</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Accreditation Section */}
                                        <div className="form-section" style={{
                                            marginBottom: '30px',
                                            padding: '20px',
                                            backgroundColor: '#f8f9fa',
                                            borderRadius: '8px',
                                            border: '1px solid #e0e0e0'
                                        }}>
                                            <h3 className="section-title" style={{
                                                color: '#006400',
                                                fontSize: '18px',
                                                fontWeight: 'bold',
                                                marginBottom: '20px',
                                                paddingBottom: '10px',
                                                borderBottom: '2px solid #006400'
                                            }}>Accreditation Details</h3>
                                            <div className="form-row">
                                                <div className="form-group">
                                                    <label>Accrediting Body</label>
                                                    <select 
                                                        name="accreditingBody" 
                                                        value={projectForm.accreditingBody}
                                                        onChange={handleProjectInputChange}
                                                    >
                                                        <option value="QCTO">QCTO</option>
                                                        <option value="W&R SETA">W&R SETA</option>
                                                    </select>
                                                </div>
                                                <div className="form-group">
                                                    <label>Accreditation Number</label>
                                                    <select 
                                                        name="accreditationNumber" 
                                                        value={projectForm.accreditationNumber}
                                                        onChange={handleProjectInputChange}
                                                    >
                                                        <option value="">Select accreditation number</option>
                                                        <option value="05-W&R">861</option>
                                                        <option value="05-QCTO/SDP010524113839">05-QCTO/SDP010524113839</option>
                                                        <option value="05-QCTO/SDP040325132739">05-QCTO/SDP040325132739</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="form-row">
                                                <div className="form-group">
                                                    <label>Qualifications</label>
                                                    <select 
                                                        name="qualifications" 
                                                        value={projectForm.qualifications}
                                                        onChange={handleProjectInputChange}
                                                        disabled={!projectForm.accreditationNumber}
                                                    >
                                                        <option value="" disabled>
                                                            {projectForm.accreditationNumber 
                                                                ? 'Select qualifications' 
                                                                : 'Select accreditation number first'
                                                            }
                                                        </option>
                                                        {projectForm.accreditationNumber && qualificationsData[projectForm.accreditationNumber]?.map((qual, index) => (
                                                            <option key={index} value={qual.name}>{qual.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="form-group">
                                                    <label>NQF Level</label>
                                                    <input 
                                                        type="text" 
                                                        name="nqfLevel" 
                                                        value={projectForm.nqfLevel}
                                                        onChange={handleProjectInputChange}
                                                        readOnly
                                                        style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
                                                        placeholder="Auto-filled based on qualification"
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-row">
                                                <div className="form-group">
                                                    <label>OFO Code</label>
                                                    <input 
                                                        type="text" 
                                                        name="ofoNumber" 
                                                        value={projectForm.ofoNumber}
                                                        onChange={handleProjectInputChange}
                                                        readOnly
                                                        style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
                                                        placeholder="Auto-filled based on NQF Level"
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label>Modules</label>
                                                    <input 
                                                        type="text" 
                                                        name="accreditationModules" 
                                                        value={projectForm.accreditationModules}
                                                        onChange={handleProjectInputChange}
                                                        placeholder="Enter modules for accreditation"
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-row">
                                                <div className="form-group">
                                                    <label>Credits</label>
                                                    <input 
                                                        type="text" 
                                                        name="accreditationCredits" 
                                                        value={projectForm.accreditationCredits}
                                                        onChange={handleProjectInputChange}
                                                        placeholder="Enter credits for accreditation"
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-row">
                                                <div className="form-group">
                                                    <label>Issued By</label>
                                                    <input 
                                                        type="date" 
                                                        name="issuedBy" 
                                                        value={projectForm.issuedBy}
                                                        onChange={handleProjectInputChange}
                                                        required
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label>Expires</label>
                                                    <input 
                                                        type="date" 
                                                        name="expires" 
                                                        value={projectForm.expires}
                                                        onChange={handleProjectInputChange}
                                                        readOnly
                                                        style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-row">
                                                <div className="form-group">
                                                    <label>Duration</label>
                                                    <input 
                                                        type="text" 
                                                        name="duration" 
                                                        value={projectForm.duration}
                                                        onChange={handleProjectInputChange}
                                                        readOnly
                                                        style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Dynamic fields that appear when Skills Program Title is selected */}
                                        {projectForm.skillsProgramType && (
                                            <div className="form-row">
                                                {projectForm.skillsProgramType === 'visual_merchandiser_level_3' ? (
                                                    <div className="form-group">
                                                        <label>Unit Standards</label>
                                                        <input 
                                                            type="text" 
                                                            name="unitStandards" 
                                                            value={projectForm.unitStandards}
                                                            onChange={handleProjectInputChange}
                                                            readOnly
                                                            style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="form-group">
                                                        <label>Modules</label>
                                                        <input 
                                                            type="text" 
                                                            name="modules" 
                                                            value={projectForm.modules}
                                                            onChange={handleProjectInputChange}
                                                            readOnly
                                                            style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
                                                        />
                                                    </div>
                                                )}
                                                <div className="form-group">
                                                    <label>Credits</label>
                                                    <input 
                                                        type="text" 
                                                        name="credits" 
                                                        value={projectForm.credits}
                                                        onChange={handleProjectInputChange}
                                                        readOnly
                                                        style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>



                                    {/* Documents Section */}
                                    <div className="form-section" style={{
                                        marginBottom: '30px',
                                        padding: '20px',
                                        backgroundColor: '#f8f9fa',
                                        borderRadius: '8px',
                                        border: '1px solid #e0e0e0'
                                    }}>
                                        <h3 className="section-title" style={{
                                            color: '#006400',
                                            fontSize: '18px',
                                            fontWeight: 'bold',
                                            marginBottom: '20px',
                                            paddingBottom: '10px',
                                            borderBottom: '2px solid #006400'
                                        }}>Documents</h3>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Document Type</label>
                                                <select
                                                    name="documentType"
                                                    value={projectForm.documentType || ''}
                                                    onChange={handleProjectInputChange}
                                                >
                                                    <option value="" disabled>Select Document Type</option>
                                                    <option value="SLA">Award Letter</option>
                                                    <option value="SDF Appointment Letter">SETA Contract</option>
                                                </select>
                                            </div>
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
                                        {attachments && Array.isArray(attachments) && attachments.length > 0 && (
                                            <div className="attachments-list">
                                                {attachments
                                                    .filter(attachment => attachment && typeof attachment === 'object' && attachment.documentType === projectForm.documentType)
                                                    .map((attachment) => (
                                                    <div key={attachment.id} className="attachment-item">
                                                        <div className="attachment-info">
                                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                                <path d="M8 1L15 8L8 15M1 8H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                            </svg>
                                                            <span className="attachment-name">{attachment.name || 'Unknown'}</span>
                                                            <span className="attachment-type">({attachment.documentType || 'Unknown'})</span>
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
                                onClick={closeAddProjectModal}
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

                            <button 
                                type="submit" 
                                className="btn primary" 
                                form="project-form"
                                style={{
                                    background: '#006400',
                                    color: 'white',
                                    border: 'none',
                                    padding: '8px 16px',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '14px'
                                }}
                            >
                                Add Project
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Project Manager Modal */}
            {showAddManagerModal && (
                <div className="modal-overlay" onClick={() => setShowAddManagerModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Add New Project Manager</h2>
                            <button className="modal-close" onClick={() => setShowAddManagerModal(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="form-group">
                            <label htmlFor="newManagerName">Manager Name:</label>
                            <input 
                                type="text" 
                                id="newManagerName" 
                                placeholder="Enter manager name"
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter' && e.target.value.trim()) {
                                        handleAddManager(e.target.value.trim());
                                    }
                                }}
                                autoFocus
                            />
                        </div>
                        <div className="form-actions">
                            <button type="button" className="btn-secondary" onClick={() => setShowAddManagerModal(false)}>
                                Cancel
                            </button>
                            <button 
                                type="button" 
                                className="btn-primary"
                                onClick={() => {
                                    const input = document.getElementById('newManagerName');
                                    if (input && input.value.trim()) {
                                        handleAddManager(input.value.trim());
                                    }
                                }}
                            >
                                Add Manager
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Year Range Modal */}
            {showAddYearRangeModal && (
                <div className="modal-overlay" onClick={() => setShowAddYearRangeModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Add New Year Range</h2>
                            <button className="modal-close" onClick={() => setShowAddYearRangeModal(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="form-group">
                            <label htmlFor="newYearRange">Year Range:</label>
                            <input 
                                type="text" 
                                id="newYearRange" 
                                placeholder="Enter year range (e.g., 29-30)"
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter' && e.target.value.trim()) {
                                        handleAddYearRange(e.target.value.trim());
                                    }
                                }}
                                autoFocus
                            />
                        </div>
                        <div className="form-actions">
                            <button type="button" className="btn-secondary" onClick={() => setShowAddYearRangeModal(false)}>
                                Cancel
                            </button>
                            <button 
                                type="button" 
                                className="btn-primary"
                                onClick={() => {
                                    const input = document.getElementById('newYearRange');
                                    if (input && input.value.trim()) {
                                        handleAddYearRange(input.value.trim());
                                    }
                                }}
                            >
                                Add Year Range
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* View Project Modal */}
            {showViewProjectModal && currentProject && (
                <div className="modal-overlay" onClick={closeViewProjectModal}>
                    <div className="modal-content create-lead-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>View Project Details</h2>
                            <button className="modal-close" onClick={closeViewProjectModal}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="create-lead-form">
                                {/* Project Information Section */}
                                <div className="form-section">
                                    <h3 className="section-title">Project Information</h3>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Project Manager</label>
                                            <input 
                                                type="text" 
                                                value={currentProject.projectManager || ''}
                                                readOnly
                                                style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>DG</label>
                                            <input 
                                                type="text" 
                                                value={currentProject.yearRange || ''}
                                                readOnly
                                                style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Start Date</label>
                                            <input 
                                                type="text" 
                                                value={currentProject.startDate || ''}
                                                readOnly
                                                style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>End Date</label>
                                            <input 
                                                type="text" 
                                                value={currentProject.endDate || ''}
                                                readOnly
                                                style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Interventions & Programs Section */}
                                <div className="form-section">
                                    <h3 className="section-title">Interventions & Programs</h3>
                                    <div className="form-group">
                                        <label>Interventions</label>
                                        <input 
                                            type="text" 
                                            value={formatInterventionDisplay(currentProject.intervention) || ''}
                                            readOnly
                                            style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
                                        />
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Qualification Title</label>
                                            <input 
                                                type="text" 
                                                value={currentProject.qualificationTitle || ''}
                                                readOnly
                                                style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Legacy Qualifications</label>
                                            <input 
                                                type="text" 
                                                value={currentProject.selectedLegacyQualifications ? currentProject.selectedLegacyQualifications.map(q => q.label).join(', ') : ''}
                                                readOnly
                                                style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>NQF Level</label>
                                            <input 
                                                type="text" 
                                                value={currentProject.independentNqfLevel || ''}
                                                readOnly
                                                style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Credits</label>
                                            <input 
                                                type="text" 
                                                value={currentProject.independentCredits || ''}
                                                readOnly
                                                style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Skills Program</label>
                                            <input 
                                                type="text" 
                                                value={currentProject.skillsProgramType || ''}
                                                readOnly
                                                style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Modules</label>
                                            <input 
                                                type="text" 
                                                value={currentProject.modulesDropdown || ''}
                                                readOnly
                                                style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Unit Standards</label>
                                            <input 
                                                type="text" 
                                                value={currentProject.unitStandards || ''}
                                                readOnly
                                                style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Modules (Dynamic)</label>
                                            <input 
                                                type="text" 
                                                value={currentProject.modules || ''}
                                                readOnly
                                                style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Credits (Dynamic)</label>
                                            <input 
                                                type="text" 
                                                value={currentProject.credits || ''}
                                                readOnly
                                                style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Financial & Learners Section */}
                                <div className="form-section">
                                    <h3 className="section-title">Financial & Learners</h3>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Cost per Learner (R)</label>
                                            <input 
                                                type="text" 
                                                value={currentProject.costPerLearner ? `R ${parseFloat(currentProject.costPerLearner).toLocaleString()}` : ''}
                                                readOnly
                                                style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Number of Learners</label>
                                            <input 
                                                type="text" 
                                                value={currentProject.numberOfLearners || ''}
                                                readOnly
                                                style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Accreditation Section */}
                                <div className="form-section">
                                    <h3 className="section-title">Accreditation Details</h3>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Accrediting Body</label>
                                            <input 
                                                type="text" 
                                                value={currentProject.accreditingBody || ''}
                                                readOnly
                                                style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Accreditation Number</label>
                                            <input 
                                                type="text" 
                                                value={currentProject.accreditationNumber || ''}
                                                readOnly
                                                style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Qualifications</label>
                                            <input 
                                                type="text" 
                                                value={currentProject.qualifications || ''}
                                                readOnly
                                                style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>NQF Level</label>
                                            <input 
                                                type="text" 
                                                value={currentProject.nqfLevel || ''}
                                                readOnly
                                                style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>OFO Code</label>
                                            <input 
                                                type="text" 
                                                value={currentProject.ofoNumber || ''}
                                                readOnly
                                                style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Modules</label>
                                            <input 
                                                type="text" 
                                                value={currentProject.accreditationModules || ''}
                                                readOnly
                                                style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Credits</label>
                                            <input 
                                                type="text" 
                                                value={currentProject.accreditationCredits || ''}
                                                readOnly
                                                style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn secondary" onClick={closeViewProjectModal}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Project Modal */}
            {showEditProjectModal && currentProject && (
                <div className="modal-overlay" onClick={closeEditProjectModal}>
                    <div className="modal-content create-lead-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Edit Project</h2>
                            <button className="modal-close" onClick={closeEditProjectModal}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleEditProjectSubmit}>
                                <div className="create-lead-form">
                                    {/* Project Information Section */}
                                    <div className="form-section">
                                        <h3 className="section-title">Project Information</h3>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Project Manager *</label>
                                                <select 
                                                    name="projectManager" 
                                                    value={projectForm.projectManager}
                                                    onChange={handleProjectInputChange}
                                                    required
                                                >
                                                    <option value="" disabled>Select project manager</option>
                                                    <option value="Shannon">Shannon</option>
                                                    <option value="Koketso">Koketso</option>
                                                    <option value="Nasreen">Nasreen</option>
                                                    <option value="add_new">+ Add Project Manager</option>
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label>DG *</label>
                                                <select 
                                                    name="yearRange" 
                                                    value={projectForm.yearRange}
                                                    onChange={handleProjectInputChange}
                                                    required
                                                >
                                                    <option value="" disabled>Select DG</option>
                                                    <option value="23-24">23-24</option>
                                                    <option value="25-26">25-26</option>
                                                    <option value="27-28">27-28</option>
                                                    <option value="add_new">+ Add New</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Start Date *</label>
                                                <input 
                                                    type="date" 
                                                    name="startDate" 
                                                    value={projectForm.startDate}
                                                    onChange={handleProjectInputChange}
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>End Date *</label>
                                                <input 
                                                    type="date" 
                                                    name="endDate" 
                                                    value={projectForm.endDate}
                                                    onChange={handleProjectInputChange}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Interventions & Programs Section */}
                                    <div className="form-section">
                                        <h3 className="section-title">Interventions & Programs</h3>
                                        <div className="form-group">
                                            <label>Interventions *</label>
                                            <div className="intervention-dropdown-container">
                                                <div 
                                                    className="intervention-dropdown-trigger"
                                                    onClick={() => setShowInterventionDropdown(!showInterventionDropdown)}
                                                >
                                                    <span className={`intervention-placeholder ${projectForm.selectedInterventions && projectForm.selectedInterventions.length > 0 ? 'has-selections' : ''}`}>
                                                        {projectForm.selectedInterventions && projectForm.selectedInterventions.length > 0 
                                                            ? projectForm.selectedInterventions.map(item => item.label).join(', ') 
                                                            : 'Select interventions'
                                                        }
                                                    </span>
                                                    <i className={`fas fa-chevron-down ${showInterventionDropdown ? 'rotated' : ''}`}></i>
                                                </div>
                                                {showInterventionDropdown && (
                                                    <div className="intervention-dropdown-options">
                                                        {[
                                                            { value: 'learnship_18_1', label: 'Learnership(18.1)' },
                                                            { value: 'learnship_18_2', label: 'Learnership(18.2)' },
                                                            { value: 'graduates_diploma', label: 'Graduates(Diploma)' },
                                                            { value: 'graduates_degree', label: 'Graduates(Degree)' },
                                                            { value: 'bursary_employed', label: 'Bursary(Employed)' },
                                                            { value: 'bursary_unemployed', label: 'Bursary(Unemployed)' },
                                                            { value: 'skills_programs_18_1', label: 'Skills Programs (18.1)' },
                                                            { value: 'skills_programs_18_2', label: 'Skills Programs (18.2)' },
                                                            { value: 'het_3_months', label: 'HET (3 months)' },
                                                            { value: 'tvet', label: 'TVET' },
                                                            { value: 'ncv', label: 'NCV' }
                                                        ].map((intervention) => (
                                                            <div 
                                                                key={intervention.value} 
                                                                className="intervention-option"
                                                                onClick={() => handleInterventionSelection(intervention.value, intervention.label)}
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    checked={projectForm.selectedInterventions && projectForm.selectedInterventions.some(item => item.value === intervention.value)}
                                                                    readOnly
                                                                />
                                                                <span>{intervention.label}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Qualification Title</label>
                                                <select
                                                    name="qualificationTitle" 
                                                    value={projectForm.qualificationTitle}
                                                    onChange={handleProjectInputChange}
                                                >
                                                    <option value="" disabled>Select qualification type</option>
                                                    <option value="wrseta_legacy">Legacy Qualification (W&R SETA)</option>
                                                    <option value="fpm_legacy">Legacy Qualification (FPM SETA)</option>
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label>Legacy Qualifications</label>
                                                <div className="intervention-dropdown-container">
                                                    <div 
                                                        className="intervention-dropdown-trigger"
                                                        onClick={() => setShowLegacyQualificationsDropdown(!showLegacyQualificationsDropdown)}
                                                    >
                                                        <span className={`intervention-placeholder ${projectForm.selectedLegacyQualifications && projectForm.selectedLegacyQualifications.length > 0 ? 'has-selections' : ''}`}>
                                                            {formatLegacyQualificationsPlaceholder(projectForm.selectedLegacyQualifications)}
                                                        </span>
                                                        <i className={`fas fa-chevron-down ${showLegacyQualificationsDropdown ? 'rotated' : ''}`}></i>
                                                    </div>
                                                    {showLegacyQualificationsDropdown && (
                                                        <div className="intervention-dropdown-options">
                                                            {(currentLegacyQualifications.length > 0 ? currentLegacyQualifications : wrsetaLegacyQualifications).map((qualification) => (
                                                                <div 
                                                                    key={qualification.value} 
                                                                    className="intervention-option"
                                                                    onClick={() => handleLegacyQualificationSelection(qualification.value, qualification.label)}
                                                                >
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={projectForm.selectedLegacyQualifications && projectForm.selectedLegacyQualifications.some(item => item.value === qualification.value)}
                                                                        readOnly
                                                                    />
                                                                    <span>{qualification.label}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label>NQF Level</label>
                                                <div className="intervention-dropdown-container">
                                                    <div 
                                                        className="intervention-dropdown-trigger"
                                                        onClick={() => setShowIndependentNqfDropdown(!showIndependentNqfDropdown)}
                                                    >
                                                        <span className={`intervention-placeholder ${projectForm.independentNqfLevel ? 'has-selections' : ''}`}>
                                                            {projectForm.independentNqfLevel 
                                                                ? independentNqfLevels.find(level => level.value === projectForm.independentNqfLevel)?.label || 'Select NQF Level'
                                                                : 'Select NQF Level'
                                                            }
                                                        </span>
                                                        <i className={`fas fa-chevron-down ${showIndependentNqfDropdown ? 'rotated' : ''}`}></i>
                                                    </div>
                                                    {showIndependentNqfDropdown && (
                                                        <div className="intervention-dropdown-options">
                                                            {independentNqfLevels.map((level) => (
                                                                <div 
                                                                    key={level.value} 
                                                                    className="intervention-option"
                                                                    onClick={() => handleIndependentNqfSelection(level.value, level.label)}
                                                                >
                                                                    <input
                                                                        type="radio"
                                                                        checked={projectForm.independentNqfLevel === level.value}
                                                                        readOnly
                                                                    />
                                                                    <span>{level.label}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label>Credits</label>
                                                <div className="intervention-dropdown-container">
                                                    <div 
                                                        className="intervention-dropdown-trigger"
                                                        onClick={() => setShowIndependentCreditsDropdown(!showIndependentCreditsDropdown)}
                                                    >
                                                        <span className={`intervention-placeholder ${projectForm.independentCredits ? 'has-selections' : ''}`}>
                                                            {projectForm.independentCredits 
                                                                ? independentCreditsOptions.find(credits => credits.value === projectForm.independentCredits)?.label || 'Select Credits'
                                                                : 'Select Credits'
                                                            }
                                                        </span>
                                                        <i className={`fas fa-chevron-down ${showIndependentCreditsDropdown ? 'rotated' : ''}`}></i>
                                                    </div>
                                                    {showIndependentCreditsDropdown && (
                                                        <div className="intervention-dropdown-options">
                                                            {independentCreditsOptions.map((credits) => (
                                                                <div 
                                                                    key={credits.value} 
                                                                    className="intervention-option"
                                                                    onClick={() => handleIndependentCreditsSelection(credits.value, credits.label)}
                                                                >
                                                                    <input
                                                                        type="radio"
                                                                        checked={projectForm.independentCredits === credits.value}
                                                                        readOnly
                                                                    />
                                                                    <span>{credits.label}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label>SKills Program</label>
                                                <select 
                                                    name="skillsProgramType" 
                                                    value={projectForm.skillsProgramType}
                                                    onChange={handleProjectInputChange}
                                                >
                                                    <option value="" disabled>Select Skills Program Title</option>
                                                    <option value="wholesale_retail_operations_level_2">Visual Merchandiser: NQF 3: VS3/00254 </option>
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label>Modules</label>
                                                <div className="intervention-dropdown-container">
                                                    <div 
                                                        className="intervention-dropdown-trigger"
                                                        onClick={() => setShowModulesDropdown(!showModulesDropdown)}
                                                    >
                                                        <span className={`intervention-placeholder ${projectForm.modulesDropdown ? 'has-selections' : ''}`}>
                                                            {projectForm.modulesDropdown 
                                                                ? modulesOptions.find(module => module.value === projectForm.modulesDropdown)?.label || 'Select Modules'
                                                                : 'Select Modules'
                                                            }
                                                        </span>
                                                        <i className={`fas fa-chevron-down ${showModulesDropdown ? 'rotated' : ''}`}></i>
                                                    </div>
                                                    {showModulesDropdown && (
                                                        <div className="intervention-dropdown-options">
                                                            {modulesOptions.map((module) => (
                                                                <div 
                                                                    key={module.value} 
                                                                    className="intervention-option"
                                                                    onClick={() => handleModulesSelection(module.value, module.label)}
                                                                >
                                                                    <input
                                                                        type="radio"
                                                                        checked={projectForm.modulesDropdown === module.value}
                                                                        readOnly
                                                                    />
                                                                    <span>{module.label}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Financial & Learners Section */}
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Cost per Learner (R) *</label>
                                                <div className="cost-dropdown-container">
                                                    <input 
                                                        type="number" 
                                                        name="costPerLearner" 
                                                        value={projectForm.costPerLearner}
                                                        onChange={handleProjectInputChange}
                                                        placeholder={projectForm.selectedCostIntervention ? 
                                                            `Cost for ${projectForm.selectedInterventions.find(i => i.value === projectForm.selectedCostIntervention)?.label || 'selected intervention'}` : 
                                                            'Select intervention and enter cost'
                                                        }
                                                        min="0"
                                                        step="0.01"
                                                        readOnly
                                                        onClick={() => {
                                                            const costOptions = getCostOptions(projectForm.selectedInterventions);
                                                            if (costOptions.length > 0) {
                                                                setShowCostDropdown(!showCostDropdown);
                                                            } else {
                                                                alert('Please select interventions first to set costs.');
                                                            }
                                                        }}
                                                    />
                                                    {showCostDropdown && (
                                                        <div className="cost-dropdown-options">
                                                            {getCostOptions(projectForm.selectedInterventions).length > 0 ? (
                                                                getCostOptions(projectForm.selectedInterventions).map((option) => (
                                                                    <div 
                                                                        key={option.interventionValue} 
                                                                        className="cost-option"
                                                                        onClick={() => handleInterventionCostChange(option.interventionValue, option.cost || '')}
                                                                    >
                                                                        <span className="cost-label">{option.label}</span>
                                                                        <span className="cost-value">
                                                                            {option.cost ? `R ${option.cost}` : 'Click to set cost'}
                                                                        </span>
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <div className="cost-option no-interventions">
                                                                    <span>No interventions selected</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label>Number of Learners *</label>
                                                <div className="learners-dropdown-container">
                                                    <input 
                                                        type="number" 
                                                        name="numberOfLearners" 
                                                        value={projectForm.numberOfLearners}
                                                        onChange={handleProjectInputChange}
                                                        placeholder={projectForm.selectedLearnersIntervention ? 
                                                            `Learners for ${projectForm.selectedInterventions.find(i => i.value === projectForm.selectedLearnersIntervention)?.label || 'selected intervention'}` : 
                                                            'Select intervention and enter learners'
                                                        }
                                                        min="1"
                                                        required
                                                        readOnly
                                                        onClick={() => {
                                                            const learnersOptions = getLearnersOptions(projectForm.selectedInterventions);
                                                            if (learnersOptions.length > 0) {
                                                                setShowLearnersDropdown(!showLearnersDropdown);
                                                            } else {
                                                                alert('Please select interventions first to set learners.');
                                                            }
                                                        }}
                                                    />
                                                    {showLearnersDropdown && (
                                                        <div className="learners-dropdown-options">
                                                            {getLearnersOptions(projectForm.selectedInterventions).length > 0 ? (
                                                                getLearnersOptions(projectForm.selectedInterventions).map((option) => (
                                                                    <div 
                                                                        key={option.interventionValue} 
                                                                        className="learners-option"
                                                                        onClick={() => handleInterventionLearnersChange(option.interventionValue, option.learners || '')}
                                                                    >
                                                                        <span className="learners-label">{option.label}</span>
                                                                        <span className="learners-value">
                                                                            {option.learners ? `${option.learners} learners` : 'Click to set learners'}
                                                                        </span>
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <div className="learners-option no-interventions">
                                                                    <span>No interventions selected</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Accreditation Section */}
                                        <div className="form-section">
                                            <h3 className="section-title">Accreditation Details</h3>
                                            <div className="form-row">
                                                <div className="form-group">
                                                    <label>Accrediting Body</label>
                                                    <select 
                                                        name="accreditingBody" 
                                                        value={projectForm.accreditingBody}
                                                        onChange={handleProjectInputChange}
                                                    >
                                                        <option value="QCTO">QCTO</option>
                                                        <option value="W&R SETA">W&R SETA</option>
                                                    </select>
                                                </div>
                                                <div className="form-group">
                                                    <label>Accreditation Number</label>
                                                    <select 
                                                        name="accreditationNumber" 
                                                        value={projectForm.accreditationNumber}
                                                        onChange={handleProjectInputChange}
                                                    >
                                                        <option value="">Select accreditation number</option>
                                                        <option value="05-W&R">861</option>
                                                        <option value="05-QCTO/SDP010524113839">05-QCTO/SDP010524113839</option>
                                                        <option value="05-QCTO/SDP040325132739">05-QCTO/SDP040325132739</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="form-row">
                                                <div className="form-group">
                                                    <label>Qualifications</label>
                                                    <select 
                                                        name="qualifications" 
                                                        value={projectForm.qualifications}
                                                        onChange={handleProjectInputChange}
                                                        disabled={!projectForm.accreditationNumber}
                                                    >
                                                        <option value="" disabled>
                                                            {projectForm.accreditationNumber 
                                                                ? 'Select qualifications' 
                                                                : 'Select accreditation number first'
                                                            }
                                                        </option>
                                                        {projectForm.accreditationNumber && qualificationsData[projectForm.accreditationNumber]?.map((qual, index) => (
                                                            <option key={index} value={qual.name}>{qual.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="form-group">
                                                    <label>NQF Level</label>
                                                    <input 
                                                        type="text" 
                                                        name="nqfLevel" 
                                                        value={projectForm.nqfLevel}
                                                        onChange={handleProjectInputChange}
                                                        readOnly
                                                        style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
                                                        placeholder="Auto-filled based on qualification"
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-row">
                                                <div className="form-group">
                                                    <label>OFO Code</label>
                                                    <input 
                                                        type="text" 
                                                        name="ofoNumber" 
                                                        value={projectForm.ofoNumber}
                                                        onChange={handleProjectInputChange}
                                                        readOnly
                                                        style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
                                                        placeholder="Auto-filled based on NQF Level"
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label>Modules</label>
                                                    <input 
                                                        type="text" 
                                                        name="accreditationModules" 
                                                        value={projectForm.accreditationModules}
                                                        onChange={handleProjectInputChange}
                                                        placeholder="Enter modules for accreditation"
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-row">
                                                <div className="form-group">
                                                    <label>Credits</label>
                                                    <input 
                                                        type="text" 
                                                        name="accreditationCredits" 
                                                        value={projectForm.accreditationCredits}
                                                        onChange={handleProjectInputChange}
                                                        placeholder="Enter credits for accreditation"
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-row">
                                                <div className="form-group">
                                                    <label>Issued By</label>
                                                    <input 
                                                        type="date" 
                                                        name="issuedBy" 
                                                        value={projectForm.issuedBy}
                                                        onChange={handleProjectInputChange}
                                                        required
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label>Expires</label>
                                                    <input 
                                                        type="date" 
                                                        name="expires" 
                                                        value={projectForm.expires}
                                                        onChange={handleProjectInputChange}
                                                        readOnly
                                                        style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-row">
                                                <div className="form-group">
                                                    <label>Duration</label>
                                                    <input 
                                                        type="text" 
                                                        name="duration" 
                                                        value={projectForm.duration}
                                                        onChange={handleProjectInputChange}
                                                        readOnly
                                                        style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Dynamic fields that appear when Skills Program Title is selected */}
                                        {projectForm.skillsProgramType && (
                                            <div className="form-row">
                                                {projectForm.skillsProgramType === 'visual_merchandiser_level_3' ? (
                                                    <div className="form-group">
                                                        <label>Unit Standards</label>
                                                        <input 
                                                            type="text" 
                                                            name="unitStandards" 
                                                            value={projectForm.unitStandards}
                                                            onChange={handleProjectInputChange}
                                                            readOnly
                                                            style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="form-group">
                                                        <label>Modules</label>
                                                        <input 
                                                            type="text" 
                                                            name="modules" 
                                                            value={projectForm.modules}
                                                            onChange={handleProjectInputChange}
                                                            readOnly
                                                            style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
                                                        />
                                                    </div>
                                                )}
                                                <div className="form-group">
                                                    <label>Credits</label>
                                                    <input 
                                                        type="text" 
                                                        name="credits" 
                                                        value={projectForm.credits}
                                                        onChange={handleProjectInputChange}
                                                        readOnly
                                                        style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Documents Section */}
                                    <div className="form-section">
                                        <h3 className="section-title">Documents</h3>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Document Type</label>
                                                <select
                                                    name="documentType"
                                                    value={projectForm.documentType || ''}
                                                    onChange={handleProjectInputChange}
                                                >
                                                    <option value="" disabled>Select Document Type</option>
                                                    <option value="SLA">Award Letter</option>
                                                    <option value="SDF Appointment Letter">SETA Contract</option>
                                                </select>
                                            </div>
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
                                        {attachments && Array.isArray(attachments) && attachments.length > 0 && (
                                            <div className="attachments-list">
                                                {attachments
                                                    .filter(attachment => attachment && typeof attachment === 'object' && attachment.documentType === projectForm.documentType)
                                                    .map((attachment) => (
                                                    <div key={attachment.id} className="attachment-item">
                                                        <div className="attachment-info">
                                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                                <path d="M8 1L15 8L8 15M1 8H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                            </svg>
                                                            <span className="attachment-name">{attachment.name || 'Unknown'}</span>
                                                            <span className="attachment-type">({attachment.documentType || 'Unknown'})</span>
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
                                    <button type="button" className="btn secondary" onClick={closeEditProjectModal}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn primary">
                                        Update Project
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Redacted Modal */}
            {showRedactedModal && (
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
                            <h2 style={{ margin: 0, color: '#006400', fontWeight: 'bold' }}>
                                {currentProject?.isRedacted ? 'Unredact Project' : 'Redact Project'}
                            </h2>
                            <button className="modal-close" onClick={closeRedactedModal} style={{
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
                            <form id="redacted-form" onSubmit={handleRedactedSubmit}>
                                    {/* Separator/Divider */}
                                    <div className="form-separator">
                                        <div className="separator-line"></div>
                                        <div className="separator-title">Client Information</div>
                                        <div className="separator-line"></div>
                                    </div>

                                    {/* Company Information Section */}
                                    <div className="form-section" style={{
                                        marginBottom: '30px',
                                        padding: '20px',
                                        backgroundColor: '#f8f9fa',
                                        borderRadius: '8px',
                                        border: '1px solid #e0e0e0'
                                    }}>
                                        <h3 className="section-title" style={{
                                            color: '#006400',
                                            fontSize: '18px',
                                            fontWeight: 'bold',
                                            marginBottom: '20px',
                                            paddingBottom: '10px',
                                            borderBottom: '2px solid #006400'
                                        }}>Company Information</h3>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Company Name *</label>
                                                <input
                                                    type="text"
                                                    name="clientName"
                                                    value={redactedFormData.clientName}
                                                    onChange={handleRedactedInputChange}
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Project Manager *</label>
                                                <div className="lead-manager-dropdown-container">
                                                    <div 
                                                        className="lead-manager-dropdown-trigger"
                                                        onClick={() => setShowLeadManagerDropdown(!showLeadManagerDropdown)}
                                                    >
                                                        <span className="lead-manager-placeholder">
                                                            {redactedFormData.leadManager || 'Select Lead Manager'}
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
                                                                        setRedactedFormData(prev => ({ ...prev, leadManager: manager }));
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
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Company Contact *</label>
                                                <input
                                                    type="text"
                                                    name="companyContact"
                                                    value={redactedFormData.companyContact}
                                                    onChange={handleRedactedInputChange}
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Registration Number *</label>
                                                <input
                                                    type="text"
                                                    name="clientReg"
                                                    value={redactedFormData.clientReg}
                                                    onChange={handleRedactedInputChange}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Conception Date *</label>
                                                <input
                                                    type="date"
                                                    name="conceptionDate"
                                                    value={redactedFormData.conceptionDate}
                                                    onChange={handleRedactedInputChange}
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>DG</label>
                                                <select
                                                    name="dg"
                                                    value={redactedFormData.dg}
                                                    onChange={handleRedactedInputChange}
                                                >
                                                    <option value="">Select DG</option>
                                                    <option value="23-24">23-24</option>
                                                    <option value="25-26">25-26</option>
                                                    <option value="27-28">27-28</option>
                                                    <option value="add_new">+ Add New</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>WSP</label>
                                                <select
                                                    name="wspSubmitted"
                                                    value={redactedFormData.wspSubmitted}
                                                    onChange={handleRedactedInputChange}
                                                >
                                                    <option value="">Submitted?</option>
                                                    <option value="Yes">Yes</option>
                                                    <option value="No">No</option>
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label>Monthly Retainer *</label>
                                                <input
                                                    type="number"
                                                    name="retainer"
                                                    value={redactedFormData.retainer}
                                                    onChange={handleRedactedInputChange}
                                                    min="0"
                                                    step="0.01"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        {/* Conditional textbox that appears when WSP is "No" */}
                                        {redactedFormData.wspSubmitted === 'No' && (
                                            <div className="form-row">
                                                <div className="form-group">
                                                    <label>Reason for not submitting WSP</label>
                                                    <textarea
                                                        name="wspReason"
                                                        value={redactedFormData.wspReason}
                                                        onChange={handleRedactedInputChange}
                                                        placeholder="Please provide a reason for not submitting the Workplace Skills Plan..."
                                                        rows="3"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Contact Information Section */}
                                    <div className="form-section" style={{
                                        marginBottom: '30px',
                                        padding: '20px',
                                        backgroundColor: '#f8f9fa',
                                        borderRadius: '8px',
                                        border: '1px solid #e0e0e0'
                                    }}>
                                        <h3 className="section-title" style={{
                                            color: '#006400',
                                            fontSize: '18px',
                                            fontWeight: 'bold',
                                            marginBottom: '20px',
                                            paddingBottom: '10px',
                                            borderBottom: '2px solid #006400'
                                        }}>Contact Information</h3>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Business Address *</label>
                                                <textarea
                                                    name="clientAddress"
                                                    value={redactedFormData.clientAddress}
                                                    onChange={handleRedactedInputChange}
                                                    rows="3"
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Phone Number *</label>
                                                <input
                                                    type="tel"
                                                    name="contactPhone"
                                                    value={redactedFormData.contactPhone}
                                                    onChange={handleRedactedInputChange}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Province/State *</label>
                                                <select
                                                    name="province"
                                                    value={redactedFormData.province}
                                                    onChange={handleRedactedInputChange}
                                                    required
                                                >
                                                    <option value="">Select Province</option>
                                                    <option value="Eastern Cape">Eastern Cape</option>
                                                    <option value="Free State">Free State</option>
                                                    <option value="Gauteng">Gauteng</option>
                                                    <option value="KwaZulu-Natal">KwaZulu-Natal</option>
                                                    <option value="Limpopo">Limpopo</option>
                                                    <option value="Mpumalanga">Mpumalanga</option>
                                                    <option value="Northern Cape">Northern Cape</option>
                                                    <option value="North West">North West</option>
                                                    <option value="Western Cape">Western Cape</option>
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label>Country *</label>
                                                <select
                                                    name="country"
                                                    value={redactedFormData.country}
                                                    onChange={handleRedactedInputChange}
                                                    required
                                                >
                                                    <option value="">Select Country</option>
                                                    <option value="South Africa">South Africa</option>
                                                    <option value="Botswana">Botswana</option>
                                                    <option value="Lesotho">Lesotho</option>
                                                    <option value="Mozambique">Mozambique</option>
                                                    <option value="Namibia">Namibia</option>
                                                    <option value="Swaziland">Swaziland</option>
                                                    <option value="Zimbabwe">Zimbabwe</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>City *</label>
                                                <input
                                                    type="text"
                                                    name="city"
                                                    value={redactedFormData.city}
                                                    onChange={handleRedactedInputChange}
                                                    placeholder="Enter city name"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Email Address *</label>
                                                <input
                                                    type="email"
                                                    name="contactEmail"
                                                    value={redactedFormData.contactEmail}
                                                    onChange={handleRedactedInputChange}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Services & SETA Section */}
                                    <div className="form-section" style={{
                                        marginBottom: '30px',
                                        padding: '20px',
                                        backgroundColor: '#f8f9fa',
                                        borderRadius: '8px',
                                        border: '1px solid #e0e0e0'
                                    }}>
                                        <h3 className="section-title" style={{
                                            color: '#006400',
                                            fontSize: '18px',
                                            fontWeight: 'bold',
                                            marginBottom: '20px',
                                            paddingBottom: '10px',
                                            borderBottom: '2px solid #006400'
                                        }}>Services & SETA</h3>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Services *</label>
                                                <div className="services-dropdown-container">
                                                    <div 
                                                        className="services-dropdown-trigger"
                                                        onClick={() => setShowServicesDropdown(!showServicesDropdown)}
                                                    >
                                                        <span className="services-placeholder">
                                                            {redactedFormData.services && redactedFormData.services.length > 0 
                                                                ? redactedFormData.services.join(', ') 
                                                                : 'Select Services'
                                                            }
                                                        </span>
                                                        <i className={`fas fa-chevron-down ${showServicesDropdown ? 'rotated' : ''}`}></i>
                                                    </div>
                                                    {showServicesDropdown && (
                                                        <div className="services-dropdown-options">
                                                            {['WSP', 'HR', 'Employment Equity', 'Industry Funded', 'SETA Funded', 'BBBEE'].map((service) => (
                                                                <div 
                                                                    key={service} 
                                                                    className="service-option"
                                                                    onClick={() => {
                                                                        setRedactedFormData(prev => {
                                                                            const currentServices = prev.services || [];
                                                                            const updatedServices = currentServices.includes(service)
                                                                                ? currentServices.filter(s => s !== service)
                                                                                : [...currentServices, service];
                                                                            return { ...prev, services: updatedServices };
                                                                        });
                                                                    }}
                                                                >
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={redactedFormData.services && redactedFormData.services.includes(service)}
                                                                        readOnly
                                                                    />
                                                                    <span>{service}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label>SETA</label>
                                                <select
                                                    name="seta"
                                                    value={redactedFormData.seta}
                                                    onChange={handleRedactedInputChange}
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
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>SDL Number *</label>
                                                <input
                                                    type="text"
                                                    name="sdlNumber"
                                                    value={redactedFormData.sdlNumber}
                                                    onChange={handleRedactedInputChange}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        
                                        {/* Documents Section */}
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Document Type</label>
                                                <select
                                                    name="documentType"
                                                    value={redactedFormData.documentType || ''}
                                                    onChange={handleRedactedInputChange}
                                                >
                                                    <option value="">Select Document Type</option>
                                                    <option value="SLA">SLA</option>
                                                    <option value="SDF Appointment Letter">SDF Appointment Letter</option>
                                                    <option value="Contract">Contract</option>
                                                    <option value="Invoice">Invoice</option>
                                                    <option value="Other">Other</option>
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
                                        {Array.isArray(attachments) && attachments.length > 0 && (
                                            <div className="attachments-list">
                                                {attachments
                                                    .filter(attachment => attachment && attachment.documentType === redactedFormData.documentType)
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

                                    {/* Separator/Divider */}
                                    <div className="form-separator">
                                        <div className="separator-line"></div>
                                        <div className="separator-title">Project Management</div>
                                        <div className="separator-line"></div>
                                    </div>

                                    {/* Project Information Section */}
                                    <div className="form-section" style={{
                                        marginBottom: '30px',
                                        padding: '20px',
                                        backgroundColor: '#f8f9fa',
                                        borderRadius: '8px',
                                        border: '1px solid #e0e0e0'
                                    }}>
                                        <h3 className="section-title" style={{
                                            color: '#006400',
                                            fontSize: '18px',
                                            fontWeight: 'bold',
                                            marginBottom: '20px',
                                            paddingBottom: '10px',
                                            borderBottom: '2px solid #006400'
                                        }}>Project Information</h3>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Project Manager *</label>
                                                <select 
                                                    name="projectManager" 
                                                    value={redactedFormData.projectManager}
                                                    onChange={handleRedactedInputChange}
                                                    required
                                                >
                                                    <option value="" disabled>Select project manager</option>
                                                    <option value="Shannon">Shannon</option>
                                                    <option value="Koketso">Koketso</option>
                                                    <option value="Nasreen">Nasreen</option>
                                                    <option value="add_new">+ Add Project Manager</option>
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label>DG *</label>
                                                <select 
                                                    name="yearRange" 
                                                    value={redactedFormData.yearRange}
                                                    onChange={handleRedactedInputChange}
                                                    required
                                                >
                                                    <option value="" disabled>Select DG</option>
                                                    <option value="23-24">23-24</option>
                                                    <option value="25-26">25-26</option>
                                                    <option value="27-28">27-28</option>
                                                    <option value="add_new">+ Add New</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Start Date *</label>
                                                <input 
                                                    type="date" 
                                                    name="startDate" 
                                                    value={redactedFormData.startDate}
                                                    onChange={handleRedactedInputChange}
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>End Date *</label>
                                                <input 
                                                    type="date" 
                                                    name="endDate" 
                                                    value={redactedFormData.endDate}
                                                    onChange={handleRedactedInputChange}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Interventions & Programs Section */}
                                    <div className="form-section" style={{
                                        marginBottom: '30px',
                                        padding: '20px',
                                        backgroundColor: '#f8f9fa',
                                        borderRadius: '8px',
                                        border: '1px solid #e0e0e0'
                                    }}>
                                        <h3 className="section-title" style={{
                                            color: '#006400',
                                            fontSize: '18px',
                                            fontWeight: 'bold',
                                            marginBottom: '20px',
                                            paddingBottom: '10px',
                                            borderBottom: '2px solid #006400'
                                        }}>Interventions & Programs</h3>
                                        <div className="form-group" style={{
                                            marginBottom: '20px'
                                        }}>
                                            <label style={{
                                                display: 'block',
                                                marginBottom: '8px',
                                                fontWeight: '600',
                                                color: '#333',
                                                fontSize: '14px'
                                            }}>Interventions *</label>
                                            <div className="intervention-dropdown-container">
                                                <div 
                                                    className="intervention-dropdown-trigger"
                                                    onClick={() => setShowInterventionDropdown(!showInterventionDropdown)}
                                                >
                                                    <span className={`intervention-placeholder ${redactedFormData.selectedInterventions && redactedFormData.selectedInterventions.length > 0 ? 'has-selections' : ''}`}>
                                                        {redactedFormData.selectedInterventions && redactedFormData.selectedInterventions.length > 0 
                                                            ? redactedFormData.selectedInterventions.map(item => item.label).join(', ') 
                                                            : 'Select interventions'
                                                        }
                                                    </span>
                                                    <i className={`fas fa-chevron-down ${showInterventionDropdown ? 'rotated' : ''}`}></i>
                                                </div>
                                                {showInterventionDropdown && (
                                                    <div className="intervention-dropdown-options">
                                                        {[
                                                            { value: 'learnship_18_1', label: 'Learnership(18.1)' },
                                                            { value: 'learnship_18_2', label: 'Learnership(18.2)' },
                                                            { value: 'graduates_diploma', label: 'Graduates(Diploma)' },
                                                            { value: 'graduates_degree', label: 'Graduates(Degree)' },
                                                            { value: 'bursary_employed', label: 'Bursary(Employed)' },
                                                            { value: 'bursary_unemployed', label: 'Bursary(Unemployed)' },
                                                            { value: 'skills_programs_18_1', label: 'Skills Programs (18.1)' },
                                                            { value: 'skills_programs_18_2', label: 'Skills Programs (18.2)' },
                                                            { value: 'het_3_months', label: 'HET (3 months)' },
                                                            { value: 'tvet', label: 'TVET' },
                                                            { value: 'ncv', label: 'NCV' }
                                                        ].map((intervention) => (
                                                            <div 
                                                                key={intervention.value} 
                                                                className="intervention-option"
                                                                onClick={() => handleRedactedInterventionSelection(intervention.value, intervention.label)}
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    checked={redactedFormData.selectedInterventions && redactedFormData.selectedInterventions.some(item => item.value === intervention.value)}
                                                                    readOnly
                                                                />
                                                                <span>{intervention.label}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="form-row" style={{
                                            display: 'grid',
                                            gridTemplateColumns: '1fr 1fr',
                                            gap: '20px',
                                            marginBottom: '20px'
                                        }}>
                                            <div className="form-group" style={{
                                                marginBottom: '20px'
                                            }}>
                                                <label style={{
                                                    display: 'block',
                                                    marginBottom: '8px',
                                                    fontWeight: '600',
                                                    color: '#333',
                                                    fontSize: '14px'
                                                }}>Qualification Title</label>
                                                <select
                                                    name="qualificationTitle" 
                                                    value={redactedFormData.qualificationTitle}
                                                    onChange={handleRedactedInputChange}
                                                    style={{
                                                        width: '100%',
                                                        padding: '10px',
                                                        border: '1px solid #ddd',
                                                        borderRadius: '4px',
                                                        fontSize: '14px'
                                                    }}
                                                >
                                                    <option value="" disabled>Select qualification type</option>
                                                    <option value="wrseta_legacy">Legacy Qualification (W&R SETA)</option>
                                                    <option value="fpm_legacy">Legacy Qualification (FPM SETA)</option>
                                                </select>
                                            </div>
                                            <div className="form-group" style={{
                                                marginBottom: '20px'
                                            }}>
                                                <label style={{
                                                    display: 'block',
                                                    marginBottom: '8px',
                                                    fontWeight: '600',
                                                    color: '#333',
                                                    fontSize: '14px'
                                                }}>Legacy Qualifications</label>
                                                <div className="intervention-dropdown-container">
                                                    <div 
                                                        className="intervention-dropdown-trigger"
                                                        onClick={() => setShowLegacyQualificationsDropdown(!showLegacyQualificationsDropdown)}
                                                    >
                                                        <span className={`intervention-placeholder ${redactedFormData.selectedLegacyQualifications && redactedFormData.selectedLegacyQualifications.length > 0 ? 'has-selections' : ''}`}>
                                                            {formatLegacyQualificationsPlaceholder(redactedFormData.selectedLegacyQualifications)}
                                                        </span>
                                                        <i className={`fas fa-chevron-down ${showLegacyQualificationsDropdown ? 'rotated' : ''}`}></i>
                                                    </div>
                                                    {showLegacyQualificationsDropdown && (
                                                        <div className="intervention-dropdown-options">
                                                            {(currentLegacyQualifications.length > 0 ? currentLegacyQualifications : wrsetaLegacyQualifications).map((qualification) => (
                                                                <div 
                                                                    key={qualification.value} 
                                                                    className="intervention-option"
                                                                    onClick={() => handleRedactedLegacyQualificationSelection(qualification.value, qualification.label)}
                                                                >
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={redactedFormData.selectedLegacyQualifications && redactedFormData.selectedLegacyQualifications.some(item => item.value === qualification.value)}
                                                                        readOnly
                                                                    />
                                                                    <span>{qualification.label}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-row" style={{
                                            display: 'grid',
                                            gridTemplateColumns: '1fr 1fr',
                                            gap: '20px',
                                            marginBottom: '20px'
                                        }}>
                                            <div className="form-group" style={{
                                                marginBottom: '20px'
                                            }}>
                                                <label style={{
                                                    display: 'block',
                                                    marginBottom: '8px',
                                                    fontWeight: '600',
                                                    color: '#333',
                                                    fontSize: '14px'
                                                }}>NQF Level</label>
                                                <div className="intervention-dropdown-container">
                                                    <div 
                                                        className="intervention-dropdown-trigger"
                                                        onClick={() => setShowIndependentNqfDropdown(!showIndependentNqfDropdown)}
                                                    >
                                                        <span className={`intervention-placeholder ${redactedFormData.independentNqfLevel ? 'has-selections' : ''}`}>
                                                            {redactedFormData.independentNqfLevel 
                                                                ? independentNqfLevels.find(level => level.value === redactedFormData.independentNqfLevel)?.label || 'Select NQF Level'
                                                                : 'Select NQF Level'
                                                            }
                                                        </span>
                                                        <i className={`fas fa-chevron-down ${showIndependentNqfDropdown ? 'rotated' : ''}`}></i>
                                                    </div>
                                                    {showIndependentNqfDropdown && (
                                                        <div className="intervention-dropdown-options">
                                                            {independentNqfLevels.map((level) => (
                                                                <div 
                                                                    key={level.value} 
                                                                    className="intervention-option"
                                                                    onClick={() => handleRedactedIndependentNqfSelection(level.value, level.label)}
                                                                >
                                                                    <input
                                                                        type="radio"
                                                                        checked={redactedFormData.independentNqfLevel === level.value}
                                                                        readOnly
                                                                    />
                                                                    <span>{level.label}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="form-group" style={{
                                                marginBottom: '20px'
                                            }}>
                                                <label style={{
                                                    display: 'block',
                                                    marginBottom: '8px',
                                                    fontWeight: '600',
                                                    color: '#333',
                                                    fontSize: '14px'
                                                }}>Credits</label>
                                                <div className="intervention-dropdown-container">
                                                    <div 
                                                        className="intervention-dropdown-trigger"
                                                        onClick={() => setShowIndependentCreditsDropdown(!showIndependentCreditsDropdown)}
                                                    >
                                                        <span className={`intervention-placeholder ${redactedFormData.independentCredits ? 'has-selections' : ''}`}>
                                                            {redactedFormData.independentCredits 
                                                                ? independentCreditsOptions.find(credits => credits.value === redactedFormData.independentCredits)?.label || 'Select Credits'
                                                                : 'Select Credits'
                                                            }
                                                        </span>
                                                        <i className={`fas fa-chevron-down ${showIndependentCreditsDropdown ? 'rotated' : ''}`}></i>
                                                    </div>
                                                    {showIndependentCreditsDropdown && (
                                                        <div className="intervention-dropdown-options">
                                                            {independentCreditsOptions.map((credits) => (
                                                                <div 
                                                                    key={credits.value} 
                                                                    className="intervention-option"
                                                                    onClick={() => handleRedactedIndependentCreditsSelection(credits.value, credits.label)}
                                                                >
                                                                    <input
                                                                        type="radio"
                                                                        checked={redactedFormData.independentCredits === credits.value}
                                                                        readOnly
                                                                    />
                                                                    <span>{credits.label}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        {hasRedactedSkillsProgramIntervention() && (
                                            <div className="form-row" style={{
                                                display: 'grid',
                                                gridTemplateColumns: '1fr',
                                                gap: '20px',
                                                marginBottom: '20px'
                                            }}>
                                                <div className="form-group" style={{
                                                    marginBottom: '20px'
                                                }}>
                                                    <label style={{
                                                        display: 'block',
                                                        marginBottom: '8px',
                                                        fontWeight: '600',
                                                        color: '#333',
                                                        fontSize: '14px'
                                                    }}>Skills Program</label>
                                                    <select 
                                                        name="skillsProgramType" 
                                                        value={redactedFormData.skillsProgramType}
                                                        onChange={handleRedactedInputChange}
                                                        style={{
                                                            width: '100%',
                                                            padding: '10px',
                                                            border: '1px solid #ddd',
                                                            borderRadius: '4px',
                                                            fontSize: '14px'
                                                        }}
                                                    >
                                                        <option value="" disabled>Select Skills Program Title</option>
                                                        <option value="wholesale_retail_operations_level_2">Visual Merchandiser: NQF 3: VS3/00254 </option>
                                                    </select>
                                                </div>
                                            </div>
                                        )}
                                        <div className="form-row" style={{
                                            display: 'grid',
                                            gridTemplateColumns: '1fr',
                                            gap: '20px',
                                            marginBottom: '20px'
                                        }}>
                                            <div className="form-group" style={{
                                                marginBottom: '20px'
                                            }}>
                                                <label style={{
                                                    display: 'block',
                                                    marginBottom: '8px',
                                                    fontWeight: '600',
                                                    color: '#333',
                                                    fontSize: '14px'
                                                }}>Unit Standards</label>
                                                <div className={`intervention-dropdown-container ${shouldDisableRedactedUnitStandards() ? 'disabled' : ''}`}>
                                                    <div 
                                                        className={`intervention-dropdown-trigger ${shouldDisableRedactedUnitStandards() ? 'disabled' : ''}`}
                                                        onClick={() => !shouldDisableRedactedUnitStandards() && setShowModulesDropdown(!showModulesDropdown)}
                                                    >
                                                        <span className={`intervention-placeholder ${redactedFormData.modulesDropdown ? 'has-selections' : ''} ${shouldDisableRedactedUnitStandards() ? 'disabled' : ''}`}>
                                                            {shouldDisableRedactedUnitStandards() 
                                                                ? 'Disabled for Learnership' 
                                                                : (redactedFormData.modulesDropdown 
                                                                    ? modulesOptions.find(module => module.value === redactedFormData.modulesDropdown)?.label || 'Select Modules'
                                                                    : 'Select Unit Standards'
                                                                )
                                                            }
                                                        </span>
                                                        <i className={`fas fa-chevron-down ${showModulesDropdown ? 'rotated' : ''} ${shouldDisableRedactedUnitStandards() ? 'disabled' : ''}`}></i>
                                                    </div>
                                                    {showModulesDropdown && !shouldDisableRedactedUnitStandards() && (
                                                        <div className="intervention-dropdown-options">
                                                            {modulesOptions.map((module) => (
                                                                <div 
                                                                    key={module.value} 
                                                                    className="intervention-option"
                                                                    onClick={() => handleRedactedModulesSelection(module.value, module.label)}
                                                                >
                                                                    <input
                                                                        type="radio"
                                                                        checked={redactedFormData.modulesDropdown === module.value}
                                                                        readOnly
                                                                    />
                                                                    <span>{module.label}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-row" style={{
                                            display: 'grid',
                                            gridTemplateColumns: '1fr',
                                            gap: '20px',
                                            marginBottom: '20px'
                                        }}>
                                            <div className="form-group" style={{
                                                marginBottom: '20px'
                                            }}>
                                                <label style={{
                                                    display: 'block',
                                                    marginBottom: '8px',
                                                    fontWeight: '600',
                                                    color: '#333',
                                                    fontSize: '14px'
                                                }}>Modules</label>
                                                <div className={`intervention-dropdown-container ${shouldDisableRedactedModules() ? 'disabled' : ''}`}>
                                                    <div 
                                                        className={`intervention-dropdown-trigger ${shouldDisableRedactedModules() ? 'disabled' : ''}`}
                                                        onClick={() => !shouldDisableRedactedModules() && setShowSeparateModulesDropdown(!showSeparateModulesDropdown)}
                                                    >
                                                        <span className={`intervention-placeholder ${redactedFormData.separateModules ? 'has-selections' : ''} ${shouldDisableRedactedModules() ? 'disabled' : ''}`}>
                                                            {shouldDisableRedactedModules() 
                                                                ? 'Disabled for Skills Programs' 
                                                                : (redactedFormData.separateModules 
                                                                    ? separateModulesOptions.find(module => module.value === redactedFormData.separateModules)?.label || 'Select Modules'
                                                                    : 'Select Modules'
                                                                )
                                                            }
                                                        </span>
                                                        <i className={`fas fa-chevron-down ${showSeparateModulesDropdown ? 'rotated' : ''} ${shouldDisableRedactedModules() ? 'disabled' : ''}`}></i>
                                                    </div>
                                                    {showSeparateModulesDropdown && !shouldDisableRedactedModules() && (
                                                        <div className="intervention-dropdown-options">
                                                            {separateModulesOptions.map((module) => (
                                                                <div 
                                                                    key={module.value} 
                                                                    className="intervention-option"
                                                                    onClick={() => handleRedactedSeparateModulesSelection(module.value, module.label)}
                                                                >
                                                                    <input
                                                                        type="radio"
                                                                        checked={redactedFormData.separateModules === module.value}
                                                                        readOnly
                                                                    />
                                                                    <span>{module.label}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Financial & Learners Section */}
                                    <div className="form-section" style={{
                                        marginBottom: '30px',
                                        padding: '20px',
                                        backgroundColor: '#f8f9fa',
                                        borderRadius: '8px',
                                        border: '1px solid #e0e0e0'
                                    }}>
                                        <h3 className="section-title" style={{
                                            color: '#006400',
                                            fontSize: '18px',
                                            fontWeight: 'bold',
                                            marginBottom: '20px',
                                            paddingBottom: '10px',
                                            borderBottom: '2px solid #006400'
                                        }}>Financial & Learners</h3>
                                        <div className="form-row" style={{
                                            display: 'grid',
                                            gridTemplateColumns: '1fr 1fr',
                                            gap: '20px',
                                            marginBottom: '20px'
                                        }}>
                                            <div className="form-group" style={{
                                                marginBottom: '20px'
                                            }}>
                                                <label style={{
                                                    display: 'block',
                                                    marginBottom: '8px',
                                                    fontWeight: '600',
                                                    color: '#333',
                                                    fontSize: '14px'
                                                }}>Cost per Learner (R) *</label>
                                                <div className="cost-dropdown-container">
                                                    <input 
                                                        type="number" 
                                                        name="costPerLearner" 
                                                        value={redactedFormData.costPerLearner}
                                                        onChange={handleRedactedInputChange}
                                                        placeholder={redactedFormData.selectedCostIntervention ? 
                                                            `Cost for ${redactedFormData.selectedInterventions.find(i => i.value === redactedFormData.selectedCostIntervention)?.label || 'selected intervention'}` : 
                                                            'Select intervention and enter cost'
                                                        }
                                                        min="0"
                                                        step="0.01"
                                                        readOnly
                                                        onClick={() => {
                                                            const costOptions = getCostOptions(redactedFormData.selectedInterventions);
                                                            if (costOptions.length > 0) {
                                                                setShowCostDropdown(!showCostDropdown);
                                                            } else {
                                                                alert('Please select interventions first to set costs.');
                                                            }
                                                        }}
                                                    />
                                                    {showCostDropdown && (
                                                        <div className="cost-dropdown-options">
                                                            {getCostOptions(redactedFormData.selectedInterventions).length > 0 ? (
                                                                getCostOptions(redactedFormData.selectedInterventions).map((option) => (
                                                                    <div 
                                                                        key={option.interventionValue} 
                                                                        className="cost-option"
                                                                        onClick={() => handleInterventionCostChange(option.interventionValue, option.cost || '')}
                                                                    >
                                                                        <span className="cost-label">{option.label}</span>
                                                                        <span className="cost-value">
                                                                            {option.cost ? `R ${option.cost}` : 'Click to set cost'}
                                                                        </span>
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <div className="cost-option no-interventions">
                                                                    <span>No interventions selected</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="form-group" style={{
                                                marginBottom: '20px'
                                            }}>
                                                <label style={{
                                                    display: 'block',
                                                    marginBottom: '8px',
                                                    fontWeight: '600',
                                                    color: '#333',
                                                    fontSize: '14px'
                                                }}>Number of Learners *</label>
                                                <div className="learners-dropdown-container">
                                                    <input 
                                                        type="number" 
                                                        name="numberOfLearners" 
                                                        value={redactedFormData.numberOfLearners}
                                                        onChange={handleRedactedInputChange}
                                                        placeholder={redactedFormData.selectedLearnersIntervention ? 
                                                            `Learners for ${redactedFormData.selectedInterventions.find(i => i.value === redactedFormData.selectedLearnersIntervention)?.label || 'selected intervention'}` : 
                                                            'Select intervention and enter learners'
                                                        }
                                                        min="1"
                                                        required
                                                        readOnly
                                                        onClick={() => {
                                                            const learnersOptions = getLearnersOptions(redactedFormData.selectedInterventions);
                                                            if (learnersOptions.length > 0) {
                                                                setShowLearnersDropdown(!showLearnersDropdown);
                                                            } else {
                                                                alert('Please select interventions first to set learners.');
                                                            }
                                                        }}
                                                    />
                                                    {showLearnersDropdown && (
                                                        <div className="learners-dropdown-options">
                                                            {getLearnersOptions(redactedFormData.selectedInterventions).length > 0 ? (
                                                                getLearnersOptions(redactedFormData.selectedInterventions).map((option) => (
                                                                    <div 
                                                                        key={option.interventionValue} 
                                                                        className="learners-option"
                                                                        onClick={() => handleInterventionLearnersChange(option.interventionValue, option.learners || '')}
                                                                    >
                                                                        <span className="learners-label">{option.label}</span>
                                                                        <span className="learners-value">
                                                                            {option.learners ? `${option.learners} learners` : 'Click to set learners'}
                                                                        </span>
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <div className="learners-option no-interventions">
                                                                    <span>No interventions selected</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Accreditation Details Section */}
                                    <div className="form-section" style={{
                                        marginBottom: '30px',
                                        padding: '20px',
                                        backgroundColor: '#f8f9fa',
                                        borderRadius: '8px',
                                        border: '1px solid #e0e0e0'
                                    }}>
                                        <h3 className="section-title" style={{
                                            color: '#006400',
                                            fontSize: '18px',
                                            fontWeight: 'bold',
                                            marginBottom: '20px',
                                            paddingBottom: '10px',
                                            borderBottom: '2px solid #006400'
                                        }}>Accreditation Details</h3>
                                        <div className="form-row" style={{
                                            display: 'grid',
                                            gridTemplateColumns: '1fr 1fr',
                                            gap: '20px',
                                            marginBottom: '20px'
                                        }}>
                                            <div className="form-group" style={{
                                                marginBottom: '20px'
                                            }}>
                                                <label style={{
                                                    display: 'block',
                                                    marginBottom: '8px',
                                                    fontWeight: '600',
                                                    color: '#333',
                                                    fontSize: '14px'
                                                }}>Accrediting Body</label>
                                                <select 
                                                    name="accreditingBody" 
                                                    value={redactedFormData.accreditingBody}
                                                    onChange={handleRedactedInputChange}
                                                    style={{
                                                        width: '100%',
                                                        padding: '10px',
                                                        border: '1px solid #ddd',
                                                        borderRadius: '4px',
                                                        fontSize: '14px'
                                                    }}
                                                >
                                                    <option value="QCTO">QCTO</option>
                                                    <option value="W&R SETA">W&R SETA</option>
                                                </select>
                                            </div>
                                            <div className="form-group" style={{
                                                marginBottom: '20px'
                                            }}>
                                                <label style={{
                                                    display: 'block',
                                                    marginBottom: '8px',
                                                    fontWeight: '600',
                                                    color: '#333',
                                                    fontSize: '14px'
                                                }}>Accreditation Number</label>
                                                <select 
                                                    name="accreditationNumber" 
                                                    value={redactedFormData.accreditationNumber}
                                                    onChange={handleRedactedInputChange}
                                                    style={{
                                                        width: '100%',
                                                        padding: '10px',
                                                        border: '1px solid #ddd',
                                                        borderRadius: '4px',
                                                        fontSize: '14px'
                                                    }}
                                                >
                                                    <option value="">Select accreditation number</option>
                                                    <option value="05-W&R">861</option>
                                                    <option value="05-QCTO/SDP010524113839">05-QCTO/SDP010524113839</option>
                                                    <option value="05-QCTO/SDP040325132739">05-QCTO/SDP040325132739</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Qualifications</label>
                                                <select 
                                                    name="qualifications" 
                                                    value={redactedFormData.qualifications}
                                                    onChange={handleRedactedInputChange}
                                                    disabled={!redactedFormData.accreditationNumber}
                                                >
                                                    <option value="" disabled>
                                                        {redactedFormData.accreditationNumber 
                                                            ? 'Select qualifications' 
                                                            : 'Select accreditation number first'
                                                        }
                                                    </option>
                                                    {redactedFormData.accreditationNumber && qualificationsData[redactedFormData.accreditationNumber]?.map((qual, index) => (
                                                        <option key={index} value={qual.name}>{qual.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label>NQF Level</label>
                                                <input 
                                                    type="text" 
                                                    name="nqfLevel" 
                                                    value={redactedFormData.nqfLevel}
                                                    onChange={handleRedactedInputChange}
                                                    readOnly
                                                    style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
                                                    placeholder="Auto-filled based on qualification"
                                                />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>OFO Code</label>
                                                <input 
                                                    type="text" 
                                                    name="ofoNumber" 
                                                    value={redactedFormData.ofoNumber}
                                                    onChange={handleRedactedInputChange}
                                                    readOnly
                                                    style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
                                                    placeholder="Auto-filled based on NQF Level"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Modules</label>
                                                <input 
                                                    type="text" 
                                                    name="accreditationModules" 
                                                    value={redactedFormData.accreditationModules}
                                                    onChange={handleRedactedInputChange}
                                                    placeholder="Enter modules for accreditation"
                                                />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Credits</label>
                                                <input 
                                                    type="text" 
                                                    name="accreditationCredits" 
                                                    value={redactedFormData.accreditationCredits}
                                                    onChange={handleRedactedInputChange}
                                                    placeholder="Enter credits for accreditation"
                                                />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Issued By</label>
                                                <input 
                                                    type="date" 
                                                    name="issuedBy" 
                                                    value={redactedFormData.issuedBy}
                                                    onChange={handleRedactedInputChange}
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Expires</label>
                                                <input 
                                                    type="date" 
                                                    name="expires" 
                                                    value={redactedFormData.expires}
                                                    onChange={handleRedactedInputChange}
                                                    readOnly
                                                    style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Duration</label>
                                                <input 
                                                    type="text" 
                                                    name="duration" 
                                                    value={redactedFormData.duration}
                                                    onChange={handleRedactedInputChange}
                                                    readOnly
                                                    style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Dynamic fields that appear when Skills Program Title is selected */}
                                    {redactedFormData.skillsProgramType && (
                                        <div className="form-row">
                                            {redactedFormData.skillsProgramType === 'visual_merchandiser_level_3' ? (
                                                <div className="form-group">
                                                    <label>Unit Standards</label>
                                                    <input 
                                                        type="text" 
                                                        name="unitStandards" 
                                                        value={shouldDisableRedactedUnitStandards() ? 'Disabled for Learnership' : redactedFormData.unitStandards}
                                                        onChange={handleRedactedInputChange}
                                                        readOnly
                                                        style={{ 
                                                            backgroundColor: shouldDisableRedactedUnitStandards() ? '#f8f9fa' : '#ffffff', 
                                                            cursor: shouldDisableRedactedUnitStandards() ? 'not-allowed' : 'text',
                                                            color: shouldDisableRedactedUnitStandards() ? '#6c757d' : '#000000',
                                                            fontStyle: shouldDisableRedactedUnitStandards() ? 'italic' : 'normal'
                                                        }}
                                                    />
                                                </div>
                                            ) : (
                                                <div className="form-group">
                                                    <label>Modules</label>
                                                    <input 
                                                        type="text" 
                                                        name="modules" 
                                                        value={shouldDisableRedactedModules() ? 'Disabled for Skills Programs' : redactedFormData.modules}
                                                        onChange={handleRedactedInputChange}
                                                        readOnly
                                                        style={{ 
                                                            backgroundColor: !shouldEnableRedactedModules() ? '#f8f9fa' : '#ffffff', 
                                                            cursor: !shouldEnableRedactedModules() ? 'not-allowed' : 'text',
                                                            color: !shouldEnableRedactedModules() ? '#6c757d' : '#000000',
                                                            fontStyle: !shouldEnableRedactedModules() ? 'italic' : 'normal'
                                                        }}
                                                    />
                                                </div>
                                            )}
                                            <div className="form-group">
                                                <label>Credits</label>
                                                <input 
                                                    type="text" 
                                                    name="credits" 
                                                    value={redactedFormData.credits}
                                                    onChange={handleRedactedInputChange}
                                                    readOnly
                                                    style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
                                                />
                                            </div>
                                        </div>
                                    )}

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
                                onClick={closeRedactedModal}
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

                            <button 
                                type="submit" 
                                className="btn primary" 
                                form="redacted-form"
                                style={{
                                    background: '#006400',
                                    color: 'white',
                                    border: 'none',
                                    padding: '8px 16px',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '14px'
                                }}
                            >
                                {currentProject?.isRedacted ? 'Unredact' : 'Redact'} Project
                            </button>
                        </div>
                    </div>
                </div>
            )}
            </div>
        </>
    );

    return (
        <HubSpotLayout 
            title="Project Management" 
            description="Manage projects, track progress, and deliver results"
        >
            {pageContent}
        </HubSpotLayout>
    );
};

export default ProjectManagement; 