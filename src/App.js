import React, { Component } from 'react';
import logo from './logo.svg';
import InfiniteCalendar from 'react-infinite-calendar';
import moment from 'moment'

import './App.css';

import 'react-infinite-calendar/styles.css'; // only needs to be imported once

import DateTimePicker, {DayView, MonthView, DateTime, SingleDatePicker} from './date-time-picker'

const VIEW_TYPES = [{
  value: 'SDP',
  label: 'Single Date Picker'
}, {
  value: 'MDP',
  label: 'Multiple Date Picker'
}, {
  value: 'RDP',
  label: 'Rangle Date Picker'
}, {
  value: 'DTP',
  label: 'Date Time Picker'
}]

const DAYS_OF_WEEK = [{
  value: 0,
  label: 'Sunday'
}, {
  value: 1,
  label: 'Monday'
}, {
  value: 2,
  label: 'Tuesday'
}, {
  value: 3,
  label: 'Wednesday'
}, {
  value: 4,
  label: 'Thursday'
}, {
  value: 5,
  label: 'Friday'
}, {
  value: 6,
  label: 'Saturday'
}]

const CUSTOM_DISPLAY_FORMATS = {
  'SDP': (date) => <span>{date.format('DD/MM/YYYY')}</span>,
  'DTP': (date) => <span>{date.format('DD/MM/YYYY')} <i className='icon-time' 
    style={{margin: '0 3px', width: '16px', height: '16px', display: 'inline-block', backgroundSize: '1em', verticalAlign: 'middle'}} />{date.format('HH:mm')}</span>
}

class App extends Component {
  constructor (props) {
    super(props)

    this.state = {
      selectedDate: null,
      firstDayOfWeek: 0,
      isCustomDisplayFormat: false,
      showTodayButton: false,
      showResetButton: false,
      viewType: 'DTP'
    }
  }

  _onChange = (day) => {
    this.setState({selectedDate: day})
  }

  _onTypeChange = (e) => {
    this.setState({viewType: e.target.value})
  }

  _onFirstDayOfWeekChange = (e) => {
    this.setState({firstDayOfWeek: +e.target.value})
  }

  _onCustomDisplayFormatChange = (e) => {
    this.setState({isCustomDisplayFormat: !this.state.isCustomDisplayFormat})
  }

  _onShowResetButtonChange = (e) => {
    this.setState({showResetButton: !this.state.showResetButton})
  }

  _onShowTodayButtonChange = (e) => {
    this.setState({showTodayButton: !this.state.showTodayButton})
  }

  render() {
    const commonProps = {
      firstDayOfWeek: this.state.firstDayOfWeek,
      onChange: this._onChange,
      closeOnChange: true,
      closeOnClickOutside: true,
      showTodayButton: this.state.showTodayButton,
      showResetButton: this.state.showResetButton,
      displayFormat: this.state.isCustomDisplayFormat ? CUSTOM_DISPLAY_FORMATS[this.state.viewType] : undefined
    }

    let component = null
    switch (this.state.viewType) {
      case 'SDP': component = <SingleDatePicker
        {...commonProps}
        value={this.state.selectedDate}/>
        break
      case 'DTP': component = <DateTimePicker
        {...commonProps}
        value={this.state.selectedDate} />
        break
    }

    return <div className='app'>
      <div className='flex-row'>
        <div className='component'>
          {component}
        </div>
        <div className='settings-container'>
          <div className='field'>
            <label className='label'>View Type:</label>
            <select className='control' value={this.state.viewType} onChange={this._onTypeChange}>
              {VIEW_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div className='field'>
            <label className='label'>First Day Of Week</label>
            <select className='control' value={this.state.firstDayOfWeek} onChange={this._onFirstDayOfWeekChange}>
              {DAYS_OF_WEEK.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div className='field'>
            <label className='label'><input type='checkbox' onChange={this._onCustomDisplayFormatChange} checked={this.state.isCustomDisplayFormat} /> Custom Display Format</label>        
          </div>
          <div className='field'>
            <label className='label'><input type='checkbox' onChange={this._onShowTodayButtonChange} checked={this.state.showTodayButton} /> Show Today Button</label>        
          </div>
          <div className='field'>
            <label className='label'><input type='checkbox' onChange={this._onShowResetButtonChange} checked={this.state.showResetButton} /> Show Reset Button</label>        
          </div>
        </div>
      </div>
      <h3 className='selected-date-preview'>Selected: {this.state.selectedDate ? this.state.selectedDate.toString() : 'None'}</h3>
    </div>
  }
}

export default App;
