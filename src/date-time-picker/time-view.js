import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

const TRACKER_INTERNAL_MS = 100

class TimeView extends Component {
    _update (unit, delta) {
        let time = this.props.time.clone().add(delta, unit)
        this.props.onChange(time)
    }
    
    _onDownMouseDown = (unit) => {        
        return (e) => this._setTracker(unit, -1)
    }
    
    _onUpMouseDown = (unit) => {
        return (e) => this._setTracker(unit, 1)
    }

    _onDownMouseUp = () => {
        this._releaseTracker()
    }

    _onUpMouseUp = () => {
        this._releaseTracker()
    }

    _releaseTracker = () => {
        clearTimeout(this.tracker)
    }

    _setTracker = (unit, delta) => {
        this._update(unit, delta)
        this.tracker = setInterval(() => {
            this._update(unit, delta)                
        }, TRACKER_INTERNAL_MS)
    }

    _renderUpDown (unit) {
        const value = (this.props.time[unit]() || 0).toString()
        return <div className='up-down-container'>
            <div className='up' onMouseDown={this._onUpMouseDown(unit)} onMouseUp={this._onUpMouseUp} />
            <div className='value'>{'00'.substr(value.length) + value}</div>
            <div className='down' onMouseDown={this._onDownMouseDown(unit)} onMouseUp={this._onDownMouseUp} />
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