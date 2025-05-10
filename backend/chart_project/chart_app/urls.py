from django.urls import path
from .views import manual_data_view

urlpatterns = [
    path('manual-data/', manual_data_view, name='manual-data'),
    # path('upload-file/', FileUploadView.as_view(), name='upload-file'),
]
