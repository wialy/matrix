import React from 'react'
import styled from '@emotion/styled'

import Matrix, { MatrixMode } from '../../components/Matrix'
import GlobalStyles from '../../styles/GlobalStyles'

const Container = styled.div({
  position: 'fixed',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  display: 'flex',
  flexDirection: 'column',
  fontFamily: 'Helvetica, Arial, sans-serif'
})

const Header = styled.div({
  flexBasis: '4em',
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  padding: '0 1rem'
})

const Content = styled.div({
  display: 'flex',
  flex: 1
})

/**
 * Size of matrix grid
 */
const gridSize = 50
const numRows = 3
const numCols = 3

const resizeMapCallback = (index, delta) => (v, i) =>
  Math.max(gridSize, i === index ? v + delta : v)

const safelyDelete = (array, index) =>
  index != null && !Number.isNaN(index) && array.length > 1
    ? [...array.slice(0, index), ...array.slice(index + 1)]
    : array

const safelyInsert = (array, index, value) =>
  index != null && !Number.isNaN(index)
    ? [...array.slice(0, index), value, ...array.slice(index)]
    : array

class App extends React.Component {
  state = {
    matrixMode: MatrixMode.layout,
    rows: Array.from(Array(numRows)).map((v, i) => gridSize * (i + 1)),
    columns: Array.from(Array(numCols)).map((v, i) => gridSize * (i + 1)),
    values: Array.from(Array(numRows)).map((v, i) =>
      Array.from(Array(numCols)).map((v, j) => `${i}:${j}`)
    )
  }
  handleClickMatrixMode = () =>
    this.setState(({ matrixMode }) => ({
      matrixMode:
        matrixMode === MatrixMode.data ? MatrixMode.layout : MatrixMode.data
    }))

  handleMatrixResize = e => {
    const { handle, delta } = e
    this.setState({
      rows: this.state.rows.map(resizeMapCallback(handle.i, delta.y)),
      columns: this.state.columns.map(resizeMapCallback(handle.j, delta.x))
    })
  }

  handleMatrixDelete = ({ row, column }) =>
    this.setState(({ rows, columns, values }) => ({
      rows: safelyDelete(rows, row),
      columns: safelyDelete(columns, column),
      values: safelyDelete(values, row).map(col => safelyDelete(col, column))
    }))

  handleMatrixInsert = ({ row, column }) =>
    this.setState(({ rows, columns, values }) => ({
      rows: safelyInsert(rows, row, gridSize),
      columns: safelyInsert(columns, column, gridSize),
      values: safelyInsert(values, row, Array.from(Array(columns.length))).map(
        col => safelyInsert(col, column, void 0)
      )
    }))

  render () {
    const { matrixMode, rows, columns, values } = this.state
    return (
      <Container>
        <GlobalStyles />
        <Header>
          Matrix mode:{' '}
          <span onClick={this.handleClickMatrixMode}>{matrixMode}</span>
        </Header>
        <Content>
          <Matrix
            mode={matrixMode}
            gridSize={gridSize}
            rows={rows}
            columns={columns}
            values={values}
            onResize={this.handleMatrixResize}
            onInsert={this.handleMatrixInsert}
            onDelete={this.handleMatrixDelete}
          />
        </Content>
      </Container>
    )
  }
}

export default App
