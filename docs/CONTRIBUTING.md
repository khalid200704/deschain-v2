# Contributing to Deschain

Thank you for interest in contributing to Deschain! This guide will help you get started.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the code, not the person

## Getting Started

### 1. Fork and Clone

```bash
git clone https://github.com/yourusername/deschain.git
cd deschain
```

### 2. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue-description
```

### 3. Make Changes

Follow the coding standards:

**Backend (Python)**:
- PEP 8 style guide
- Use type hints
- Write docstrings
- Keep functions focused and testable

```python
def create_procurement_request(
    umkm_id: str,
    product_name: str,
    quantity: float,
    db: Session
) -> ProcurementRequest:
    """
    Create a new procurement request.
    
    Args:
        umkm_id: The UMKM user ID
        product_name: Name of the product
        quantity: Quantity needed
        db: Database session
        
    Returns:
        The created ProcurementRequest
    """
    # Implementation
```

**Frontend (React/JavaScript)**:
- Use functional components with hooks
- Use meaningful variable names
- Keep components focused
- Use Tailwind CSS for styling

```jsx
export const MyComponent = ({ title, onAction }) => {
  const [state, setState] = React.useState(null)
  
  React.useEffect(() => {
    // Side effects
  }, [])
  
  return (
    <div className="bg-white p-6">
      <h1 className="text-2xl font-bold">{title}</h1>
    </div>
  )
}
```

### 4. Test Your Changes

**Backend**:
```bash
cd backend
pytest tests/ -v
```

**Frontend**:
```bash
cd frontend
npm run lint
npm run test
```

### 5. Commit

Use conventional commits:

```bash
git commit -m "feat: add procurement request creation API"
git commit -m "fix: resolve database connection pool issue"
git commit -m "docs: update API documentation"
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

### 6. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Open a Pull Request on GitHub with:
- Clear title describing the change
- Description of what changed and why
- Related issue numbers (if applicable)
- Screenshots (for UI changes)

## Code Review Process

1. Code review by maintainers
2. Request changes if needed
3. All tests must pass
4. Merge when approved

## Development Workflow

### Backend Development

```bash
cd backend

# Create migration
alembic revision --autogenerate -m "add new field"

# Run tests
pytest tests/

# Run linting
flake8 app/
black app/
```

### Frontend Development

```bash
cd frontend

# Start dev server
npm run dev

# Lint
npm run lint

# Format
npm run format
```

## Documentation

- Update README.md for major features
- Add docstrings to functions
- Document complex algorithms
- Update API docs in docs/API_DESIGN.md

## Reporting Bugs

Include:
- Clear title
- Detailed description
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots/logs
- Environment info

## Feature Requests

Include:
- Clear title and description
- Use case and benefits
- Possible implementation approach
- Related features/dependencies

## Questions?

- Create a GitHub Discussion
- Check existing issues
- Read documentation

---

Thank you for contributing! 🚀
