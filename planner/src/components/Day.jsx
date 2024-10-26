import './Calendar.css';
import { Event } from './Event';
import { getSoftContrastingColor } from '../logic/logic'

export const Day = ({ day, events, onEventClick, slotsAttributes, configuration }) => {
    const { height, width } = slotsAttributes;
    const { adjustedStartTime, adjustedEndTime, calendarColor, showRows, showColumns } = configuration;
    const startHour = parseInt(adjustedStartTime.split(':')[0]);
    const endHour = parseInt(adjustedEndTime.split(':')[0]) + 1

    const parsedEvents = events.map((event) => {
        const startHour = parseInt(event.days[day].startTime.split(':')[0], 10);
        const startMinutes = parseInt(event.days[day].startTime.split(':')[1], 10);
        const endHour = parseInt(event.days[day].endTime.split(':')[0], 10);
        const endMinutes = parseInt(event.days[day].endTime.split(':')[1], 10);

        return {
            ...event,
            startHour,
            endHour,
            startMinutes,
            endMinutes,
        };
    });

    const renderTimeSlots = () => {
        const timeSlots = [];
        const totalHours = endHour;

        for (let hour = startHour; hour < totalHours; hour++) {
            timeSlots.push(
                <div
                    key={hour}
                    className="time-slot"
                    style={{
                        height: `${100 / ((endHour - startHour))}%`,
                        width: width,
                        minWidth: '150px',
                        borderBottom: showRows ? `0.5px solid ${getSoftContrastingColor(calendarColor)}` : '',
                        borderRight: showColumns ? `0.5px solid ${getSoftContrastingColor(calendarColor)}` : '',
                    }}
                >
                </div>
            );
        }

        return timeSlots;
    };

    return (
        <div className={'day-container'}>

            {(showRows || showColumns) && renderTimeSlots()}

            {parsedEvents.map((event) => {
                const slotsOccupied = event.endHour - event.startHour;
                const minutes = 60 - event.startMinutes + event.endMinutes + (slotsOccupied - 1) * 60;
                const eventHeight = ((height * 1.021) * minutes) / 60;
                const emptySlots = event.startHour - startHour;
                const top = (emptySlots * (height * 1.021)) + (event.startMinutes / 60) * height;
                const eventAttributes = { height: eventHeight, width, top };
                return (
                    <Event
                        key={event.id}
                        day={day}
                        event={event}
                        onEventClick={onEventClick}
                        eventAttributes={eventAttributes}
                        slotsAttributes={slotsAttributes}
                        configuration={configuration}
                    />
                );
            })}
        </div>
    );
};
