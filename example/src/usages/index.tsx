import React from 'react'
import type { RouteObject } from 'react-router'
import { createBrowserRouter } from 'react-router-dom'
import withNavigation from './navigation'
import NoUsage from './no-usage'
import SimpleUsage from './simple-usage'

const NoUsageProvided = withNavigation(NoUsage)
const SimpleUsageProvided = withNavigation(SimpleUsage)

export type Route = Exclude<RouteObject, 'path'> & {
  path: string
  title: string
}

export const routes: Route[] = [
  {
    title: 'Home',
    path: '/',
    element: <NoUsageProvided />
  },
  {
    title: 'Simple usage',
    path: '/simple',
    element: <SimpleUsageProvided />
  }
]

const router = createBrowserRouter(
  routes.map(({ title, ...route }) => {
    return route
  })
)

export default router
