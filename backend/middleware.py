# Multi-tenant middleware for FastAPI
from fastapi import Request, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
import os

class MultiTenantMiddleware:
    def __init__(self):
        self.security = HTTPBearer()
    
    async def __call__(self, request: Request, call_next):
        # Extract client_id from various sources
        client_id = None
        
        # 1. From API key in header
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            api_key = auth_header.split(" ")[1]
            client_id = self.get_client_from_api_key(api_key)
        
        # 2. From custom header
        if not client_id:
            client_id = request.headers.get("X-Client-ID")
        
        # 3. From query parameter (for iframe embedding)
        if not client_id:
            client_id = request.query_params.get("client_id")
        
        # 4. From referer header (for domain-based identification)
        if not client_id:
            referer = request.headers.get("referer")
            if referer:
                client_id = self.get_client_from_domain(referer)
        
        if not client_id:
            raise HTTPException(status_code=401, detail="Client identification required")
        
        # Add client_id to request state
        request.state.client_id = client_id
        
        response = await call_next(request)
        return response
    
    def get_client_from_api_key(self, api_key: str) -> str:
        # Query database to find client by API key
        # This would be implemented with your database session
        pass
    
    def get_client_from_domain(self, referer: str) -> str:
        # Map domain to client_id
        # This would be implemented with your database session
        pass




