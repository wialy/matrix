import styled from '@emotion/styled'

const Layer = styled.div(({ visible = true }) => ({
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  display: 'flex',
  alignItems: 'stretch',
  opacity: visible ? void 0 : 0,
  pointerEvents: visible ? void 0 : 'none',
  transition: 'all 0.2s ease-in-out'
}))

export default Layer
