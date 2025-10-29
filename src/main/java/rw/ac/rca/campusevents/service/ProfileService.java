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
        return profileRepository.save(profile);
    }

    public List<Profile> getAllProfiles() {
        return profileRepository.findAll();
    }

    public Optional<Profile> getProfileById(Long id) {
        return profileRepository.findById(id);
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
