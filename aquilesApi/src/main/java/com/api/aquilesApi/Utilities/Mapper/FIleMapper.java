package com.api.aquilesApi.Utilities.Mapper;

import org.mapstruct.Named;

import java.util.Base64;
import java.util.regex.Pattern;

public final class FIleMapper {
    private FIleMapper() {}

    // Pattern to validate Base64 strings
    private static final Pattern BASE64_PATTERN = Pattern.compile("^[A-Za-z0-9+/]*={0,2}$");

    @Named("stringToBytes")
    public static byte[] stringToBytes(String value) {
        if (value == null || value.isBlank()) return null;

        // Remove any whitespace
        String cleanValue = value.trim();

        // Check if the string is valid Base64
        if (!isValidBase64(cleanValue)) {
            // If it's not valid Base64, return null or handle as needed
            // You could also log a warning here
            return null;
        }

        try {
            return Base64.getDecoder().decode(cleanValue);
        } catch (IllegalArgumentException e) {
            // Handle any remaining Base64 decode errors
            return null;
        }
    }

    private static boolean isValidBase64(String value) {
        // Check if string length is multiple of 4 (Base64 requirement)
        if (value.length() % 4 != 0) {
            return false;
        }

        // Check if string contains only valid Base64 characters
        return BASE64_PATTERN.matcher(value).matches();
    }

    @Named("bytesToString")
    public static String bytesToString(byte[] value) {
        if (value == null || value.length == 0) return null;
        return Base64.getEncoder().encodeToString(value);
    }

    // Generics
    public static byte[] map(String value) {
        return stringToBytes(value);
    }

    public static String map(byte[] value) {
        return bytesToString(value);
    }
}
