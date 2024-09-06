import { UserByIdResult, UserData } from '@/types'
import { createErrorResponse, isErrorResponse } from '../util'
import { RoleType } from '@/store/users/state'

export async function getUsers() {
  const res = await fetch('/api/user/users')
  if (!res) {
    return createErrorResponse(res)
  }
  const user = (await res.json()) as UserData[]
  return user
}

export async function createUser(newUser: {
  username: string
  password: string
  confirmPassword: string
  role: RoleType
}) {
  const res = await fetch('/api/user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newUser),
  })
  if (!res.ok) {
    return createErrorResponse(res)
  }
  const createdUser = (await res.json()) as {
    username: string
    id: string
    role: string
  }
  return createdUser
}

export async function deleteUser(id: string) {
  const dbResponse = await fetch(`/api/user/${id}`, {
    method: 'DELETE',
  })
  if (!dbResponse.ok) {
    return createErrorResponse(dbResponse)
  }
  return dbResponse
}

export async function getUserByUserId(id: string) {
  const res = await fetch(`/api/user/${id}`)
  if (!res.ok) {
    return createErrorResponse(res)
  }
  const userData = (await res.json()) as UserByIdResult
  return userData
}

export async function updateProfile({
  userId,
  settings,
}: {
  userId: string
  settings: {
    username: string
    password: string
    role: 'EMPLOYEE' | 'ADMIN'
    theme: 'light' | 'dark' | ''
  }
}) {
  const response = await fetch(`/api/user/profile/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(settings),
  })
  if (!response.ok) {
    return createErrorResponse(response)
  }
  const responseJson = (await response.json()) as UserData
  return responseJson
}

export async function updateImage({
  file,
  userId,
}: {
  file: Blob
  userId: string
}) {
  const formData = new FormData()
  formData.append('profileImage', file)

  const response = await fetch(`/api/user/profile/${userId}/upload-image`, {
    method: 'POST',
    body: formData,
  })
  if (!response.ok) {
    return createErrorResponse(response)
  }
  return (await response.json()) as { message: string }
}

export async function updateUser({
  username,
  password,
  role,
  id,
}: {
  username: string
  role: RoleType
  password: string | null
  id: string
}) {
  const dbResponse = await fetch(`/api/user/${id}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'PATCH',
    body: JSON.stringify({
      username,
      role,
      password,
    }),
  })

  if (!dbResponse.ok) {
    return createErrorResponse(dbResponse)
  }

  const result = (await dbResponse.json()) as { username: string }
  return result
}
