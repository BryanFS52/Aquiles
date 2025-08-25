/*
package com.api.aquilesApi.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

@NoArgsConstructor
@Entity
@Getter
@Setter
@Table(name = "ImprovementPlan_supporting_contents")
public class ImprovementPlanSupportingContent implements Serializable {

    @Transient
    private final SimpleDateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd");

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "improvement_plan_id", nullable = false)
    private ImprovementPlan improvementPlan;

    @Column(name = "type", nullable = false)
    private String type;

    @Column(name = "url", nullable = false)
    private String url;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "concertation_date", nullable = false)
    private Date concertationDate;

    @Column(name = "final_delivery_date", nullable = false)
    private Date finalDeliveryDate;

    public void setConcertationDate(String concertationDate) throws ParseException {
        this.concertationDate = dateFormatter.parse(concertationDate);
    }

    public void setFinalDeliveryDate(String finalDeliveryDate) throws ParseException {
        this.finalDeliveryDate = dateFormatter.parse(finalDeliveryDate);
    }

    public String getConcertationDate() {
        return (concertationDate != null) ? dateFormatter.format(concertationDate) : null;
    }

    public String getFinalDeliveryDate() {
        return (finalDeliveryDate != null) ? dateFormatter.format(finalDeliveryDate) : null;
    }
}
 */