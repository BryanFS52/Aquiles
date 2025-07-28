package com.api.aquilesApi.Grpc.Client;

import com.api.aquilesApi.proto.DesertionServiceGrpc;
import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import lombok.Getter;
import org.springframework.stereotype.Component;

@Component
@Getter
public class DesertionGrpcClient {

    private final DesertionServiceGrpc.DesertionServiceBlockingStub stub;

    public DesertionGrpcClient() {
        ManagedChannel channel = ManagedChannelBuilder
                .forAddress("localhost", 8080)
                .usePlaintext()
                .build();

        this.stub = DesertionServiceGrpc.newBlockingStub(channel);
    }
}
