"""
Tests básicos para el modelo de items usando patrón AAA
(Arrange-Act-Assert)
"""
from unittest.mock import MagicMock, patch


@patch('src.models.items.items_collection')
def test_create_item_success(mock_collection):
    """Test: crear un item exitosamente"""
    from src.models.items import create_item
    
    # Arrange
    mock_collection.insert_one.return_value = MagicMock()
    user_email = "user@test.com"
    item_name = "Leche"
    category = "Lácteos"
    expiration = "2025-12-31"
    
    # Act
    result = create_item(user_email, item_name, category, expiration)
    
    # Assert
    assert "message" in result
    assert result["message"] == "Item agregado exitosamente."


@patch('src.models.items.items_collection')
def test_list_items_by_user(mock_collection):
    """Test: listar items de un usuario"""
    from src.models.items import list_items
    
    # Arrange
    user_email = "user@test.com"
    expected_items = [
        {"name": "Yogurt", "user_email": user_email}
    ]
    mock_collection.find.return_value = expected_items
    
    # Act
    result = list_items(user_email)
    
    # Assert
    assert len(result) == 1
    assert result[0]["name"] == "Yogurt"


@patch('src.models.items.items_collection')
def test_update_item_status(mock_collection):
    """Test: actualizar el estado de un item"""
    from src.models.items import update_item_status
    
    # Arrange
    item_name = "Leche"
    new_status = "consumed"
    mock_result = MagicMock()
    mock_result.modified_count = 1
    mock_collection.update_one.return_value = mock_result
    
    # Act
    result = update_item_status(item_name, new_status)
    
    # Assert
    assert "message" in result
    assert result["message"] == "Estado del item actualizado correctamente."
