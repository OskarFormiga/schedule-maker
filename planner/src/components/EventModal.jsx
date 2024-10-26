import { useState } from 'react';
import '../App.css';
import { checkAvailability } from '../logic/logic';
import ColorPicker from './ColorPicker';

const EventModal = ({ selectedEvent, setNewEvents, onCloseModal, events, configuration }) => {
    const { adjustedStartTime, adjustedEndTime } = configuration
    const [eventConfig, setEventConfig] = useState(selectedEvent ? selectedEvent : {
        title: '',
        notes: '',
        days: {
            'M': { selected: false, startTime: '', endTime: '' },
            'T': { selected: false, startTime: '', endTime: '' },
            'W': { selected: false, startTime: '', endTime: '' },
            'R': { selected: false, startTime: '', endTime: '' },
            'F': { selected: false, startTime: '', endTime: '' },
            'S': { selected: false, startTime: '', endTime: '' },
            'U': { selected: false, startTime: '', endTime: '' },
        },
        useDifferentTimes: false,
        commonStartTime: '',
        commonEndTime: '',
        color: "rgba(245, 166, 35, 1)",
    });

    const [errors, setErrors] = useState({
        title: false,
        color: false,
        days: false,
        commonStartTime: false,
        commonEndTime: false,
        differentTime: {},
        timeError: false,
    });

    const handleDaySelection = (e) => {
        const { name, checked } = e.target;
        setEventConfig((prevConfig) => ({
            ...prevConfig,
            days: {
                ...prevConfig.days,
                [name]: { ...prevConfig.days[name], selected: checked, startTime: '', endTime: '' },
            }
        }));
    };

    const handleUseDifferentTimes = () => {
        setEventConfig((prevConfig) => ({
            ...prevConfig,
            useDifferentTimes: !prevConfig.useDifferentTimes
        }));
    };

    const handleStartTimeChange = (e, day) => {
        const { value } = e.target;
        setEventConfig((prevConfig) => ({
            ...prevConfig,
            days: {
                ...prevConfig.days,
                [day]: { ...prevConfig.days[day], startTime: value }
            }
        }));
    };

    const handleEndTimeChange = (e, day) => {
        const { value } = e.target;
        setEventConfig((prevConfig) => ({
            ...prevConfig,
            days: {
                ...prevConfig.days,
                [day]: { ...prevConfig.days[day], endTime: value }
            }
        }));
    };

    const handleColorChange = (color) => {
        setEventConfig((prevConfig) => ({
            ...prevConfig,
            color: `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const newErrors = {
            title: false,
            color: false,
            days: false,
            commonStartTime: false,
            commonEndTime: false,
            differentTime: {},
            timeError: false,
        };

        let hasError = false;

        if (!eventConfig.title) {
            newErrors.title = true;
            hasError = true;
        }

        if (!eventConfig.color) {
            newErrors.color = true;
            hasError = true;
        }

        const daysSelected = Object.values(eventConfig.days).some(day => day.selected);
        if (!daysSelected) {
            newErrors.days = true;
            hasError = true;
        }

        let newEvent;

        const validateTimeRange = (eventStartTime, eventEndTime) => {
            const endTimeWithBuffer = addOneHour(adjustedEndTime);
            return eventStartTime >= adjustedStartTime && eventEndTime <= endTimeWithBuffer;
        };

        const addOneHour = (time) => {
            const [hours, minutes] = time.split(':').map(Number);
            let newMinutes = minutes + 59;

            if (newMinutes >= 60) {
                newMinutes = newMinutes % 60;
            }

            return `${hours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
        };

        if (eventConfig.useDifferentTimes) {
            for (const day of Object.keys(eventConfig.days)) {
                if (eventConfig.days[day].selected) {
                    const { startTime, endTime } = eventConfig.days[day];
                    if (!startTime || !endTime) {
                        newErrors.differentTime[day] = true;
                        hasError = true;
                    } else if (!validateTimeRange(startTime, endTime)) {
                        alert(`Las horas del evento el día ${day} deben estar entre ${adjustedStartTime} y ${adjustedEndTime}.`);
                        setErrors(newErrors);
                        return;
                    }

                    if (startTime >= endTime) {
                        newErrors.timeError = true;
                        newErrors.differentTime[day] = true;
                        hasError = true;
                    }
                }
            }
        } else {
            const { commonStartTime, commonEndTime } = eventConfig;
            if (!commonStartTime || !commonEndTime) {
                newErrors.commonStartTime = true;
                newErrors.commonEndTime = true;
                hasError = true;
            } else if (!validateTimeRange(commonStartTime, commonEndTime)) {
                alert(`Las horas del evento deben estar entre ${adjustedStartTime} y ${adjustedEndTime}.`);
                setErrors(newErrors);
                return;
            }

            if (commonStartTime >= commonEndTime) {
                newErrors.timeError = true;
                newErrors.commonStartTime = true;
                newErrors.commonEndTime = true;
                hasError = true;
            }

            if (!hasError) {
                for (const day of Object.keys(eventConfig.days)) {
                    if (eventConfig.days[day].selected) {
                        eventConfig.days[day].startTime = commonStartTime;
                        eventConfig.days[day].endTime = commonEndTime;
                    }
                }
            }
        }

        if (!hasError) {
            newEvent = {
                ...eventConfig,
                id: Date.now(),
            };
        }

        if (newErrors.title || newErrors.color || newErrors.days || newErrors.commonStartTime || newErrors.commonEndTime || newErrors.timeError) {
            setErrors(newErrors);
            alert("Por favor, corrige los errores en el formulario.");
            return;
        }

        if (!hasError && !checkAvailability(events, newEvent, selectedEvent)) {
            alert("El evento ya existe en la franja horaria para uno o más días seleccionados.");
            return;
        }

        cleanForm();
        setNewEvents([...events.filter((event) => event.id !== selectedEvent?.id), newEvent]);
    };


    const onDeleteEventHandler = () => {
        cleanForm();
        setNewEvents([...events.filter((event) => event.id !== selectedEvent?.id)]);
    };

    const cleanForm = () => {
        setEventConfig({
            title: '',
            notes: '',
            days: {
                'M': { selected: false, startTime: '', endTime: '' },
                'T': { selected: false, startTime: '', endTime: '' },
                'W': { selected: false, startTime: '', endTime: '' },
                'R': { selected: false, startTime: '', endTime: '' },
                'F': { selected: false, startTime: '', endTime: '' },
                'S': { selected: false, startTime: '', endTime: '' },
                'U': { selected: false, startTime: '', endTime: '' },
            },
            useDifferentTimes: false,
            commonStartTime: '',
            commonEndTime: '',
            color: "rgba(245, 166, 35, 1)",
        });
        setErrors({
            title: false,
            color: false,
            days: false,
            commonStartTime: false,
            commonEndTime: false,
            differentTime: {}
        });
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onCloseModal}>&times;</span>
                <h2 className="modal-title">{selectedEvent ? "Actualizar Evento" : "Nuevo Evento"}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="titleSection">
                        <label className="modalLabel">Título</label>
                        <div className='titleColorContainer'>
                            <input
                                type="text"
                                value={eventConfig.title}
                                onChange={(e) => setEventConfig((prevConfig) => ({ ...prevConfig, title: e.target.value }))}
                                style={{ borderColor: errors.title ? 'red' : '' }}
                            />
                            <ColorPicker
                                color={eventConfig.color}
                                onChangeComplete={handleColorChange}
                            />
                        </div>
                    </div>

                    <div className="checkboxSection">
                        <label className="modalLabel">
                            ¿Horas diferentes para cada día?
                        </label>
                        <input
                            type="checkbox"
                            checked={eventConfig.useDifferentTimes}
                            onChange={handleUseDifferentTimes}
                        />
                    </div>

                    <div className="section">
                        <div className="checkbox-container">
                            {['M', 'T', 'W', 'R', 'F', 'S', 'U'].map((day) => (
                                <label key={day} className="checkbox-input">
                                    <p style={{ color: errors.days ? 'red' : '' }}
                                    >{day}</p>
                                    <input
                                        type="checkbox"
                                        name={day}
                                        checked={eventConfig.days[day].selected}
                                        onChange={handleDaySelection}
                                    />
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="section">
                        {!eventConfig.useDifferentTimes && (
                            <>
                                <div className="input-container">
                                    <div className="time-input">
                                        <label className="modalLabel">Hora de Inicio</label>
                                        <input
                                            type="time"
                                            value={eventConfig.commonStartTime}
                                            onChange={(e) => setEventConfig((prevConfig) => ({ ...prevConfig, commonStartTime: e.target.value }))}
                                            style={{ borderColor: errors.commonStartTime ? 'red' : '' }}
                                        />
                                    </div>
                                    <div className="time-input">
                                        <label className="modalLabel">Hora de Fin</label>
                                        <input
                                            type="time"
                                            value={eventConfig.commonEndTime}
                                            onChange={(e) => setEventConfig((prevConfig) => ({ ...prevConfig, commonEndTime: e.target.value }))}
                                            style={{ borderColor: errors.commonEndTime ? 'red' : '' }}
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        {Object.keys(eventConfig.days).map((day) => {
                            const { selected } = eventConfig.days[day];
                            return (
                                selected && eventConfig.useDifferentTimes && (
                                    <div className='differentTimeContainer' key={day}>
                                        <h1>{day}</h1>
                                        <div className="time-input">
                                            <label className="modalLabel">Hora de Inicio:</label>
                                            <input
                                                type="time"
                                                value={eventConfig.days[day].startTime}
                                                onChange={(e) => handleStartTimeChange(e, day)}
                                                style={{ borderColor: errors.differentTime[day] ? 'red' : '' }}
                                            />
                                        </div>
                                        <div className="time-input">
                                            <label className="modalLabel">Hora de Fin:</label>
                                            <input
                                                type="time"
                                                value={eventConfig.days[day].endTime}
                                                onChange={(e) => handleEndTimeChange(e, day)}
                                                style={{ borderColor: errors.differentTime[day] ? 'red' : '' }}
                                            />
                                        </div>
                                    </div>
                                )
                            );
                        })}
                    </div>

                    <div className="notesSection">
                        <label className="modalLabel">Notas</label>
                        <textarea
                            value={eventConfig.notes}
                            onChange={(e) => setEventConfig((prevConfig) => ({ ...prevConfig, notes: e.target.value }))}
                            rows={4}
                        />
                    </div>

                    <div className="button-container">
                        <button type="submit" className="modal-button">{selectedEvent ? "Actualizar" : "Crear"}</button>
                        {selectedEvent && <button type="button" className="modal-button" onClick={onDeleteEventHandler}>Eliminar Evento</button>}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EventModal;
