# API Documentation

This document outlines the API endpoints for the quiz application, including authentication, user management, topics, quizzes, and results.

## Authentication

---

### 1. Register User

* **Endpoint:** `POST /register`
* **Description:** Creates a new user account.
* **Permissions:** Public
* **Request Body (JSON):**
    ```json
    {
      "username": "new_user",
      "email": "user@example.com",
      "password": "your_strong_password"
    }
    ```
* **Success Response (201 CREATED):**
    ```json
    {
      "message": "Sikeres regisztráció! Felhasználó létrehozva: new_user"
    }
    ```
* **Error Responses:**
    * **400 BAD REQUEST:** Missing data (`email`, `username`, or `password`).
    * **409 CONFLICT:** Email or username already exists.

---

### 2. Login User

* **Endpoint:** `POST /login`
* **Description:** Authenticates a user and returns access/refresh tokens.
* **Permissions:** Public
* **Request Body (JSON):**
    ```json
    {
      "email": "user@example.com",
      "password": "your_password"
    }
    ```
* **Success Response (200 OK):**
    ```json
    {
      "access_token": "...",
      "refresh_token": "...",
      "user": {
        "id": 1,
        "username": "test_user",
        "email": "user@example.com",
        "is_admin": false
      }
    }
    ```
* **Error Responses:**
    * **400 BAD REQUEST:** Missing `email` or `password`.
    * **401 UNAUTHORIZED:** Invalid credentials.

---

### 3. Refresh Access Token

* **Endpoint:** `POST /refresh`
* **Description:** Issues a new access token using a valid refresh token.
* **Permissions:** Logged-in User (Requires `Authorization: Bearer <refresh_token>` header)
* **Request Body:** None
* **Success Response (200 OK):**
    ```json
    {
      "access_token": "..."
    }
    ```
* **Error Responses:**
    * **401 UNAUTHORIZED:** Invalid or expired refresh token.

## Profile (`/`)

---

### 1. Get My Profile

* **Endpoint:** `GET /`
* **Description:** Gets the currently authenticated user's profile information.
* **Permissions:** Logged-in User
* **Request Body:** None
* **Success Response (200 OK):**
    ```json
    {
      "id": 1,
      "username": "current_user",
      "email": "user@example.com",
      "is_admin": false
    }
    ```
* **Error Responses:**
    * **404 NOT FOUND:** User not found.

---

### 2. Delete My Profile

* **Endpoint:** `DELETE /`
* **Description:** Deletes the currently authenticated user's account and all their associated data (Results, Quizzes).
* **Permissions:** Logged-in User
* **Request Body:** None
* **Success Response (200 OK):**
    ```json
    {
      "message": "A fiókod sikeresen törölve."
    }
    ```
* **Error Responses:**
    * **404 NOT FOUND:** User not found.
    * **500 INTERNAL SERVER ERROR:** Failed to delete account.

## Admin User Management (`/users`)

*Note: These routes are defined in `admin_bp`.*

---

### 1. Get All Users

* **Endpoint:** `GET /users`
* **Description:** (Admin) Retrieves a list of all users.
* **Permissions:** Admin Only
* **Request Body:** None
* **Success Response (200 OK):**
    ```json
    [
      {
        "id": 1,
        "username": "test_user",
        "email": "user@example.com",
        "is_admin": false
      },
      {
        "id": 2,
        "username": "admin_user",
        "email": "admin@example.com",
        "is_admin": true
      }
    ]
    ```

---

### 2. Get User by ID

* **Endpoint:** `GET /users/<int:user_id>`
* **Description:** (Admin) Retrieves details for a specific user.
* **Permissions:** Admin Only
* **URL Parameters:**
    * `user_id` (int): The ID of the user to retrieve.
* **Request Body:** None
* **Success Response (200 OK):**
    ```json
    {
      "id": 1,
      "username": "test_user",
      "email": "user@example.com",
      "is_admin": false
    }
    ```
* **Error Responses:**
    * **404 NOT FOUND:** User not found.

---

### 3. Update User

* **Endpoint:** `PUT /users/<int:user_id>`
* **Description:** (Admin) Updates a user's information.
* **Permissions:** Admin Only
* **URL Parameters:**
    * `user_id` (int): The ID of the user to update.
* **Request Body (JSON):** (All fields are optional)
    ```json
    {
      "username": "new_username",
      "email": "new_email@example.com",
      "password": "new_password",
      "is_admin": true
    }
    ```
* **Success Response (200 OK):**
    ```json
    {
      "message": "Felhasználó frissítve"
    }
    ```
* **Error Responses:**
    * **404 NOT FOUND:** User not found.
    * **409 CONFLICT:** New username or email is already taken.

---

### 4. Delete User

* **Endpoint:** `DELETE /users/<int:user_id>`
* **Description:** (Admin) Deletes a user.
* **Permissions:** Admin Only
* **URL Parameters:**
    * `user_id` (int): The ID of the user to delete.
* **Request Body:** None
* **Success Response (200 OK):**
    ```json
    {
      "message": "Felhasználó törölve"
    }
    ```
