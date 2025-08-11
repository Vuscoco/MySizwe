import React, { useState, useEffect } from 'react';
// Assuming HubSpotLayout is provided externally and correctly handles global layout
import HubSpotLayout from '../components/HubSpotLayout';
// Importing the global layout CSS, as specified by your project structure
import '../css/global-layout.css';
// Importing the Timetable specific CSS for styling the calendar and other elements
import '../css/Timetable.css';

const Timetable = () => {
    // State for the currently displayed date in the calendar
    const [selectedDate, setSelectedDate] = useState(new Date());
    // State to control the visibility of the booking modal
    const [showBookingModal, setShowBookingModal] = useState(false);
    // State to store all bookings. In a real application, this would likely come from a backend.
    const [bookings, setBookings] = useState([]);
    
    // Load agenda events from localStorage on component mount
    useEffect(() => {
        const agendaEvents = JSON.parse(localStorage.getItem('agendaEvents') || '[]');
        setBookings(prevBookings => [...prevBookings, ...agendaEvents]);
    }, []);
    // State for the new booking form data
    const [bookingForm, setBookingForm] = useState({
        title: '',
        description: '',
        facilitator: '',
        client: '',
        duration: 60, // default to 1 hour
        type: 'training', // default type
        date: selectedDate, // date for the new booking, initialized with the current selected date
    });

    // Public holidays data (you can expand this list)
    const publicHolidays = [
        // New Year's Day
        { date: '2024-01-01', name: 'New Year\'s Day' },
        { date: '2025-01-01', name: 'New Year\'s Day' },
        { date: '2026-01-01', name: 'New Year\'s Day' },
        
        // Human Rights Day (March 21)
        { date: '2024-03-21', name: 'Human Rights Day' },
        { date: '2025-03-21', name: 'Human Rights Day' },
        { date: '2026-03-21', name: 'Human Rights Day' },
        
        // Good Friday (varies each year - simplified for 2024-2026)
        { date: '2024-03-29', name: 'Good Friday' },
        { date: '2025-04-18', name: 'Good Friday' },
        { date: '2026-04-03', name: 'Good Friday' },
        
        // Family Day (Easter Monday - varies each year)
        { date: '2024-04-01', name: 'Family Day' },
        { date: '2025-04-21', name: 'Family Day' },
        { date: '2026-04-06', name: 'Family Day' },
        
        // Freedom Day (April 27)
        { date: '2024-04-27', name: 'Freedom Day' },
        { date: '2025-04-27', name: 'Freedom Day' },
        { date: '2026-04-27', name: 'Freedom Day' },
        
        // Workers' Day (May 1)
        { date: '2024-05-01', name: 'Workers\' Day' },
        { date: '2025-05-01', name: 'Workers\' Day' },
        { date: '2026-05-01', name: 'Workers\' Day' },
        
        // Youth Day (June 16)
        { date: '2024-06-16', name: 'Youth Day' },
        { date: '2025-06-16', name: 'Youth Day' },
        { date: '2026-06-16', name: 'Youth Day' },
        
        // National Women's Day (August 9)
        { date: '2024-08-09', name: 'National Women\'s Day' },
        { date: '2025-08-09', name: 'National Women\'s Day' },
        { date: '2026-08-09', name: 'National Women\'s Day' },
        
        // Heritage Day (September 24)
        { date: '2024-09-24', name: 'Heritage Day' },
        { date: '2025-09-24', name: 'Heritage Day' },
        { date: '2026-09-24', name: 'Heritage Day' },
        
        // Day of Reconciliation (December 16)
        { date: '2024-12-16', name: 'Day of Reconciliation' },
        { date: '2025-12-16', name: 'Day of Reconciliation' },
        { date: '2026-12-16', name: 'Day of Reconciliation' },
        
        // Christmas Day (December 25)
        { date: '2024-12-25', name: 'Christmas Day' },
        { date: '2025-12-25', name: 'Christmas Day' },
        { date: '2026-12-25', name: 'Christmas Day' },
        
        // Day of Goodwill (December 26)
        { date: '2024-12-26', name: 'Day of Goodwill' },
        { date: '2025-12-26', name: 'Day of Goodwill' },
        { date: '2026-12-26', name: 'Day of Goodwill' },
    ];

    // Effect to update the booking form's date when selectedDate changes
    // This ensures that when a user clicks a new date on the calendar, the modal pre-fills with that date.
    useEffect(() => {
        setBookingForm(prev => ({ ...prev, date: selectedDate }));
    }, [selectedDate]);

    /**
     * Generates an array of day objects for the current month view.
     * It includes days from the previous and next months to fill out a complete 6-row calendar grid (42 cells).
     * This ensures the calendar always looks consistent.
     * @param {Date} date - The date for the month to generate days for (e.g., new Date() for current month).
     * @returns {Array<Object>} An array of day objects, each containing:
     * - date: The Date object for that day.
     * - isCurrentMonth: A boolean indicating if the day belongs to the currently displayed month.
     */
    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);

        // Calculate the day of the week for the first day (0 for Sunday, 6 for Saturday)
        const startDayOfWeek = firstDayOfMonth.getDay();

        const days = [];

        // Add days from the previous month to fill the leading empty cells of the first week
        for (let i = startDayOfWeek - 1; i >= 0; i--) {
            const prevMonthDay = new Date(year, month - 1, new Date(year, month, 0).getDate() - i);
            days.push({ date: prevMonthDay, isCurrentMonth: false });
        }

        // Add days of the current month
        for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
            const currentMonthDay = new Date(year, month, i);
            days.push({ date: currentMonthDay, isCurrentMonth: true });
        }

        // Add days from the next month to fill the trailing empty cells, ensuring 42 total cells
        const totalCells = days.length;
        const remainingCells = 42 - totalCells; // A full calendar grid is 6 rows * 7 days = 42 cells
        for (let i = 1; i <= remainingCells; i++) {
            const nextMonthDay = new Date(year, month + 1, i);
            days.push({ date: nextMonthDay, isCurrentMonth: false });
        }

        return days;
    };

    /**
     * Navigates the calendar view to the previous or next month.
     * @param {number} offset - -1 for previous month, 1 for next month.
     */
    const navigateMonth = (offset) => {
        setSelectedDate(prevDate => {
            const newDate = new Date(prevDate);
            newDate.setMonth(prevDate.getMonth() + offset);
            return newDate;
        });
    };

    /**
     * Handles a click event on a specific date in the calendar grid.
     * Updates the `selectedDate` state and the `date` in the `bookingForm` state.
     * @param {Date} date - The Date object corresponding to the clicked calendar day.
     */
    const handleDateClick = (date) => {
        setSelectedDate(date);
        setBookingForm(prev => ({ ...prev, date: date }));
    };

    /**
     * Retrieves bookings that fall on a specific date.
     * @param {Date} date - The date to filter bookings by.
     * @returns {Array<Object>} An array of booking objects for the given date.
     */
    const getBookingsForDate = (date) => {
        return bookings.filter(booking =>
            booking.date.toDateString() === date.toDateString()
        );
    };

    /**
     * Checks if a date is a public holiday.
     * @param {Date} date - The date to check.
     * @returns {Object|null} Holiday object if it's a holiday, null otherwise.
     */
    const getHolidayForDate = (date) => {
        const dateString = date.toISOString().split('T')[0]; // Format: YYYY-MM-DD
        return publicHolidays.find(holiday => holiday.date === dateString) || null;
    };



    /**
     * Handles the submission of the new booking form.
     * Adds the new booking to the `bookings` array and closes the modal.
     * Resets the form fields for the next entry.
     * @param {Event} e - The form submission event.
     */
    const handleBookingSubmit = (e) => {
        e.preventDefault(); // Prevent default form submission behavior (page reload)
        // Add the new booking to the state, assigning a unique ID
        setBookings(prevBookings => [...prevBookings, { ...bookingForm, id: Date.now() }]);
        setShowBookingModal(false); // Close the modal after submission
        // Reset form fields to their initial state for a new booking
        setBookingForm({
            title: '',
            description: '',
            facilitator: '',
            client: '',
            duration: 60,
            type: 'training',
            date: selectedDate, // Keep the selected date for convenience
        });
    };

    // The main content of the Timetable component
    const pageContent = (
        <>
            {/* Top Bar Section */}
            {/* This section is now empty after removing breadcrumb and settings */}
            <div className="top-bar">
            </div>

            {/* Header Section */}
            {/* Main title for the timetable page, styled by Timetable.css */}
            <h1 className="program-title">Timetable</h1>

            {/* Calendar Container */}
            {/* This div wraps the entire calendar UI, styled by Timetable.css */}
            <div className="calendar-container">
                {/* Calendar Section - Left Side */}
                <div className="calendar-section">
                    {/* Calendar Header: Month navigation and display */}
                    <div className="calendar-header">
                        <button
                            onClick={() => navigateMonth(-1)}
                            className="nav-button"
                            aria-label="Previous Month"
                        >
                            {/* SVG icon for previous month */}
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <div className="calendar-title-section">
                            <h2 className="month-title">
                                {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </h2>
                        </div>
                        <button
                            onClick={() => navigateMonth(1)}
                            className="nav-button"
                            aria-label="Next Month"
                        >
                            {/* SVG icon for next month */}
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>

                    {/* Calendar Grid: Days of the week headers and individual day cells */}
                    <div className="calendar-grid">
                        {/* Day Headers */}
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="day-header">{day}</div>
                        ))}
                        
                        {/* Calendar Days */}
                        {getDaysInMonth(selectedDate).map((day, index) => {
                            const holiday = getHolidayForDate(day.date);
                            return (
                                <div
                                    key={index}
                                    className={`calendar-day ${!day.isCurrentMonth ? 'other-month' : ''} ${day.date.toDateString() === new Date().toDateString() ? 'today' : ''} ${selectedDate.toDateString() === day.date.toDateString() && day.isCurrentMonth ? 'selected' : ''} ${holiday ? 'holiday' : ''}`}
                                    onClick={() => handleDateClick(day.date)}
                                    title={holiday ? holiday.name : ''}
                                >
                                    <div className="day-content">
                                        <span className="day-number">{day.date.getDate()}</span>
                                        {holiday && (
                                            <div className="holiday-indicator" title={holiday.name}>
                                                🎉
                                            </div>
                                        )}
                                        {getBookingsForDate(day.date).length > 0 && (
                                            <div className="booking-indicator">
                                                {getBookingsForDate(day.date).some(booking => booking.type === 'agenda') && (
                                                    <div className="agenda-indicator" title="Agenda Event">📋</div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Selected Date Info & Add Booking Button */}
                    {/* This section displays info about the selected date and a button to add bookings */}
                    <div className="calendar-footer">
                        <div className="selected-date-info">
                            <h3 className="selected-date-title">
                                Selected Date: {selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </h3>
                            <p className="booking-count">
                                Bookings: {getBookingsForDate(selectedDate).length}
                            </p>
                        </div>
                        <button
                            className="add-booking-btn"
                            onClick={() => setShowBookingModal(true)}
                        >
                            {/* SVG icon for adding a booking */}
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Add Booking
                        </button>
                    </div>
                </div>

                {/* Summary Panel - Right Side */}
                <div className="summary-panel">
                    <div className="summary-header">
                        <h3 className="summary-title">Daily Summary</h3>
                        <span className="summary-date">{selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                    </div>
                    
                    <div className="summary-content">
                        {getBookingsForDate(selectedDate).length === 0 ? (
                            <div className="no-bookings">
                                <div className="no-bookings-icon">📅</div>
                                <p>No bookings scheduled for this date</p>
                                <button 
                                    className="quick-add-btn"
                                    onClick={() => setShowBookingModal(true)}
                                >
                                    Add First Booking
                                </button>
                            </div>
                        ) : (
                            <div className="bookings-list">
                                {getBookingsForDate(selectedDate).map((booking, index) => (
                                    <div key={booking.id || index} className={`booking-card ${booking.type === 'agenda' ? 'agenda-event' : ''}`}>
                                        <div className="booking-header">
                                            <h4 className="booking-title">{booking.title}</h4>
                                            <span className={`booking-type ${booking.type}`}>{booking.type}</span>
                                        </div>
                                        <div className="booking-details">
                                            <div className="booking-info">
                                                <span className="info-label">Time:</span>
                                                <span className="info-value">{booking.duration} min</span>
                                            </div>
                                            <div className="booking-info">
                                                <span className="info-label">Facilitator:</span>
                                                <span className="info-value">{booking.facilitator}</span>
                                            </div>
                                            <div className="booking-info">
                                                <span className="info-label">Client:</span>
                                                <span className="info-value">{booking.client}</span>
                                            </div>
                                            {booking.description && (
                                                <div className="booking-description">
                                                    <span className="info-label">Description:</span>
                                                    <p className="description-text">{booking.description}</p>
                                                </div>
                                            )}
                                            {booking.type === 'agenda' && booking.agendaData && (
                                                <div className="agenda-progress">
                                                    <span className="agenda-status">Progress: {booking.agendaData.progress}%</span>
                                                    <div className="agenda-progress-bar">
                                                        <div 
                                                            className="agenda-progress-fill" 
                                                            style={{ width: `${booking.agendaData.progress}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="agenda-status">{booking.agendaData.status}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="summary-footer">
                        <div className="summary-stats">
                            <div className="stat-item">
                                <span className="stat-label">Total Bookings</span>
                                <span className="stat-value">{getBookingsForDate(selectedDate).length}</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">Total Hours</span>
                                <span className="stat-value">
                                    {getBookingsForDate(selectedDate).reduce((total, booking) => total + (booking.duration / 60), 0).toFixed(1)}h
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Booking Modal */}
            {/* This modal appears when "Add Booking" is clicked, allowing users to create new bookings */}
            {showBookingModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        {/* Modal Header */}
                        <div className="modal-header">
                            <h3 className="modal-title">New Booking for {selectedDate.toLocaleDateString()}</h3>
                            <button
                                onClick={() => setShowBookingModal(false)}
                                className="close-btn"
                                aria-label="Close modal"
                            >
                                {/* SVG icon for closing the modal */}
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Booking Form */}
                        <form onSubmit={handleBookingSubmit} className="booking-form">
                            <div className="form-group">
                                <label htmlFor="title" className="form-label">Title</label>
                                <input
                                    type="text"
                                    id="title"
                                    value={bookingForm.title}
                                    onChange={(e) => setBookingForm(prev => ({ ...prev, title: e.target.value }))}
                                    className="form-input"
                                    placeholder="e.g., Project Kick-off"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="description" className="form-label">Description</label>
                                <textarea
                                    id="description"
                                    value={bookingForm.description}
                                    onChange={(e) => setBookingForm(prev => ({ ...prev, description: e.target.value }))}
                                    className="form-textarea"
                                    placeholder="Brief description of the booking"
                                    required
                                ></textarea>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="facilitator" className="form-label">Facilitator</label>
                                    <input
                                        type="text"
                                        id="facilitator"
                                        value={bookingForm.facilitator}
                                        onChange={(e) => setBookingForm(prev => ({ ...prev, facilitator: e.target.value }))}
                                        className="form-input"
                                        placeholder="e.g., John Doe"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="client" className="form-label">Client</label>
                                    <input
                                        type="text"
                                        id="client"
                                        value={bookingForm.client}
                                        onChange={(e) => setBookingForm(prev => ({ ...prev, client: e.target.value }))}
                                        className="form-input"
                                        placeholder="e.g., Acme Corp"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="duration" className="form-label">Duration</label>
                                    <select
                                        id="duration"
                                        value={bookingForm.duration}
                                        onChange={(e) => setBookingForm(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                                        className="form-select"
                                    >
                                        <option value={30}>30 minutes</option>
                                        <option value={60}>1 hour</option>
                                        <option value={90}>1.5 hours</option>
                                        <option value={120}>2 hours</option>
                                        <option value={180}>3 hours</option>
                                        <option value={240}>4 hours</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="type" className="form-label">Type</label>
                                    <select
                                        id="type"
                                        value={bookingForm.type}
                                        onChange={(e) => setBookingForm(prev => ({ ...prev, type: e.target.value }))}
                                        className="form-select"
                                    >
                                        <option value="training">Training</option>
                                        <option value="meeting">Meeting</option>
                                        <option value="consultation">Consultation</option>
                                        <option value="assessment">Assessment</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-actions">
                                <button
                                    type="button"
                                    onClick={() => setShowBookingModal(false)}
                                    className="btn-secondary"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn-primary"
                                >
                                    Create Booking
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );

    // The Timetable component is wrapped by HubSpotLayout, which is assumed to handle global styling.
    return (
        <HubSpotLayout
            title="Timetable"
            description="Manage bookings, schedules, and trench deadlines"
        >
            {pageContent}
        </HubSpotLayout>
    );
};

export default Timetable; 