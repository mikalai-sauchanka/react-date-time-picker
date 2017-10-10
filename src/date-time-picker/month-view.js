import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import classnames from 'classnames'
import Header from './header'
import Grid from './grid'

class MonthView extends Component {
    constructor (props) {
        super (props)

        this.state = {
            year: props.year || moment()
        }
    }

    componentWillReceiveProps (nextProps) {
        this.setState({
            year: nextProps.year || moment()
        })    
    }

    _getMonths = () => {
        const year = this.state.year
        const startOfYear = year.clone().startOf('year')
        
        const result = []
        for (let i = 0; i < 12; i++) {
            const month = startOfYear.clone().add(i, 'months')
            const row = Math.floor(i / 3)

            if (!result[row]) result[row] = []
            result[row].push(month)
        }

        return result
    }

    _renderMonth = (month) => {
        const className = classnames('month')
        return <div className={className}>{month.format('MMMM')}</div>
    }

    _onBackClick = () => {
        this.setState({year: this.state.year.clone().subtract(1, 'year')})
    }

    _onNextClick = () => {
        this.setState({year: this.state.year.clone().add(1, 'year')})
    }

    _onTitleClick = () => {
        this.props.onYearClick && this.props.onYearClick(this.state.year)
    }

    _formatHeader () {
        return this.state.year.format('YYYY')
    }
    
    render() {
        const months = this._getMonths()
        const renderMonth = this.props.renderMonth || this._renderMonth
        return <div className='month-view'>
            <Header onBackClick={this._onBackClick} onNextClick={this._onNextClick} onTitleClick={this._onTitleClick} title={this._formatHeader()} />
            <div className='body'>
                <Grid items={months}
                    renderCell={this._renderMonth}
                    unit='month'
                    selection={this.props.selection} />
            </div>
        </div>
    }
}

MonthView.propTypes = {
    renderMonth: PropTypes.func,
    year: PropTypes.instanceOf(moment),
    selection: PropTypes.shape({
        mode: PropTypes.oneOf(['single', 'multiple', 'range']),
        onChange: PropTypes.func,
        items: PropTypes.arrayOf(PropTypes.instanceOf(moment)),
    }),
    onYearClick: PropTypes.func
};

MonthView.defaultProps = {
    selection: {
        mode: 'single',
        items: [moment()]
    }
}

export default MonthView