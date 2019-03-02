import React from 'react'
import PropTypes from 'prop-types'

import { DraggableCore } from 'react-draggable'

import Layer from './Layer'
import Dots from './Dots'
import Cell from './Cell'
import ModifyButton from './ModifyButton'
import DragHandle from './DragHandle'
import Container from './Container'

export const MatrixMode = {
  layout: 'layout',
  data: 'data'
}

export const transition = 'all 0.1s ease-out'

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

class Matrix extends React.Component {
  static propTypes = {
    rows: PropTypes.arrayOf(PropTypes.number).isRequired,
    columns: PropTypes.arrayOf(PropTypes.number).isRequired,
    values: PropTypes.array,
    mode: PropTypes.oneOf(Object.keys(MatrixMode)),
    gridSize: PropTypes.number,
    onResize: PropTypes.func,
    onInsert: PropTypes.func,
    onDelete: PropTypes.func
  }

  state = {
    resizeHandle: null,
    deletedRows: []
  }

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
      }
    } catch (err) {}
  }

  handleDragStop = (e, data) => {
    this.setState({ resizeHandle: null })
  }

  handleDrag = (e, { deltaX: x, deltaY: y }) => {
    if (this.state.resizeHandle) {
      if (typeof this.props.onResize === 'function') {
        this.props.onResize({
          handle: this.state.resizeHandle,
          delta: { x, y }
        })
      }
    }
  }

  handleClickDelete = e => {
    if (typeof this.props.onDelete === 'function') {
      const { row, column } = e.currentTarget.dataset
      const rowNumber = parseInt(row)
      const columnNumber = parseInt(column)
      this.props.onDelete({ row: rowNumber, column: columnNumber })
    }
  }

  handleClickInsert = e => {
    if (typeof this.props.onInsert === 'function') {
      const { row, column } = e.currentTarget.dataset
      const rowNumber = parseInt(row)
      const columnNumber = parseInt(column)
      this.props.onInsert({ row: rowNumber, column: columnNumber })
    }
  }

  render () {
    const {
      mode = MatrixMode.layout,
      rows,
      columns,
      gridSize,
      values
    } = this.props
    const totalRows = rows.length
    const totalColumns = columns.length
    return (
      <Container>
        <Layer visible={mode === MatrixMode.layout}>
          <Dots gridSize={gridSize} />
        </Layer>
        <Layer>
          {mapSum(rows, (h, y, i) =>
            mapSum(columns, (w, x, j) => (
              <Cell
                key={`cell-${i}:${j}-${totalRows * totalColumns}`}
                x={x}
                y={y}
                w={w}
                h={h}>
                {Array.isArray(values[i]) && values[i][j]}
              </Cell>
            ))
          )}
        </Layer>
        <DraggableCore
          grid={[gridSize, gridSize]}
          onStart={this.handleDragStart}
          onDrag={this.handleDrag}
          onStop={this.handleDragStop}>
          <Layer visible={mode === MatrixMode.layout}>
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
                  key={`insert-col-${i + 1}-${totalColumns}`}
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
