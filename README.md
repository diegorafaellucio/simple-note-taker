# Simple Note Taker

A modern web application for taking and organizing notes with a clean, user-friendly interface. Built following Domain-Driven Design (DDD) principles and clean architecture practices.

## Architecture Overview

The project follows a modern full-stack architecture with a strong emphasis on domain-driven design and clean architecture:

### Backend Architecture (Django + DRF)

#### Domain Layer
The core business logic is encapsulated in the domain layer:

- **Domain Models**: Pure Python classes representing core business entities
  - `Note`: Core note entity with title, content, and metadata
  - `Category`: Represents note categories with name and color
  - `User`: Custom user entity for authentication

- **Value Objects**: Immutable objects representing domain concepts
  - `NoteContent`: Encapsulates and validates note content
  - `CategoryColor`: Ensures valid color formats
  - `NoteMetadata`: Groups metadata attributes

- **Interfaces**: Abstract base classes defining repository contracts
  - `NoteRepository`
  - `CategoryRepository`
  - `UserRepository`

#### Application Layer
Services implementing business use cases:

- **Services** (`/apps/notes/services/`)
  - `NoteService`: Note creation, updates, and queries
  - `CategoryService`: Category management
  - `UserService`: User authentication and queries

#### Infrastructure Layer
Implementation of persistence and framework integration:

- **Repositories** (`/apps/notes/repositories/`)
  - `DjangoNoteRepository`: Django ORM implementation for notes
  - `DjangoCategoryRepository`: Category persistence
  - `DjangoUserRepository`: User authentication and storage

- **Models** (`/apps/notes/models/`)
  - Django ORM models with domain model mapping
  - Conversion methods between domain and persistence models

## Key Design Decisions

### 1. SOLID Principles Implementation

- **Single Responsibility Principle (SRP)**
  - Each service and repository has a single, well-defined purpose
  - Value objects handle their own validation

- **Open/Closed Principle (OCP)**
  - Use of interfaces allows extending functionality without modification
  - Domain models are extensible through composition

- **Liskov Substitution Principle (LSP)**
  - Repository implementations properly fulfill their interfaces
  - Domain models maintain consistent behavior

- **Interface Segregation Principle (ISP)**
  - Focused interfaces for repositories
  - No unnecessary dependencies

- **Dependency Inversion Principle (DIP)**
  - High-level modules (services) depend on abstractions
  - Low-level modules (Django models) implement these abstractions

### 2. Domain-Driven Design Patterns

- **Value Objects**: Immutable objects for domain concepts
- **Repositories**: Abstract persistence layer
- **Services**: Encapsulate business operations
- **Domain Events**: (Planned for future implementation)

### 3. Clean Architecture

- Clear separation between domain and infrastructure
- Domain layer has no external dependencies
- Infrastructure adapts to domain interfaces

## Project Organization

```
backend/
├── apps/
│   └── notes/
│       ├── domain/
│       │   ├── models/
│       │   ├── value_objects.py
│       │   └── interfaces.py
│       ├── repositories/
│       │   ├── note_repository.py
│       │   ├── category_repository.py
│       │   └── user_repository.py
│       ├── services/
│       │   ├── note_service.py
│       │   ├── category_service.py
│       │   └── user_service.py
│       └── models/
│           ├── note_model.py
│           ├── category_model.py
│           └── custom_user_model.py
└── core/
    └── settings.py
```

## Development Setup

### Backend
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Start development server
python manage.py runserver
```

## Git Configuration

The project includes a comprehensive `.gitignore` file that excludes:
- Python cache files (`__pycache__`, `*.pyc`)
- Virtual environment directories
- IDE files
- Django-specific files
- System files

## Future Improvements

1. **Exception Handling**
   - Implement domain-specific exceptions
   - Create a consistent error handling strategy

2. **Validation Layer**
   - Add a dedicated validation layer for complex business rules
   - Implement cross-entity validation

3. **Event System**
   - Implement domain events for better decoupling
   - Add event handlers for complex workflows

## Contributing

1. Follow the established architectural patterns
2. Maintain separation of concerns
3. Write tests for domain logic
4. Document architectural decisions

## License

MIT License - see LICENSE file for details