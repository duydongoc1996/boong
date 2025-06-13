# Boong Framework

A next-generation microservices framework built on domain-driven design, clean architecture, and event sourcing principles.

## 🚀 Framework Overview

Boong is a comprehensive framework that combines the power of domain events, clean architecture, and modern TypeScript tooling to create scalable, maintainable microservices. Built on Bun runtime and Elysia, it provides automatic CRUD generation, distributed transactions, and event sourcing capabilities.

## 🎯 Core Principles

### Domain-Driven Design + Clean Architecture

- **Domain Layer**: Pure business logic with domain entities and events
- **Application Layer**: Use cases and application services
- **Infrastructure Layer**: Database, message brokers, external services
- **Presentation Layer**: REST APIs with automatic documentation

### Event-Driven Architecture

- Domain events for business logic communication
- Event sourcing for audit trails and state reconstruction
- Distributed transaction coordination via event choreography

## 📋 Detailed Implementation Plan

### Phase 1: Core Framework Infrastructure

1. **Project Structure Setup**

    - Clean architecture folder structure
    - Dependency injection container
    - Configuration management
    - Environment-specific settings

2. **Database Layer**

    - Drizzle ORM integration
    - PostgreSQL connection pooling
    - Transaction management
    - Migration system

3. **Event System**
    - Domain event base classes
    - Event bus implementation
    - Event store for event sourcing
    - Message broker integration (Redis Streams/RabbitMQ)

### Phase 2: Service Infrastructure

1. **Service Discovery & Registry**

    - Service registration on startup
    - Health check endpoints
    - Load balancing support
    - Service mesh integration ready

2. **API Framework**

    - Elysia-based REST API
    - Automatic OpenAPI/Swagger generation
    - Request/response validation
    - Error handling middleware

3. **Observability**
    - Structured logging with correlation IDs
    - Distributed tracing (OpenTelemetry)
    - Metrics collection
    - Health monitoring

### Phase 3: Developer Experience

1. **Code Generation**

    - CRUD operations from Drizzle schema
    - TypeScript interfaces
    - API client generation
    - Repository patterns

2. **Security & Multi-tenancy**

    - JWT-based authentication
    - Role-based access control (RBAC)
    - Tenant isolation
    - API endpoint protection

3. **Developer Tools**
    - CLI for scaffolding
    - Hot reloading
    - Testing utilities
    - Database seeding

### Phase 4: Advanced Features

1. **Distributed Transactions**

    - Saga pattern implementation
    - Compensation actions
    - Transaction state management
    - Rollback mechanisms

2. **Event Sourcing**
    - Event store implementation
    - Snapshot management
    - Projection rebuilding
    - Event replay capabilities

## 🏗️ Architecture Diagrams

### System Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        Web[Web App]
        Mobile[Mobile App]
        API_Client[Type-safe API Client]
    end

    subgraph "API Gateway"
        Gateway[API Gateway/Load Balancer]
        Auth[Authentication Service]
    end

    subgraph "Microservices"
        UserService[User Service]
        ProductService[Product Service]
        OrderService[Order Service]
        PaymentService[Payment Service]
    end

    subgraph "Infrastructure"
        ServiceRegistry[Service Registry]
        MessageBroker[Message Broker]
        EventStore[Event Store]
        Database[(PostgreSQL)]
        Cache[(Redis Cache)]
    end

    subgraph "Observability"
        Logging[Centralized Logging]
        Tracing[Distributed Tracing]
        Metrics[Metrics & Monitoring]
    end

    Web --> Gateway
    Mobile --> Gateway
    API_Client --> Gateway

    Gateway --> Auth
    Gateway --> UserService
    Gateway --> ProductService
    Gateway --> OrderService
    Gateway --> PaymentService

    UserService --> ServiceRegistry
    ProductService --> ServiceRegistry
    OrderService --> ServiceRegistry
    PaymentService --> ServiceRegistry

    UserService --> MessageBroker
    ProductService --> MessageBroker
    OrderService --> MessageBroker
    PaymentService --> MessageBroker

    UserService --> Database
    ProductService --> Database
    OrderService --> Database
    PaymentService --> Database

    UserService --> EventStore
    ProductService --> EventStore
    OrderService --> EventStore
    PaymentService --> EventStore

    UserService --> Cache
    ProductService --> Cache
    OrderService --> Cache
    PaymentService --> Cache

    UserService --> Logging
    UserService --> Tracing
    UserService --> Metrics

    ProductService --> Logging
    ProductService --> Tracing
    ProductService --> Metrics

    OrderService --> Logging
    OrderService --> Tracing
    OrderService --> Metrics

    PaymentService --> Logging
    PaymentService --> Tracing
    PaymentService --> Metrics
