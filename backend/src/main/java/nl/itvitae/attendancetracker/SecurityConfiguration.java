package nl.itvitae.attendancetracker;

import nl.itvitae.attendancetracker.registrar.ATRole;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
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
        jdbcUserDetailsManager.setUsersByUsernameQuery("select identity_name,password,enabled from registrar where identity_name = ?");
        return jdbcUserDetailsManager;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        var admin = ATRole.ADMIN.name();
        var coach = ATRole.COACH.name();
        var superAdmin = ATRole.SUPER_ADMIN.name();
        return httpSecurity
                .httpBasic(Customizer.withDefaults())
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(requests ->
                        requests.requestMatchers("/students/**").hasAnyRole(admin, coach, superAdmin)
                                .requestMatchers(
                                        "/scheduled-classes/**",
                                        "/personnel/teachers/**").hasAnyRole(admin, superAdmin)
                                .requestMatchers("/attendances/**", "/personnel/login/**").authenticated()
                                .requestMatchers(HttpMethod.POST, "/personnel/register").permitAll()
                                .requestMatchers(HttpMethod.GET, "/invitations/*").permitAll()
                                .requestMatchers(HttpMethod.GET, "/invitations").hasAnyRole(admin, superAdmin)
                                .requestMatchers("/personnel/**").hasAnyRole(admin, superAdmin)
                                .requestMatchers("/teachers").hasAnyRole(admin, superAdmin)
                                .requestMatchers("/teachers/*").hasRole(superAdmin)
                                .requestMatchers("/groups/**").hasRole(superAdmin)
                                .requestMatchers(HttpMethod.POST,
                                        "/invitations/for-teacher", "/invitations/for-coach").hasAnyRole(admin, superAdmin)
                                .requestMatchers(HttpMethod.POST,
                                        "/invitations/for-admin", "/invitations/for-super-admin").hasRole(superAdmin))
                .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return PasswordEncoderFactories.createDelegatingPasswordEncoder();
    }
}
