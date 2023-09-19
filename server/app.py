from models import db, User, Post , PostComment, UserLikes
from flask_restful import Api, Resource
from flask import Flask, make_response, request
from flask_migrate import Migrate
import bcrypt
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from flask_cors import CORS as FlaskCors
import os
from werkzeug.utils import secure_filename

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DATABASE = os.environ.get(
    "DB_URI", f"sqlite:///{os.path.join(BASE_DIR, 'app.db')}")

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = '3917f2296d0e5b3f1e11340a'
app.config['REMEMBER_COOKIE_DOMAIN']= "http://localhost:3000"
app.config["SESSION_COOKIE_SECURE"] = True
app.config["SESSION_COOKIE_SAMESITE"] = "None"
migrate = Migrate(app, db)
db.init_app(app)
api=Api(app)
# CORS ALLOWS COMMUNICATION BETWEEN 2 DOMAINS
cors = FlaskCors(app, origins=["http://localhost:3000"], supports_credentials=True)

# LOGIN STUFF
login_manager = LoginManager()
login_manager.init_app(app)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))
class CurrentUser(Resource):
    @login_required
    def get(self):
        user = current_user
        if user:
            return make_response(user.to_dict(rules=('-posts.photo',)), 200)
        else:
            return make_response({"message": "User not found"}, 404)
api.add_resource(CurrentUser,'/currentUser')
class Login(Resource):
    def post(self):
        data = request.get_json()
        user = User.query.filter(User.username == data['username']).first()
        if not user:
           return make_response({"error":"Not Found"}, 404)           
        password = data['password']
        if bcrypt.checkpw(password.encode('utf-8'), user.password):
            login_user(user, remember=True)
            return "You Are Logged In!", 200
api.add_resource(Login, '/Login')

class Logout(Resource):
   @login_required
   def post(self):
      logout_user()
      return make_response("You Are Logged Out!")
api.add_resource(Logout, '/Logout')

class SignUp(Resource):
   def post(self):
    data = request.get_json()
    username = data['username']
    password = data['password']
    hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    existing_user = User.query.filter_by(username=username).first()
    if existing_user:
        return make_response("Username has already been used"), 400
    try:
        user = User(username=username, password = hashed)
        db.session.add(user)
        db.session.commit()
        return make_response("User has been created", 200)
    except:
        return make_response("Failed to Create User"), 404
api.add_resource(SignUp, '/signup')

# USER SETTINGS CHANGE SUCH AS USERNAME FIRST NAME OR LAST NAME
class ChangeUsername(Resource):
    def patch(self):
        try:
            user = current_user
            data=request.get_json()
            new_username = data['username']
            setattr(user, 'username', new_username)
            db.session.commit()
            return make_response("Username Has Been Changed", 200)
        except:
            return make_response("Username Failed To Change", 400)
api.add_resource(ChangeUsername, '/ChangeUsername')
class ChangeFirstName(Resource):
    def patch(self):
        try:
            user = current_user
            data = request.get_json()
            new_first_name = data['first_name']
            setattr(user, 'first_name', new_first_name)
            db.session.commit()
            return make_response("First_name Has Been Changed", 200)
        except:
            return make_response("First_name Failed To Change", 400)
api.add_resource(ChangeFirstName, '/ChangeFirstName')
class ChangeLastName(Resource):
    def patch(self):
        try:
            user = current_user
            data = request.get_json()
            new_last_name = data['last_name']
            setattr(user, 'last_name', new_last_name)
            db.session.commit()
            return make_response("Last_Name Has Been Changed", 200)
        except:
            return make_response("Last_Name Failed To Change", 400)
api.add_resource(ChangeLastName, '/ChangeLastName')
class ChangePassword(Resource):
    def patch(self):
        try:
            user = current_user
            data = request.get_json()
            password = data['password']
            hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
            setattr(user, 'password', hashed)
            db.session.commit()
            return make_response("Password Has Been Changed", 200)
        except:
            return make_response("Password Failed To Change", 400)
