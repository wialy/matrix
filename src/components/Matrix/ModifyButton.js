import styled from '@emotion/styled'
import { transition } from './'

const ModifyButton = styled.div(
  ({ x, y, column = false, size = 20, remove }) => ({
    position: 'absolute',
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: '4px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: remove ? '#FF4136' : '#2ECC40',
    color: 'white',
    top: y,
    left: x,
    transition,
    cursor: 'pointer',
    transform: column
      ? `translate(-50%, ${-1.5 * size}px)`
      : `translate(${-1.5 * size}px, -50%)`,
    '&::after': {
      content: remove ? '"-"' : '"+"'
    },
    '&::before': {
      ...(column
        ? { width: '2px', height: `${0.5 * size}px`, top: `${size}px` }
        : { height: '2px', width: `${0.5 * size}px`, left: `${size}px` }),
      ...{
        content: '""',
        position: 'absolute',
        backgroundColor: '#eee'
      }
    }
  })
)
export default ModifyButton
