package com.jersey4u.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    @JsonIgnore
    private CustomerOrder order;

    @Column(nullable = false)
    private Long jerseyId;

    @Column(nullable = false)
    private String jerseyName;

    private String team;

    @Column(nullable = false, length = 10)
    private String size;

    @Column(nullable = false)
    private Integer quantity;

    @Column(length = 30)
    private String customName;

    @Column(length = 10)
    private String customNumber;

    @Column(length = 30)
    private String fontFinish;

    @Column(length = 30)
    private String sleevePatch;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPrice;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal lineTotal;

    public OrderItem() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public CustomerOrder getOrder() {
        return order;
    }

    public void setOrder(CustomerOrder order) {
        this.order = order;
    }

    public Long getJerseyId() {
        return jerseyId;
    }

    public void setJerseyId(Long jerseyId) {
        this.jerseyId = jerseyId;
    }

    public String getJerseyName() {
        return jerseyName;
    }

    public void setJerseyName(String jerseyName) {
        this.jerseyName = jerseyName;
    }

    public String getTeam() {
        return team;
    }

    public void setTeam(String team) {
        this.team = team;
    }

    public String getSize() {
        return size;
    }

    public void setSize(String size) {
        this.size = size;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public String getCustomName() {
        return customName;
    }

    public void setCustomName(String customName) {
        this.customName = customName;
    }

    public String getCustomNumber() {
        return customNumber;
    }

    public void setCustomNumber(String customNumber) {
        this.customNumber = customNumber;
    }

    public String getFontFinish() {
        return fontFinish;
    }

    public void setFontFinish(String fontFinish) {
        this.fontFinish = fontFinish;
    }

    public String getSleevePatch() {
        return sleevePatch;
    }

    public void setSleevePatch(String sleevePatch) {
        this.sleevePatch = sleevePatch;
    }

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(BigDecimal unitPrice) {
        this.unitPrice = unitPrice;
    }

    public BigDecimal getLineTotal() {
        return lineTotal;
    }

    public void setLineTotal(BigDecimal lineTotal) {
        this.lineTotal = lineTotal;
    }
}
