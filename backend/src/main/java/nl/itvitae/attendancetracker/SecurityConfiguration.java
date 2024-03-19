package nl.itvitae.attendancetracker;

import nl.itvitae.attendancetracker.personnel.ATRole;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.JdbcUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

import javax.sql.DataSource;

@Configuration
public class SecurityConfiguration {

    @Bean
    public UserDetailsService userDetailsService(DataSource dataSource) {
        var jdbcUserDetailsManager = new JdbcUserDetailsManager(dataSource);
        // As we also use the Users table for Personnel, I prefer 'name' over the default 'username', and 'personnel' over 'users'
        // for implementation, see:
        // https://stackoverflow.com/questions/67634569/how-to-change-jdbc-schema-users-with-mytable-in-oauth2-spring-boot
        jdbcUserDetailsManager.setUsersByUsernameQuery("select name,password,enabled from personnel where name = ?");
        return jdbcUserDetailsManager;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        String adminRole = ATRole.ADMIN.name();
        return httpSecurity
                .httpBasic(Customizer.withDefaults())
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(requests ->
                        requests.requestMatchers("/students/**").hasRole(adminRole)
                                .requestMatchers("/groups/**").hasRole(adminRole)
                                .requestMatchers("/scheduled-classes/**").hasRole(adminRole)
                                .requestMatchers("/personnel/teachers/**").hasRole(adminRole)
                                .requestMatchers("/attendances/**").authenticated()
                                .requestMatchers("/**").permitAll())
                .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return PasswordEncoderFactories.createDelegatingPasswordEncoder();
    }
}
