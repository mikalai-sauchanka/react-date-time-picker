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

    DateTime,

    SingleDatePicker
}

const CommonProps = {
    firstDayOfWeek: PropTypes.number,
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    displayFormat: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    closeOnChange: PropTypes.bool,
    closeOnClickOutside: PropTypes.bool
}

class SingleDatePicker extends React.Component {
    _onChange = (days) => {
        this.props.onChange && this.props.onChange(days[0])
    }

    _formatDisplayDate = () => {
        if (!this.props.value) return this.props.placeholder

        return this.props.displayFormat instanceof Function ? this.props.displayFormat(this.props.value) : this.props.value.format(this.props.displayFormat)
    }

    render () {
        return <DateTimePickerInternal 
            firstDayOfWeek={this.props.firstDayOfWeek}
            selection={{
                mode: 'single',
                onChange: this._onChange,
                days: this.props.value ? [this.props.value] : []
            }}
            showTime={false}
            displayFormat={this._formatDisplayDate}
            closeOnChange={this.props.closeOnChange}
            closeOnClickOutside={this.props.closeOnClickOutside}
        />
    }
}

SingleDatePicker.propTypes = Object.assign({
    value: PropTypes.instanceOf(moment)
}, CommonProps)

SingleDatePicker.defaultProps = {
    placeholder: 'Select Date',
    displayFormat: 'DD MMM YYYY'
}

class DateTimePicker extends React.Component {
    _onChange = (days) => {
        this.props.onChange && this.props.onChange(days[0])
    }
   
    _formatDisplayDateTime = () => {
        if (!this.props.value) return this.props.placeholder

        return this.props.displayFormat instanceof Function ? this.props.displayFormat(this.props.value) : this.props.value.format(this.props.displayFormat)
    }

    render () {
        return <DateTimePickerInternal 
            firstDayOfWeek={this.props.firstDayOfWeek}
            selection={{
                mode: 'single',
                onChange: this._onChange,
                days: this.props.value ? [this.props.value] : []               
            }}
            showTime
            onTimeChange={(time) => this._onChange([time])}
            displayFormat={this._formatDisplayDateTime}
            closeOnChange={this.props.closeOnChange}
            closeOnClickOutside={this.props.closeOnClickOutside}
        />
    }
}

DateTimePicker.propTypes = Object.assign({
    value: PropTypes.instanceOf(moment)
}, CommonProps)

DateTimePicker.defaultProps = {
    placeholder: 'Select Date Time',
    displayFormat: 'DD MMM YYYY HH:mm'
}

class DateTimePickerInternal extends React.Component {
    constructor (props) {
        super(props)

        this.hasCloseHandler = false

        this._setCloseHandler(props)

        this.state = {
            isOpen: false
        }
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.closeOnClickOutside !== this.props.closeOnClickOutside) {
            this._setCloseHandler(nextProps)            
        }
    }

    componentDidUpdate (prevProps, prevState) {
        if (this.state.isOpen && this.dt) {
            const dtHeight = this.dt.clientHeight
            const toggleRect = this.tgl.getBoundingClientRect()
            this.dt.style = Object.assign({}, this.dt.style, {
                top: toggleRect.bottom + dtHeight > window.innerHeight ? `${toggleRect.top - dtHeight}` : `${toggleRect.bottom}px`,
                left: `${toggleRect.left}px`
            })
        }
    }

    componentWillUnmount () {
        if (this.hasCloseHandler) {
            document.removeEventListener('click', this._closeHander)
            this.hasCloseHandler = false
        }
    }

    _closeHander = (e) => {
        if (!this.cnr || !this.state.isOpen) return
        if (!this.cnr.contains(e.target)) {
            this.setState({isOpen: false})
        }
    }

    _setCloseHandler = (props) => {
        if (props.closeOnClickOutside) {
            if (this.hasCloseHandler) return
            document.addEventListener('click', this._closeHander, true)
            this.hasCloseHandler = true            
        } else {
            if (!this.hasCloseHandler) return
            document.removeEventListener('click', this._closeHander, true)
            this.hasCloseHandler = false
        }
    }

    _toggleIsOpen = () => {
        this.setState({isOpen: !this.state.isOpen})
    }

    _onChange = (days) => {
        this.props.selection.onChange && this.props.selection.onChange(days)
        if (this.props.closeOnChange) {
            this.setState({isOpen: false})
        }        
    }
    
    render () {
        let props = {
            firstDayOfWeek: this.props.firstDayOfWeek,
            selection: {
                mode: this.props.selection.mode,
                onChange: this._onChange,
                days: this.props.selection.days
            },
            showTime: this.props.showTime,
            onTimeChange: this.props.onTimeChange
        }

        return <div ref={cnr => this.cnr = cnr} className='date-time-picker'>
            <div ref={tgl => this.tgl = tgl} className='date-time-toggle readonly' onClick={this._toggleIsOpen}>{this.props.displayFormat()}</div>
            {this.state.isOpen && <DateTime ref={dt => this.dt = dt} {...props} />}
        </div>
    }
}

DateTimePickerInternal.propTypes = {
    firstDayOfWeek: PropTypes.number,
    selection: PropTypes.shape({
        mode: PropTypes.oneOf(['single', 'multiple', 'range']),
        onChange: PropTypes.func,
        days: PropTypes.arrayOf(PropTypes.instanceOf(moment)),
    }),
    onTimeChange: PropTypes.func,
    showTime: PropTypes.bool,
    displayFormat: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    closeOnChange: PropTypes.bool,
    closeOnClickOutside: PropTypes.bool
}

DateTimePickerInternal.defaultProps = {
    selection: {
        days: [moment()]
    }
}

export default DateTimePicker
