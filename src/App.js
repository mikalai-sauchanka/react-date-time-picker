import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import InfiniteCalendar from 'react-infinite-calendar';
import 'react-infinite-calendar/styles.css'; // only needs to be imported once
import moment from 'moment'

import DateTimePicker, {DayView, MonthView, DateTime, SingleDatePicker} from './date-time-picker'

class App extends Component {
  constructor (props) {
    super(props)

    this.state = {
      selectedDate: moment()
    }
  }

  _onChange = (day) => {
    this.setState({selectedDate: day})
  }

  render() {
    return (
      <div className="App">
        <SingleDatePicker
          onChange={this._onChange}
          value={this.state.selectedDate}
          closeOnChange
          closeOnClickOutside />
      </div>
    );
  }
}

export default App;
