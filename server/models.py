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
# user_likes = db.Table('user_likes',
#                  db.Column('user_id', db.Integer, db.ForeignKey('users.id')),
#                  db.Column('post_id', db.Integer, db.ForeignKey('posts.id'))
# )

# Association Tables
class PostComment(db.Model, UserMixin, SerializerMixin):
    __tablename__ = 'post_comments'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'))
    comment = db.Column(db.String, nullable = True)

class UserLikes(db.Model):
    __tablename__ = 'user_likes'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'))

# My models that can Serialize that Mixin
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
    liked_posts = db.relationship('Post', secondary=UserLikes.__table__, back_populates='liked_by')
    user_comments = db.relationship('Post', secondary=PostComment.__table__, back_populates='comment_by',)
    # rules
    serialize_rules = ('-posts.user', '-post_comments', '-liked_posts', '-user_comments',)
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

    liked_by = db.relationship('User', secondary=UserLikes.__table__, back_populates='liked_posts')
    comment_by = db.relationship('User', secondary=PostComment.__table__, back_populates='user_comments',)
    # rules
    serialize_rules = ( '-post_comments.user', '-post_comments.post','-liked_by', '-comment_by',)

