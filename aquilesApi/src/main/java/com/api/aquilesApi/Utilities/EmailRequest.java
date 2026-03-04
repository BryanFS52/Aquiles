package com.api.aquilesApi.Utilities;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Setter
@Getter
public class EmailRequest {
    private String email;
    private String subject;
    private String htmlContent;
}
