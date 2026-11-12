package com.jersey4u.service;

import com.jersey4u.dto.OrderItemRequest;
import com.jersey4u.dto.OrderRequest;
import com.jersey4u.model.CustomerOrder;
import com.jersey4u.model.Jersey;
import com.jersey4u.model.OrderItem;
import com.jersey4u.repository.JerseyRepository;
import com.jersey4u.repository.OrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class OrderService {

    private static final BigDecimal FREE_SHIPPING_THRESHOLD = new BigDecimal("999.00");
    private static final BigDecimal FLAT_SHIPPING_FEE = new BigDecimal("99.00");

    private final OrderRepository orderRepository;
    private final JerseyRepository jerseyRepository;

    public OrderService(OrderRepository orderRepository, JerseyRepository jerseyRepository) {
        this.orderRepository = orderRepository;
        this.jerseyRepository = jerseyRepository;
    }

    /**
     * Validates shipping details, recalculates all INR prices directly from MySQL,
     * and persists the CustomerOrder + OrderItems atomically inside one transaction.
     */
    @Transactional
    public CustomerOrder placeOrder(OrderRequest request) {
        validateRequest(request);

        CustomerOrder order = new CustomerOrder();
        order.setOrderCode(generateOrderCode());
        order.setCustomerName(request.getCustomerName().trim());
        order.setCustomerPhone(request.getCustomerPhone().trim());
        order.setCustomerEmail(request.getCustomerEmail() != null ? request.getCustomerEmail().trim() : "");
        order.setShippingAddress(request.getShippingAddress().trim());
        order.setCity(request.getCity().trim());
        order.setPincode(request.getPincode().trim());

        String normalizedMethod = request.getPaymentMethod() != null
                ? request.getPaymentMethod().trim().toUpperCase()
                : "UPI";
        order.setPaymentMethod(normalizedMethod);
        order.setPaymentStatus("COD".equals(normalizedMethod) ? "PENDING_COD" : "PAID");
        order.setOrderStatus("CONFIRMED");
        order.setCreatedAt(LocalDateTime.now());

        BigDecimal subtotal = BigDecimal.ZERO;

        for (OrderItemRequest itemReq : request.getItems()) {
            if (itemReq.getJerseyId() == null) {
                throw new IllegalArgumentException("Each cart item must reference a valid jerseyId.");
            }
            int qty = (itemReq.getQuantity() != null && itemReq.getQuantity() > 0) ? itemReq.getQuantity() : 1;

            Jersey jersey = jerseyRepository.findById(itemReq.getJerseyId())
                    .orElseThrow(() -> new IllegalArgumentException(
                            "Jersey with ID " + itemReq.getJerseyId() + " was not found in the vault."));

            if (!jersey.isInStock()) {
                throw new IllegalArgumentException(jersey.getName() + " is currently sold out.");
            }

            BigDecimal unitPrice = calculateVerifiedUnitPrice(jersey.getPrice(), itemReq);
            BigDecimal lineTotal = unitPrice.multiply(BigDecimal.valueOf(qty));
            subtotal = subtotal.add(lineTotal);

            OrderItem orderItem = new OrderItem();
            orderItem.setJerseyId(jersey.getId());
            orderItem.setJerseyName(jersey.getName());
            orderItem.setTeam(jersey.getTeam());
            orderItem.setSize(hasText(itemReq.getSize()) ? itemReq.getSize().trim().toUpperCase() : "M");
            orderItem.setQuantity(qty);
            orderItem.setCustomName(hasText(itemReq.getCustomName()) ? itemReq.getCustomName().trim().toUpperCase() : "");
            orderItem.setCustomNumber(hasText(itemReq.getCustomNumber()) ? itemReq.getCustomNumber().trim() : "");
            orderItem.setFontFinish(hasText(itemReq.getFontFinish()) ? itemReq.getFontFinish().trim() : "standard");
            orderItem.setSleevePatch(hasText(itemReq.getSleevePatch()) ? itemReq.getSleevePatch().trim() : "none");
            orderItem.setUnitPrice(unitPrice);
            orderItem.setLineTotal(lineTotal);

            order.addItem(orderItem);
        }

        BigDecimal shippingFee = subtotal.compareTo(FREE_SHIPPING_THRESHOLD) >= 0
                ? BigDecimal.ZERO
                : FLAT_SHIPPING_FEE;
        BigDecimal totalAmount = subtotal.add(shippingFee);

        order.setSubtotalAmount(subtotal);
        order.setShippingFee(shippingFee);
        order.setTotalAmount(totalAmount);

        return orderRepository.save(order);
    }

    private BigDecimal calculateVerifiedUnitPrice(BigDecimal basePrice, OrderItemRequest itemReq) {
        boolean hasPrinting = hasText(itemReq.getCustomName()) || hasText(itemReq.getCustomNumber());
        BigDecimal printFee = BigDecimal.ZERO;
        if (hasPrinting) {
            boolean isGoldFoil = "gold-foil".equalsIgnoreCase(itemReq.getFontFinish())
                    || "gold".equalsIgnoreCase(itemReq.getFontFinish());
            printFee = isGoldFoil ? new BigDecimal("249.00") : new BigDecimal("150.00");
        }

        BigDecimal patchFee = BigDecimal.ZERO;
        if ("ucl".equalsIgnoreCase(itemReq.getSleevePatch())) {
            patchFee = new BigDecimal("149.00");
        } else if ("league".equalsIgnoreCase(itemReq.getSleevePatch())) {
            patchFee = new BigDecimal("99.00");
        }

        return basePrice.add(printFee).add(patchFee);
    }

    private void validateRequest(OrderRequest request) {
        if (request == null || request.getItems() == null || request.getItems().isEmpty()) {
            throw new IllegalArgumentException("Your bag is empty. Add at least one jersey before checking out.");
        }
        if (!hasText(request.getCustomerName())) {
            throw new IllegalArgumentException("Full name is required for delivery.");
        }
        if (!hasText(request.getCustomerPhone()) || request.getCustomerPhone().trim().length() < 10) {
            throw new IllegalArgumentException("Please provide a valid 10-digit mobile number.");
        }
        if (!hasText(request.getShippingAddress())) {
            throw new IllegalArgumentException("Street shipping address is required.");
        }
        if (!hasText(request.getCity())) {
            throw new IllegalArgumentException("City is required.");
        }
        if (!hasText(request.getPincode()) || !request.getPincode().trim().matches("\\d{6}")) {
            throw new IllegalArgumentException("Please enter a valid 6-digit Indian PIN code.");
        }
    }

    private boolean hasText(String value) {
        return value != null && !value.trim().isEmpty();
    }

    private String generateOrderCode() {
        int randomNum = ThreadLocalRandom.current().nextInt(10000, 99999);
        return "J4U-" + LocalDateTime.now().getYear() + "-" + randomNum;
    }
}
