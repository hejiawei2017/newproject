import React, { Component } from 'react'
import PropTypes from 'prop-types'

const dotOrLabelStyle = {
    // Style of dot's wrapper
    links: {
        position: 'absolute',
        bottom: 0,
        textAlign: 'center',
        paddingBottom: 15
    },
    dotBase: {
        position: 'absolute',
        bottom: -5,
        height: 12,
        width: 12,
        borderRadius: '50%',
        transition: 'background-color 0.3s, border-color 0.3s'
    },
    labelBase: {
        position: 'absolute',
        bottom: -70,
        textAlign: 'center',
        transition: 'background-color 0.3s, border-color 0.3s'
    },
    future: (styles) => ({
        backgroundColor: styles.background,
        border: `2px solid ${styles.outline}`
    }),
    past: (styles) => ({
        backgroundColor: styles.background,
        border: `2px solid ${styles.foreground}`
    }),
    present: (styles) => ({
        backgroundColor: styles.foreground,
        border: `2px solid ${styles.foreground}`
    })
}



// @Radium
export default class TimelinePoint extends Component {
    static propTypes = {
        // The index of the selected dot
        selected: PropTypes.number.isRequired,
        // The index of the present dot
        index: PropTypes.number.isRequired,
        // The actual date of the dot
        date: PropTypes.string.isRequired,
        // onClick: PropTypes.func.isRequired,
        // label: PropTypes.string.isRequired,
        labelWidth: PropTypes.number.isRequired,
        totalWidth: PropTypes.number.isRequired,
        styles: PropTypes.object.isRequired
    }

    getDotOrLabelStyle = (dotType, key, elType) => {
        const { points, styles, totalWidth, index} = this.props

        let dotStyle = {
            ...dotOrLabelStyle.dotBase,
            ...dotOrLabelStyle[dotType](styles, elType),
            left: totalWidth / (points.length - 1) * index
        }

        let labelStyle = {
            ...dotOrLabelStyle.labelBase,
            left: totalWidth / (points.length - 1) * index - 46
        }

        return elType === 'dot' ? dotStyle : labelStyle
    }

    render = () => {
        const {
            date,
            index,
            labelWidth,
            label,
            onClick,
            selected
        } = this.props


        let dotType = 'future'

        if (index < selected) {
            dotType = 'past'
        } else if (index === this.props.selected) {
            dotType = 'present'
        }
        let newStyle = Object({...dotOrLabelStyle.links}, {
            left: index * labelWidth,
            cursor: 'pointer',
            width: labelWidth
        })
        return (
            <li
                id={`timeline-point-${date}`}
                className={`${dotType} timeline-point-label`}
                onClick={function () {onClick(index)}}
                style={newStyle}
            >
                <span
                    key={`dot-dot`}
                    style={
                        this.getDotOrLabelStyle(dotType, date, 'dot')
                    }
                />
                <span
                    style={
                        {
                            ...this.getDotOrLabelStyle(dotType, date, 'label')
                        }
                    }
                >{label}</span>
            </li>
        )
    }
}