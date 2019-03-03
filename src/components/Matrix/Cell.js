import styled from '@emotion/styled'

import { transition } from './'

const Cell = styled.div(({ w, h, touchable }) => ({
  width: `${w}px`,
  height: `${h}px`,
  outline: `4px solid #eee`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  outlineOffset: '-2px',
  pointerEvents: touchable ? void 0 : 'none',
  color: touchable ? 'black' : '#ccc',
  transition,
  '&:focus': {
    outline: `4px solid #FFFF00`,
    backgroundColor: '#FFFF00',
    zIndex: 1
  }
}))

export default Cell
