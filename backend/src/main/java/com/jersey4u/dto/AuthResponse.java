package com.jersey4u.dto;

public class AuthResponse {

    private String token;
    private String type = "Bearer";
    private String email;
    private String name;
    private String phone;
    private String role;

    public AuthResponse() {
    }

    public AuthResponse(String token, String email, String name, String phone, String role) {
        this.token = token;
        this.email = email;
        this.name = name;
        this.phone = phone;
        this.role = role;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
