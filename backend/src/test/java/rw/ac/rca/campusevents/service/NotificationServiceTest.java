package rw.ac.rca.campusevents.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import rw.ac.rca.campusevents.model.Notification;
import rw.ac.rca.campusevents.model.User;
import rw.ac.rca.campusevents.repository.NotificationRepository;
import rw.ac.rca.campusevents.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
public class NotificationServiceTest {

    @Mock
    private NotificationRepository notificationRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private NotificationService notificationService;

    private User user;
    private Notification notification;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setEmail("user@example.com");

        notification = new Notification();
        notification.setId(1L);
        notification.setMessage("Test Message");
        notification.setRecipient(user);
    }

    @Test
    void createNotification_Success() {
        when(notificationRepository.save(any(Notification.class))).thenReturn(notification);

        Notification saved = notificationService.createNotification(user, "Test Message", Notification.Type.INFO, 1L, "CLUB");

        assertNotNull(saved);
        verify(notificationRepository, times(1)).save(any(Notification.class));
    }

    @Test
    void notifyAllUsers_CallsCreateForEachUser() {
        User u1 = new User(); u1.setId(1L);
        User u2 = new User(); u2.setId(2L);
        List<User> users = Arrays.asList(u1, u2);

        when(userRepository.findAll()).thenReturn(users);
        when(notificationRepository.save(any(Notification.class))).thenReturn(new Notification());

        notificationService.notifyAllUsers("Global Msg", Notification.Type.INFO, null, null);

        verify(notificationRepository, times(2)).save(any(Notification.class));
    }
}
