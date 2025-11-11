"""
Tests básicos para el modelo de recetas usando patrón AAA
(Arrange-Act-Assert)
"""
from unittest.mock import MagicMock, patch


@patch('src.models.recipes.recipes_collection')
def test_create_recipe_success(mock_collection):
    """Test: crear una receta"""
    from src.models.recipes import create_recipe
    
    # Arrange
    mock_result = MagicMock()
    mock_result.inserted_id = "recipe123"
    mock_collection.insert_one.return_value = mock_result
    title = "Pasta"
    description = "Receta de pasta"
    user_email = "user@test.com"
    
    # Act
    result = create_recipe(title, description, user_email)
    
    # Assert
    assert result == "recipe123"


@patch('src.models.recipes.recipes_collection')
def test_list_recipes(mock_collection):
    """Test: listar todas las recetas"""
    from src.models.recipes import list_recipes
    
    # Arrange
    expected_recipes = [
        {"title": "Receta 1"},
        {"title": "Receta 2"}
    ]
    mock_collection.find.return_value = expected_recipes
    
    # Act
    result = list_recipes()
    
    # Assert
    assert len(result) == 2
    assert result[0]["title"] == "Receta 1"


@patch('src.models.recipes.recipes_collection')
def test_create_recipe_with_expiration(mock_collection):
    """Test: crear receta con fecha de vencimiento"""
    from src.models.recipes import create_recipe
    
    # Arrange
    mock_result = MagicMock()
    mock_result.inserted_id = "recipe456"
    mock_collection.insert_one.return_value = mock_result
    title = "Ensalada"
    description = "Fresca"
    user_email = "user@test.com"
    expiration_date = "2025-12-31"
    
    # Act
    result = create_recipe(title, description, user_email, expiration_date)
    
    # Assert
    assert result == "recipe456"
