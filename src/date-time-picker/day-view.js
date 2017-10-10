import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import classnames from 'classnames'
import Header from './header'
import Grid from './grid'

class DayView extends Component {
    constructor (props) {
        super (props)

        this.state = {
            month: props.month || moment()
        }
    }

    componentWillReceiveProps (nextProps) {
        this.setState({
            month: nextProps.month || moment()
        })
    }
    
    _getFirstDayOfWeek = () => {
        return this.props.firstDayOfWeek || moment().weekday(0).weekday()
    }

    _getDays = () => {
        const firstDayOfWeek = this._getFirstDayOfWeek()

        const month = this.state.month
        const startOfMonth = month.clone().startOf('month')

        const start = startOfMonth.clone().subtract(startOfMonth.weekday() - firstDayOfWeek, 'days')
        const end = start.clone().add(7 * 6, 'days')

        const result = []
        for (let i = 0, duration = end.diff(start, 'days'); i < duration; i++) {
            const day = start.clone().add(i, 'days')
            const row = Math.floor(i / 7)

            if (!result[row]) result[row] = []
            result[row].push(day)
        }

        return result
    }

    _renderDay = (day) => {
        const month = this.state.month
        const className = classnames('day', {
            'today': day.isSame(moment(), 'day'),
            'prev-month': day < month.clone().startOf('month'),
            'next-month': day > month.clone().endOf('month')
        })
        return <div className={className}>{day.date()}</div>
    }

    _renderWeekDay (weekday) {
        return moment.weekdaysMin(weekday)
    }

    _onBackClick = () => {
        this.setState({month: this.state.month.clone().subtract(1, 'month')})
    }

    _onNextClick = () => {
        this.setState({month: this.state.month.clone().add(1, 'month')})
    }

    _onTitleClick = () => {
        this.props.onMonthClick && this.props.onMonthClick(this.state.month)
    }

    _formatHeader () {
        return this.state.month.format('MMMM YYYY')
    }
    
    render() {
        const days = this._getDays()
        const renderDay = this.props.renderDay || this._renderDay
        const renderWeekDay = this.props.renderWeekDay || this._renderWeekDay
        return <div className='day-view'>
            <Header onBackClick={this._onBackClick} onNextClick={this._onNextClick} onTitleClick={this._onTitleClick} title={this._formatHeader()} />
            <div className='body'>
                <div className='weekdays'>
                    {days[0].map(day => <div key={`wd-${day}`} className='weekday'>{renderWeekDay(day.weekday())}</div>)}
                </div>
                <Grid items={days}
                    renderCell={this._renderDay}
                    unit='day'
                    selection={this.props.selection} />
            </div>
        </div>
    }
}

DayView.propTypes = {
    firstDayOfWeek: PropTypes.number,
    renderDay: PropTypes.func,
    renderWeekDay: PropTypes.func,
    month: PropTypes.instanceOf(moment),
    selection: PropTypes.shape({
        mode: PropTypes.oneOf(['single', 'multiple', 'range']),
        onChange: PropTypes.func,
        items: PropTypes.arrayOf(PropTypes.instanceOf(moment)),
    }),
    onMonthClick: PropTypes.func
};

DayView.defaultProps = {
    selection: {
        mode: 'single',
        items: [moment()]
    }
}

export default DayView