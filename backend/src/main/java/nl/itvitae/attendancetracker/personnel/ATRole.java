package nl.itvitae.attendancetracker.personnel;

public enum ATRole {
    COACH, TEACHER;

    public String asSpringSecurityRole() {
        return "ROLE_" + name();
    }
}
