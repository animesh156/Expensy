
# Expense Tracker App

The Expense Tracker App is a full-stack application that helps users manage their finances by tracking income and expenses. It offers features like adding, editing, and deleting transactions, visualizing data with charts, and categorizing transactions for better financial insights.

## Features

- #### Dashboard Overview: Get an overview of your income, expenses, and balance.

- #### Add Transactions: Record your income and expenses effortlessly

- #### Edit/Delete Transactions: Modify or remove entries to keep your records accurate.

- #### Transaction Categories: Organize transactions by categories (e.g., Food, Rent, Salary, etc.).

- #### Secure User Authentication: Users can securely log in and manage their personal finances.


## Run Locally

Clone the project

```bash
  git clone https://github.com/animesh156/Expensy.git


```

Go to the project directory

```bash
 cd expense-tracker  
```

Install dependencies

```bash
  cd client
  npm install
```
```bash
  cd ../server
  npm install
```

Set up environment variables

```bash
 MONGO_URI=<your-mongodb-connection-string>  
JWT_SECRET=<your-jwt-secret>  
```


Start the server

```bash
  client
  npm run dev
```
```bash
  server
  node index.js
```
Open your browser and navigate to:

```bash
http://localhost:3000  
```



## Tech Stack

**Frontend**
- **React.js** : *For building a dynamic and responsive user interface.*

- **Tailwind CSS:** : *For styling the application with utility-first, responsive CSS classes.*

- **Material Tailwind:** : *A library of ready-made UI components and templates built with Tailwind CSS for faster and more consistent UI development.*

- **Axios** : *o make API calls to the backend.*

- **Chart.js** : *For displaying graphical data.*

**Backend**

- **Node.js & Express.js:** : * For handling API requests and business logic.*

- **MongoDB:** : *For storing transaction data securely.*

- **Mongoose:** : *o interact with the MongoDB database.*


  ![Screenshot (122)](https://github.com/user-attachments/assets/8a4b1d24-3536-489d-bb37-677fad843e4f)

  ![Screenshot (125)](https://github.com/user-attachments/assets/b2661aab-390a-4f3e-8d9d-0a964f71a7d7)

  ![Screenshot (124)](https://github.com/user-attachments/assets/981cce62-be3e-4c6f-8d88-f6b184be852c)
  
![Screenshot (123)](https://github.com/user-attachments/assets/24fdd0fe-9c77-45da-9974-f4399f2b5e00)












