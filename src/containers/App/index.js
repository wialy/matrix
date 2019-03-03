import React from 'react'
import styled from '@emotion/styled'

import Matrix, { MatrixMode } from '../../components/Matrix'
import Button from '../../components/Button'

/**
 * Size of matrix grid
 */
const gridSize = 50
const numRows = 2
const numCols = 2

const Container = styled.div({
  position: 'fixed',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'stretch',
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
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  flex: 1
})

class App extends React.Component {
  state = {
    matrixMode: MatrixMode.layout,
    rows: Array.from(Array(numRows)).map((v, i) => gridSize * 2),
    columns: Array.from(Array(numCols)).map((v, i) => gridSize * 3),
    values: Array.from(Array(numRows)).map((v, i) =>
      Array.from(Array(numCols)).map((v, j) => `${i}:${j}`)
    )
  }
  handleClickMatrixMode = () =>
    this.setState(({ matrixMode }) => ({
      matrixMode:
        matrixMode === MatrixMode.data ? MatrixMode.layout : MatrixMode.data
    }))

  handleMatrixChange = changedFields => this.setState(changedFields)

  render () {
    const { matrixMode, rows, columns, values } = this.state
    return (
      <Container>
        <Header>
          <Button onClick={this.handleClickMatrixMode}>
            {matrixMode === MatrixMode.data ? 'Edit layout' : 'Done'}
          </Button>
        </Header>
        <Content>
          <Matrix
            mode={matrixMode}
            gridSize={gridSize}
            rows={rows}
            columns={columns}
            values={values}
            onChange={this.handleMatrixChange}
          />
        </Content>
      </Container>
    )
  }
}

export default App
