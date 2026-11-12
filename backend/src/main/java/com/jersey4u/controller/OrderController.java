package com.jersey4u.controller;

import com.jersey4u.dto.OrderRequest;
import com.jersey4u.model.CustomerOrder;
import com.jersey4u.repository.OrderRepository;
import com.jersey4u.service.OrderService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;
    private final OrderRepository orderRepository;

    public OrderController(OrderService orderService, OrderRepository orderRepository) {
        this.orderService = orderService;
        this.orderRepository = orderRepository;
    }

    /**
     * POST /api/orders -> Validates cart items, recalculates INR totals server-side,
     * and persists CustomerOrder + OrderItems in MySQL.
     */
    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody OrderRequest request) {
        try {
            CustomerOrder savedOrder = orderService.placeOrder(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedOrder);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("message", ex.getMessage()));
        }
    }

    /**
     * GET /api/orders/{orderCode} -> Fetch an order receipt by order code.
     */
    @GetMapping("/{orderCode}")
    public ResponseEntity<?> getOrderByCode(@PathVariable String orderCode) {
        return orderRepository.findByOrderCode(orderCode)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Order not found: " + orderCode)));
    }

    /**
     * GET /api/orders -> List all orders (newest first or stored order).
     */
    @GetMapping
    public List<CustomerOrder> getAllOrders() {
        return orderRepository.findAll();
    }
}
