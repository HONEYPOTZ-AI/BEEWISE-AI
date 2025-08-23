
import { http, HttpResponse } from 'msw'

export const handlers = [
  // Auth handlers
  http.post('/api/auth/login', () => {
    return HttpResponse.json({ error: null })
  }),

  http.post('/api/auth/register', () => {
    return HttpResponse.json({ error: null })
  }),

  http.post('/api/auth/logout', () => {
    return HttpResponse.json({ error: null })
  }),

  http.get('/api/auth/user', () => {
    return HttpResponse.json({
      data: {
        ID: 1,
        Name: 'Test User',
        Email: 'test@example.com',
        CreateTime: new Date().toISOString(),
        Roles: 'GeneralUser'
      },
      error: null
    })
  }),

  // API testing handlers
  http.get('/api/test', () => {
    return HttpResponse.json({ message: 'Test successful' })
  }),

  http.post('/api/test', () => {
    return HttpResponse.json({ message: 'Post test successful' })
  }),

  // Table operations
  http.get('/api/table/:tableId', () => {
    return HttpResponse.json({
      data: {
        List: [
          { id: 1, name: 'Test Config', endpoint: 'https://api.example.com' }
        ],
        VirtualCount: 1
      },
      error: null
    })
  }),

  http.post('/api/table/:tableId', () => {
    return HttpResponse.json({ error: null })
  }),

  http.put('/api/table/:tableId', () => {
    return HttpResponse.json({ error: null })
  }),

  http.delete('/api/table/:tableId', () => {
    return HttpResponse.json({ error: null })
  })
]
