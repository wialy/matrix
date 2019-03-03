import React from 'react'
import PropTypes from 'prop-types'

import { DraggableCore } from 'react-draggable'

import Layer from './Layer'
import Dots from './Dots'
import Cell from './Cell'
import Row from './Row'
import ModifyButton from './ModifyButton'
import DragHandle from './DragHandle'
import Container from './Container'

export const MatrixMode = {
  layout: 'layout',
  data: 'data'
}

export const transition = 'all 0.1s ease-out'

const defaultGridSize = 50

/**
 * Iterates the array calling callback function on every element
 * Callback receives 4 params: current element, sum of elements from first to current,
 * current index and array, on which function is called.
 * @param {array} array
 * @param {function} callback
 */
const mapSum = function (array, callback) {
  let total = 0
  const result = []
  for (let i = 0; i < array.length; i++) {
    result.push(callback(array[i], total, i, array))
    total += array[i]
  }
  return result
}

/**
 * Callback function called when matrix cell is being resized.
 * Returns function, that changes cell size by delta, keeping minimum gridSize.
 * @param {number} index
 * @param {number} delta
 * @param {number} gridSize
 */
const resizeMapCallback = (index, delta, gridSize = defaultGridSize) => (
  v,
  i
) => Math.max(gridSize, i === index ? v + delta : v)

/**
 * Safely removes element at index position from array.
 * Does not allows to remove last element.
 * @param {array} array
 * @param {number} index
 */
const safelyDelete = (array, index) =>
  index != null &&
  !Number.isNaN(index) &&
  Array.isArray(array) &&
  array.length > 1
    ? [...array.slice(0, index), ...array.slice(index + 1)]
    : array

/**
 * Safely inserts value into array at index position.
 * @param {array} array
 * @param {number} index
 * @param {*} value
 */
const safelyInsert = (array, index, value) =>
  index != null && !Number.isNaN(index) && index >= 0
    ? [...array.slice(0, index), value, ...array.slice(index)]
    : array

/**
 * Main matrix class.
 * @param {array} rows - array of rows' heights, required
 * @param {array} columns - array of columns' widths, required
 * @param {array} values - two dimensional array of values, required
 * @param {function} onChange - function that is called every time the layout or values change
 * @param {string} mode - sets matrix to data/layout edition modes
 * @param {number} gridSize - size of grid the matrix snaps to
 */
class Matrix extends React.PureComponent {
  static propTypes = {
    rows: PropTypes.arrayOf(PropTypes.number).isRequired,
    columns: PropTypes.arrayOf(PropTypes.number).isRequired,
    values: PropTypes.array.isRequired,
    mode: PropTypes.oneOf(Object.keys(MatrixMode)),
    gridSize: PropTypes.number,
    onChange: PropTypes.func
  }

  state = {
    resizeHandle: null
  }

  // Drag handlers
  handleDragStart = e => {
    try {
      const { type } = e.target.dataset
      let coo
      switch (type) {
        case 'handle':
          coo = JSON.parse(e.target.dataset.coo)
          this.setState({
            resizeHandle: coo
          })
          break
        // other drag interactions may be added here
        default:
          // no default
          break
      }
    } catch (err) {}
  }
  handleDragStop = () => this.setState({ resizeHandle: null })
  handleDrag = (e, { deltaX, deltaY }) => {
    if (typeof this.props.onChange === 'function') {
      const { resizeHandle } = this.state
      if (resizeHandle) {
        const { rows, columns, gridSize = defaultGridSize } = this.props
        this.props.onChange({
          rows: rows.map(resizeMapCallback(resizeHandle.i, deltaY, gridSize)),
          columns: columns.map(
            resizeMapCallback(resizeHandle.j, deltaX, gridSize)
          )
        })
      }
    }
  }

  // Delete row or column
  handleClickDelete = e => {
    if (typeof this.props.onChange === 'function') {
      const { rows, columns, values } = this.props
      const { row, column } = e.currentTarget.dataset
      const i = parseInt(row)
      const j = parseInt(column)
      this.props.onChange({
        rows: safelyDelete(rows, i),
        columns: safelyDelete(columns, j),
        values: safelyDelete(values, i).map(col => safelyDelete(col, j))
      })
    }
  }

  // Insert row or column
  handleClickInsert = e => {
    if (typeof this.props.onChange === 'function') {
      const { rows, columns, values, gridSize = defaultGridSize } = this.props
      const { row, column } = e.currentTarget.dataset
      const i = parseInt(row)
      const j = parseInt(column)
      this.props.onChange({
        rows: safelyInsert(rows, i, gridSize),
        columns: safelyInsert(columns, j, gridSize),
        values: safelyInsert(values, i, Array.from(Array(columns.length))).map(
          col => safelyInsert(col, j, void 0)
        )
      })
    }
  }

