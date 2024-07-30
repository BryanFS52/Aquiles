package com.senacsf.aquiles.app.repository;

import com.senacsf.aquiles.app.entities.TwoFactorAuth;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TwoFactorAuthRepository extends JpaRepository<TwoFactorAuth, Long> {
    TwoFactorAuth findByEmail(String email);
}
