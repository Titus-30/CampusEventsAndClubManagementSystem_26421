package rw.ac.rca.campusevents.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import rw.ac.rca.campusevents.model.EventCategory;
import rw.ac.rca.campusevents.repository.EventCategoryRepository;

@Service
public class EventCategoryService {

    @Autowired
    private EventCategoryRepository categoryRepository;

    public EventCategory saveCategory(EventCategory category) {
        return categoryRepository.save(category);
    }

    public List<EventCategory> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Optional<EventCategory> getCategoryById(Long id) {
        return categoryRepository.findById(id);
    }

    public EventCategory updateCategory(EventCategory category) {
        if(categoryRepository.existsById(category.getId())) {
            return categoryRepository.save(category);
        } else {
            return null;
        }
    }

    public String deleteCategory(Long id) {
        if(categoryRepository.existsById(id)) {
            categoryRepository.deleteById(id);
            return "Category deleted successfully";
        } else {
            return "Category not found";
        }
    }
}


