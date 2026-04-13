package com.nisa.backend.service;

import com.nisa.backend.model.Task;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class TaskService {

    private final List<Task> tasks = new ArrayList<>();
    private final AtomicLong nextId = new AtomicLong(4);

    public TaskService() {
        tasks.add(new Task(1L, "Backend API hazirla", "Task endpointlerini ve servis durumunu tamamla.", "DONE", "HIGH"));
        tasks.add(new Task(2L, "Frontend panelini kur", "React ile gorev listesini ve yeni gorev formunu hazirla.", "IN_PROGRESS", "HIGH"));
        tasks.add(new Task(3L, "CI/CD akisini test et", "Docker Compose ve Jenkins pipeline ciktisini kontrol et.", "TODO", "MEDIUM"));
    }

    public List<Task> getAllTasks() {
        return tasks;
    }

    public Optional<Task> getTaskById(Long id) {
        return tasks.stream()
                .filter(task -> task.getId().equals(id))
                .findFirst();
    }

    public Task addTask(Task task) {
        Task newTask = new Task(
                nextId.getAndIncrement(),
                task.getTitle(),
                task.getDescription(),
                defaultValue(task.getStatus(), "TODO"),
                defaultValue(task.getPriority(), "MEDIUM")
        );
        tasks.add(newTask);
        return newTask;
    }

    public Optional<Task> updateStatus(Long id, String status) {
        return getTaskById(id)
                .map(task -> {
                    task.setStatus(status);
                    return task;
                });
    }

    private String defaultValue(String value, String fallback) {
        if (value == null || value.isBlank()) {
            return fallback;
        }
        return value;
    }
}
