package com.api.aquilesApi.Utilities;

import org.springframework.stereotype.Component;

@Component
public class DataConvert {
    public Long parseLongOrNull(String value) {
        try {
            return value != null && !value.isEmpty() ? Long.parseLong(value) : null;
        } catch (NumberFormatException e) {
            return null;
        }
    }
}
