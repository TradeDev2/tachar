export const LOGIN = "LOGIN";
export const LOGOUT = "LOGOUT";

export const Login = (info:any) => ({
  type: LOGIN,
  payload: {
    info
  }
});