from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.security import verify_password, get_password_hash, create_access_token
from app.core.dependencies import get_current_user
from app.models import User, CareerProfile
from app.schemas.schemas import UserCreate, UserLogin, Token, UserResponse
import uuid

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=Token)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_in.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user_id = f"user-{uuid.uuid4().hex[:8]}"
    hashed_pwd = get_password_hash(user_in.password)
    
    new_user = User(
        id=user_id,
        name=user_in.name,
        email=user_in.email,
        hashed_password=hashed_pwd,
        target_role="Frontend Developer"
    )
    db.add(new_user)
    
    profile_id = f"prof-{uuid.uuid4().hex[:8]}"
    profile = CareerProfile(id=profile_id, user_id=user_id)
    db.add(profile)
    
    db.commit()

    token = create_access_token(user_id)
    return {
        "access_token": token,
        "token_type": "bearer",
        "user_id": user_id,
        "name": new_user.name,
        "email": new_user.email
    }

@router.post("/login", response_model=Token)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == credentials.email).first()
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token(user.id)
    return {
        "access_token": token,
        "token_type": "bearer",
        "user_id": user.id,
        "name": user.name,
        "email": user.email
    }

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.post("/logout")
def logout():
    return {"message": "Logged out successfully"}
