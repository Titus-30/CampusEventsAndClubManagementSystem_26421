package rw.ac.rca.campusevents.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import rw.ac.rca.campusevents.model.User;
import rw.ac.rca.campusevents.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private BCryptPasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setFullName("Titus Mucyo");
        user.setEmail("titus@example.com");
        user.setPhoneNumber("+250788123456");
        user.setPassword("password123");
        user.setRole(User.Role.STUDENT);
    }

    @Test
    void saveUser_Success() {
        when(userRepository.existsByEmail(user.getEmail())).thenReturn(false);
        when(userRepository.existsByPhoneNumber(user.getPhoneNumber())).thenReturn(false);
        when(passwordEncoder.encode(user.getPassword())).thenReturn("$2a$10$hashedpassword");
        when(userRepository.save(any(User.class))).thenReturn(user);

        String result = userService.saveUser(user);

        assertEquals("User saved successfully", result);
        verify(passwordEncoder, times(1)).encode("password123");
        verify(userRepository, times(1)).save(user);
    }

    @Test
    void saveUser_EmailExists() {
        when(userRepository.existsByEmail(user.getEmail())).thenReturn(true);

        String result = userService.saveUser(user);

        assertEquals("Email already exists", result);
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void getUserById_Found() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        Optional<User> found = userService.getUserById(1L);

        assertTrue(found.isPresent());
        assertEquals("Titus Mucyo", found.get().getFullName());
    }

    @Test
    void getUserById_NotFound() {
        when(userRepository.findById(2L)).thenReturn(Optional.empty());

        Optional<User> found = userService.getUserById(2L);

        assertFalse(found.isPresent());
    }
}
