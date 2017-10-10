import React from 'react'
import PropTypes from 'prop-types'
import DayView from './day-view'
import MonthView from './month-view'
import TimeView from './time-view'
import YearView from './year-view'
import DateTime from './date-time'
import moment from 'moment'
import './style.css'

export {
    DayView,
    MonthView,
    YearView,

    TimeView,

    DateTime
}

class DateTimePicker extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            currentView: 'day'
        }
    }
    
    render () {
        switch (this.state.currentView) {
            case 'day': return <DayView />
            case 'month': return <MonthView />
            case 'year': return 
        }
    }
}

DateTimePicker.protTypes = {
    firstDayOfWeek: PropTypes.number,
    selection: PropTypes.shape({
        mode: PropTypes.oneOf(['single', 'multiple', 'range']),
        onChange: PropTypes.func,
        days: PropTypes.arrayOf(PropTypes.instanceOf(moment)),
    }),
    showTime: PropTypes.bool   
}

export default DateTimePicker
