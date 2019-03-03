import styled from '@emotion/styled'

const Button = styled.div(({ color = '#2ECC40' }) => ({
  padding: '1em',
  borderRadius: '4px',
  backgroundColor: color,
  color: 'white',
  cursor: 'pointer'
}))

export default Button
