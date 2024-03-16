package nl.itvitae.attendancetracker.personnel;

public enum ATRole {
    ADMIN, COACH, TEACHER;

    public String asSpringSecurityRole() {
        return "ROLE_" + name();
    }
}
