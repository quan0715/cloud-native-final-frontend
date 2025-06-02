import { jwtDecode } from 'jwt-decode'
export const useUserData = () => {
  const token = localStorage.getItem('token')
  if (!token) {
    throw new Error('未登入，請先登入')
  }
  const decodedToken = jwtDecode(token) as { id: string; role: string; userName: string }
  const username = decodedToken.userName
  const userId = decodedToken.id
  const userRole = decodedToken.role
  return { username, userId, userRole }
}
