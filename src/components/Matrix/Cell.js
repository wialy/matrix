import styled from '@emotion/styled'

import { transition } from './'

const Cell = styled.div(({ w, h, y, x }) => ({
  width: `${w}px`,
  height: `${h}px`,
  outline: `4px solid #eee`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  outlineOffset: '-2px',
  transition
}))

export default Cell
