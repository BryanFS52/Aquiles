package com.api.aquilesApi.Grpc.Service;

import com.api.aquilesApi.Grpc.Client.DesertionGrpcClient;
import com.api.aquilesApi.proto.DesertionRequest;
import com.api.aquilesApi.proto.DesertionResponse;
import org.springframework.stereotype.Service;

@Service
public class DesertionGrpcService {

    private final DesertionGrpcClient desertionGrpcClient;

    public DesertionGrpcService(DesertionGrpcClient desertionGrpcClient) {
        this.desertionGrpcClient = desertionGrpcClient;
    }

    public DesertionResponse notifyDesertion(Long studentId, String motivo, Long teacherId) {
        DesertionRequest request = DesertionRequest.newBuilder()
                .setStudentId(studentId)
                .setMotivo(motivo)
                .setTeacherId(teacherId)
                .build();
        return desertionGrpcClient.getStub().notifyDesertionProcess(request);
    }
}