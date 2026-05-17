export const registerSchema = {
  body: {
    type: 'object',
    required: ['username', 'password', 'role'],
    properties: {
      username: { type: 'string' },
      password: { type: 'string' },
      role: { type: 'string', enum: ['admin', 'user'] }
    }
  }
}

export const loginSchema = {
  body: {
    type: 'object',
    required: ['username', 'password'],
    properties: {
      username: { type: 'string' },
      password: { type: 'string' }
    }
  }
}