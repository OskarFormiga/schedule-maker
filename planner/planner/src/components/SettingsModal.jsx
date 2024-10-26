import { useState } from 'react';
import './SettingsModal.css';
import FontSelector from './FontSelector';
import ColorPicker from './ColorPicker';
import { getSoftContrastingColor } from '../logic/logic';

const SettingsModal = ({ configuration, onSettingsModalSubmit, closeModal, onDeleteEvents, fonts }) => {
    const [adjustedStartTime, setTempStartTime] = useState(configuration.adjustedStartTime);
    const [adjustedEndTime, setTempEndTime] = useState(configuration.adjustedEndTime);
    const [calendarColor, setTempCalendarColor] = useState(configuration.calendarColor);
    const [columnsColor, setTempColumnsColor] = useState(configuration.columnsColor);
    const [rowsColor, setTempRowsColor] = useState(configuration.rowsColor);
    const [showRows, setTempShowRows] = useState(configuration.showRows);
    const [showColumns, setTempShowColumns] = useState(configuration.showColumns);
    const [showHours, setTempShowHours] = useState(configuration.showHours);
    const [calendarFont, setCalendarFont] = useState(configuration.calendarFont);
    const [showWarningModal, setShowWarningModal] = useState(false);

    const onSubmitHandlerSettings = (e) => {
        e.preventDefault();
        if (adjustedStartTime !== configuration.adjustedStartTime || adjustedEndTime !== configuration.adjustedEndTime) {
            setShowWarningModal(true);
        } else {
            handleSubmit();
        }
    };

    const handleSubmit = () => {
        onSettingsModalSubmit({
            adjustedStartTime,
            adjustedEndTime,
            calendarColor,
            columnsColor,
            rowsColor,
            showRows,
            showColumns,
            showHours,
            calendarFont,
            columnsTextColor: getSoftContrastingColor(columnsColor),
            rowsTextColor: getSoftContrastingColor(rowsColor),
        });
    };

    const handleConfirmDeleteEvents = () => {
        onDeleteEvents(adjustedStartTime, adjustedEndTime);
        handleSubmit();
        setShowWarningModal(false);
    };

    const handleCancelDeleteEvents = () => {
        setShowWarningModal(false);
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={closeModal}>&times;</span>
                <h2 className="modal-title">Ajustes de Horario</h2>

                <form onSubmit={onSubmitHandlerSettings}>
                    <section className="section">
                        <div className="input-container">
                            <div className="time-input">
                                <label>Hora de Inicio del Calendario:</label>
                                <input
                                    type="time"
                                    value={adjustedStartTime}
                                    onChange={(e) => setTempStartTime(e.target.value)}
                                />
                            </div>
                            <div className="time-input">
                                <label>Hora de Fin del Calendario:</label>
                                <input
                                    type="time"
                                    value={adjustedEndTime}
                                    onChange={(e) => setTempEndTime(e.target.value)}
                                />
                            </div>
                        </div>
                    </section>

                    <section className="section">
                        <h3 className="section-title">Opciones de Visualización</h3>
                        <div className="color-input-container">
                            {[
                                { label: 'Color del Calendario', color: calendarColor, setter: setTempCalendarColor },
                                { label: 'Color de Columnas', color: columnsColor, setter: setTempColumnsColor },
                                { label: 'Color de Filas', color: rowsColor, setter: setTempRowsColor },
                            ].map(({ label, color, setter }) => (
                                <div className="color-input" key={label}>
                                    <label>{label}</label>
                                    <ColorPicker
                                        color={color}
                                        onChangeComplete={(color) => setter(`rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`)}
                                    />
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="section">
                        <div className="checkbox-container">
                            {[
                                { label: 'Mostrar Filas', checked: showRows, setter: setTempShowRows },
                                { label: 'Mostrar Columnas', checked: showColumns, setter: setTempShowColumns },
                                { label: 'Mostrar Horas', checked: showHours, setter: setTempShowHours },
                            ].map(({ label, checked, setter }) => (
                                <div className="checkbox-input" key={label}>
                                    <label>{label}</label>
                                    <input
                                        type="checkbox"
                                        checked={checked}
                                        onChange={(e) => setter(e.target.checked)}
                                    />
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="section">
                        <FontSelector onFontChange={(font) => setCalendarFont(font)} fonts={fonts} previousFont={configuration.calendarFont} />
                    </section>

                    <div className="button-container">
                        <button type="submit" className="modal-button">Guardar</button>
                    </div>
                </form>
            </div>

            {showWarningModal && (
                <div className="modal-warning">
                    <div className="modal-content-warning">
                        <h3>Advertencia</h3>
                        <p>Si cambias la hora de inicio y fin, se eliminarán los eventos que comiencen o terminen antes de esas horas. ¿Estás seguro?</p>
                        <div className="modal-buttons">
                            <button onClick={handleConfirmDeleteEvents} className="modal-confirm-button">Confirmar</button>
                            <button onClick={handleCancelDeleteEvents} className="modal-cancel-button">Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SettingsModal;