```

### Clean Architecture Layers

```mermaid
graph TB
    subgraph "Presentation Layer"
        REST[REST Controllers]
        Middleware[Middleware]
        DTOs[DTOs & Validation]
    end

    subgraph "Application Layer"
        UseCases[Use Cases]
        AppServices[Application Services]
        Handlers[Event Handlers]
    end

    subgraph "Domain Layer"
        Entities[Domain Entities]
        ValueObjects[Value Objects]
        DomainEvents[Domain Events]
        DomainServices[Domain Services]
    end

    subgraph "Infrastructure Layer"
        Repositories[Repository Implementations]
        EventBus[Event Bus]
        MessageBroker[Message Broker]
        Database[Database Access]
        ExternalAPIs[External APIs]
    end

    REST --> UseCases
    Middleware --> UseCases
    DTOs --> UseCases

    UseCases --> Entities
    AppServices --> Entities
    Handlers --> Entities

    UseCases --> DomainEvents
    AppServices --> DomainEvents
    Handlers --> DomainEvents

    Entities --> ValueObjects
    Entities --> DomainServices

    UseCases --> Repositories
    AppServices --> Repositories
    Handlers --> EventBus

    Repositories --> Database
    EventBus --> MessageBroker
    AppServices --> ExternalAPIs
```

### API Request Flow

```mermaid
sequenceDiagram
    participant Client
    participant Gateway
    participant Auth
    participant Service
    participant Repository
    participant Database
    participant EventBus
    participant MessageBroker

    Client->>Gateway: HTTP Request
    Gateway->>Auth: Validate Token
    Auth-->>Gateway: Token Valid + User Context
    Gateway->>Service: Forward Request + Context

    Service->>Repository: Query/Command
    Repository->>Database: Execute Transaction
    Database-->>Repository: Result
    Repository-->>Service: Domain Entity

    Service->>EventBus: Publish Domain Event
    EventBus->>MessageBroker: Send Event Message
    MessageBroker-->>EventBus: Acknowledgment

    Service-->>Gateway: Response
    Gateway-->>Client: HTTP Response

    Note over MessageBroker: Other services consume events asynchronously
```

### Event Flow & Distributed Transaction

```mermaid
sequenceDiagram
    participant OrderService
    participant PaymentService
    participant InventoryService
    participant EventStore
    participant MessageBroker

    Note over OrderService: User places order

    OrderService->>EventStore: Store OrderCreated Event
    OrderService->>MessageBroker: Publish OrderCreated

    MessageBroker->>PaymentService: OrderCreated Event
    MessageBroker->>InventoryService: OrderCreated Event

    PaymentService->>PaymentService: Process Payment
    PaymentService->>EventStore: Store PaymentProcessed Event
    PaymentService->>MessageBroker: Publish PaymentProcessed

    InventoryService->>InventoryService: Reserve Items
    InventoryService->>EventStore: Store ItemsReserved Event
    InventoryService->>MessageBroker: Publish ItemsReserved

    alt Payment Failed
        PaymentService->>EventStore: Store PaymentFailed Event
        PaymentService->>MessageBroker: Publish PaymentFailed
        MessageBroker->>OrderService: PaymentFailed Event
        MessageBroker->>InventoryService: PaymentFailed Event
        InventoryService->>InventoryService: Release Reserved Items
        OrderService->>OrderService: Cancel Order
    end

    alt Inventory Insufficient
        InventoryService->>EventStore: Store ItemsNotAvailable Event
        InventoryService->>MessageBroker: Publish ItemsNotAvailable
        MessageBroker->>OrderService: ItemsNotAvailable Event
        MessageBroker->>PaymentService: ItemsNotAvailable Event
        PaymentService->>PaymentService: Refund Payment
        OrderService->>OrderService: Cancel Order
    end

    Note over OrderService,InventoryService: Success case: Order completed
```

### Data Flow Architecture

```mermaid
graph LR
    subgraph "Input Layer"
        API[REST API]
        Events[Domain Events]
    end

    subgraph "Processing Layer"
        CommandHandlers[Command Handlers]
        QueryHandlers[Query Handlers]
        EventHandlers[Event Handlers]
    end

    subgraph "Domain Layer"
        Aggregates[Domain Aggregates]
        DomainEvents[Domain Events]
    end

    subgraph "Persistence Layer"
        WriteDB[(Write Database)]
        ReadDB[(Read Database)]
        EventStore[(Event Store)]
    end

    subgraph "Integration Layer"
        MessageBus[Message Bus]
        ExternalSystems[External Systems]
    end

    API --> CommandHandlers
    API --> QueryHandlers
    Events --> EventHandlers

    CommandHandlers --> Aggregates
    QueryHandlers --> ReadDB
    EventHandlers --> Aggregates

    Aggregates --> DomainEvents
    Aggregates --> WriteDB

    DomainEvents --> EventStore
    DomainEvents --> MessageBus

    MessageBus --> ExternalSystems
    MessageBus --> EventHandlers

    WriteDB -.-> ReadDB
    EventStore -.-> ReadDB