api.add_resource(ChangePassword, '/ChangePassword')

# Upload Image :)
class UploadImage(Resource):
    @login_required
    def post(self):
        try:
            # When request.files the key is the ["photo"]
            photo = request.files['photo']

            if not photo:
                return make_response('No pic uploaded', 400)
            title = request.form.get('title')
            filename = secure_filename(photo.name)
            mimetype = photo.mimetype
            post = Post(title=title,photo=photo.read(), mimetype=mimetype, name=filename, user_id=current_user.id)
            db.session.add(post)
            db.session.commit()
            return 'Image was uploaded', 200
        except Exception as e:
            return make_response(f'Image upload failed: {str(e)}', 400)
api.add_resource(UploadImage, '/UploadImage')
import base64
# base64 is a group of binary to text encoding shcemes. decode it into a ('utf-8')
class UserProfileImages(Resource):
    @login_required
    def get(self):
        posts = []
        for post in current_user.posts:
            post.photo = base64.b64encode(post.photo).decode('utf-8')   
        posts.append(current_user.to_dict())
        return posts
api.add_resource(UserProfileImages, '/UserProfile')
# USER PROFILE IMAGE PATCH
class ImagePatch(Resource):
    @login_required
    def patch(self, post_id):
        post = Post.query.get(post_id)
        data = request.get_json()
        new_title = data['title']
        try:
            setattr(post, 'title', new_title)
            db.session.commit()
            return make_response("PATCH SUCCESFULL", 200)
        except:
            return make_response("FAILED TO PATCH"), 400
api.add_resource(ImagePatch, '/ImagePatch/<int:post_id>')
# USER DASHBOARD IMPORTANT
class UserDashboard(Resource):
    @login_required
    def get(self):
        all_users = User.query.all()
        users = []
        for user in all_users:
            for post in user.posts:
                post.photo = base64.b64encode(post.photo).decode('utf-8')   
            users.append(user.to_dict())
        return users
api.add_resource(UserDashboard, '/UserDashboard')
# DELETE POST
class DeletePost(Resource):
    def delete(self, post_id):
        post = Post.query.get(post_id)
        if current_user.id == post.user_id:
            db.session.delete(post)
            db.session.commit()
            return make_response("Delete Succesful")
        else:
            return make_response("You don't own this post")
api.add_resource(DeletePost, '/DeletePost/<int:post_id>')
# LIKES
class Like(Resource):
    @login_required
    def patch(self, post_id):
        data = request.get_json()
        postlike = data['likes']
        post = Post.query.get(post_id)
        if post:
            if current_user in post.liked_by:
                post.likes += postlike
                db.session.commit()
                return make_response("Like has been added")
            if current_user not in post.liked_by:
                post.liked_by.append(current_user)
                post.likes += postlike
                db.session.commit()
                return make_response("Liked Post", 200)
            else:
                return make_response("User has already liked this post")
        if not post:
            return make_response("Post does not exists", 404)
        # UNLIKE A CERTAIN POST ADDITIONAL
    def delete(self, post_id):
        data = request.get_json()
        postlike = data['likes']
        post = Post.query.get(post_id)
        if post:
            if current_user in post.liked_by:
                post.liked_by.remove(current_user)
                post.likes -= postlike
                db.session.commit()
                return make_response("Unliked Post", 200)
            else:
                return make_response("User has never liked this post")
        if not post:
            return make_response("Post does not exists", 404)
api.add_resource(Like, '/Like/<int:post_id>')

class Comment(Resource):
    @login_required
    def post(self, post_id):
        post = Post.query.get(post_id)
        data = request.get_json()
        comment = data['comment']
        if post:
            # post.comment_by.append(current_user)
            post_comment = PostComment(comment=comment, user_id=current_user.id, post_id=post_id)
            db.session.add(post_comment)
            db.session.commit()
            return "Comment has been posted"
        else:
            return "Comment has failed to post for this post"
api.add_resource(Comment, '/Comment/<int:post_id>')

if __name__ == "__main__":
    app.run(port=5555, debug = True )