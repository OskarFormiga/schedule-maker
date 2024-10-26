'use strict';

import { useState, useEffect } from 'react';
import reactCSS from 'reactcss';
import { SketchPicker } from 'react-color';
import { rgbaToObject } from '../logic/logic';

const ColorPicker = ({ color, onChangeComplete }) => {
    const [displayColorPicker, setDisplayColorPicker] = useState(false);
    const [currentColor, setCurrentColor] = useState(() => {
        if (typeof color === 'object' && 'r' in color && 'g' in color && 'b' in color && 'a' in color) return color;
        return rgbaToObject(color)
    });

    const handleClick = () => {
        setDisplayColorPicker(!displayColorPicker);
    };

    const handleClose = () => {
        setDisplayColorPicker(false);
    };

    const handleChange = (color) => {
        setCurrentColor(color.rgb);
        onChangeComplete(color.rgb);
    };

    useEffect(() => {
        setCurrentColor(color);
    }, [color]);


    const styles = reactCSS({
        'default': {
            color: {
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                border: '1px solid black',
                background: `rgba(${currentColor.r}, ${currentColor.g}, ${currentColor.b}, ${currentColor.a})`,
            },
            swatch: {
                background: '#fff',
                borderRadius: '1px',
                boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
                display: 'inline-block',
                cursor: 'pointer',
                position: 'relative',
            },
            popover: {
                position: 'fixed',
                zIndex: '1000',
            },
            cover: {
                position: 'fixed',
                top: '0px',
                right: '0px',
                bottom: '0px',
                left: '0px',
            },
        },
    });

    return (
        <div>
            <div style={styles.swatch} onClick={handleClick}>
                <div style={styles.color} />
            </div>
            {displayColorPicker ? (
                <div style={styles.popover}>
                    <div style={styles.cover} onClick={handleClose} />
                    <SketchPicker
                        color={currentColor}
                        onChange={handleChange}
                    />
                </div>
            ) : null}
        </div>
    );
};

export default ColorPicker;
