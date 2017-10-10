import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

class TimeView extends Component {
    // constructor (props) {
    //     super(props)

    //     this.state = this._getStateFromProps(props)
    // }

    // componentWillReceiveProps (nextProps) {
    //     if (nextProps.hour !== this.props.hour && nextProps.minute && this.props.minute) {
    //         this.setState(this._getStateFromProps(nextProps))
    //     }
    // }

    // _getStateFromProps (props) {
    //     return {
    //         hour: props.hour,
    //         minute: props.minute
    //     }
    // }

    _update (unit, delta) {
        let time = this.props.time.clone().add(delta, unit)
        this.props.onChange(time)
    }
    
    _onDownClick = (unit) => {
        return (e) => this._update(unit, -1)
    }
    
    _onUpClick = (unit) => {
        return (e) => this._update(unit, 1)
    }

    _renderUpDown (unit) {
        const value = (this.props.time[unit]() || 0).toString()
        return <div className='up-down-container'>
            <div className='up' onClick={this._onUpClick(unit)} />
            <div className='value'>{'00'.substr(value.length) + value}</div>
            <div className='down' onClick={this._onDownClick(unit)} />
        </div>
    }

    render() {
        return <div className='time-view'>
            {this._renderUpDown('hour')}
            {this._renderUpDown('minute')}
        </div>
    }
}

TimeView.propTypes = {
    time: PropTypes.instanceOf(moment),
    onChange: PropTypes.func.isRequired
}

export default TimeView