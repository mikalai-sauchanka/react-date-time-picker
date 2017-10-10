import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import moment from 'moment'

class Grid extends Component {
    constructor (props) {
        super (props)

        this.state = this._getStateFromProps(props)
    }

    componentWillReceiveProps (nextProps) {
        this.setState(this._getStateFromProps(nextProps))
    }

    _setStartOf (items) {
        return items.map(item => item.clone().startOf(this.props.unit))
    }
    
    _getStateFromProps (props) {
        const selectedItems = this._setStartOf(props.selection.items || [])
        const startItem = props.selection.mode === 'range' ? selectedItems[0] : null
        const endItem = props.selection.mode === 'range' ? selectedItems[selectedItems.length - 1] : null
        return {selectedItems, startItem, endItem, mouseOverCell: null}
    }

    _areEqual = (a, b) => {
        return a.isSame(b, this.props.unit)
    }

    _getRange = (a, b) => {
        let start = a <= b ? a : b
        let end = a < b ? b : a
        let range = [start]
        while (!this._areEqual(start, end)) {
            start = start.clone().add(1, this.props.unit)
            range.push(start)
        }
        return range
    }

    _isSelected = (cell) => {
        return this.state.selectedItems.some(item => this._areEqual(item, cell))
    }
    
    _onCellClick = (cell) => {
        return (e) => {
            switch (this.props.selection.mode) {
                case 'single':
                    this._updateSelection([cell])
                    break
                case 'multiple':
                    let selectedItems = this.state.selectedItems.slice().filter(item => !this._areEqual(item, cell))
                    if (selectedItems.length === this.state.selectedItems.length) {
                        selectedItems.push(cell)
                    }
                    this.   _updateSelection(selectedItems)
                    break
                case 'range':
                    if (!this.state.startItem) {
                        this.setState({startItem: cell})
                        this._updateSelection([cell])
                        break
                    }
                    if (this._areEqual(this.state.startItem, cell)) {
                        if (this.state.endItem) {
                            this.setState({startItem: this.state.endItem, endItem: null})
                            this._updateSelection([this.state.endItem])
                        } else {
                            this.setState({startItem: null, endItem: null})
                            this._updateSelection([])
                        }
                        break
                    }
                    if (this.state.endItem && this._areEqual(this.state.endItem, cell)) {
                        this.setState({endItem: null})
                        this._updateSelection([this.state.startItem])
                        break
                    }
                    this.setState({endItem: cell})
                    this._updateSelection(this._getRange(this.state.startItem, cell))
                    break
            }
        }
    }

    _shouldHightlight = (cell) => {
        if (!this.state.mouseOverCell || !this.state.startItem || (this.state.endItem && !this._areEqual(this.state.startItem, this.state.endItem))) return false
        const units = `${this.props.unit}s`
        const [min, max] = [moment.min(this.state.startItem, this.state.mouseOverCell), moment.max(this.state.startItem, this.state.mouseOverCell)]
        return cell.diff(min, units) >= 0 && max.diff(cell, units) >= 0
    }

    _onCellMouseEnter = (cell) => {
        return () => this.setState({mouseOverCell: cell})
    }

    _updateSelection(items) {
        items = this._setStartOf(items)
        this.setState({selectedItems: items})
        this.props.selection.onChange && this.props.selection.onChange(items)
    }

    render() {
        const items = this.props.items
        return <div ref='grid' className='grid'>
            {items.map((row, i) =>
                <div key={i} className='row'>
                    {row.map((cell, i) => {
                        const className = classnames('cell', {'highlight': this._shouldHightlight(cell), 'selected': this._isSelected(cell)})
                        return <div key={i} className={className} onClick={this._onCellClick(cell)} onMouseEnter={this._onCellMouseEnter(cell)}>
                            {this.props.renderCell(cell)}
                        </div>
                    })}
                </div>
            )}
        </div>
    }
}

Grid.propTypes = {
    className: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.instanceOf(moment))),
    renderCell: PropTypes.func.isRequired,
    unit: PropTypes.oneOf(['day', 'month', 'year']).isRequired,
    selection: PropTypes.shape({
        mode: PropTypes.oneOf(['single', 'multiple', 'range']),
        onChange: PropTypes.func,
        items: PropTypes.arrayOf(PropTypes.instanceOf(moment))
    })
}

export default Grid