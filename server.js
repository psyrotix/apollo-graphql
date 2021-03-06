import express from 'express';
import Schema from './data/schema';
import Resolvers from './data/resolvers';
import Mocks from './data/mocks';

import { apolloExpress, graphiqlExpress } from 'apollo-server';
import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
import bodyParser from 'body-parser';
import Connectors from './data/connectors';

const GRAPHQL_PORT = 8080;

const graphQLServer = express();


graphQLServer.use(function (req, res, next) {
    // intercept OPTIONS method'

    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    res.setHeader('Cache-Control', 'public, max-age=31557600');
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.setHeader("Access-Control-Allow-Headers", "Origin, if-none-match, upgrade-insecure-requests, X-Requested-With, Content-Type, cache-control, Accept, pragma, authorization");

if ('OPTIONS' == req.method) {
        res.send(200);
    }
   else {
    console.log(req)
    next();
  }

});

const executableSchema = makeExecutableSchema({
  typeDefs: Schema,
  resolvers: Resolvers,
  allowUndefinedInResolve: false,
  connectors: Connectors,
  printErrors: true,
});

addMockFunctionsToSchema({
  schema: executableSchema,
  mocks: Mocks,
  preserveResolvers: true,
});

// `context` must be an object and can't be undefined when using connectors
graphQLServer.use('/graphql', bodyParser.json(), apolloExpress({
  schema: executableSchema,
  context: {},
}));

graphQLServer.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
}));

graphQLServer.listen(GRAPHQL_PORT, () => console.log(
  `GraphQL Server is now running on http://localhost:${GRAPHQL_PORT}/graphql`
));