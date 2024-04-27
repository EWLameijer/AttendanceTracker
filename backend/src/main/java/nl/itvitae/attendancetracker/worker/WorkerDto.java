package nl.itvitae.attendancetracker.worker;

public record WorkerDto(String name, String role) {
    public static WorkerDto from(Worker worker) {
        return new WorkerDto(worker.getName(), worker.getRole().name());
    }
}
