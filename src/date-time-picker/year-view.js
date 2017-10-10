import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import classnames from 'classnames'
import Header from './header'
import Grid from './grid'

class YearView extends Component {
    constructor (props) {
        super(props)

        this.state = {
            year: this.props.year || moment()
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({year: this.nextProps.year || moment()})
    }

    _getYearsRange () {
        const year = this.state.year.year()
        return {
            from: this.state.year.clone().subtract(year % 12, 'years'),
            to: this.state.year.clone().add(12 - year % 12, 'years')
        }
    }

    _getYears = () => {
        const {from} = this._getYearsRange()
        
        const result = []
        for (let i = 0; i < 12; i++) {
            const year = from.clone().add(i, 'years')
            const row = Math.floor(i / 3)

            if (!result[row]) result[row] = []
            result[row].push(year)
        }

        return result
    }

    _renderYear = (month) => {
        const className = classnames('year')
        return <div className={className}>{month.format('YYYY')}</div>
    }

    _onBackClick = () => {
        this.setState({year: this.state.year.clone().subtract(9, 'years')})
    }

    _onNextClick = () => {
        this.setState({year: this.state.year.clone().add(9, 'years')})
    }

    _formatTitle = () => {
        const {from, to} = this._getYearsRange()
        return `${from.format('YYYY')}-${to.format('YYYY')}`
    }
    
    render() {
        const years = this._getYears()
        const renderYear = this.props.renderYear || this._renderYear
        return <div className='year-view'>
            <Header onBackClick={this._onBackClick} onNextClick={this._onNextClick} title={this._formatTitle()} />
            <div className='body'>
                <Grid items={years}
                    renderCell={this._renderYear}
                    unit='year'
                    selection={this.props.selection} />
            </div>
        </div>
    }
}

YearView.propTypes = {
    renderYear: PropTypes.func,
    year: PropTypes.instanceOf(moment),
    selection: PropTypes.shape({
        mode: PropTypes.oneOf(['single', 'multiple', 'range']),
        onChange: PropTypes.func,
        items: PropTypes.arrayOf(PropTypes.instanceOf(moment)),
    })
};

YearView.defaultProps = {
    selection: {
        mode: 'none',
        items: [moment()]
    }
}

export default YearView