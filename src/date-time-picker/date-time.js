import React from 'react'
import PropTypes from 'prop-types'
import DayView from './day-view'
import MonthView from './month-view'
import YearView from './year-view'
import TimeView from './time-view'
import moment from 'moment'
import _ from 'lodash'
import { CSSTransitionGroup } from 'react-transition-group'

const _getStartOfDay = () => moment().startOf('day')

class DateTime extends React.Component {
    constructor (props) {
        super(props)

        const selection = this.props.selection || {}
        const selectedDays = selection.days || [moment()]

        this.state = {
            currentView: 'day',
            date: selectedDays[0],
            selectedDays: selectedDays,
            selectedTime: selectedDays[0] || moment().startOf('day')
        }
    }

    _onDVMonthClick = (month) => {
        this.setState({currentView: 'month', date: month})
    }

    _onMVYearClick = (year) => {
        this.setState({currentView: 'year', date: year})
    }

    _onDateSelectionChange = (days) => {
        const time = this.state.selectedTime
        days = days.map(d => d.clone().hour(time.hour()).minute(time.minute()))
        this.setState({selectedDays: days})
        this.props.selection && this.props.selection.onChange && this.props.selection.onChange(days)
    }

    _onMonthSelectionChange = (months) => {
        this.setState({currentView: 'day', date: months[0]})
    }

    _onYearSelectionChange = (years) => {
        this.setState({currentView: 'month', date: years[0]})
    }

    _onResetClick = () => {
        this.setState({selectedDays: [], selectedTime: _getStartOfDay()})
        this.props.selection && this.props.selection.onChange && this.props.selection.onChange([])
    }

    _onTodayClick = () => {
        // Note: this is a bit different from the initialization in the constructor - constructor preserves original time
        const today = moment()
        const selectedDays = [this.props.showTime ? today : today.clone().startOf('day')]
        this.setState({
            date: today,
            selectedDays: selectedDays,
            selectedTime: this.props.showTime ? today : today.clone().startOf('day')
        })
        this.props.selection && this.props.selection.onChange && this.props.selection.onChange(selectedDays)
    }

    _renderDayView () {
        const renderTodayReset = () => {
            if (!this.props.showResetButton && !this.props.showTodayButton) return null
            return <div className='today-reset-buttons-container'>
                {this.props.showTodayButton && <button className='btn-today' onClick={this._onTodayClick}>Today</button>}
                {this.props.showResetButton && <button className='btn-reset' onClick={this._onResetClick}>Reset</button>}
            </div>
        }

        return <div key='day' className='day-view-container'>
            <DayView key='dv'
                month={this.state.date}
                onMonthClick={this._onDVMonthClick}
                firstDayOfWeek={this.props.firstDayOfWeek}
                selection={{
                    mode: this.props.selection.mode,
                    items: this.state.selectedDays,
                    onChange: this._onDateSelectionChange
                }} />
            {this.props.showTime && this.props.selection.mode === 'single' && <div className='time-toggle' onClick={() => this.setState({currentView: 'time'})}></div>}
            {renderTodayReset()}
        </div>
    }

    _renderMonthView () {
        return <MonthView key='month' year={this.state.date} onYearClick={this._onMVYearClick} selection={{
            mode: 'single',
            items: _.uniqBy(this.state.selectedDays.filter(d => d.isSame(this.state.date, 'year')), d => d.month()),
            onChange: this._onMonthSelectionChange
        }} />
    }

    _renderYearView () {
        return <YearView key='year' year={this.state.date} selection={{
            mode: 'single',
            items: _.uniqBy(this.state.selectedDays, d => d.year()),
            onChange: this._onYearSelectionChange
        }} />
    }

    _renderTimeView () {
        const selectedDate = this.state.selectedDays[0]
        const onChange = (dateTime) => {
            this.setState({selectedDays: [dateTime], selectedTime: dateTime})
            this.props.onTimeChange && this.props.onTimeChange(dateTime)
        }
        
        const timeView = <TimeView time={selectedDate} onChange={onChange} />

        if (!this.props.showTime || this.props.selection.mode !== 'single') return timeView

        return <div key='time' className='time-view-container'>
            <div className='date-toggle' onClick={() => this.setState({currentView: 'day'})} />
            {timeView}
        </div>
    }
    
    render () {
        let content = null
        switch (this.state.currentView) {
            case 'day': 
                content = this._renderDayView()
                break
            case 'month': 
                content = this._renderMonthView()   
                break
            case 'year': 
                content = this._renderYearView()
                break
            case 'time': 
                content = this._renderTimeView()
                break
        }
        return <div className={`date-time-container${this.props.showTime ? ' has-time' : ''}`}>       
            {content}
        </div>
    }
}

DateTime.propTypes = {
    firstDayOfWeek: PropTypes.number,
    selection: PropTypes.shape({
        mode: PropTypes.oneOf(['single', 'multiple', 'range']),
        onChange: PropTypes.func,
        days: PropTypes.arrayOf(PropTypes.instanceOf(moment)),
    }),
    onTimeChange: PropTypes.func,
    showTime: PropTypes.bool,
    showTodayButton: PropTypes.bool,
    showResetButton: PropTypes.bool
}

DateTime.defaultProps = {
    selection: {
        mode: 'single',
        days: [moment()]
    },
    showTodayButton: false,
    showResetButton: false
}

export default DateTime
