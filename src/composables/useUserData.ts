import { jwtDecode } from 'jwt-decode'
export const useUserData = () => {
  const token = localStorage.getItem('token')
  if (!token) {
    throw new Error('未登入，請先登入')
  }
  const decodedToken = jwtDecode(token) as { id: string; role: string }
  const username = decodedToken.id
  const roleLabel = decodedToken.role

  return { username, roleLabel }
}
