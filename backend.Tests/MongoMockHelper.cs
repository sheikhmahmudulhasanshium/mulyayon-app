using MongoDB.Bson;
using MongoDB.Driver;
using Moq;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace backend.Tests;

internal static class MongoMockHelper
{
    public static Mock<IAsyncCursor<T>> CreateCursor<T>(params T[] results)
    {
        var cursor = new Mock<IAsyncCursor<T>>();
        var hasMoved = false;

        cursor.SetupGet(c => c.Current).Returns(results);

        cursor
            .Setup(c => c.MoveNextAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(() =>
            {
                if (!hasMoved && results.Length > 0)
                {
                    hasMoved = true;
                    return true;
                }
                return false;
            });

        cursor
            .Setup(c => c.MoveNext(It.IsAny<CancellationToken>()))
            .Returns(() =>
            {
                if (!hasMoved && results.Length > 0)
                {
                    hasMoved = true;
                    return true;
                }
                return false;
            });

        return cursor;
    }

    public static void SetupFind<T>(
        Mock<IMongoCollection<T>> collection,
        params T[] results)
    {
        var cursor = CreateCursor(results);
        var bsonResults = Array.ConvertAll(results, _ => new BsonDocument());
        var bsonCursor = CreateCursor(bsonResults);

        // --- Standard Setups (TProjection = T) ---
        collection
            .Setup(x => x.FindAsync(
                It.IsAny<FilterDefinition<T>>(),
                It.IsAny<FindOptions<T, T>>(),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(() => cursor.Object);

        collection
            .Setup(x => x.FindAsync(
                It.IsAny<IClientSessionHandle>(),
                It.IsAny<FilterDefinition<T>>(),
                It.IsAny<FindOptions<T, T>>(),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(() => cursor.Object);

        collection
            .Setup(x => x.FindSync(
                It.IsAny<FilterDefinition<T>>(),
                It.IsAny<FindOptions<T, T>>(),
                It.IsAny<CancellationToken>()))
            .Returns(() => cursor.Object);

        collection
            .Setup(x => x.FindSync(
                It.IsAny<IClientSessionHandle>(),
                It.IsAny<FilterDefinition<T>>(),
                It.IsAny<FindOptions<T, T>>(),
                It.IsAny<CancellationToken>()))
            .Returns(() => cursor.Object);

        // --- Projected Setups (TProjection = BsonDocument) ---
        collection
            .Setup(x => x.FindAsync<BsonDocument>(
                It.IsAny<FilterDefinition<T>>(),
                It.IsAny<FindOptions<T, BsonDocument>>(),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(() => bsonCursor.Object);

        collection
            .Setup(x => x.FindAsync<BsonDocument>(
                It.IsAny<IClientSessionHandle>(),
                It.IsAny<FilterDefinition<T>>(),
                It.IsAny<FindOptions<T, BsonDocument>>(),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(() => bsonCursor.Object);

        collection
            .Setup(x => x.FindSync<BsonDocument>(
                It.IsAny<FilterDefinition<T>>(),
                It.IsAny<FindOptions<T, BsonDocument>>(),
                It.IsAny<CancellationToken>()))
            .Returns(() => bsonCursor.Object);

        collection
            .Setup(x => x.FindSync<BsonDocument>(
                It.IsAny<IClientSessionHandle>(),
                It.IsAny<FilterDefinition<T>>(),
                It.IsAny<FindOptions<T, BsonDocument>>(),
                It.IsAny<CancellationToken>()))
            .Returns(() => bsonCursor.Object);
    }

    public static void SetupFindSequence<T>(
        Mock<IMongoCollection<T>> collection,
        params T[][] results)
    {
        // Unifying both query paths into a single queue guarantees standard and projected
        // setups stay perfectly synchronized regardless of query execution order.
        var resultsQueue = new Queue<T[]>();
        foreach (var values in results)
        {
            resultsQueue.Enqueue(values);
        }

        Func<IAsyncCursor<T>> getNextCursor = () =>
        {
            var values = resultsQueue.Count > 0 ? resultsQueue.Dequeue() : Array.Empty<T>();
            return CreateCursor(values).Object;
        };

        Func<IAsyncCursor<BsonDocument>> getNextBsonCursor = () =>
        {
            var values = resultsQueue.Count > 0 ? resultsQueue.Dequeue() : Array.Empty<T>();
            var bsonValues = Array.ConvertAll(values, _ => new BsonDocument());
            return CreateCursor(bsonValues).Object;
        };

        // --- Standard Setups (TProjection = T) ---
        collection
            .Setup(x => x.FindAsync(
                It.IsAny<FilterDefinition<T>>(),
                It.IsAny<FindOptions<T, T>>(),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(getNextCursor);

        collection
            .Setup(x => x.FindAsync(
                It.IsAny<IClientSessionHandle>(),
                It.IsAny<FilterDefinition<T>>(),
                It.IsAny<FindOptions<T, T>>(),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(getNextCursor);

        collection
            .Setup(x => x.FindSync(
                It.IsAny<FilterDefinition<T>>(),
                It.IsAny<FindOptions<T, T>>(),
                It.IsAny<CancellationToken>()))
            .Returns(getNextCursor);

        collection
            .Setup(x => x.FindSync(
                It.IsAny<IClientSessionHandle>(),
                It.IsAny<FilterDefinition<T>>(),
                It.IsAny<FindOptions<T, T>>(),
                It.IsAny<CancellationToken>()))
            .Returns(getNextCursor);

        // --- Projected Setups (TProjection = BsonDocument) ---
        collection
            .Setup(x => x.FindAsync<BsonDocument>(
                It.IsAny<FilterDefinition<T>>(),
                It.IsAny<FindOptions<T, BsonDocument>>(),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(getNextBsonCursor);

        collection
            .Setup(x => x.FindAsync<BsonDocument>(
                It.IsAny<IClientSessionHandle>(),
                It.IsAny<FilterDefinition<T>>(),
                It.IsAny<FindOptions<T, BsonDocument>>(),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(getNextBsonCursor);

        collection
            .Setup(x => x.FindSync<BsonDocument>(
                It.IsAny<FilterDefinition<T>>(),
                It.IsAny<FindOptions<T, BsonDocument>>(),
                It.IsAny<CancellationToken>()))
            .Returns(getNextBsonCursor);

        collection
            .Setup(x => x.FindSync<BsonDocument>(
                It.IsAny<IClientSessionHandle>(),
                It.IsAny<FilterDefinition<T>>(),
                It.IsAny<FindOptions<T, BsonDocument>>(),
                It.IsAny<CancellationToken>()))
            .Returns(getNextBsonCursor);
    }
}