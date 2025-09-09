package com.golance.backend.model;


import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name="tasks")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long taskId;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "Text")
    private String description;

    @Column
    private String category;

    @Column
    private LocalDateTime postedOn;

    @Column
    private LocalDate deadline;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TaskStatus status=TaskStatus.OPEN;

    //task table completed now we to link with the user table


}
