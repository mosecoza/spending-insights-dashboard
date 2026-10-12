# DESIGN SYSTEM

- Source of truth: API `color` + `icon` fields.
- Map: Groceries #FF6B6B shopping-cart, Entertainment #4ECDC4 film, Transportation #45B7D1 car, Dining #F7DC6F utensils, Shopping #BB8FCE shopping-bag, Utilities #85C1E9 zap
- lucide-react icons: ShoppingCart, Film, Car, Utensils, ShoppingBag, Zap
- Tailwind tokens in `tailwind.config` extend colors from above.
- Currency: `new Intl.NumberFormat('en-ZA',{style:'currency',currency:'ZAR'})`
- Status: on_track green, warning amber, over_budget red.
