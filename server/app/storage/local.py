import os
import uuid
from typing import Tuple
from app.storage.provider import StorageProvider

class LocalStorageProvider(StorageProvider):
    def __init__(self, upload_dir: str = "uploads"):
        self.upload_dir = upload_dir
        os.makedirs(self.upload_dir, exist_ok=True)

    def save_file(self, file_bytes: bytes, file_name: str) -> Tuple[str, str]:
        unique_name = f"{uuid.uuid4().hex[:12]}_{file_name}"
        full_path = os.path.join(self.upload_dir, unique_name)
        with open(full_path, "wb") as f:
            f.write(file_bytes)
        return unique_name, full_path

    def get_file(self, file_path: str) -> bytes:
        if not os.path.exists(file_path):
            raise FileNotFoundError("Requested file not found in storage.")
        with open(file_path, "rb") as f:
            return f.read()
