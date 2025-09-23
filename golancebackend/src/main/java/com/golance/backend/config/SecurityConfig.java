package com.golance.backend.config;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.DefaultSecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.golance.backend.security.JwtFilter;
import com.golance.backend.service.UserService;

@Configuration
@EnableWebSecurity	
public class SecurityConfig {
	
	@Autowired
	private UserService userService;
	
	@Autowired
	private PasswordEncoder passwordEncoder;
	
	@Autowired
	private JwtFilter jwtFilter;

	@Bean
	public DefaultSecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http.authorizeHttpRequests(authz ->
		authz
		.requestMatchers(HttpMethod.POST, "/api/users/**").permitAll()
		.requestMatchers("/api/tasks/**").authenticated()
		.requestMatchers("/api/users/**").authenticated()
		.anyRequest().permitAll()
		)
	//	.formLogin(form -> form.permitAll().defaultSuccessUrl("/")) 
		.csrf( csrf -> csrf.disable())
		.sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))//we are not creating session here. for api testing
		.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
		;
		
		return http.build();
	}
	
	//creating in memory user
	//@Bean
	//public UserService userDetailService() {
		
//		UserDetails user = User.withUsername("sandy")  //here User is from spring
//				.password("sandy")
//				.roles("USER")
//				.build();
//		
//		UserDetails admin = User.withUsername("sundheep")  //here User is from spring
//				.password("sundheep")
//				.roles("ADMIN")
//				.build();	
		
//		return new InMemoryUserDetailsManager(user,admin);
		
	//	return new UserService();
	//}
	
	
	
	@Bean
	@SuppressWarnings("deprecation")
	public DaoAuthenticationProvider authenticationProvider() {
		DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
		authProvider.setUserDetailsService(userService);
		authProvider.setPasswordEncoder(passwordEncoder);
		
		return authProvider;
		
	}
	
	@Bean
	public AuthenticationManager AuthenticationManager() {
		return new ProviderManager(List.of(authenticationProvider())); 
	}
}
