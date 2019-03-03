import React from 'react'
import styled from '@emotion/styled'

import Matrix, { MatrixMode } from '../../components/Matrix'
import Button from '../../components/Button'

/**
 * Size of matrix grid
 */
const gridSize = 50
const numRows = 1
const numCols = 1

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

const Controls = styled.div({
  flexBasis: '4em',
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  padding: '0 1rem',
  justifyContent: 'center'
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
    matrixMode: MatrixMode.data,
    rows: Array.from(Array(numRows)).map(() => gridSize * 3),
    columns: Array.from(Array(numCols)).map(() => gridSize * 3),
    values: Array.from(Array(numRows)).map((v, i) =>
      Array.from(Array(numCols)).map((v, j) => `Touch me`)
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
        <Controls>
          <Button onClick={this.handleClickMatrixMode}>
            {matrixMode === MatrixMode.data ? 'Edit layout' : 'Done'}
          </Button>
        </Controls>
      </Container>
    )
  }
}

export default App
