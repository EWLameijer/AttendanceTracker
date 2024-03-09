class LoginData {
  username: string = "";
  password: string = "";
  role: string = "";

  update = (username: string, password: string, role: string) => {
    this.username = username;
    this.password = password;
    this.role = role;
  };
}

export default LoginData;
