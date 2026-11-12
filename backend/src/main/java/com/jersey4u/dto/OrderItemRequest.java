package com.jersey4u.dto;

/**
 * Request DTO representing one line item inside an order payload.
 */
public class OrderItemRequest {

    private Long jerseyId;
    private String size;
    private Integer quantity;
    private String customName;
    private String customNumber;
    private String fontFinish;
    private String sleevePatch;

    public Long getJerseyId() {
        return jerseyId;
    }

    public void setJerseyId(Long jerseyId) {
        this.jerseyId = jerseyId;
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
}
