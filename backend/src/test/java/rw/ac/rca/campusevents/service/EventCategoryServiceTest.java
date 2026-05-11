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
import rw.ac.rca.campusevents.model.EventCategory;
import rw.ac.rca.campusevents.repository.EventCategoryRepository;

@ExtendWith(MockitoExtension.class)
public class EventCategoryServiceTest {

    @Mock
    private EventCategoryRepository categoryRepository;

    @InjectMocks
    private EventCategoryService categoryService;

    private EventCategory category;

    @BeforeEach
    void setUp() {
        category = new EventCategory();
        category.setId(1L);
        category.setName("Academic");
    }

    @Test
    void saveCategory_Success() {
        when(categoryRepository.save(any(EventCategory.class))).thenReturn(category);

        EventCategory saved = categoryService.saveCategory(category);

        assertNotNull(saved);
        assertEquals("Academic", saved.getName());
        verify(categoryRepository, times(1)).save(category);
    }

    @Test
    void getCategoryById_Found() {
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));

        Optional<EventCategory> found = categoryService.getCategoryById(1L);

        assertTrue(found.isPresent());
        assertEquals("Academic", found.get().getName());
    }
}
