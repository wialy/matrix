import styled from '@emotion/styled'

const Dots = styled.div(({ gridSize = 32 }) => ({
  flex: 1,
  background: `radial-gradient(#eee 2px, transparent 0)`,
  backgroundSize: `${gridSize}px ${gridSize}px`,
  backgroundPosition: `${-0.5 * gridSize}px ${-0.5 * gridSize}px`,
  pointerEvents: 'none'
}))

export default Dots
