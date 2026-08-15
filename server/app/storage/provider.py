from abc import ABC, abstractmethod
from typing import Tuple

class StorageProvider(ABC):
    @abstractmethod
    def save_file(self, file_bytes: bytes, file_name: str) -> Tuple[str, str]:
        """Saves file content and returns (stored_relative_path, full_file_path)"""
        pass

    @abstractmethod
    def get_file(self, file_path: str) -> bytes:
        """Retrieves raw file bytes from storage"""
        pass
