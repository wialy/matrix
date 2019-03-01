import React from 'react'
import styled from '@emotion/styled'

import smartSize from 'smart-size'
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
  flexBasis: smartSize(4),
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  padding: smartSize(1)
})

const Content = styled.div({
  display: 'flex',
  flex: 1,
  padding: smartSize(4)
})

const snapDistance = 50

class App extends React.Component {
  state = {
    snap: snapDistance,
    matrixMode: MatrixMode.layout,
    rows: Array.from(Array(3)).map((v, i) => snapDistance * (i + 1)),
    columns: Array.from(Array(5)).map((v, i) => snapDistance * (i + 1))
  }
  handleClickMatrixMode = () =>
    this.setState(({ matrixMode }) => ({
      matrixMode:
        matrixMode === MatrixMode.data ? MatrixMode.layout : MatrixMode.data
    }))

  resizeMapCallback = (index, delta) => (v, i) =>
    Math.max(this.state.snap, i === index ? v + delta : v)

  handleMatrixResize = e => {
    const { handle, delta } = e
    this.setState({
      rows: this.state.rows.map(this.resizeMapCallback(handle.i, delta.y)),
      columns: this.state.columns.map(this.resizeMapCallback(handle.j, delta.x))
    })
  }

  handleMatrixDelete = ({ row, column }) => {
    if (row != null && !Number.isNaN(row)) {
      this.setState({
        rows: [
          ...this.state.rows.slice(0, row),
          ...this.state.rows.slice(row + 1)
        ]
      })
    } else if (column != null && !Number.isNaN(column)) {
      this.setState({
        columns: [
          ...this.state.columns.slice(0, column),
          ...this.state.columns.slice(column + 1)
        ]
      })
    }
  }

  handleMatrixInsert = ({ row, column }) => {
    if (row != null && !Number.isNaN(row)) {
      this.setState({
        rows: [
          ...this.state.rows.slice(0, row),
          snapDistance,
          ...this.state.rows.slice(row)
        ]
      })
    } else if (column != null && !Number.isNaN(column)) {
      this.setState({
        columns: [
          ...this.state.columns.slice(0, column),
          snapDistance,
          ...this.state.columns.slice(column)
        ]
      })
    }
  }

  render () {
    const { matrixMode, snap, rows, columns } = this.state
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
            snap={snap}
            rows={rows}
            columns={columns}
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
