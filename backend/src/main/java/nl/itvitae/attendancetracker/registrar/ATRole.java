package nl.itvitae.attendancetracker.registrar;

public enum ATRole {
    ADMIN, COACH, SUPER_ADMIN, TEACHER;

    public String asSpringSecurityRole() {
        return "ROLE_" + name();
    }
}
