from flask import Flask , render_template, request
from flask_socketio import SocketIO, send, emit

app = Flask(__name__)
app.config['SECRET_KEY'] = "Secret_chat"
socketio = SocketIO(app, cors_allowed_origins="*")

chat_history = []
users = {}

@app.route ("/")
def index():
    return render_template ("index.html")

@socketio.on ("connect")
def handle_connect():
    print ("User conectted")
    emit ("chat_history",chat_history)

@socketio.on ("join")
def handle_join (username):
    users [request.sid] = username
    join_msg = f"{username} joined the chat"
    chat_history.append (join_msg)
    send (join_msg, broadcasdt=True)
    print (join_msg)

@socketio.on("message")
def handle_message(msg):
    print("pesan : ", msg)
    chat_history.append (msg)
    send (msg, broadcast=True)

@socketio.on("disconect")
def handle_disconect():
    username = users.pop(request.sid, "Unknown user")
    quit_msg = f"{username} left the chat"
    chat_history.append(quit_msg)
    send (quit_msg, broadcasdt=True)
    print (quit_msg)

if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=5000, debug=True)