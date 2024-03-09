class LoginData {
  username: string = "";
  password: string = "";

  update = (newUsername: string, newPassword: string) => {
    this.username = newUsername;
    this.password = newPassword;
  };
}

export default LoginData;
