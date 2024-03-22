package nl.itvitae.attendancetracker.personnel;

public enum ATRole {
    ADMIN, TEACHER;

    public String asSpringSecurityRole() {
        return "ROLE_" + name();
    }
}
