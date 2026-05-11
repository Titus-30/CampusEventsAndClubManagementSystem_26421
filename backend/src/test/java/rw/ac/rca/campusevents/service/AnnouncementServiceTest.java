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
import rw.ac.rca.campusevents.model.Announcement;
import rw.ac.rca.campusevents.repository.AnnouncementRepository;

@ExtendWith(MockitoExtension.class)
public class AnnouncementServiceTest {

    @Mock
    private AnnouncementRepository announcementRepository;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private AnnouncementService announcementService;

    private Announcement announcement;

    @BeforeEach
    void setUp() {
        announcement = new Announcement();
        announcement.setId(1L);
        announcement.setMessage("New Semester Starts Tomorrow!");
    }

    @Test
    void saveAnnouncement_Success() {
        when(announcementRepository.save(any(Announcement.class))).thenReturn(announcement);

        Announcement saved = announcementService.saveAnnouncement(announcement);

        assertNotNull(saved);
        assertEquals("New Semester Starts Tomorrow!", saved.getMessage());
        verify(announcementRepository, times(1)).save(announcement);
        verify(notificationService, times(1)).notifyAllUsers(anyString(), any(), anyLong(), anyString());
    }

    @Test
    void getAnnouncementById_Found() {
        when(announcementRepository.findById(1L)).thenReturn(Optional.of(announcement));

        Optional<Announcement> found = announcementService.getAnnouncementById(1L);

        assertTrue(found.isPresent());
        assertEquals("New Semester Starts Tomorrow!", found.get().getMessage());
    }
}
