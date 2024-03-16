import Role from "../components/shared/Role";

class LoginData {
  username: string = "";
  password: string = "";
  role: string = "";

  constructor() {
    this.username = localStorage.getItem("username") ?? "";
    this.password = localStorage.getItem("password") ?? "";
    this.role = localStorage.getItem("role") ?? "";

    if (!this.username || !this.password || !this.role) {
      this.username = "";
      this.password = "";
      this.role = "";
    }
  }

  update = (username: string, password: string, role: string) => {
    this.username = username;
    localStorage.setItem("username", username);
    this.password = password;
    localStorage.setItem("password", password);
    this.role = role;
    localStorage.setItem("role", role);
  };

  isTeacher = () => this.role == Role.TEACHER;
}

export default LoginData;
