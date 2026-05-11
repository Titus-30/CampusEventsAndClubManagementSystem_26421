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
import rw.ac.rca.campusevents.model.Location;
import rw.ac.rca.campusevents.model.ELocationType;
import rw.ac.rca.campusevents.repository.LocationRepository;

@ExtendWith(MockitoExtension.class)
public class LocationServiceTest {

    @Mock
    private LocationRepository locationRepository;

    @InjectMocks
    private LocationService locationService;

    private Location province;
    private Location district;

    @BeforeEach
    void setUp() {
        province = new Location();
        province.setId(1L);
        province.setName("Kigali");
        province.setType(ELocationType.PROVINCE);

        district = new Location();
        district.setId(2L);
        district.setName("Gasabo");
        district.setType(ELocationType.DISTRICT);
        district.setParent(province);
    }

    @Test
    void saveLocation_Success() {
        when(locationRepository.existsByNameAndType(anyString(), any())).thenReturn(false);
        when(locationRepository.save(any(Location.class))).thenReturn(province);

        String result = locationService.saveLocation(province);

        assertEquals("Location saved successfully", result);
        verify(locationRepository, times(1)).save(province);
    }

    @Test
    void saveLocation_InvalidHierarchy() {
        Location invalidChild = new Location();
        invalidChild.setName("Invalid");
        invalidChild.setType(ELocationType.VILLAGE);
        invalidChild.setParent(province); // Province cannot have Village directly

        when(locationRepository.findById(1L)).thenReturn(Optional.of(province));

        String result = locationService.saveLocation(invalidChild);

        assertEquals("A Province can only have Districts as children", result);
        verify(locationRepository, never()).save(invalidChild);
    }

    @Test
    void getLocationById_Found() {
        when(locationRepository.findById(1L)).thenReturn(Optional.of(province));

        Optional<Location> found = locationService.getLocationById(1L);

        assertTrue(found.isPresent());
        assertEquals("Kigali", found.get().getName());
    }
}
