import { getSoftContrastingColor } from '../logic/logic';
import './Event.css';

export const Event = ({ day, event, onEventClick, eventAttributes, slotsAttributes, configuration }) => {
    const { height, top } = eventAttributes
    const { showHours } = configuration
    const textColor = getSoftContrastingColor(event.color);
    const heightRatio = height && slotsAttributes.height ? height / slotsAttributes.height : 1;

    return (
        <div
            className="event"
            style={{
                height: height,
                width: '100%',
                backgroundColor: event.color,
                color: textColor,
                top: top,
                position: 'absolute',
            }}
            onClick={() => { onEventClick(event, day) }}
        >
            <div className='title-container'>
                <h3 style={{
                    WebkitLineClamp: Math.min(Math.floor(heightRatio / (showHours ? (heightRatio > 2 ? 1.15 : 1.25) : (heightRatio > 2 ? 1.10 : 1))), showHours ? 10 : 12),
                    marginTop: heightRatio < 1 ? '4px' : '10px',
                    fontSize: Math.max(Math.min(heightRatio * 11, 30), 10),
                }}>
                    {event.title}
                </h3>
            </div>

            {
                showHours && (heightRatio > 1.25) && (
                    <div className="time" style={{
                        fontSize: heightRatio < 0.7 ? '8px' : '10px',
                    }}>
                        {event.days[day].startTime} - {event.days[day].endTime}
                    </div>
                )
            }
        </div >
    );
};
