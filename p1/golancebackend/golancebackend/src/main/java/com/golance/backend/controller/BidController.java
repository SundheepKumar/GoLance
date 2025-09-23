package com.golance.backend.controller;

import com.golance.backend.dto.BidRequest;
import com.golance.backend.dto.BidResponseDto;
import com.golance.backend.model.Bid;
import com.golance.backend.model.Task;
import com.golance.backend.repository.BidRepository;
import com.golance.backend.service.BidService;
import com.golance.backend.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/bids") // All bid endpoints start with /api/bids
public class BidController {

    @Autowired
    private BidService bidService;

    @Autowired
    private BidRepository bidRepository;

    @Autowired
    private TaskService taskService;

    // ------------------ PLACE BID ------------------
    @PostMapping("/tasks/{taskId}")
    public BidResponseDto placeBid(@PathVariable Long taskId, @RequestBody BidRequest bidRequest) {
        Bid bid = bidService.placeBid(
                taskId,
                bidRequest.getUserId(),
                bidRequest.getCredits(),
                bidRequest.getDescription()
        );
        return mapToResponse(bid);
    }

    // ------------------ GET ALL BIDS FOR A TASK ------------------
    @GetMapping("/tasks/{taskId}")
    public List<BidResponseDto> getBidsForTask(@PathVariable Long taskId) {
        Task task = taskService.getTaskById(taskId);
        return task.getBids().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ------------------ GET SINGLE BID ------------------
    @GetMapping("/{id}")
    public ResponseEntity<BidResponseDto> getBidById(@PathVariable Long id) {
        Optional<Bid> bid = bidRepository.findById(id);
        return bid.map(value -> ResponseEntity.ok(mapToResponse(value)))
                .orElse(ResponseEntity.notFound().build());
    }

    // ------------------ UPDATE BID ------------------
    @PutMapping("/{id}")
    public ResponseEntity<BidResponseDto> updateBid(@PathVariable Long id, @RequestBody BidRequest bidRequest) {
        Optional<Bid> optionalBid = bidRepository.findById(id);
        if (optionalBid.isPresent()) {
            Bid bid = optionalBid.get();
            bid.setCredits(bidRequest.getCredits());
            bid.setDescription(bidRequest.getDescription());
            bidRepository.save(bid);
            return ResponseEntity.ok(mapToResponse(bid));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // ------------------ DELETE BID ------------------
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBid(@PathVariable Long id) {
        Optional<Bid> optionalBid = bidRepository.findById(id);
        if (optionalBid.isPresent()) {
            bidRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // ------------------ ALLOCATE TASK TO BID ------------------
    @PostMapping("/tasks/{taskId}/allocate/{bidId}")
    public Task allocateTask(@PathVariable Long taskId, @PathVariable Long bidId) {
        return taskService.allocateTask(taskId, bidId);
    }

    // ------------------ HELPER: Map Entity -> DTO ------------------
    private BidResponseDto mapToResponse(Bid bid) {
        BidResponseDto dto = new BidResponseDto();
        dto.setId(bid.getId());
        dto.setCredits(bid.getCredits());
        dto.setDescription(bid.getDescription());
        if (bid.getBidder() != null) {
            dto.setBidderId(bid.getBidder().getId());
            dto.setBidderName(bid.getBidder().getUsername()); // assuming User has getName()
        }
        return dto;
    }
}
