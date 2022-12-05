import CssBaseline from '@mui/material/CssBaseline'
import createTheme from '@mui/material/styles/createTheme'
import ThemeProvider from '@mui/material/styles/ThemeProvider'
import React from 'react'
import Smartkeys from 'react-smartkeys'
import Entrypoint from './Entrypoint'

const theme = createTheme({})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline>
        <Smartkeys.Provider>
          <Entrypoint />
        </Smartkeys.Provider>
      </CssBaseline>
    </ThemeProvider>
  )
}

export default App
