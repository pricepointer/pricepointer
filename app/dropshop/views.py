from rest_framework.response import Response
from rest_framework.views import APIView


class TestView(APIView):
    """
    List all snippets, or create a new snippet.
    """

    def get(self, request):
        return Response({'hi': 4})

    def post(self, request):
        return Response({'hi': 5})
