package rw.ac.rca.campusevents.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.MediaType;
import java.util.Optional;
import java.util.List;

import rw.ac.rca.campusevents.model.User;
import rw.ac.rca.campusevents.model.Location;
import rw.ac.rca.campusevents.service.UserService;

@RestController
@RequestMapping(value = "/api/user")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping(value = "/register", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> registerUser(@RequestBody User user) {
        String response = userService.saveUser(user);

        if (response.equalsIgnoreCase("Email already exists")) {
            return new ResponseEntity<String>(response, HttpStatus.CONFLICT);
        } else {
            return new ResponseEntity<String>(response, HttpStatus.CREATED);
        }
    }

    @GetMapping(value = "/all", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return new ResponseEntity<List<User>>(users, HttpStatus.OK);
    }

    @GetMapping(value = "/paginated", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Page<User>> getAllUsersPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDirection) {

        Sort sort = sortDirection.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<User> users = userService.getAllUsersPaginated(pageable);

        return new ResponseEntity<Page<User>>(users, HttpStatus.OK);
    }

    @GetMapping(value = "/search", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> searchUser(@RequestParam(required = false) String email,
                                        @RequestParam(required = false) String phoneNumber) {
        Optional<User> userOptional = Optional.empty();

        if (email != null) {
            userOptional = userService.getUserByEmail(email);
        } else if (phoneNumber != null) {
            userOptional = userService.getUserByPhoneNumber(phoneNumber);
        } else {
            return new ResponseEntity<String>("Please provide either email or phone number to search.", HttpStatus.BAD_REQUEST);
        }

        return userOptional
                .<ResponseEntity<?>>map(user -> new ResponseEntity<User>(user, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<String>("User not found", HttpStatus.NOT_FOUND));
    }

    @GetMapping(value = "/by-province/{province}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getUsersByProvince(@PathVariable String province) {
        List<User> users = userService.getUsersByProvince(province);
        if (users.isEmpty()) {
            return new ResponseEntity<String>("No users found in this province", HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<List<User>>(users, HttpStatus.OK);
    }

    @GetMapping(value = "/by-district/{district}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getUsersByDistrict(@PathVariable String district) {
        List<User> users = userService.getUsersByDistrict(district);
        if (users.isEmpty()) {
            return new ResponseEntity<String>("No users found in this district", HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<List<User>>(users, HttpStatus.OK);
    }

    @GetMapping(value = "/by-province-code/{provinceCode}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getUsersByProvinceCode(@PathVariable String provinceCode) {
    List<User> users = userService.getUsersByProvinceCode(provinceCode);
    if (users.isEmpty()) {
        return new ResponseEntity<String>("No users found with this province code", HttpStatus.NOT_FOUND);
    }
    return new ResponseEntity<List<User>>(users, HttpStatus.OK);
}

    

    @PutMapping(value = "/update", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> updateUser(@RequestBody User user) {
        String response = userService.updateUser(user);

        if (response.equalsIgnoreCase("User not found")) {
            return new ResponseEntity<String>(response, HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<String>(response, HttpStatus.OK);
        }
    }

    @DeleteMapping(value = "/delete/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable("id") Long id) {
        String response = userService.deleteUser(id);

        if (response.equalsIgnoreCase("User not found")) {
            return new ResponseEntity<String>(response, HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<String>(response, HttpStatus.OK);
        }
    }

    @GetMapping(value = "/{id}/location", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getUserLocation(@PathVariable("id") Long id) {
        Optional<User> userOptional = userService.getUserById(id);

        if (userOptional.isEmpty()) {
            return new ResponseEntity<String>("User not found", HttpStatus.NOT_FOUND);
        }

        User user = userOptional.get();
        Location location = user.getLocation();

        if (location == null) {
            return new ResponseEntity<String>("User has no location assigned", HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<Location>(location, HttpStatus.OK);
    }
}
