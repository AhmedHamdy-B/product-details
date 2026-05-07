import { createBrowserRouter } from 'react-router-dom'

import App from './App'
import { RouteErrorPage } from './pages/RouteErrorPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <RouteErrorPage />,
    children: [
      {
        index: true,
        lazy: async () => {
          const { ProductDetailPage } = await import('./pages/ProductDetailPage')
          return { Component: ProductDetailPage }
        },
      },
      {
        path: 'testing',
        lazy: async () => {
          const { TestingReferencePage } = await import('./pages/TestingReferencePage')
          return { Component: TestingReferencePage }
        },
      },
    ],
  },
])
