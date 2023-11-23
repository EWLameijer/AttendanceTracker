package nl.itvitae.attendancetracker;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class Seeder implements CommandLineRunner {
    private final StudentRepository studentRepository;

    @Override
    public void run(String... args) throws Exception {
        if (studentRepository.count() == 0) {
            studentRepository.saveAll(List.of(
                    new Student("Arie"),
                    new Student("Bas")
            ));
            System.out.println("Students seeded!");
        }
    }
}
