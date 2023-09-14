from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_login import UserMixin
from sqlalchemy_serializer import SerializerMixin
from datetime import datetime
import base64
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'

db = SQLAlchemy(app)
migrate = Migrate(app, db)


class User(db.Model, UserMixin, SerializerMixin):
    __tablename__= 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.String, nullable=True)
    first_name = db.Column(db.String, nullable = True)
    last_name = db.Column(db.String, nullable = True)

    # relationship
    posts = db.relationship('Post', cascade = 'all, delete', backref = 'user')
    post_likes = db.relationship('PostLike', cascade = 'all, delete', backref = 'user')
    post_comments = db.relationship('PostComment', cascade = 'all ,delete', backref = 'user')
    serialize_rules = ('-posts.user','-post_likes.user','-post_comments.user',)

class Post(db.Model,UserMixin, SerializerMixin):
    __tablename__='posts'
    id = db.Column(db.Integer, primary_key=True)
    photo = db.Column(db.Text, nullable = False)
    name = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.now)
    mimetype=db.Column(db.Text, nullable = False)
    # relationship
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    post_likes = db.relationship('PostLike', cascade = 'all, delete', backref = 'post')
    post_comments = db.relationship('PostComment', cascade = 'all, delete', backref = 'post')
    serialize_rules = ('-post_likes.post', '-post_comments.post',)

class PostLike(db.Model, SerializerMixin):
    __tablename__ = 'post_likes'
    id = db.Column(db.Integer, primary_key=True)
    post_likes = db.Column(db.Integer)
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    serialize_rules = ('-post.post_likes', '-user.post_likes',)

class PostComment(db.Model, SerializerMixin):
    __tablename__ = 'post_comments'
    id = db.Column(db.Integer, primary_key=True)
    comment = db.Column(db.String)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'))
    serialize_rules = ('-user.post_comments', '-post.post_comments',)