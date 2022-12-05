import { Box, Typography } from '@mui/material'
import React from 'react'
import Smartkey from 'react-smartkeys'

function SimpleUsage() {
  return (
    <Box>
      <Typography variant='h2'>Simple usage</Typography>

      <Smartkey.View smartkey='mod+x' highlight />
    </Box>
  )
}

export default SimpleUsage
