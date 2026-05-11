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
import rw.ac.rca.campusevents.model.Membership;
import rw.ac.rca.campusevents.model.Club;
import rw.ac.rca.campusevents.model.User;
import rw.ac.rca.campusevents.repository.MembershipRepository;

@ExtendWith(MockitoExtension.class)
public class MembershipServiceTest {

    @Mock
    private MembershipRepository membershipRepository;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private MembershipService membershipService;

    private Membership membership;
    private Club club;
    private User student;

    @BeforeEach
    void setUp() {
        student = new User();
        student.setId(1L);
        student.setFullName("Student User");

        User creator = new User();
        creator.setId(2L);

        club = new Club();
        club.setId(1L);
        club.setName("Dance Club");
        club.setCreatedBy(creator);

        membership = new Membership();
        membership.setId(1L);
        membership.setUser(student);
        membership.setClub(club);
    }

    @Test
    void saveMembership_Success() {
        when(membershipRepository.save(any(Membership.class))).thenReturn(membership);

        Membership saved = membershipService.saveMembership(membership);

        assertNotNull(saved);
        verify(membershipRepository, times(1)).save(membership);
        verify(notificationService, times(1)).createNotification(any(), anyString(), any(), anyLong(), anyString());
    }

    @Test
    void getMembershipById_Found() {
        when(membershipRepository.findById(1L)).thenReturn(Optional.of(membership));

        Optional<Membership> found = membershipService.getMembershipById(1L);

        assertTrue(found.isPresent());
        assertEquals(1L, found.get().getId());
    }
}
