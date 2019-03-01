import React from 'react'
import PropTypes from 'prop-types'

import styled from '@emotion/styled'
import Layer from './Layer'

import smartSize from 'smart-size'

export const getSize = v => smartSize(v, { unit: 'px', scale: 32 })

export const MatrixMode = {
  layout: 'layout',
  data: 'data'
}

const Container = styled.div({
  position: 'relative',
  // overflow: 'hidden',
  flex: 1
})

const Dots = styled.div(({ visible = false, step = 1 }) => ({
  flex: 1,
  background: `radial-gradient(#ccc 1px, transparent 0)`,
  backgroundSize: getSize([step, step]),
  backgroundPosition: getSize([-step / 2, -step / 2]),
  opacity: visible ? 1 : 0,
  transition: 'opacity 0.3s ease-in-out',
  pointerEvents: 'none'
}))

const Cell = styled.div(({ w, h, y, x }) => ({
  position: 'absolute',
  top: getSize(y),
  left: getSize(x),
  width: getSize(w),
  height: getSize(h),
  outline: `2px solid rgba(242,242,242)`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  outlineOffset: '-1px'
}))

const Dragger = styled.div(({ x, y }) => ({
  position: 'absolute',
  width: getSize(1),
  height: getSize(1),
  top: getSize(y),
  left: getSize(x),
  transform: 'translate(-50%,-50%)',
  cursor: 'move',
  '&::after': {
    content: "''",
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%,-50%)',
    width: getSize(0.5),
    height: getSize(0.5),
    background: 'black',
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
    columns: PropTypes.arrayOf(PropTypes.number)
  }

  renderDotsLayer () {
    return (
      <Layer>
        <Dots />
      </Layer>
    )
  }

  render () {
    const { mode = MatrixMode.layout, rows, columns } = this.props
    return (
      <Container>
        <Layer>
          <Dots visible={mode === MatrixMode.layout} />
        </Layer>
        <Layer>
          {mapSum(rows, (h, y, i) =>
            mapSum(columns, (w, x, j) => (
              <Cell key={`cell_${i}:${j}`} x={x} y={y} w={w} h={h}>
                {w}x{h}
              </Cell>
            ))
          )}
        </Layer>
        <Layer>
          {mapSum(rows, (h, y, i) =>
            mapSum(columns, (w, x, j) => (
              <Dragger key={`cell_${i}:${j}`} x={x} y={y} w={w} h={h} />
            ))
          )}
        </Layer>
      </Container>
    )
  }
}

export default Matrix
