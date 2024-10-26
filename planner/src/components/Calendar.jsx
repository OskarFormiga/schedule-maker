import { useEffect, useRef, useState } from 'react';
import { Day } from "./Day";
import './Calendar.css';
import { getSoftContrastingColor } from '../logic/logic'
import { headerWeekDays, weekDays } from '../logic/consts';

export const Calendar = ({ events, onEventClick, configuration }) => {

    const { adjustedStartTime, adjustedEndTime, calendarColor, rowsColor, columnsColor, showColumns, columnsTextColor, rowsTextColor, calendarFont } = configuration
    const startHour = parseInt(adjustedStartTime.split(':')[0])
    const endHour = parseInt(adjustedEndTime.split(':')[0]) + 1
    const timeSlot = Array.from({ length: endHour - startHour }, (_, i) => [startHour + i, startHour + i + 1]);
    const [slotHeight, setSlotHeight] = useState(0);
    const [headerWidth, setHeaderWidth] = useState(0);
    const timeSlotRef = useRef(null);
    const headerRef = useRef(null);

    useEffect(() => {
        const updateDimensions = () => {
            if (timeSlotRef.current) {
                setSlotHeight(timeSlotRef.current.clientHeight);
            }
            if (headerRef.current) {
                setHeaderWidth(headerRef.current.clientWidth);
            }
        };

        updateDimensions();

        window.addEventListener('resize', updateDimensions);
        return () => {
            window.removeEventListener('resize', updateDimensions);
        };
    }, []);

    return (
        <div className="calendar-container" id="print" style={{ backgroundColor: calendarColor, fontFamily: calendarFont }}>
            <div className="days-header-container">
                <div className="header-day" ref={headerRef} style={{
                    height: `${90 / ((endHour - startHour))}%`,
                    borderRight: `0.1px solid ${getSoftContrastingColor(columnsColor)}`,
                    borderBottom: `0.1px solid ${getSoftContrastingColor(rowsColor)}`,
                }}>  <h1 style={{ opacity: '0' }}>dummy</h1></div>
                {headerWeekDays.map((day) => (
                    <div className="header-day" key={day} style={{
                        backgroundColor: columnsColor,
                        color: columnsTextColor,
                        borderRight: `0.1px solid ${getSoftContrastingColor(columnsColor)}`,
                        borderTop: `0.1px solid ${getSoftContrastingColor(columnsColor)}`,
                        borderBottom: `0.1px solid ${getSoftContrastingColor(columnsColor)}`
                    }}>
                        <h1>{day}</h1>
                    </div>
                ))}
            </div>
            <div className="days-container" style={{
                minHeight: (endHour - startHour) * 50,
            }}>
                <div className="day-container" >
                    {timeSlot.map((timeSlot, index) => {
                        let [timeA, timeB] = timeSlot;
                        if (timeA < 10) timeA = `0${timeA}:00`;
                        else timeA = `${timeA}:00`;
                        if (timeB < 10) timeB = `0${timeB}:00`;
                        else timeB = `${timeB}:00`;

                        return (
                            <div key={timeA} className='timeSlot-container' style={{ height: `${100 / ((endHour - startHour))}%` }} >
                                <div ref={index === 0 ? timeSlotRef : null} className="timeSlot-header" style={{
                                    backgroundColor: rowsColor,
                                    color: rowsTextColor,
                                    borderBottom: `0.1px solid ${getSoftContrastingColor(rowsColor)}`,
                                    borderLeft: `0.1px solid ${getSoftContrastingColor(rowsColor)}`,
                                    borderRight: `${showColumns ? `0.1px solid ${getSoftContrastingColor(rowsColor)}` : ''}`,

                                }}>
                                    {timeA}
                                </div>
                            </div>

                        );
                    })}

                </div>
                {weekDays.map((day) => {
                    const dayEvents = events.filter((event) => event.days[day].selected);
                    const slotAttributes = { height: slotHeight, width: headerWidth }
                    return (
                        <Day key={day} day={day} events={dayEvents} onEventClick={onEventClick} slotsAttributes={slotAttributes} configuration={configuration} />
                    );
                })}
            </div>
        </div>
    );
};
