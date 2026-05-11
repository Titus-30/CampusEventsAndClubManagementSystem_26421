package rw.ac.rca.campusevents.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import rw.ac.rca.campusevents.model.Profile;
import rw.ac.rca.campusevents.model.User;
import rw.ac.rca.campusevents.repository.ProfileRepository;

@ExtendWith(MockitoExtension.class)
public class ProfileServiceTest {

    @Mock
    private ProfileRepository profileRepository;

    @InjectMocks
    private ProfileService profileService;

    private Profile profile;
    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);

        profile = new Profile();
        profile.setId(1L);
        profile.setBio("Hello AUCA");
        profile.setUser(user);
    }

    @Test
    void saveProfile_NewProfile_Success() {
        when(profileRepository.findByUserId(1L)).thenReturn(Collections.emptyList());
        when(profileRepository.save(any(Profile.class))).thenReturn(profile);

        Profile saved = profileService.saveProfile(profile);

        assertNotNull(saved);
        verify(profileRepository, times(1)).save(profile);
    }

    @Test
    void saveProfile_ExistingProfile_UpdatesInsteadOfCreates() {
        Profile existingProfile = new Profile();
        existingProfile.setId(2L);
        existingProfile.setUser(user);
        existingProfile.setBio("Old Bio");

        when(profileRepository.findByUserId(1L)).thenReturn(List.of(existingProfile));
        when(profileRepository.save(any(Profile.class))).thenReturn(existingProfile);

        Profile result = profileService.saveProfile(profile);

        assertNotNull(result);
        assertEquals(2L, result.getId());
        assertEquals("Hello AUCA", result.getBio()); // Check update
    }

    @Test
    void getProfileByUserId_Found() {
        when(profileRepository.findByUserId(1L)).thenReturn(List.of(profile));

        Optional<Profile> found = profileService.getProfileByUserId(1L);

        assertTrue(found.isPresent());
        assertEquals("Hello AUCA", found.get().getBio());
    }
}
