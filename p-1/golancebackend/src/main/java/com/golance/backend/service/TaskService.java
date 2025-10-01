package com.golance.backend.service;

import com.golance.backend.model.Bid;
import com.golance.backend.model.Task;
import com.golance.backend.model.TaskStatus;
import com.golance.backend.repository.BidRepository;
import com.golance.backend.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TaskService {
    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private BidRepository bidRepository;

    public Task createTask(Task task) {
        return taskRepository.save(task);
    }

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public Task getTaskById(Long id) {
        return taskRepository.findById(id).orElseThrow(() -> new RuntimeException("Task not found"));
    }

    public Task updateTask(Long id, Task taskDetails) {
        Task task = getTaskById(id);
        task.setTitle(taskDetails.getTitle());
        task.setDescription(taskDetails.getDescription());
        task.setCreditsOffered(taskDetails.getCreditsOffered());
        task.setCategory(taskDetails.getCategory());
        task.setDeadline(taskDetails.getDeadline());
        task.setStatus(taskDetails.getStatus());
        return taskRepository.save(task);
    }

    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }

    // NEW
    public List<Task> getTasksByUser(Long userId) {
        return taskRepository.findByPostedBy_Id(userId);
    }

    // Allocate task to a bid
    public Task allocateTask(Long taskId, Long bidId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        Bid bid = bidRepository.findById(bidId)
                .orElseThrow(() -> new RuntimeException("Bid not found"));

        task.setAssignedUser(bid.getBidder());
        task.setStatus(TaskStatus.ALLOCATED); // make sure you add ALLOCATED in TaskStatus enum

        return taskRepository.save(task);
    }



}
