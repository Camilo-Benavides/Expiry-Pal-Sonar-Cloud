"""
Tests básicos para el modelo de usuarios usando patrón AAA
(Arrange-Act-Assert)
"""
from unittest.mock import MagicMock, patch
from werkzeug.security import generate_password_hash
import secrets


@patch('src.models.users.users_collection')
def test_register_user_success(mock_collection):
    """Test: registrar un usuario nuevo"""
    from src.models.users import register_user
    
    # Arrange (Preparar)
    mock_collection.find_one.return_value = None
    mock_collection.insert_one.return_value = MagicMock()
    name = "Juan"
    email = "juan@test.com"
    password = "pass123"
    
    # Act (Actuar)
    result = register_user(name, email, password)
    
    # Assert (Afirmar)
    assert "message" in result
    assert result["message"] == "Usuario registrado correctamente."


@patch('src.models.users.users_collection')
def test_register_user_duplicate(mock_collection):
    """Test: no permitir emails duplicados"""
    from src.models.users import register_user
    
    # Arrange
    existing_email = "existe@test.com"
    mock_collection.find_one.return_value = {"email": existing_email}
    
    # Act
    result = register_user("Test", existing_email, "pass")
    
    # Assert
    assert "error" in result
    assert "ya está registrado" in result["error"]


@patch('src.models.users.users_collection')
def test_authenticate_user_success(mock_collection):
    """Test: autenticar usuario con credenciales correctas"""
    from src.models.users import authenticate_user
    
    # Arrange
    email = "user@test.com"
    password = secrets.token_urlsafe(8)
    mock_collection.find_one.return_value = {
        "email": email,
        "name": "User",
        "password_hash": generate_password_hash(password)
    }
    
    # Act
    result = authenticate_user(email, password)
    
    # Assert
    assert "message" in result
    assert result["message"] == "Autenticación exitosa."
    assert result["email"] == email
