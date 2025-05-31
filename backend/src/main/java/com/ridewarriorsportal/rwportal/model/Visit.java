package com.ridewarriorsportal.rwportal.model;

import lombok.*;
import lombok.experimental.SuperBuilder;
import jakarta.persistence.*;
import java.time.*;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "visits")

public class Visit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "date", nullable = false)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate date;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonBackReference
    private User user;

    @Column(name = "temperature")
    private Integer temperature;

    @Column(name = "wind_speed")
    private Integer windSpeed;

    @Column(name = "humidity")
    private Integer humidity;

    @Column(name = "uv_index")
    private Integer uvIndex;

    @Column(name = "rain")
    private Boolean rain;

    @Column(name = "comments")
    private String comments;

    @OneToMany(mappedBy = "visit", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Activity> activities;

}
