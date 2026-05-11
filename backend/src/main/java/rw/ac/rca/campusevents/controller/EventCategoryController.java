package rw.ac.rca.campusevents.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.MediaType;

import rw.ac.rca.campusevents.model.EventCategory;
import rw.ac.rca.campusevents.service.EventCategoryService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/category")
public class EventCategoryController {

    @Autowired
    private EventCategoryService categoryService;

    @PostMapping(value = "/add", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<EventCategory> addCategory(@RequestBody EventCategory category) {
        EventCategory saved = categoryService.saveCategory(category);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @GetMapping(value = "/all", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<EventCategory>> getAllCategories() {
        List<EventCategory> categories = categoryService.getAllCategories();
        return new ResponseEntity<>(categories, HttpStatus.OK);
    }

    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getCategoryById(@PathVariable Long id) {
        Optional<EventCategory> category = categoryService.getCategoryById(id);
        return category.<ResponseEntity<?>>map(c -> new ResponseEntity<>(c, HttpStatus.OK))
                       .orElseGet(() -> new ResponseEntity<>("Category not found", HttpStatus.NOT_FOUND));
    }

    @PutMapping(value = "/update", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> updateCategory(@RequestBody EventCategory category) {
        EventCategory updated = categoryService.updateCategory(category);
        if (updated == null) {
            return new ResponseEntity<>("Category not found", HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteCategory(@PathVariable Long id) {
        String response = categoryService.deleteCategory(id);
        HttpStatus status = response.contains("not found") ? HttpStatus.NOT_FOUND : HttpStatus.OK;
        return new ResponseEntity<>(response, status);
    }
}


