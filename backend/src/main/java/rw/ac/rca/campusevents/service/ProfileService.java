package rw.ac.rca.campusevents.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import rw.ac.rca.campusevents.model.Profile;
import rw.ac.rca.campusevents.repository.ProfileRepository;

@Service
public class ProfileService {

    @Autowired
    private ProfileRepository profileRepository;

    public Profile saveProfile(Profile profile) {
        // Prevent duplicates: Check if user already has a profile
        if (profile.getUser() != null && profile.getUser().getId() != null) {
            List<Profile> existing = profileRepository.findByUserId(profile.getUser().getId());
            if (!existing.isEmpty()) {
                Profile current = existing.get(0);
                // Update existing instead of creating new
                current.setBio(profile.getBio());
                current.setPhone(profile.getPhone());
                current.setProfilePicture(profile.getProfilePicture());
                return profileRepository.save(current);
            }
        }
        return profileRepository.save(profile);
    }

    public List<Profile> getAllProfiles() {
        return profileRepository.findAll();
    }

    public Optional<Profile> getProfileById(Long id) {
        return profileRepository.findById(id);
    }

    public Optional<Profile> getProfileByUserId(Long userId) {
        List<Profile> profiles = profileRepository.findByUserId(userId);
        return profiles.isEmpty() ? Optional.empty() : Optional.of(profiles.get(0));
    }

    public Profile updateProfile(Profile profile) {
        if(profileRepository.existsById(profile.getId())) {
            return profileRepository.save(profile);
        } else {
            return null;
        }
    }

    public String deleteProfile(Long id) {
        if(profileRepository.existsById(id)) {
            profileRepository.deleteById(id);
            return "Profile deleted successfully";
        } else {
            return "Profile not found";
        }
    }
}


