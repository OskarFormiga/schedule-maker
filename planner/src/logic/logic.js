export function getSoftContrastingColor(bgColor) {
    let r, g, b;

    // Si bgColor es una cadena en formato 'rgba(r, g, b, a)', extraemos los valores
    if (typeof bgColor === 'string' && bgColor.startsWith('rgba')) {
        const rgbaValues = bgColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+),?.*?\)/);
        if (rgbaValues) {
            r = parseInt(rgbaValues[1], 10);
            g = parseInt(rgbaValues[2], 10);
            b = parseInt(rgbaValues[3], 10);
        }
    } else if (typeof bgColor === 'object' && bgColor.r !== undefined) {
        // Si bgColor es un objeto { r, g, b, a }
        ({ r, g, b } = bgColor);
    }

    // Calculamos la luminancia usando la fórmula
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

    // Devolvemos un color de contraste exagerado
    if (luminance > 180) {
        // Si el fondo es claro, devuelve un color negro más opaco
        return `rgba(0, 0, 0, 0.9)`;
    } else {
        // Si el fondo es oscuro, devuelve un color blanco más opaco
        return `rgba(255, 255, 255, 0.9)`;
    }
}



export function checkAvailability(events, newEvent, selectedEvent) {
    const daysOfWeek = ['M', 'T', 'W', 'R', 'F', 'S', 'U'];
    for (const event of events) {
        for (const day of daysOfWeek) {
            if (selectedEvent?.id !== event.id) {

                // Verificar si ambos eventos están seleccionados para el mismo día
                if (newEvent.days[day]?.selected && event.days[day]?.selected) {
                    const newStartTime = newEvent.days[day].startTime;
                    const newEndTime = newEvent.days[day].endTime;
                    const existingStartTime = event.days[day].startTime;
                    const existingEndTime = event.days[day].endTime;

                    // Convertir tiempos a milisegundos para compararlos fácilmente
                    const newStart = new Date(`1970-01-01T${newStartTime}:00`).getTime();
                    const newEnd = new Date(`1970-01-01T${newEndTime}:00`).getTime();
                    const existingStart = new Date(`1970-01-01T${existingStartTime}:00`).getTime();
                    const existingEnd = new Date(`1970-01-01T${existingEndTime}:00`).getTime();
                    // Verificar si los tiempos se solapan
                    if (
                        (newStart < existingEnd && newEnd > existingStart)
                    ) {
                        return false; // Si hay conflicto, no está disponible
                    }
                }
            }
        }
    }

    return true; // Si no hay conflicto, está disponible
};

export const rgbaToObject = (rgba) => {
    const regex = /rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?\)/;
    const match = rgba.match(regex);

    if (match) {
        return {
            r: parseInt(match[1], 10),
            g: parseInt(match[2], 10),
            b: parseInt(match[3], 10),
            a: match[4] ? parseFloat(match[4]) : 1, // Default alpha to 1 if not provided
        };
    }
    return null; // Return null if the input format is incorrect
};