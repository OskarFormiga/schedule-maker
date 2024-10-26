import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faAdd, faChevronUp, faChevronDown, faDownload, faCalendarWeek } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import './Header.css';

const Header = ({
    newSchedule,
    showEventModal,
    showSettingsModal,
    handleDownloadImage
}) => {
    const [isHeaderVisible, setIsHeaderVisible] = useState(true);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const handleNewScheduleClick = () => {
        setShowConfirmModal(true);
    };

    const confirmNewSchedule = () => {
        newSchedule();
        setShowConfirmModal(false);
    };

    const cancelNewSchedule = () => {
        setShowConfirmModal(false);
    };

    return (
        <div className={`header-container ${isHeaderVisible ? '' : 'hidden'}`}>
            <div className='headerButtons'>

                <button onClick={handleNewScheduleClick} className='headerButton'>
                    <FontAwesomeIcon icon={faCalendarWeek} className="headerIcon" />
                    <span className='buttonText'>New Schedule</span>
                </button>

                <button onClick={handleDownloadImage} className='headerButton'>
                    <FontAwesomeIcon icon={faDownload} className="headerIcon" />
                    <span className='buttonText'>Download</span>
                </button>

                <button onClick={showEventModal} className='headerButton'>
                    <FontAwesomeIcon icon={faAdd} className="headerIcon" />
                    <span className='buttonText'>New Event</span>
                </button>

                <button onClick={showSettingsModal} className='headerButton'>
                    <FontAwesomeIcon icon={faCog} className="headerIcon" />
                    <span className='buttonText'>Settings</span>
                </button>
            </div>

            <button onClick={() => setIsHeaderVisible(prev => !prev)} className='toggleButton'>
                <FontAwesomeIcon icon={isHeaderVisible ? faChevronUp : faChevronDown} />
            </button>

            {showConfirmModal && (
                <div className="modal2">
                    <div className="modal-content2">
                        <h3>Confirm New Schedule</h3>
                        <p>Are you sure you want to create a new schedule? This will delete the current schedule.</p>
                        <div className="modal-buttons2">
                            <button onClick={confirmNewSchedule} className="modal-confirm-button">Yes, create</button>
                            <button onClick={cancelNewSchedule} className="modal-cancel-button">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Header;
