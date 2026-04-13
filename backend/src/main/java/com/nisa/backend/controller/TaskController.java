package com.nisa.backend.controller;

import com.nisa.backend.model.Task;
import com.nisa.backend.service.TaskService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = {"http://localhost:3000"})
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping("/")
    public String home() {
        return "Backend calisiyor";
    }

    @GetMapping("/api/status")
    public Map<String, Object> status() {
        return Map.of(
                "service", "backend",
                "status", "ok",
                "port", 8082
        );
    }

    @GetMapping("/api/tasks")
    public List<Task> getTasks() {
        return taskService.getAllTasks();
    }

    @GetMapping("/api/tasks/{id}")
    public ResponseEntity<Task> getTask(@PathVariable Long id) {
        return taskService.getTaskById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/api/tasks")
    public Task addTask(@RequestBody Task task) {
        return taskService.addTask(task);
    }

    @PutMapping("/api/tasks/{id}/status")
    public ResponseEntity<Task> updateStatus(@PathVariable Long id, @RequestBody StatusUpdateRequest request) {
        return taskService.updateStatus(id, request.status())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    public record StatusUpdateRequest(String status) {
    }
}
