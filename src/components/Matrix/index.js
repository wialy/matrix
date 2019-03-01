import React from 'react'
import PropTypes from 'prop-types'

import styled from '@emotion/styled'
import Layer from './Layer'

import { DraggableCore } from 'react-draggable'

export const MatrixMode = {
  layout: 'layout',
  data: 'data'
}

const Container = styled.div({
  position: 'relative',
  flex: 1
})

const Dots = styled.div(({ snap = 32 }) => ({
  flex: 1,
  background: `radial-gradient(#ccc 1px, transparent 0)`,
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
  outline: `2px solid rgba(242,242,242)`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  outlineOffset: '-1px',
  transition: 'all 0.1s ease-out'
}))

const Handle = styled.div(({ x, y }) => ({
  position: 'absolute',
  width: '50px',
  height: '50px',
  left: `${x - 25}px`,
  top: `${y - 25}px`,
  cursor: 'move',
  transition: 'all 0.1s ease-out',
  '&::after': {
    content: "''",
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%,-50%)',
    width: '10px',
    height: '10px',
    background: 'orange',
    borderRadius: '50%'
  }
}))

const mapSum = function (array, f) {
  let total = 0
  const result = []
  for (let i = 0; i < array.length; i++) {
    result.push(f(array[i], total, i, array))
    total += array[i]
  }
  return result
}

class Matrix extends React.Component {
  static propTypes = {
    mode: PropTypes.oneOf(Object.keys(MatrixMode)),
    rows: PropTypes.arrayOf(PropTypes.number),
    columns: PropTypes.arrayOf(PropTypes.number),
    snap: PropTypes.number,
    onResize: PropTypes.func
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

  render () {
    const { mode = MatrixMode.layout, rows, columns, snap } = this.props
    return (
      <Container>
        <Layer visible={mode === MatrixMode.layout}>
          <Dots snap={snap} />
        </Layer>
        <Layer>
          {mapSum(rows, (h, y, i) =>
            mapSum(columns, (w, x, j) => (
              <Cell key={`cell_${i}:${j}`} x={x} y={y} w={w} h={h}>
                {i}:{j}
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
                  key={`handle_${i}:${j}`}
                  data-coo={JSON.stringify({ i, j })}
                  x={x + w}
                  y={y + h}
                />
              ))
            )}
          </Layer>
        </DraggableCore>
      </Container>
    )
  }
}

export default Matrix
