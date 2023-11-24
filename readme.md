
# Project Title

A brief description of what this project does and who it's for


## API Reference

#### Create a new user api

```http
  POST /api/users
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `api_key` | `types` | **Required**. Your API key |

#### Get all users api

```http
  GET /api/users
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `api_key`      | `types` | **Required**. Id of item to fetch |


#### Update specific user by userId api

```http
  PUT /api/users/${userId}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `userId`      | `number` | **Required**. userId of user to update specific user|





#### Delete specific user by userId api

```http
  DELETE /api/users/${userId}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `userId`      | `number` | **Required**. userId of user to delete specific user|



#### Add order to specific user by userId api

```http
  PUT /api/users/${userId}/orders
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `userId`      | `number` | **Required**. userId of user to add order for specific user|


#### Get specific user's all orders by userId api

```http
  GET /api/users/${userId}/orders
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `userId`      | `number` | **Required**. userId of user to fetch specific user|


#### Get specific user's orders total price by userId

```http
  GET /api/users/${userId}/orders/total-price
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `userId`      | `number` | **Required**. userId of user to calculate specific user's orders total price|

## Features

- Create user
- Stored User's hashed password into database
- Get all user
- Get a specific user by userId
- Update a specific user by userId
- Delete a specific user by userId
- Add order for specific user's  by userId
- Get a specific user by userId
- Get total price for specific user's orders by userId
- Data validation with zod
## 🛠 Skills

- Express
- MongoDB
- Mongoose
- Cors
- Bcryptjs
- Zod
- Dotenv
- Typescript
## Run Locally

Clone the project

```bash
  git clone https://github.com/githubrana2023/L2-assignment-02.git
```

Go to the project directory

```bash
  cd L2-assignment-02
```

Install dependencies

```bash
  npm install or yarn --init
```

Make an .env file

```bash
  .env
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

```
PORT
```
```
MONGODB_URL
```

Start the server

```bash
  npm run dev
```

