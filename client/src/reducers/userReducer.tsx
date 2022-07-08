import Action from "../models/Action"
import User from "../models/User"

const userReducer = (state: User, action: Action<UserActionKind>) => {
  switch (action.type) {
    case 'LOGIN':
      localStorage.setItem('user', JSON.stringify(action.payload.user))
      localStorage.setItem('token', JSON.stringify(action.payload.token))
      return { ...state, isAuthenticated: true, user: action.payload.user, token: action.payload.token }
    case 'LOGOUT':
      localStorage.clear()
      return { ...state, isAuthenticated: false, user: null }
    default:
      return state
  }
}

export enum UserActionKind {
  Login = 'LOGIN',
  Logout = 'LOGOUT'
}

export default userReducer