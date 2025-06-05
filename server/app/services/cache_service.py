"""
Cache service for storing analysis results
"""
from typing import Dict, Any, Optional
import json
import os
import time
from pathlib import Path
import hashlib

# Cache directory
CACHE_DIR = Path(__file__).parent.parent.parent / "cache"

# Ensure cache directory exists
os.makedirs(CACHE_DIR, exist_ok=True)

class CacheService:
    """
    Service for caching analysis results
    """
    
    def __init__(self, cache_expiry: int = 3600):
        """
        Initialize cache service
        
        Args:
            cache_expiry: Cache expiry time in seconds (default: 1 hour)
        """
        self.cache_expiry = cache_expiry
    
    def get_cache_key(self, data: str) -> str:
        """
        Generate cache key from data
        
        Args:
            data: Data to generate key from
            
        Returns:
            str: Cache key
        """
        # Generate MD5 hash of data
        return hashlib.md5(data.encode()).hexdigest()
    
    def get_cache_path(self, cache_key: str) -> Path:
        """
        Get cache file path
        
        Args:
            cache_key: Cache key
            
        Returns:
            Path: Cache file path
        """
        return CACHE_DIR / f"{cache_key}.json"
    
    def get_cached_result(self, cache_key: str) -> Optional[Dict[str, Any]]:
        """
        Get cached result
        
        Args:
            cache_key: Cache key
            
        Returns:
            Optional[Dict[str, Any]]: Cached result or None if not found or expired
        """
        # Get cache file path
        cache_path = self.get_cache_path(cache_key)
        
        # Check if cache file exists
        if not cache_path.exists():
            return None
        
        # Check if cache is expired
        if time.time() - cache_path.stat().st_mtime > self.cache_expiry:
            # Remove expired cache
            os.remove(cache_path)
            return None
        
        # Load cache
        try:
            with open(cache_path, 'r') as f:
                return json.load(f)
        except Exception:
            # Remove invalid cache
            if cache_path.exists():
                os.remove(cache_path)
            return None
    
    def cache_result(self, cache_key: str, result: Dict[str, Any]) -> None:
        """
        Cache result
        
        Args:
            cache_key: Cache key
            result: Result to cache
        """
        # Get cache file path
        cache_path = self.get_cache_path(cache_key)
        
        # Save cache
        with open(cache_path, 'w') as f:
            json.dump(result, f)
    
    def clear_cache(self) -> None:
        """
        Clear all cache
        """
        # Remove all cache files
        for cache_file in CACHE_DIR.glob("*.json"):
            os.remove(cache_file)
