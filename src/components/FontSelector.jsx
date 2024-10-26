import { useState, useEffect } from 'react';
import './FontSelector.css';

const FontSelector = ({ onFontChange, fonts, previousFont }) => {
    const [selectedFont, setSelectedFont] = useState(previousFont ? previousFont : 'Arial');


    const handleFontChange = (event) => {
        const newFont = event.target.value;
        setSelectedFont(newFont);
    };

    // Cargar la fuente seleccionada en el documento
    useEffect(() => {
        const link = document.createElement('link');
        link.href = `https://fonts.googleapis.com/css2?family=${selectedFont.replace(/ /g, '+')}&display=swap`;
        link.rel = 'stylesheet';
        document.head.appendChild(link);

        // Limpiar el efecto al cambiar la fuente
        return () => {
            document.head.removeChild(link);
        };
    }, [selectedFont]);

    useEffect(() => {
        console.log(selectedFont)

        if (onFontChange) {
            onFontChange(selectedFont);
        }
    }, [selectedFont, onFontChange]);

    return (
        <div>
            <label htmlFor="font-select">Elige una fuente: </label>
            <select id="font-select" value={selectedFont} onChange={handleFontChange}>
                {fonts.map((font) => (
                    <option key={font.family} value={font.family} style={{ fontFamily: font.family }}>
                        {font.family}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default FontSelector;
