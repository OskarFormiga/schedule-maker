import { Calendar } from './components/Calendar';
import { useState, useEffect } from 'react';
import './App.css';
import html2canvas from "html2canvas";
import SettingsModal from './components/SettingsModal';
import EventModal from './components/EventModal';
import Header from './components/Header';

function App() {
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState(() => {
    const eventsFromStorage = window.localStorage.getItem('events')
    if (eventsFromStorage) return JSON.parse(eventsFromStorage)
    return []
  });
  const [configuration, setConfiguration] = useState(() => {
    const configurationFromStorage = window.localStorage.getItem('configuration')
    if (configurationFromStorage) return JSON.parse(configurationFromStorage)
    return {
      adjustedStartTime: '08:00',
      adjustedEndTime: '23:00',
      calendarColor: 'rgb(85, 85, 85)',
      columnsColor: 'rgb(187, 187, 187)',
      rowsColor: 'rgb(187, 187, 187)',
      showRows: false,
      showColumns: false,
      calendarFont: 'Arial',
      isHeaderVisible: true,
      columnsTextColor: 'rgb(51, 51, 51)',
      rowsTextColor: 'rgb(51, 51, 51)',
    }
  });
  const [fonts, setFonts] = useState([]);

  useEffect(() => {
    document.body.style.backgroundColor = configuration.calendarColor;
  }, [configuration.calendarColor]);

  useEffect(() => {
    const fetchFonts = async () => {
      // Usar el parámetro sort=popularity para obtener las fuentes más populares
      const response = await fetch('https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyASI1VbYSmvVXCorILZxufniUdGU5JzlFI&sort=popularity');
      const data = await response.json();
      setFonts(data.items.slice(0, 50)); // Limitar a las primeras 20 fuentes
    };

    fetchFonts();
  }, []);

  // Cargar todas las fuentes populares en el documento
  useEffect(() => {
    fonts.forEach((font) => {
      const link = document.createElement('link');
      link.href = `https://fonts.googleapis.com/css2?family=${font.family.replace(/ /g, '+')}&display=swap`;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    });
  }, [fonts]);

  const onSettingsModalSubmit = (configuration) => {
    setConfiguration(configuration);
    window.localStorage.setItem('configuration', JSON.stringify(configuration));
    setIsSettingsModalOpen(false);
  }

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setIsEventModalOpen(true);
  };

  const setNewEvents = (newEvents) => {
    setEvents(newEvents);
    window.localStorage.setItem('events', JSON.stringify(newEvents));
    setSelectedEvent(null);
    setIsEventModalOpen(false);
  }

  const handleDownloadImage = async () => {
    const element = document.getElementById('print');
    element.style.overflow = 'visible'; // Temporalmente habilita overflow visible.

    const canvas = await html2canvas(element, {
      scrollY: -window.scrollY, // Ajusta para captura completa
      scrollX: -window.scrollX,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
    });

    const data = canvas.toDataURL('image/jpg');
    const link = document.createElement('a');
    link.href = data;
    link.download = 'downloaded-image.jpg';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    element.style.overflow = ''; // Restaura overflow después de la captura
  };


  const onCloseModalHandler = () => {
    setIsEventModalOpen(false);
    setSelectedEvent(null);
  }

  const onNewSchedule = () => {
    setEvents([]);
    setConfiguration({
      adjustedStartTime: '08:00',
      adjustedEndTime: '23:00',
      calendarColor: 'rgb(85, 85, 85)',
      columnsColor: 'rgb(187, 187, 187)',
      rowsColor: 'rgb(187, 187, 187)',
      showRows: false,
      showColumns: false,
      showHours: true,
      calendarFont: 'Arial',
      isHeaderVisible: true,
      columnsTextColor: 'rgb(51, 51, 51)',
      rowsTextColor: 'rgb(51, 51, 51)',
    });

    window.localStorage.removeItem('events');
    window.localStorage.removeItem('configuration');
  }

  const onDeleteEvents = (newStartTime, newEndTime) => {
    const [newStartHour, newStartMinutes] = newStartTime.split(':').map(Number);
    const [newEndHour, newEndMinutes] = newEndTime.split(':').map(Number);

    const newStartDate = new Date();
    newStartDate.setHours(newStartHour, newStartMinutes, 0);

    const newEndDate = new Date();
    newEndDate.setHours(newEndHour, newEndMinutes, 0);

    const filteredEvents = events.filter(event => {
      const { days } = event;
      let shouldDelete = false;

      for (const day in days) {
        if (days[day].selected) {
          const eventStartTime = new Date();
          eventStartTime.setHours(event.startHour, event.startMinutes, 0);

          const eventEndTime = new Date();
          eventEndTime.setHours(event.endHour, event.endMinutes, 0);

          if (eventStartTime < newStartDate || eventEndTime > newEndDate) {
            shouldDelete = true;
            break;
          }
        }
      }

      return !shouldDelete;
    });

    setEvents(filteredEvents);
    window.localStorage.setItem('events', JSON.stringify(filteredEvents));
  };

  return (
    <div style={{
      backgroundColor: configuration.calendarColor,
      width: '100%',
      overflow: 'auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      fontFamily: 'Nunito'
    }}>

      <div className='header'>
        <Header
          newSchedule={onNewSchedule}
          showEventModal={() => { setIsEventModalOpen(true) }}
          showSettingsModal={() => { setIsSettingsModalOpen(true) }}
          handleDownloadImage={handleDownloadImage} />

        {isEventModalOpen && <EventModal selectedEvent={selectedEvent} setNewEvents={setNewEvents} onCloseModal={onCloseModalHandler} events={events} configuration={configuration} />}
        {isSettingsModalOpen && <SettingsModal configuration={configuration} onSettingsModalSubmit={onSettingsModalSubmit} closeModal={() => { setIsSettingsModalOpen(false) }} onDeleteEvents={onDeleteEvents} fonts={fonts} />}
      </div>
      <Calendar
        events={events}
        onEventClick={handleEventClick}
        configuration={configuration}
      />

    </div>
  );
}

export default App;
