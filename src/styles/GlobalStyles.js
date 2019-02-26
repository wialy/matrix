import React from 'react'
import { Global } from '@emotion/core'

const globalStyles = {
  '*': {
    boxSizing: 'border-box'
  }
}

const GlobalStyles = () => <Global styles={globalStyles} />

export default GlobalStyles
