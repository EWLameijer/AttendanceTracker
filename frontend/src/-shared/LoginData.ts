import Role from "./Role";

class LoginData {
  username: string = "";
  password: string = "";
  role: string = "";

  constructor() {
    this.username = sessionStorage.getItem("username") ?? "";
    this.password = sessionStorage.getItem("password") ?? "";
    this.role = sessionStorage.getItem("role") ?? "";

    if (!this.username || !this.password || !this.role) {
      this.username = "";
      this.password = "";
      this.role = "";
    }
  }

  update = (username: string, password: string, role: string) => {
    this.username = username;
    sessionStorage.setItem("username", username);
    this.password = password;
    sessionStorage.setItem("password", password);
    this.role = role;
    sessionStorage.setItem("role", role);
  };

  isTeacher = () => this.role === Role.TEACHER;
  isAnyAdmin = () => this.role === Role.ADMIN || this.role === Role.SUPER_ADMIN;
  isSuperAdmin = () => this.role === Role.SUPER_ADMIN;
  isPureAdmin = () => this.role === Role.PURE_ADMIN;
}

export default LoginData;
