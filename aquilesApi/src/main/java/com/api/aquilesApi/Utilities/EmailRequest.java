package com.api.aquilesApi.Utilities;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
public class EmailRequest {
    private String email;
    private String subject;
    private String htmlContent;
}
