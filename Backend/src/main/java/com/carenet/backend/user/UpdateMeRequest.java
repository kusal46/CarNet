package com.carenet.backend.user;

public class UpdateMeRequest {
    private String firstName;
    private String lastName;
    private String city;
    private String address;

    public String getFirstName() { return firstName; }
    public void setFirstName(String v) { this.firstName = v; }

    public String getLastName() { return lastName; }
    public void setLastName(String v) { this.lastName = v; }

    public String getCity() { return city; }
    public void setCity(String v) { this.city = v; }

    public String getAddress() { return address; }
    public void setAddress(String v) { this.address = v; }
}
