"""
Safe Unpickler for BloomEDA
Provides restricted unpickling to prevent arbitrary code execution attacks.
Restricts loaded classes to standard scientific/ML packages and safe builtins.
"""

import io
import pickle
from typing import Any, Set

class SecurityException(Exception):
    """Raised when an unpickle operation attempts to load an unauthorized class or module."""
    pass

# Whitelist of safe modules
ALLOWED_MODULE_PREFIXES: Set[str] = {
    "numpy",
    "pandas",
    "sklearn",
    "scipy",
    "joblib",
    "builtins",
    "_codecs",
    "collections",
    "datetime",
    "decimal",
    "math",
    "copyreg",
}

# Whitelist of safe builtins
ALLOWED_BUILTINS: Set[str] = {
    "int", "float", "str", "bytes", "bool", "complex",
    "dict", "list", "set", "frozenset", "tuple",
    "slice", "range", "bytearray", "NoneType",
    "Ellipsis", "object", "type", "print", "Exception"
}

# Explicitly forbidden dangerous attributes even if in an allowed module
FORBIDDEN_NAMES: Set[str] = {
    "eval", "exec", "compile", "open", "input", "__import__",
    "globals", "locals", "system", "popen", "spawn", "fork",
    "execv", "execl", "kill", "remove", "unlink", "rmdir"
}

class RestrictedUnpickler(pickle.Unpickler):
    def find_class(self, module: str, name: str) -> Any:
        # Check forbidden names
        if name in FORBIDDEN_NAMES:
            raise SecurityException(f"Security Alert: Disallowed function or class '{name}' in module '{module}'")

        # Check if module starts with any allowed prefix
        is_allowed_module = any(
            module == prefix or module.startswith(prefix + ".")
            for prefix in ALLOWED_MODULE_PREFIXES
        )

        if not is_allowed_module:
            raise SecurityException(
                f"Security Alert: Module '{module}' is not in the allowed security whitelist. "
                "Only standard scientific Python, NumPy, Pandas, Scikit-learn, and safe builtins are permitted."
            )

        # If builtins, ensure it's in the safe builtins set
        if module in ("builtins", "__builtin__"):
            if name not in ALLOWED_BUILTINS:
                raise SecurityException(f"Security Alert: Disallowed builtin '{name}'")

        # Safe to resolve
        return super().find_class(module, name)


def safe_load_pickle(data: bytes) -> Any:
    """Safely loads pickle data using RestrictedUnpickler."""
    file_obj = io.BytesIO(data)
    unpickler = RestrictedUnpickler(file_obj)
    return unpickler.load()


def safe_load_pickle_from_file(file_path: str) -> Any:
    """Safely loads pickle data from file path using RestrictedUnpickler."""
    with open(file_path, "rb") as f:
        unpickler = RestrictedUnpickler(f)
        return unpickler.load()
