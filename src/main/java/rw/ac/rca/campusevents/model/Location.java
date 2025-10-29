package rw.ac.rca.campusevents.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "locations")
public class Location {

    public enum LocationType {
        PROVINCE, DISTRICT, SECTOR, CELL, VILLAGE
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String province;
    private String provinceCode; 
    private String district;
    private String sector;
    private String cell;
    private String village;

    @Enumerated(EnumType.STRING)
    private LocationType locationType;

    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_location_id")
    @JsonIgnore
    private Location parentLocation;

    
    @OneToMany(mappedBy = "parentLocation", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Location> childLocations = new ArrayList<>();

    
    @OneToMany(mappedBy = "location", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<User> users = new ArrayList<>();

    public Location() {}

    public Location(Long id, String province, String provinceCode, String district, String sector, String cell, String village, LocationType locationType, Location parentLocation, List<Location> childLocations, List<User> users) {
        this.id = id;
        this.province = province;
        this.provinceCode = provinceCode;
        this.district = district;
        this.sector = sector;
        this.cell = cell;
        this.village = village;
        this.locationType = locationType;
        this.parentLocation = parentLocation;
        this.childLocations = childLocations;
        this.users = users;
    }

    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getProvince() { return province; }
    public void setProvince(String province) { this.province = province; }

    public String getProvinceCode() { return provinceCode; }
    public void setProvinceCode(String provinceCode) { this.provinceCode = provinceCode; }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

    public String getSector() { return sector; }
    public void setSector(String sector) { this.sector = sector; }

    public String getCell() { return cell; }
    public void setCell(String cell) { this.cell = cell; }

    public String getVillage() { return village; }
    public void setVillage(String village) { this.village = village; }

    public LocationType getLocationType() { return locationType; }
    public void setLocationType(LocationType locationType) { this.locationType = locationType; }

    public Location getParentLocation() { return parentLocation; }
    public void setParentLocation(Location parentLocation) { this.parentLocation = parentLocation; }

    public List<Location> getChildLocations() { return childLocations; }
    public void setChildLocations(List<Location> childLocations) { this.childLocations = childLocations; }

    public List<User> getUsers() { return users; }
    public void setUsers(List<User> users) { this.users = users; }

    
    public void addChild(Location child) {
        this.childLocations.add(child);
        child.setParentLocation(this);
    }
}