  // Edit data handlers.
  handleCellKeyDown = e =>
    e.key === 'Enter' && document.activeElement && document.activeElement.blur()
  handleCellBlur = e => {
    if (typeof this.props.onChange === 'function') {
      const { innerHTML } = e.currentTarget
      const { coo } = e.currentTarget.dataset
      const currentCell = JSON.parse(coo)
      const { values } = this.props

      this.props.onChange({
        values: values.map((row, i) =>
          i === currentCell.i
            ? row.map((cell, j) =>
              j === currentCell.j
                ? String(innerHTML).replace(/&nbsp;|\u202F|\u00A0/g, ' ')
                : cell
            )
            : row
        )
      })
    }
  }

  render () {
    const {
      rows,
      columns,
      values,
      gridSize = defaultGridSize,
      mode = MatrixMode.layout
    } = this.props
    const totalRows = rows.length
    const totalColumns = columns.length
    return (
      <Container margin={gridSize}>
        {/* Dots in background, visible only in layout edit mode */}
        <Layer visible={mode === MatrixMode.layout} absolute>
          <Dots gridSize={gridSize} />
        </Layer>
        {/* Matrix values */}
        <Layer>
          {rows.map((h, i) => (
            <Row key={`row-${i}-${totalRows}`}>
              {columns.map((w, j) => (
                <Cell
                  key={`cell-${i}:${j}-${totalRows * totalColumns}`}
                  w={w}
                  h={h}
                  data-coo={JSON.stringify({ i, j })}
                  touchable={mode === MatrixMode.data}
                  contentEditable
                  spellCheck={false}
                  suppressContentEditableWarning
                  onBlur={this.handleCellBlur}
                  onKeyDown={this.handleCellKeyDown}>
                  {Array.isArray(values[i]) && values[i][j]}
                </Cell>
              ))}
            </Row>
          ))}
        </Layer>
        {/* Layout edit mode elements */}
        <DraggableCore
          grid={[gridSize, gridSize]}
          onStart={this.handleDragStart}
          onDrag={this.handleDrag}
          onStop={this.handleDragStop}>
          <Layer visible={mode === MatrixMode.layout}>
            {/* Draggable elements to resize matrix cells */}
            {mapSum(rows, (h, y, i) =>
              mapSum(columns, (w, x, j) => (
                <DragHandle
                  key={`handle-${i}:${j}-${totalRows * totalColumns}`}
                  data-type={'handle'}
                  data-coo={JSON.stringify({ i, j })}
                  x={x + w}
                  y={y + h}
                />
              ))
            )}
            {/* Insert rows and columsn buttons */}
            <ModifyButton
              key={`insert-row-0-${totalRows}`}
              x={0}
              y={0}
              data-row={0}
              onClick={this.handleClickInsert}
            />
            {mapSum(rows, (h, y, i) => (
              <ModifyButton
                key={`insert-row-${i + 1}-${totalRows}`}
                x={0}
                y={y + h}
                data-row={i + 1}
                onClick={this.handleClickInsert}
              />
            ))}
            <ModifyButton
              key={`insert-col-0-${totalColumns}`}
              x={0}
              y={0}
              column
              data-column={0}
              onClick={this.handleClickInsert}
            />
            {mapSum(columns, (w, x, i) => (
              <ModifyButton
                key={`insert-col-${i + 1}-${totalColumns}`}
                x={x + w}
                y={0}
                column
                data-column={i + 1}
                onClick={this.handleClickInsert}
              />
            ))}
            {/* Delete rows and columns buttons */}
            {rows.length > 1 &&
              mapSum(rows, (h, y, i) => (
                <ModifyButton
                  key={`delete-row-${i + 1}-${totalRows}`}
                  data-row={i}
                  x={0}
                  y={y + h / 2}
                  remove
                  onClick={this.handleClickDelete}
                />
              ))}
            {columns.length > 1 &&
              mapSum(columns, (w, x, i) => (
                <ModifyButton
                  key={`delete-col-${i + 1}-${totalColumns}`}
                  x={x + w / 2}
                  y={0}
                  data-column={i}
                  column
                  remove
                  onClick={this.handleClickDelete}
                />
              ))}
          </Layer>
        </DraggableCore>
      </Container>
    )
  }
}

export default Matrix
