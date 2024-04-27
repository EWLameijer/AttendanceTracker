package nl.itvitae.attendancetracker.worker;

public enum ATRole {
    ADMIN, TEACHER;

    public String asSpringSecurityRole() {
        return "ROLE_" + name();
    }
}
