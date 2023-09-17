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

# Likes Many to Many Table
user_likes = db.Table('user_likes',
                 db.Column('user_id', db.Integer, db.ForeignKey('users.id')),
                 db.Column('post_id', db.Integer, db.ForeignKey('posts.id'))
)

class User(db.Model, UserMixin, SerializerMixin):
    __tablename__= 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.String, nullable=True)
    first_name = db.Column(db.String, nullable = True)
    last_name = db.Column(db.String, nullable = True)

    # relationship
    posts = db.relationship('Post', cascade = 'all, delete', backref = 'user')
    post_comments = db.relationship('PostComment', cascade = 'all ,delete', backref = 'user')
    liked_posts = db.relationship('Post', secondary=user_likes, back_populates='liked_by')
    # rules
    serialize_rules = ('-posts.user','-post_comments.user','-liked_posts',)

class Post(db.Model,UserMixin, SerializerMixin):
    __tablename__='posts'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.Text, nullable=True)
    photo = db.Column(db.Text, nullable = True)
    name = db.Column(db.Text, nullable = True)
    created_at = db.Column(db.DateTime, default=datetime.now)
    mimetype=db.Column(db.Text, nullable = True)
    likes=db.Column(db.Integer, default=0)
    # relationship
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    post_comments = db.relationship('PostComment', cascade = 'all, delete', backref = 'post')

    liked_by = db.relationship('User', secondary=user_likes, back_populates='liked_posts')
    # rules
    serialize_rules = ('-post_comments.post','-liked_by',)


class PostComment(db.Model, SerializerMixin):
    __tablename__ = 'post_comments'
    id = db.Column(db.Integer, primary_key=True)
    comment = db.Column(db.String)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'))
    serialize_rules = ('-user.post_comments', '-post.post_comments',)

# class Admins(db.Model, SerializerMixin):
#     pass