```

## 🛠️ Technical Stack

### Runtime & Framework

- **Bun**: Ultra-fast JavaScript runtime
- **Elysia**: High-performance web framework
- **TypeScript**: Full type safety

### Database & ORM

- **PostgreSQL**: Primary database
- **Drizzle ORM**: Type-safe database access
- **Redis**: Caching and session storage

### Message Broker

- **Redis Streams**: Lightweight event streaming
- **RabbitMQ**: Enterprise message broker (optional)

### Observability

- **OpenTelemetry**: Distributed tracing
- **Pino**: High-performance logging
- **Prometheus**: Metrics collection

### Development Tools

- **Swagger/OpenAPI**: API documentation
- **TypeBox**: Runtime validation
- **Jest**: Testing framework

## 🔧 Core Features

### 1. Automatic CRUD Generation

```typescript
// Define your schema
export const users = pgTable('users', {
	id: uuid('id').primaryKey(),
	email: varchar('email', { length: 255 }).notNull(),
	name: varchar('name', { length: 255 }),
	createdAt: timestamp('created_at').defaultNow(),
});

// CRUD operations are automatically generated
@AutoCRUD(users)
@Service()
export class UserService extends BaseCRUDService<typeof users> {
	// Custom business logic here
	async createUserWithWelcomeEmail(userData: CreateUserDTO) {
		const user = await this.create(userData);
		await this.eventBus.publish(new UserCreatedEvent(user));
		return user;
	}
}
```

### 2. Domain Events & Event Sourcing

```typescript
@DomainEvent('user.created')
export class UserCreatedEvent extends BaseEvent {
	constructor(public readonly user: User) {
		super();
	}
}

@EventHandler(UserCreatedEvent)
export class UserCreatedHandler {
	async handle(event: UserCreatedEvent) {
		// Send welcome email
		await this.emailService.sendWelcomeEmail(event.user);
	}
}
```

### 3. Multi-tenant RBAC

```typescript
@Controller('/api/users')
@RequireTenant()
export class UserController {
	@Get('/')
	@RequireRole(['admin', 'manager'])
	async getUsers(@TenantId() tenantId: string) {
		return this.userService.findByTenant(tenantId);
	}
}
```

### 4. Distributed Transactions

```typescript
@Saga()
export class OrderProcessingSaga {
	@SagaStep()
	async processPayment(orderId: string) {
		return this.paymentService.processPayment(orderId);
	}

	@CompensationAction('processPayment')
	async refundPayment(orderId: string) {
		return this.paymentService.refundPayment(orderId);
	}
}
```

### 5. Type-safe API Client

```typescript
// Automatically generated from your API
const api = createApiClient<AppAPI>({
	baseUrl: 'https://api.example.com',
	token: 'your-jwt-token',
});

// Full TypeScript support
const users = await api.users.getAll(); // Type: User[]
const user = await api.users.getById('123'); // Type: User | null
```

## 🚀 Getting Started

### Installation

```bash
bun create boong-framework my-app
cd my-app
bun install
```

### Project Structure

```
src/
├── application/          # Use cases and application services
├── domain/              # Domain entities, events, and services
├── infrastructure/      # Database, message brokers, external APIs
├── presentation/        # REST controllers and DTOs
├── shared/             # Shared utilities and types
└── main.ts            # Application entry point
```

### Quick Start

```bash
# Generate a new service
bun boong generate service User

# Generate CRUD from schema
bun boong generate crud --schema=users

# Start development server
bun dev

# Run migrations
bun migrate

# Generate API client
bun boong generate client
```

## 📚 Documentation

### API Documentation

- Auto-generated Swagger UI available at `/docs`
- OpenAPI 3.0 specification
- Interactive API explorer

### Development Guidelines

1. **Domain-First**: Start with domain modeling
2. **Event-Driven**: Use domain events for decoupling
3. **Test-Driven**: Write tests for business logic
4. **API-First**: Design APIs before implementation

## 🔒 Security Features

- JWT-based authentication
- Role-based access control (RBAC)
- Multi-tenant data isolation
- Rate limiting and throttling
- Input validation and sanitization
- CORS and security headers

## 📈 Performance Features

- Connection pooling
- Redis caching
- Query optimization
- Horizontal scaling
- Load balancing
- Circuit breakers

## 🧪 Testing

```bash
# Run unit tests
bun test

# Run integration tests
bun test:integration

# Run e2e tests
bun test:e2e

# Generate test coverage
bun test:coverage
```

## 📦 Deployment

### Docker Support

```dockerfile
FROM oven/bun:1.2-slim
WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile
COPY . .
EXPOSE 3000
CMD ["bun", "start"]
```

### Kubernetes Ready

- Health check endpoints
- Graceful shutdown
- Environment configuration
- Helm charts included

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Roadmap

- [ ] GraphQL support
- [ ] gRPC integration
- [ ] WebSocket real-time features
- [ ] Advanced monitoring dashboard
- [ ] AI-powered code generation
- [ ] Blockchain event sourcing

---

Built with ❤️ using Bun and TypeScript
