import styled from '@emotion/styled'

import { transition } from './'

const DragHandle = styled.div(({ x, y }) => ({
  position: 'absolute',
  width: '50px',
  height: '50px',
  left: `${x - 25}px`,
  top: `${y - 25}px`,
  cursor: 'move',
  transition,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  '&::after': {
    content: "''",
    width: '12px',
    height: '12px',
    background: '#FF851B',
    borderRadius: '50%',
    border: '4px solid white'
  }
}))

export default DragHandle
