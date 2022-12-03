import { Box, Typography } from '@mui/material'
import React from 'react'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded'

function NoUsage() {
  return (
    <Box>
      <Typography mb={3} variant='h2'>
        Example app
      </Typography>

      <Alert severity='warning'>
        <AlertTitle>Warning</AlertTitle>
        This is only used for testing, it is <strong>not documentation</strong>
      </Alert>

      <Box display='flex' gap={1} alignItems='center' mt={3}>
        <ArrowBackIosNewRoundedIcon />

        <Typography variant='body2'>
          Click on the menu to navigate testing use cases
        </Typography>
      </Box>
    </Box>
  )
}

export default NoUsage