* **Error Responses:**
    * **404 NOT FOUND:** User not found.
    * **403 FORBIDDEN:** Admin attempts to delete themselves.

## Topics (`/topics`)

---

### 1. Create Topic

* **Endpoint:** `POST /topics/`
* **Description:** (Admin) Creates a new quiz topic.
* **Permissions:** Admin Only
* **Request Body (JSON):**
    ```json
    {
      "name": "History"
    }
    ```
* **Success Response (201 CREATED):**
    ```json
    {
      "id": 1,
      "name": "History"
    }
    ```
* **Error Responses:**
    * **400 BAD REQUEST:** Missing `name`.
    * **409 CONFLICT:** Topic name already exists.

---

### 2. Get All Topics

* **Endpoint:** `GET /topics/`
* **Description:** Retrieves a list of all available topics.
* **Permissions:** Public
* **Request Body:** None
* **Success Response (200 OK):**
    ```json
    [
      {
        "id": 1,
        "name": "History"
      },
      {
        "id": 2,
        "name": "Science"
      }
    ]
    ```

---

### 3. Get Single Topic

* **Endpoint:** `GET /topics/<int:topic_id>`
* **Description:** Retrieves a single topic by its ID.
* **Permissions:** Public
* **URL Parameters:**
    * `topic_id` (int): The ID of the topic.
* **Request Body:** None
* **Success Response (200 OK):**
    ```json
    {
      "id": 1,
      "name": "History"
    }
    ```
* **Error Responses:**
    * **404 NOT FOUND:** Topic not found.

---

### 4. Update Topic

* **Endpoint:** `PUT /topics/<int:topic_id>`
* **Description:** (Admin) Updates a topic's name.
* **Permissions:** Admin Only
* **URL Parameters:**
    * `topic_id` (int): The ID of the topic to update.
* **Request Body (JSON):**
    ```json
    {
      "name": "World History"
    }
    ```
* **Success Response (200 OK):**
    ```json
    {
      "id": 1,
      "name": "World History"
    }
    ```
* **Error Responses:**
    * **400 BAD REQUEST:** Missing `name`.
    * **404 NOT FOUND:** Topic not found.
    * **409 CONFLICT:** New topic name is already in use by another topic.

---

### 5. Delete Topic

* **Endpoint:** `DELETE /topics/<int:topic_id>`
* **Description:** (Admin) Deletes a topic.
* **Permissions:** Admin Only
* **URL Parameters:**
    * `topic_id` (int): The ID of the topic to delete.
* **Request Body:** None
* **Success Response (200 OK):**
    ```json
    {
      "message": "Topic deleted successfully"
    }
    ```
* **Error Responses:**
    * **404 NOT FOUND:** Topic not found.
    * **409 CONFLICT:** Cannot delete topic because it is in use by quizzes.

## Quizzes (`/quiz`)

---

### 1. Create Quiz

* **Endpoint:** `POST /quiz/`
* **Description:** Creates a new quiz, either by manually providing questions or by requesting AI generation.
* **Permissions:** Logged-in User
* **Request Body (JSON) - Manual:**
    ```json
    {
      "topic_id": 1,
      "custom_topic": null,
      "difficulty": "Medium",
      "questions": [
        {
          "question_text": "Who was the first president?",
          "options": ["Washington", "Adams", "Jefferson"],
          "correct_option_index": 0
        },
        {
          "question_text": "When was the Declaration of Independence signed?",
          "options": ["1776", "1812", "1492"],
          "correct_option_index": 0
        }
      ]
    }
    ```
* **Request Body (JSON) - AI Generated:**
    ```json
    {
      "topic_id": 1,
      "custom_topic": "Early American History",
      "difficulty": "Hard",
      "ai_generate": true,
      "num_questions": 10
    }
    ```
* **Notes on Request:**
    * Must provide either `topic_id` or `custom_topic`.
    * If `ai_generate` is `false` or missing, the `questions` array is required.
    * If `ai_generate` is `true`, `num_questions` is used (default 5, max 15).
* **Success Response (201 CREATED):**
    ```json
    {
      "message": "Quiz created successfully",
      "quiz_id": 1,
      "questions_count": 10
    }
    ```
* **Error Responses:**
    * **400 BAD REQUEST:** Missing required fields, invalid question data, or invalid `num_questions`.
    * **404 NOT FOUND:** `topic_id` does not exist.
    * **500 INTERNAL SERVER ERROR:** AI generation failed or returned invalid data.

---

### 2. Get All Quizzes

* **Endpoint:** `GET /quiz/`
* **Description:** Retrieves a list of all quizzes (metadata only, no questions).
* **Permissions:** Public
* **Request Body:** None
* **Success Response (200 OK):**
    ```json
    [
      {
        "id": 1,
        "topic_name": "History",
        "difficulty": "Medium",
        "created_by_user_id": 1,
        "created_at": "2025-11-16T18:00:00"
      }
    ]
    ```

---

### 3. Get Quiz Details

