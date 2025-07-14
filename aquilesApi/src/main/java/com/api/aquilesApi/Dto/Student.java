package com.api.aquilesApi.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class Student implements Serializable {


    private Long id;

    private Boolean state;

    private Date createdAt;

    private Date updatedAt;

}