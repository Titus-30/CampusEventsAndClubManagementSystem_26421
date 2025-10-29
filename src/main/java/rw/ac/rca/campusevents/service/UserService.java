package rw.ac.rca.campusevents.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import rw.ac.rca.campusevents.model.User;
import rw.ac.rca.campusevents.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    
    public String saveUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            return "Email already exists";
        } 
        userRepository.save(user);
        return "User saved successfully";
    }

    
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    
    public Page<User> getAllUsersPaginated(Pageable pageable) {
        return userRepository.findAll(pageable);
    }

    
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    
    public String updateUser(User user) {
        if (userRepository.existsById(user.getId())) {
            userRepository.save(user);
            return "User updated successfully";
        } else {
            return "User not found";
        }
    }

    
    public String deleteUser(Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return "User deleted successfully";
        } else {
            return "User not found";
        }
    }

    
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    
    public Optional<User> getUserByPhoneNumber(String phoneNumber) {
        return userRepository.findByPhoneNumber(phoneNumber);
    }

    
    public List<User> getUsersByProvince(String province) {
        return userRepository.findByLocationProvince(province);
    }

    
    public List<User> getUsersByDistrict(String district) {
        return userRepository.findByLocationDistrict(district);
    }
    public List<User> getUsersByProvinceCode(String provinceCode) {
    return userRepository.findByLocationProvinceCode(provinceCode);
}
}
