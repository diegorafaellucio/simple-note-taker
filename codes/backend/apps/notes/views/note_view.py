from rest_framework.generics import GenericAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response
from rest_framework import status

from apps.notes.models.note_model import NoteModel as Model
from apps.notes.serializers.note_serializer import NoteSerializer as ModelSerializer

class NoteView(GenericAPIView):
    """API View for managing notes, with category filtering available only for GET requests."""

    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication, SessionAuthentication, BasicAuthentication]
    serializer_class = ModelSerializer

    def get_queryset(self):
        """Returns notes belonging to the authenticated user, with optional category filtering."""
        queryset = Model.objects.filter(user=self.request.user).order_by('-last_edited')

        # Apply category filtering only for GET requests
        if self.request.method == "GET":
            category_id = self.request.query_params.get('category', None)
            if category_id:
                try:
                    queryset = queryset.filter(category_id=int(category_id))
                except ValueError:
                    return queryset  # Ignore invalid category values

        return queryset

    def get_object(self, pk, user):
        """Retrieves a single note object belonging to the user."""
        try:
            return Model.objects.get(pk=pk, user=user)
        except Model.DoesNotExist:
            return None

    def get(self, request, pk=None):
        """Retrieves all notes for the user or a single note if `pk` is provided, with optional category filtering."""
        if pk:
            note = self.get_object(pk, request.user)  # ✅ Pass both pk and request.user
            if not note:
                return Response({"error": "Note not found"}, status=status.HTTP_404_NOT_FOUND)
            serializer = self.serializer_class(note)
            return Response(serializer.data)

        notes = self.get_queryset()  # Fetch all notes, optionally filtered by category
        serializer = self.serializer_class(notes, many=True)
        return Response(serializer.data)

    def post(self, request):
        """Creates a new note for the user."""
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        """Updates an existing note."""
        note = self.get_object(pk, request.user)  # ✅ Fix method signature
        if not note:
            return Response({"error": "Note not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.serializer_class(note, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        """Deletes a note."""
        note = self.get_object(pk, request.user)  # ✅ Fix method signature
        if not note:
            return Response({"error": "Note not found"}, status=status.HTTP_404_NOT_FOUND)
        note.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
