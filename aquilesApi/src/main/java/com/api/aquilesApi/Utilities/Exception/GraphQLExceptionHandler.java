package com.api.aquilesApi.Utilities.Exception;

import graphql.GraphQLError;
import graphql.GraphqlErrorBuilder;
import graphql.schema.DataFetchingEnvironment;
import org.springframework.dao.DataAccessException;
import org.springframework.graphql.execution.DataFetcherExceptionResolverAdapter;
import org.springframework.stereotype.Component;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

@Component
public class GraphQLExceptionHandler extends DataFetcherExceptionResolverAdapter {

    @Override
    protected GraphQLError resolveToSingleError(Throwable ex, DataFetchingEnvironment env) {

        // Validations with business
        if (ex instanceof BadRequestException) {
            return GraphqlErrorBuilder.newError(env)
                    .message(ex.getMessage())
                    .errorType(graphql.ErrorType.ValidationError)
                    .build();
        }

        // Resource not found
        if (ex instanceof NotFoundException) {
            return GraphqlErrorBuilder.newError(env)
                    .message(ex.getMessage())
                    .errorType(graphql.ErrorType.DataFetchingException)
                    .build();
        }

        // Error with database
        if (ex instanceof DataAccessException) {
            return GraphqlErrorBuilder.newError(env)
                    .message("Database error: " + ex.getMessage())
                    .errorType(graphql.ErrorType.DataFetchingException)
                    .build();
        }

        // Error with invalid argument type
        if (ex instanceof MethodArgumentTypeMismatchException) {
            return GraphqlErrorBuilder.newError(env)
                    .message("Invalid parameter type")
                    .errorType(graphql.ErrorType.ValidationError)
                    .build();
        }

        // Fallback for other exceptions
        return GraphqlErrorBuilder.newError(env)
                .message("Unexpected server error: " + ex.getMessage())
                .errorType(graphql.ErrorType.DataFetchingException)
                .build();
    }
}
