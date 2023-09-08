from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_login import UserMixin
# from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy_serializer import SerializerMixin

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'

db = SQLAlchemy(app)
migrate = Migrate(app, db)


class User(db.Model, UserMixin, SerializerMixin):
    __tablename__= 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.String, nullable=True)
    user_profile = db.Column(db.String)

class Post(db.Model, UserMixin, SerializerMixin):
    __tablename__='posts'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String)
    body = db.Column(db.String)
    created_at= db.Column(db.String)
    # relationship
    user_id = db.relationship()
class PostLike(db.Model, UserMixin, SerializerMixin):
    id = db.Column(db.Integer, primary_key=True)
    post_id = db.Column(db.integer)


class PostComment(db.Model, UserMixin, SerializerMixin):
    id = db.Column(db.Integer, primary_key=True)
    post_id = db.relationship
    user_id = db.relationship

