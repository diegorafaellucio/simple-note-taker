from typing import List
from apps.notes.domain.models import Category
from apps.notes.domain.value_objects import CategoryColor
from apps.notes.domain.interfaces import CategoryRepository


class CategoryService:
    def __init__(self, category_repo: CategoryRepository):
        self.category_repo = category_repo

    def create_category(self, name: str, color: str) -> Category:
        category = Category(name=name, color=CategoryColor(color))
        self.category_repo.save(category)
        return category

    def get_all_categories(self) -> List[Category]:
        return self.category_repo.get_all()

    def update_category_color(self, name: str, new_color: str) -> Category:
        category = self.category_repo.get_by_name(name)
        if not category:
            raise ValueError(f"Category {name} not found")
        
        category.change_color(CategoryColor(new_color))
        self.category_repo.save(category)
        return category
