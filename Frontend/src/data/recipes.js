export const recipes = [
  {
    id: 'sandwich',
    emoji: '🥪',
    name: 'Chicken Sandwich',
    time: '~15 min',
    portions: '2 servings',
    tags: ['Easy','Quick','Use fridge leftovers'],
    ingredients: [
      { name: 'Bread', available: true },
      { name: 'Chicken', available: true },
      { name: 'Lettuce', available: true },
      { name: 'Yogurt', available: true },
      { name: 'Tomato', available: false },
      { name: 'Cheese', available: false }
    ],
    steps: [
      'Lightly toast the bread.',
      'Cook or reheat the chicken.',
      'Assemble with lettuce, yogurt and (if available) tomato/cheese.'
    ]
  },
  {
    id: 'omelette',
    emoji: '🍳',
    name: 'Light Omelette',
    time: '~10 min',
    portions: '1-2 servings',
    tags: ['Breakfast','Quick'],
    ingredients: [
      { name: 'Eggs', available: true },
      { name: 'Broccoli', available: true },
      { name: 'Butter', available: true },
      { name: 'Cheese', available: false }
    ],
    steps: ['Beat the eggs', 'Sauté the broccoli', 'Cook in a pan with butter']
  },
  {
    id: 'salad',
    emoji: '🥗',
    name: 'Green Salad',
    time: '~8 min',
    portions: '2 servings',
    tags: ['Light','Fresh'],
    ingredients: [
      { name: 'Lettuce', available: true },
      { name: 'Broccoli', available: true },
      { name: 'Tomato', available: false },
      { name: 'Cucumber', available: false },
      { name: 'Vinaigrette', available: false }
    ],
    steps: ['Wash and chop vegetables', 'Mix and dress with vinaigrette']
  },
  {
    id: 'pasta',
    emoji: '🍝',
    name: 'Quick Pasta',
    time: '~20-25 min',
    portions: '2-3 servings',
    tags: ['Dinner'],
    ingredients: [
      { name: 'Pasta', available: true },
      { name: 'Tomato sauce', available: false },
      { name: 'Butter', available: true }
    ],
    steps: ['Boil the pasta', 'Prepare a quick sauce', 'Mix and serve']
  }
]
