package com.api.aquilesApi.Resolver.DgsEntityFetcher;

import com.api.aquilesApi.Dto.Profile;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsEntityFetcher;

import java.util.Map;

@DgsComponent
public class profileEntityFetcher {

    @DgsEntityFetcher(name = "Profile")
    public Profile getProfile(Map<String, Object> values) {
        String id = (String) values.get("id");
        if (id == null) return null;
        Profile profile = new Profile();
        profile.setId(id);
        return profile;
    }
}
