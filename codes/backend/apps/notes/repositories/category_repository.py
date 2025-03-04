from typing import List, Optional
from apps.notes.domain.interfaces import CategoryRepository
from apps.notes.domain.models import Category
from apps.notes.models.category_model import CategoryModel


class DjangoCategoryRepository(CategoryRepository):
    def save(self, category: Category) -> None:
        category_model = CategoryModel.from_domain(category)
        category_model.save()

    def get_by_name(self, name: str) -> Optional[Category]:
        try:
            category_model = CategoryModel.objects.get(name=name)
            return category_model.to_domain()
        except CategoryModel.DoesNotExist:
            return None

    def get_all(self) -> List[Category]:
        category_models = CategoryModel.objects.all()
        return [category_model.to_domain() for category_model in category_models]

    def delete(self, name: str) -> None:
        CategoryModel.objects.filter(name=name).delete()
