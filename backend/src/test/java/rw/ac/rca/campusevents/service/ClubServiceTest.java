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
import rw.ac.rca.campusevents.model.Club;
import rw.ac.rca.campusevents.model.User;
import rw.ac.rca.campusevents.repository.ClubRepository;

@ExtendWith(MockitoExtension.class)
public class ClubServiceTest {

    @Mock
    private ClubRepository clubRepository;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private ClubService clubService;

    private Club club;
    private User creator;

    @BeforeEach
    void setUp() {
        creator = new User();
        creator.setId(1L);
        creator.setRole(User.Role.STUDENT);

        club = new Club();
        club.setId(1L);
        club.setName("Tech Club");
        club.setDescription("AUCA Tech Enthusiasts");
        club.setCreatedBy(creator);
        club.setStatus(Club.Status.PENDING);
    }

    @Test
    void saveClub_StudentRole_SetsPending() {
        when(clubRepository.save(any(Club.class))).thenReturn(club);

        Club savedClub = clubService.saveClub(club);

        assertEquals(Club.Status.PENDING, savedClub.getStatus());
        verify(clubRepository, times(1)).save(club);
    }

    @Test
    void approveClub_Success() {
        when(clubRepository.findById(1L)).thenReturn(Optional.of(club));
        when(clubRepository.save(any(Club.class))).thenReturn(club);

        Club approvedClub = clubService.approveClub(1L);

        assertNotNull(approvedClub);
        assertEquals(Club.Status.APPROVED, approvedClub.getStatus());
        verify(notificationService, atLeastOnce()).notifyAllUsers(anyString(), any(), anyLong(), anyString());
    }

    @Test
    void getClubById_Found() {
        when(clubRepository.findById(1L)).thenReturn(Optional.of(club));

        Optional<Club> found = clubService.getClubById(1L);

        assertTrue(found.isPresent());
        assertEquals("Tech Club", found.get().getName());
    }
}
