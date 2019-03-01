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
  flex: 1
})

class App extends React.Component {
  state = {
    matrixMode: MatrixMode.layout
  }
  handleClickMatrixMode = () =>
    this.setState(({ matrixMode }) => ({
      matrixMode:
        matrixMode === MatrixMode.data ? MatrixMode.layout : MatrixMode.data
    }))
  render () {
    const { matrixMode } = this.state
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
            rows={Array.from(Array(10)).map((v, i) => i + 1)}
            columns={Array.from(Array(10)).map((v, i) => i + 1)}
          />
        </Content>
      </Container>
    )
  }
}

export default App
