package nl.itvitae.attendancetracker.registrar;

public enum ATRole {
    ADMIN, TEACHER;

    public String asSpringSecurityRole() {
        return "ROLE_" + name();
    }
}
