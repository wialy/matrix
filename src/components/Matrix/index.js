import React from 'react'
import PropTypes from 'prop-types'

import styled from '@emotion/styled'
import Layer from './Layer'

import { DraggableCore } from 'react-draggable'

export const MatrixMode = {
  layout: 'layout',
  data: 'data'
}

const transition = 'all 0.1s ease-out'

const Container = styled.div({
  position: 'relative',
  flex: 1
})

const Dots = styled.div(({ snap = 32 }) => ({
  flex: 1,
  background: `radial-gradient(#eee 2px, transparent 0)`,
  backgroundSize: `${snap}px ${snap}px`,
  backgroundPosition: `${-0.5 * snap}px ${-0.5 * snap}px`,
  pointerEvents: 'none'
}))

const Cell = styled.div(({ w, h, y, x }) => ({
  position: 'absolute',
  left: `${x}px`,
  top: `${y}px`,
  width: `${w}px`,
  height: `${h}px`,
  outline: `4px solid #eee`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  outlineOffset: '-2px',
  transition
}))

const Handle = styled.div(({ x, y }) => ({
  position: 'absolute',
  width: '50px',
  height: '50px',
  left: `${x - 25}px`,
  top: `${y - 25}px`,
  cursor: 'move',
  transition,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  '&::after': {
    content: "''",
    width: '12px',
    height: '12px',
    background: '#FF851B',
    borderRadius: '50%',
    border: '4px solid white'
  }
}))

const InsertDeleteButton = styled.div(
  ({ x, y, column = false, size = 20, remove }) => ({
    position: 'absolute',
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: '4px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: remove ? '#FF4136' : '#2ECC40',
    color: 'white',
    top: y,
    left: x,
    transition,
    cursor: 'pointer',
    transform: remove
      ? `translate(${-size / 2}px, ${-size / 2}px)`
      : column
        ? `rotate(90deg) translate(${-2 * size}px, 50%)`
        : `translate(${-2 * size}px, -50%)`,
    '&::after': {
      content: remove ? '"-"' : '"✚"'
    },
    '&::before': remove
      ? void 0
      : {
        content: '""',
        position: 'absolute',
        height: '2px',
        width: `${size}px`,
        left: `${size}px`,
        backgroundColor: '#eee'
      }
  })
)

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
    mode: PropTypes.oneOf(Object.keys(MatrixMode)),
    snap: PropTypes.number,
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
    const { mode = MatrixMode.layout, rows, columns, snap } = this.props
    const totalRows = rows.length
    const totalColumns = columns.length
    return (
      <Container>
        <Layer visible={mode === MatrixMode.layout}>
          <Dots snap={snap} />
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
                {w / snap}x{h / snap}
              </Cell>
            ))
          )}
        </Layer>
        <DraggableCore
          grid={[snap, snap]}
          onStart={this.handleDragStart}
          onDrag={this.handleDrag}
          onStop={this.handleDragStop}>
          <Layer visible={mode === MatrixMode.layout}>
            {mapSum(rows, (h, y, i) =>
              mapSum(columns, (w, x, j) => (
                <Handle
                  data-type={'handle'}
                  key={`handle-${i}:${j}-${totalRows * totalColumns}`}
                  data-coo={JSON.stringify({ i, j })}
                  x={x + w}
                  y={y + h}
                />
              ))
            )}
            <InsertDeleteButton
              key={`insert-row-0-${totalRows}`}
              x={0}
              y={0}
              data-row={0}
              onClick={this.handleClickInsert}
            />
            {mapSum(rows, (h, y, i) => (
              <InsertDeleteButton
                key={`insert-row-${i + 1}-${totalRows}`}
                x={0}
                y={y + h}
                data-row={i + 1}
                onClick={this.handleClickInsert}
              />
            ))}
            <InsertDeleteButton
              key={`insert-col-0-${totalColumns}`}
              x={0}
              y={0}
              column
              data-column={0}
              onClick={this.handleClickInsert}
            />
            {mapSum(columns, (w, x, i) => (
              <InsertDeleteButton
                key={`insert-col-${i + 1}-${totalColumns}`}
                x={x + w}
                y={0}
                column
                data-column={i + 1}
                onClick={this.handleClickInsert}
              />
            ))}

            {mapSum(rows, (h, y, i) => (
              <InsertDeleteButton
                key={`delete-row-${i + 1}-${totalRows}`}
                data-row={i}
                x={0}
                y={y + h / 2}
                remove
                onClick={this.handleClickDelete}
              />
            ))}
            {mapSum(columns, (w, x, i) => (
              <InsertDeleteButton
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