* **Endpoint:** `GET /quiz/<int:quiz_id>`
* **Description:** Retrieves full details for a single quiz, including its questions (without answers).
* **Permissions:** Public
* **URL Parameters:**
    * `quiz_id` (int): The ID of the quiz.
* **Request Body:** None
* **Success Response (200 OK):**
    ```json
    {
      "id": 1,
      "topic_name": "History",
      "difficulty": "Medium",
      "created_by_user_id": 1,
      "created_at": "2025-11-16T18:00:00",
      "questions": [
        {
          "id": 1,
          "question_text": "Who was the first president?",
          "options": ["Washington", "Adams", "Jefferson"]
        },
        {
          "id": 2,
          "question_text": "When was the Declaration of Independence signed?",
          "options": ["1776", "1812", "1492"]
        }
      ]
    }
    ```
* **Error Responses:**
    * **404 NOT FOUND:** Quiz not found.

---

### 4. Update Quiz

* **Endpoint:** `PUT /quiz/<int:quiz_id>`
* **Description:** Updates a quiz's metadata and/or replaces its questions. This is a full overwrite, not a patch.
* **Permissions:** Owner or Admin
* **URL Parameters:**
    * `quiz_id` (int): The ID of the quiz to update.
* **Request Body (JSON):**
    ```json
    {
      "topic_id": 1,
      "custom_topic": "A new custom topic",
      "difficulty": "Hard",
      "questions": [
        {
          "question_text": "New question?",
          "options": ["Yes", "No"],
          "correct_option_index": 0
        }
      ]
    }
    ```
* **Notes:**
    * If `questions` array is provided, all existing questions are deleted and replaced.
    * If `questions` key is `null` or missing, only metadata is updated.
* **Success Response (200 OK):**
    ```json
    {
      "message": "Quiz updated successfully",
      "quiz_id": 1
    }
    ```
* **Error Responses:**
    * **400 BAD REQUEST:** Invalid data.
    * **403 FORBIDDEN:** User does not have permission.
    * **404 NOT FOUND:** Quiz not found.

---

### 5. Delete Quiz

* **Endpoint:** `DELETE /quiz/<int:quiz_id>`
* **Description:** Deletes a quiz and all its associated questions and results.
* **Permissions:** Owner or Admin
* **URL Parameters:**
    * `quiz_id` (int): The ID of the quiz to delete.
* **Request Body:** None
* **Success Response (200 OK):**
    ```json
    {
      "message": "Quiz deleted successfully"
    }
    ```
* **Error Responses:**
    * **403 FORBIDDEN:** User does not have permission.
    * **404 NOT FOUND:** Quiz not found.

## Results (`/result`)

---

### 1. Submit Result

* **Endpoint:** `POST /result/`
* **Description:** Submits a score for a completed quiz.
* **Permissions:** Logged-in User
* **Request Body (JSON):**
    ```json
    {
      "quiz_id": 1,
      "score": 8,
      "total_questions": 10
    }
    ```
* **Success Response (201 CREATED):**
    ```json
    {
      "message": "Result submitted successfully",
      "result_id": 1
    }
    ```
* **Error Responses:**
    * **400 BAD REQUEST:** Missing data.
    * **404 NOT FOUND:** Quiz not found.

---

### 2. Get Results

* **Endpoint:** `GET /result/`
* **Description:**
    * **Admins:** Get all results from all users.
    * **Regular Users:** Get only their own results.
* **Permissions:** Logged-in User
* **Request Body:** None
* **Success Response (200 OK):**
    ```json
    [
      {
        "id": 1,
        "user_id": 1,
        "quiz_id": 1,
        "score": 8,
        "total_questions": 10,
        "completed_at": "2025-11-16T18:05:00"
      }
    ]
    ```

---

### 3. Get Result by ID

* **Endpoint:** `GET /result/<int:result_id>`
* **Description:** Retrieves a specific result by its ID. Users can only view their own results; admins can view any.
* **Permissions:** Owner or Admin
* **URL Parameters:**
    * `result_id` (int): The ID of the result.
* **Request Body:** None
* **Success Response (200 OK):**
    ```json
    {
      "id": 1,
      "user_id": 1,
      "quiz_id": 1,
      "score": 8,
      "total_questions": 10,
      "completed_at": "2025-11-16T18:05:00"
    }
    ```
* **Error Responses:**
    * **403 FORBIDDEN:** User does not have permission.
    * **404 NOT FOUND:** Result not found.

---

### 4. Get Results for a Specific User

* **Endpoint:** `GET /result/user/<int:user_id>`
* **Description:** (Admin) Retrieves all results for a specific user.
* **Permissions:** Admin Only
* **URL Parameters:**
    * `user_id` (int): The ID of the user.
* **Request Body:** None
* **Success Response (200 OK):**
    ```json
    [
      {
        "id": 1,
        "quiz_id": 1,
        "score": 8,
        "total_questions": 10,
        "completed_at": "2025-11-16T18:05:00"
      }
    ]
    ```
* **Error Responses:**
    * **404 NOT FOUND:** User not found.