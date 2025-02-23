from django.db import models
from rest_framework import serializers
from apps.notes.models.category_model import CategoryModel

# Serializers
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoryModel
        fields = '__all__'