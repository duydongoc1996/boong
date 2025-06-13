# Elysia with Bun runtime

## Getting Started

To get started with this template, simply paste this command into your terminal:

```bash
bun create elysia ./elysia-example
```

## Development

To start the development server run:

```bash
bun run dev
```

Open http://localhost:3000/ with your browser to see the result.

## Clean architecture

```
src
    domain
        entities
        value-objects
        interfaces
        enums
        events
        commands
        queries

    usecases
        users
        access
        group

    interfaces
        respositories
            user-repository
            group-repository
        adapters
            http-adapter
        controllers
        routes

    infrastructures
        tracing
            open-telemetry
        loggers
            winston
        databases
            postgres
        caches
            redis
        message-brokers
            rabbitmq
        http
            elysia-server
        trpc
            elysia-trpc-server


```
