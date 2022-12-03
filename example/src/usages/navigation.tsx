import { Divider } from '@mui/material'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Smartkey, { useSmartkeys } from 'react-smartkeys'
import { routes, Route } from '.'

function NavigationItem({
  path,
  title,
  smartkey,
  selected
}: Route & { smartkey: string; selected: boolean }) {
  const navigate = useNavigate()

  const triggered = useSmartkeys({
    key: smartkey,
    group: 'Navigation'
  })

  useEffect(() => {
    if (triggered) {
      navigate(path)
    }
  }, [triggered])

  return (
    <ListItem disablePadding>
      <ListItemButton selected={selected} onClick={() => navigate(path)}>
        <Box
          display='flex'
          gap={2}
          alignItems='center'
          justifyContent='space-between'
          width='100%'
        >
          <ListItemText primary={title} />

          <Smartkey.View smartkey={smartkey} highlight highlightParts />
        </Box>
      </ListItemButton>
    </ListItem>
  )
}

function Navigation() {
  const location = useLocation()

  return (
    <Box bgcolor='background.paper'>
      <nav>
        <List>
          {routes.map((route, index) => (
            <NavigationItem
              key={index}
              smartkey={`mod+alt+${(index + 1) % 10}`}
              selected={route.path === location.pathname}
              {...route}
            />
          ))}
        </List>
      </nav>
    </Box>
  )
}

function withNavigation(Component: React.FC) {
  return () => (
    <Box display='flex' gap={2} flexGrow={1}>
      <Box pl={2} pt={1}>
        <Navigation />
      </Box>

      <Box height='100%'>
        <Divider orientation='vertical' />
      </Box>

      <Box flexGrow={1} pr={2} py={1}>
        <Component />
      </Box>
    </Box>
  )
}

export default withNavigation
