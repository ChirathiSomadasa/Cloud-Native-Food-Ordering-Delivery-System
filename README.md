<!DOCTYPE html>
<html lang="en">
<body>
  <h1>FoodSprint - Cloud-Native Food Ordering & Delivery System using Microservices</h1>

  <h2>Project Description</h2>
  <p>FoodSprint is a cloud-native food ordering and delivery platform built using microservices architecture. It enables customers to browse restaurants, order food, make secure payments, and track deliveries in real-time.</p>

  <h2>System Components</h2>
  <ul>
    <li><strong>User Authentication Service:</strong> Handles authentication and authorization for four user roles: Customer, Restaurant Owner, Delivery Personnel, and System Admin. Ensures security using JWT, password hashing, and RBAC.</li>
    <li><strong>Restaurant Management Service:</strong> Restaurant owners can register restaurants (pending admin approval) and manage menu items (add, edit, view, delete) after verification.</li>
    <li><strong>Order Management Service:</strong> Manages order placement, cart operations, real-time tracking, order status updates (Accepted, Preparing, Ready, Delivered), cancellations, refunds, and sends email confirmations.</li>
    <li><strong>Payment Management Service:</strong> Handles payments using PayPal integration. Displays total order cost, processes card payments securely, and sends receipts via email.</li>
    <li><strong>Delivery Management Service:</strong> Manages driver assignment after order placement, order pickup notifications, real-time delivery status updates, and tracking for customers.</li>
  </ul>

  <h2>Technologies Used</h2>
  <h3>Frontend</h3>
  <ul>
    <li>React.js – JavaScript library for building user interfaces.</li>
    <li>React Router – For navigation between pages.</li>
    <li>Axios – For making HTTP requests to the backend.</li>
    <li>Material-UI – For responsive and modern UI components.</li>
  </ul>

  <h3>Backend</h3>
  <ul>
    <li><strong>Node.js</strong>: JavaScript runtime for server-side development.</li>
    <li><strong>Express</strong>: Web framework for Node.js.</li>
    <li>MongoDB – NoSQL database (MongoDB Atlas - Cloud)</li>
    <li><strong>Cors</strong>: Middleware for handling cross-origin requests.</li>
    <li><strong>Dotenv</strong>: For managing environment variables.</li>
    <li><strong>Body-parser</strong>: Middleware for parsing incoming request bodies in Node.js and Express applications.</li>
    <li><strong>Nodemon</strong>: Automatically restarts the server during development.</li>
    <li><strong>Jsonwebtoken (JWT)</strong>: For creating and verifying JSON Web Tokens, typically used for authentication and authorization.</li>
    <li><strong>Bcrypt</strong>: For hashing and salting passwords securely.</li>
    <li><strong>Cookie-parser</strong>: Middleware for parsing HTTP cookies.</li>
    <li>Nodemailer – For push email notifications.</li>
    <li>Socket.IO – Real-time, bidirectional communication for real-time delivery updates.</li>
  </ul>

  <h2>Project Setup</h2>
  <ol>
    <li>Clone Repository</li>
    <li><strong>Frontend Setup (React.js):</strong>
      <ol>
        <li>Create the React app - <code>npx create-react-app frontend</code></li>
        <li>Navigate to the frontend directory - <code>cd frontend</code></li>
        <li>Install required dependencies - <code>npm install</code></li>
        <li>Start the development server - <code>npm start</code></li>
      </ol>
    </li>
    <li><strong>Backend Setup (Node.js + MongoDB):</strong>
      <ol>
        <li>Create a separate folder (e.g., user_authentication_service)</li>
        <li>Navigate into the service folder - <code>cd user_authentication_service</code></li>
        <li>Initialize Node.js project - <code>npm init -y</code></li>
        <li>Install dependencies (example) - <code>npm install express mongoose cors dotenv jsonwebtoken bcrypt body-parser nodemon</code></li>
        <li>Create .env file for each service to store environment variables</li>
        <li>Start the server - <code>nodemon server</code></li>
      </ol>
    </li>
    <li><strong>Database Setup:</strong>
      <ol>
        <li>Use MongoDB Atlas (Cloud).</li>
        <li>Create a database for each service if needed.</li>
        <li>Update connection strings inside .env files.</li>
      </ol>
    </li>
    <li><strong>Microservices Deployment (Docker and Kubernetes):</strong>
      <h4>Docker</h4>
      <ul>
        <li>Each service must have its own Dockerfile.</li>
        <li>To Build and Start Services - <code>docker-compose up --build</code></li>
        <li>To Verify Running Containers - <code>docker ps</code></li>
      </ul>
      <h4>Kubernetes (Minikube)</h4>
      <ul>
        <li>Build Docker Images inside Minikube - <code>eval $(minikube docker-env)</code></li>
        <li>Rebuild your service images inside Minikube - Example: <code>docker build -t cloud-native-food-ordering-delivery-system-user-authentication ./user-authentication</code></li>
        <li>Apply Kubernetes YAML Files - Deploy our services:
          <ul>
            <li>For user-authentication:
              <ul>
                <li><code>kubectl apply -f user-authentication-deployment.yaml</code></li>
                <li><code>kubectl apply -f user-authentication-service.yaml</code></li>
                <li><code>kubectl apply -f user-authentication-hpa.yaml</code></li>
              </ul>
            </li>
          </ul>
        </li>
        <li>Check the Deployments and Pods:
          <ul>
            <li><code>kubectl get deployments</code></li>
            <li><code>kubectl get pods</code></li>
          </ul>
        </li>
        <li>Access Services - Example: <code>minikube service user-authentication</code></li>
        <li>Run the System - Access the frontend using the IP address and port assigned by Kubernetes (e.g., via NodePort).</li>
      </ul>
    </li>
  </ol>
</body>
</html>
