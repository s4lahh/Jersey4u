package com.jersey4u.controller;

import com.jersey4u.dto.OrderRequest;
import com.jersey4u.dto.RazorpayOrderResponse;
import com.jersey4u.dto.RazorpayVerifyRequest;
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
     * POST /api/orders -> Direct COD checkout (recalculates totals server-side).
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
     * POST /api/orders/razorpay/create -> Creates Razorpay Test Mode order in paise
     * and stores a PENDING_PAYMENT order in MySQL.
     */
    @PostMapping("/razorpay/create")
    public ResponseEntity<?> createRazorpayOrder(@RequestBody OrderRequest request) {
        try {
            RazorpayOrderResponse rzpOrder = orderService.createRazorpayOrder(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(rzpOrder);
        } catch (IllegalArgumentException | IllegalStateException ex) {
            return ResponseEntity.badRequest().body(Map.of("message", ex.getMessage()));
        }
    }

    /**
     * POST /api/orders/{orderCode}/pay -> Initiates Razorpay payment for an existing pending order.
     */
    @PostMapping("/{orderCode}/pay")
    public ResponseEntity<?> payExistingOrder(@PathVariable String orderCode) {
        try {
            RazorpayOrderResponse rzpOrder = orderService.createRazorpayOrderForExisting(orderCode);
            return ResponseEntity.ok(rzpOrder);
        } catch (IllegalArgumentException | IllegalStateException ex) {
            return ResponseEntity.badRequest().body(Map.of("message", ex.getMessage()));
        }
    }

    /**
     * POST /api/orders/razorpay/verify -> Verifies HMAC-SHA256 signature from Razorpay
     * and promotes the MySQL order to PAID + CONFIRMED.
     */
    @PostMapping("/razorpay/verify")
    public ResponseEntity<?> verifyRazorpayPayment(@RequestBody RazorpayVerifyRequest verifyRequest) {
        try {
            CustomerOrder confirmedOrder = orderService.verifyRazorpayPayment(verifyRequest);
            return ResponseEntity.ok(confirmedOrder);
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
     * GET /api/orders/my-orders -> Returns list of past orders for the authenticated user (JWT).
     */
    @GetMapping("/my-orders")
    public ResponseEntity<?> getMyOrders(org.springframework.security.core.Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Not authenticated"));
        }
        String userEmail = authentication.getName();
        List<CustomerOrder> myOrders = orderRepository.findByCustomerEmailIgnoreCaseOrderByCreatedAtDesc(userEmail);
        return ResponseEntity.ok(myOrders);
    }

    /**
     * PATCH /api/orders/{orderCode}/status -> Admin updates order fulfillment status.
     */
    @PatchMapping("/{orderCode}/status")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable String orderCode,
            @RequestBody Map<String, String> body
    ) {
        try {
            String newStatus = body != null ? body.get("status") : null;
            CustomerOrder updated = orderService.updateOrderStatus(orderCode, newStatus);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("message", ex.getMessage()));
        }
    }

    /**
     * GET /api/orders -> List all orders.
     */
    @GetMapping
    public List<CustomerOrder> getAllOrders() {
        return orderRepository.findAll();
    }
}
