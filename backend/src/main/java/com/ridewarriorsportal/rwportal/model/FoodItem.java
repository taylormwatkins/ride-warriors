package com.ridewarriorsportal.rwportal.model;

import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Entity
@Table(name = "food_items")

public class FoodItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "name")
    private String name;

    @ManyToOne
    @JoinColumn(name = "attraction_id", nullable = false)
    private Attraction attraction;

    @Column(name = "is_entree")
    private Boolean isEntree;

    @ManyToMany(mappedBy = "foodItems")
    @JsonIgnore
    private List<Meal> meals;

    // this jsonignore isn't sustainable but it will work for now

}
