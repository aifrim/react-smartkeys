import { Box, Divider, Typography } from '@mui/material'
import React from 'react'
import { RouterProvider } from 'react-router-dom'
import router from './usages'

function Entrypoint() {
  return (
    <Box height='100vh' width='100vw'>
      <Box display='flex' flexDirection='column' height='100%'>
        <Typography variant='h1' p={2}>
          🧠 react-smartkeys
        </Typography>

        <Box display='flex' flexDirection='column' flexGrow={1}>
          <Divider />

          <RouterProvider router={router} />
        </Box>
      </Box>
    </Box>
  )
}

export default Entrypoint
