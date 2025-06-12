    package com.api.aquilesApi.Dto;

    import jakarta.validation.constraints.NotNull;
    import lombok.AllArgsConstructor;
    import lombok.Data;
    import lombok.NoArgsConstructor;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public class StateAttendanceDto {
        private Long stateAttendanceId;

        @NotNull(message = "El estado es obligatorio")
        private String status;
    }
