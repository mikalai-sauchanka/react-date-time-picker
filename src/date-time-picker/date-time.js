import React from 'react'
import PropTypes from 'prop-types'
import DayView from './day-view'
import MonthView from './month-view'
import YearView from './year-view'
import TimeView from './time-view'
import moment from 'moment'
import _ from 'lodash'
import { CSSTransitionGroup } from 'react-transition-group'

class DateTime extends React.Component {
    constructor (props) {
        super(props)

        const selection = this.props.selection || {}
        const selectedDays = selection.days && selection.days.length ? selection.days : [moment()]

        this.state = {
            currentView: 'time',
            date: selectedDays[0],
            selectedDays: selectedDays
        }
    }

    _onDVMonthClick = (month) => {
        this.setState({currentView: 'month', date: month})
    }

    _onMVYearClick = (year) => {
        this.setState({currentView: 'year', date: year})
    }

    _onDateSelectionChange = (days) => {
        this.setState({selectedDays: days})
        this.props.selection && this.props.selection.onChange && this.props.selection.onChange()
    }

    _onMonthSelectionChange = (months) => {
        this.setState({currentView: 'day', date: months[0]})
    }

    _onYearSelectionChange = (years) => {
        this.setState({currentView: 'month', date: years[0]})
    }

    _renderDayView () {
        const dayView = <DayView key='dv' month={this.state.date} onMonthClick={this._onDVMonthClick} selection={{
            mode: this.props.selection.mode,
            items: this.state.selectedDays,
            onChange: this._onDateSelectionChange
        }} />

        if (!this.props.showTime || this.props.selection.mode !== 'single') return dayView

        return <div key='day' className='day-view-container'>
            {dayView}
            <div className='time-toggle' onClick={() => this.setState({currentView: 'time'})}></div>
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
        const onChange = (time) => {
            const selectedDays = [selectedDate.clone().hour(time.hour()).minute(time.minute())]
            this.setState({selectedDays})
            this.props.selection.onChange && this.props.selection.onChange(selectedDays)
        }
        
        const timeView = <TimeView time={selectedDate} onChange={onChange} />

        if (!this.props.showTime || this.props.selection.mode !== 'single') return timeView

        return <div key='time' className='time-view-container'>
            <div className='date-toggle' onClick={() => this.setState({currentView: 'day'})} />,
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
        return <div className='date-time-container'>       
            <CSSTransitionGroup
                transitionName='date-time-view'
                transitionEnterTimeout={1000}
                transitionLeaveTimeout={1000}
            >
                {content}
            </CSSTransitionGroup>
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
    showTime: PropTypes.bool   
}

DateTime.defaultProps = {
    selection: {
        mode: 'single',
        days: [moment()]
    }
}

export default DateTime
