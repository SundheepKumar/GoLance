package com.golance.backend.controller;

import com.golance.backend.dto.TaskRequestDto;
//import com.golance.backend.dto.TaskResponseDto;
import com.golance.backend.model.Task;
import com.golance.backend.model.TaskStatus;
import com.golance.backend.model.User;
import com.golance.backend.service.TaskService;
import com.golance.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "http://localhost:5173")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @Autowired
    private UserService userService; // For fetching postedBy & assignedUser

    // CREATE
    @PostMapping
    public Task createTask(@RequestBody TaskRequestDto taskDto) {
        Task task = new Task();
        task.setTitle(taskDto.getTitle());
        task.setDescription(taskDto.getDescription());
        task.setCategory(taskDto.getCategory());
        task.setDeadline(taskDto.getDeadline());
        task.setCreditsOffered(taskDto.getCreditsOffered());
        task.setStatus(taskDto.getStatus() != null ? Enum.valueOf(TaskStatus.class, taskDto.getStatus()) : TaskStatus.PENDING);

        // Set postedBy user
        User postedBy = userService.getUserById(taskDto.getPostedById());
        task.setPostedBy(postedBy);

        // Optional: assignedUser
        if (taskDto.getAssignedUserId() != null) {
            User assignedUser = userService.getUserById(taskDto.getAssignedUserId());
            task.setAssignedUser(assignedUser);
        }

        return taskService.createTask(task);
    }

    // READ ALL
    @GetMapping
    public List<Task> getAllTasks() {
        return taskService.getAllTasks();
    }

    // READ BY ID
    @GetMapping("/{id}")
    public Task getTaskById(@PathVariable Long id) {
        return taskService.getTaskById(id);
    }

    // UPDATE
    @PutMapping("/{id}")
    public Task updateTask(@PathVariable Long id, @RequestBody TaskRequestDto taskDto) {
        Task taskDetails = taskService.getTaskById(id);
        taskDetails.setTitle(taskDto.getTitle());
        taskDetails.setDescription(taskDto.getDescription());
        taskDetails.setCategory(taskDto.getCategory());
        taskDetails.setDeadline(taskDto.getDeadline());
        taskDetails.setCreditsOffered(taskDto.getCreditsOffered());
        taskDetails.setStatus(taskDto.getStatus() != null ? Enum.valueOf(TaskStatus.class, taskDto.getStatus()) : taskDetails.getStatus());

        // Update assignedUser if provided
        if (taskDto.getAssignedUserId() != null) {
            User assignedUser = userService.getUserById(taskDto.getAssignedUserId());
            taskDetails.setAssignedUser(assignedUser);
        }

        return taskService.updateTask(id, taskDetails);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public String deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return "Task deleted successfully!";
    }

    // Get tasks by user
    @GetMapping("/user/{userId}")
    public List<Task> getTasksByUser(@PathVariable Long userId) {
        return taskService.getTasksByUser(userId);
    }




}
