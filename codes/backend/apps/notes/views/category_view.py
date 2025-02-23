from rest_framework.generics import GenericAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response
from rest_framework import status

from apps.notes.models.category_model import CategoryModel as Model
from apps.notes.serializers.category_serializer import CategorySerializer as ModelSerializer

class CategoryView(GenericAPIView):
    """API View for managing categories"""

    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication, SessionAuthentication, BasicAuthentication]
    serializer_class = ModelSerializer

    def get_queryset(self):
        """Returns all categories (categories are shared among users)."""
        return Model.objects.all()

    def get_object(self, pk):
        """Retrieves a single category."""
        try:
            return Model.objects.get(pk=pk)
        except Model.DoesNotExist:
            return None

    def get(self, request, pk=None):
        """Retrieves all categories or a specific category if `pk` is provided."""
        if pk:
            category = self.get_object(pk)
            if not category:
                return Response({"error": "Category not found"}, status=status.HTTP_404_NOT_FOUND)
            serializer = self.serializer_class(category)
            return Response(serializer.data)

        categories = self.get_queryset()
        serializer = self.serializer_class(categories, many=True)
        return Response(serializer.data)

    def post(self, request):
        """Creates a new category."""
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        """Updates an existing category."""
        category = self.get_object(pk)
        if not category:
            return Response({"error": "Category not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.serializer_class(category, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        """Deletes a category."""
        category = self.get_object(pk)
        if not category:
            return Response({"error": "Category not found"}, status=status.HTTP_404_NOT_FOUND)
        category.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
