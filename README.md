# CodeCollab

CodeCollab is a real-time collaborative code editor that allows multiple users to write and edit code simultaneously.

## Features
- Real-time code collaboration with WebSockets
- Room-based code sharing using unique IDs
- Syntax highlighting and live synchronization
- User-friendly interface
- Instant notifications when users join or leave a room

## Tech Stack
### **Frontend:**
- React.js
- React Router
- Socket.io-client
- UUID for room ID generation
- React Hot Toast for notifications

### **Backend:**
- Node.js
- Express.js
- Socket.io (WebSockets for real-time communication)

##  Installation & Setup

### 1. Clone the Repository
```sh
git clone https://github.com/SriSailesh3320/CodeCollab.git
cd CodeCollab
```

### 2️. Install Dependencies

```sh
cd client
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the `client` directory and add:
```sh
REACT_APP_BACKEND_URL=http://localhost:5000
```

### 4️. Start the Application
```sh
cd client
npm start
```

## Contribution
Feel free to contribute by submitting issues or pull requests.

---
Happy Coding! 
