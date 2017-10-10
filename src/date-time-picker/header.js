import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

class Header extends Component {
    render() {
        return <div className={classnames('header', this.props.className)}>
            <div className='back' onClick={this.props.onBackClick}></div>
            <div className='title' onClick={this.props.onTitleClick}>{this.props.title}</div>
            <div className='next' onClick={this.props.onNextClick}></div>
        </div>
    }
}

Header.propTypes = {
    className: PropTypes.string,
    title: PropTypes.string,
    onBackClick: PropTypes.func,
    onNextClick: PropTypes.func,
    onTitleClick: PropTypes.func
}

export default Header