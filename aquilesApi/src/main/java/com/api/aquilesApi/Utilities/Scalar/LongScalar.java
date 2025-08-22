package com.api.aquilesApi.Utilities.Scalar;

import com.netflix.graphql.dgs.DgsScalar;
import graphql.GraphQLContext;
import graphql.language.IntValue;
import graphql.language.StringValue;
import graphql.language.Value;
import graphql.schema.Coercing;
import graphql.schema.CoercingParseLiteralException;
import graphql.schema.CoercingParseValueException;
import graphql.schema.CoercingSerializeException;
import jakarta.validation.constraints.NotNull;

import java.util.Locale;

@DgsScalar(name = "Long")
public class LongScalar implements Coercing<Long, String> {

    // ✅ Versión modern con contexto (usada por Spring GraphQL y DGS)
    @Override
    public String serialize(@NotNull Object dataFetcherResult, @NotNull GraphQLContext graphQLContext, @NotNull Locale locale) throws CoercingSerializeException {
        if (dataFetcherResult instanceof Long || dataFetcherResult instanceof Integer) {
            return dataFetcherResult.toString();
        } else {
            throw new CoercingSerializeException("Not a valid Long");
        }
    }

    @Override
    public Long parseValue(Object input, @NotNull GraphQLContext graphQLContext, @NotNull Locale locale) throws CoercingParseValueException {
        try {
            return Long.parseLong(input.toString());
        } catch (NumberFormatException e) {
            throw new CoercingParseValueException("Invalid value for Long: " + input);
        }
    }

    @Override
    public @NotNull Value<?> valueToLiteral(@NotNull Object input, @NotNull GraphQLContext context, @NotNull Locale locale) {
        return new StringValue(input.toString());
    }

    // ✅ MÉTODO CLÁSICO: obligatorio para evitar el UnsupportedOperationException
    @Override
    public Long parseLiteral(Object input) throws CoercingParseLiteralException {
        if (input instanceof IntValue) {
            return ((IntValue) input).getValue().longValue();
        } else if (input instanceof StringValue) {
            try {
                return Long.parseLong(((StringValue) input).getValue());
            } catch (NumberFormatException e) {
                throw new CoercingParseLiteralException("Invalid Long literal: " + input);
            }
        }
        throw new CoercingParseLiteralException("Unexpected literal type: " + input.getClass().getSimpleName());
    }
}
