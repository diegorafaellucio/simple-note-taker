# Simple Note Taker

A modern, full-stack note-taking application built with a focus on clean architecture, domain-driven design, and exceptional user experience. The application features a Django backend with DDD principles and a responsive Next.js frontend.

## System Architecture

The application is split into two main components:

```
codes/
├── backend/     # Django + DRF backend
└── frontend/    # Next.js frontend
```

## Frontend Architecture

### Tech Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **Authentication**: JWT-based auth

### Key Features

1. **Modern UI/UX**
   - Responsive design for all devices
   - Real-time note saving with debouncing
   - Category-based organization with color coding
   - Smooth transitions and loading states

2. **Architecture Patterns**
   - Component-based architecture
   - Custom hooks for shared logic
   - Service layer for API communication
   - Proper state management with React hooks

3. **Security & Performance**
   - JWT token management with auto-expiration
   - Route protection
   - Optimized re-rendering
   - Lazy loading where appropriate

### Frontend Structure
```
frontend/
├── src/
│   ├── app/
│   │   ├── components/   # Reusable components
│   │   ├── hooks/       # Custom React hooks
│   │   ├── utils/       # Utility functions
│   │   └── notes/       # Note feature pages
│   └── styles/          # Global styles
```

## Architecture Overview

The project follows a modern full-stack architecture with a strong emphasis on domain-driven design and clean architecture:

## Backend Architecture (Django + DRF)

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

### Prerequisites
- Python 3.8+
- Node.js 18+
- npm or yarn

### Backend Setup
```bash
# Navigate to backend directory
cd codes/backend

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

### Frontend Setup
```bash
# Navigate to frontend directory
cd codes/frontend

# Install dependencies
npm install
# or
yarn install

# Start development server
npm run dev
# or
yarn dev
```

### Access the Application
- Backend API: http://localhost:8000
- Frontend: http://localhost:3000

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