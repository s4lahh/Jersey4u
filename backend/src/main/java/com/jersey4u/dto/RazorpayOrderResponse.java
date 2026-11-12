package com.jersey4u.dto;

/**
 * Response returned to React so checkout.js can launch Razorpay Test Mode popup.
 */
public class RazorpayOrderResponse {

    private String orderCode;
    private String razorpayOrderId;
    private long amountInPaise;
    private String currency;
    private String keyId;
    private String customerName;
    private String customerPhone;
    private String customerEmail;

    public RazorpayOrderResponse() {
    }

    public RazorpayOrderResponse(String orderCode, String razorpayOrderId, long amountInPaise,
                                 String currency, String keyId, String customerName,
                                 String customerPhone, String customerEmail) {
        this.orderCode = orderCode;
        this.razorpayOrderId = razorpayOrderId;
        this.amountInPaise = amountInPaise;
        this.currency = currency;
        this.keyId = keyId;
        this.customerName = customerName;
        this.customerPhone = customerPhone;
        this.customerEmail = customerEmail;
    }

    public String getOrderCode() {
        return orderCode;
    }

    public String getRazorpayOrderId() {
        return razorpayOrderId;
    }

    public long getAmountInPaise() {
        return amountInPaise;
    }

    public String getCurrency() {
        return currency;
    }

    public String getKeyId() {
        return keyId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public String getCustomerPhone() {
        return customerPhone;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }
}
