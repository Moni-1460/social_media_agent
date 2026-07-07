"""
In-memory 'repositories'. Same idea as the original Java edition:
plain dict-backed stores with save/find methods, so swapping in a real
database later only means changing this file.
"""
import threading
import uuid
from datetime import datetime, timezone
from typing import Optional


def new_id() -> str:
    return str(uuid.uuid4())


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


class UserStore:
    def __init__(self):
        self._lock = threading.Lock()
        self._by_id: dict[str, dict] = {}
        self._by_email: dict[str, str] = {}  # email -> id

    def save(self, user: dict) -> dict:
        with self._lock:
            if not user.get("id"):
                user["id"] = new_id()
            self._by_id[user["id"]] = user
            self._by_email[user["email"].lower()] = user["id"]
            return user

    def find_by_email(self, email: str) -> Optional[dict]:
        user_id = self._by_email.get(email.lower())
        return self._by_id.get(user_id) if user_id else None

    def find_by_id(self, user_id: str) -> Optional[dict]:
        return self._by_id.get(user_id)

    def exists_by_email(self, email: str) -> bool:
        return email.lower() in self._by_email


class PostStore:
    def __init__(self):
        self._lock = threading.Lock()
        self._data: dict[str, dict] = {}

    def save(self, post: dict) -> dict:
        with self._lock:
            if not post.get("id"):
                post["id"] = new_id()
            self._data[post["id"]] = post
            return post

    def find_by_id(self, post_id: str) -> Optional[dict]:
        return self._data.get(post_id)

    def find_by_user_id_ordered(self, user_id: str) -> list[dict]:
        items = [p for p in self._data.values() if p["userId"] == user_id]
        return sorted(items, key=lambda p: p["createdAt"], reverse=True)

    def find_favorites_by_user_id(self, user_id: str) -> list[dict]:
        items = [
            p for p in self._data.values()
            if p["userId"] == user_id and p.get("favorite")
        ]
        return sorted(items, key=lambda p: p["createdAt"], reverse=True)

    def delete_by_id(self, post_id: str) -> None:
        with self._lock:
            self._data.pop(post_id, None)


class PromptHistoryStore:
    def __init__(self):
        self._lock = threading.Lock()
        self._data: dict[str, dict] = {}

    def save(self, entry: dict) -> dict:
        with self._lock:
            if not entry.get("id"):
                entry["id"] = new_id()
            self._data[entry["id"]] = entry
            return entry


# Singleton instances shared across the app (mirrors the Java @Service beans)
user_store = UserStore()
post_store = PostStore()
prompt_history_store = PromptHistoryStore()
