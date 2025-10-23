package com.golance.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.golance.backend.model.TaskComment;
import com.golance.backend.model.Task;

public interface TaskCommentRepository extends JpaRepository<TaskComment, Long> {
    List<TaskComment> findByTaskOrderByTimestampAsc(Task task);
}
