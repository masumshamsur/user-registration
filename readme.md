# App creation-

registration-app/

Create an application that will have registraion page with -
Wellcome to the Registration Page!!
ask for entering name, email and country.

make the background color as gray.

put the form in the middle of the page.

once user enter the information and click on submit button, display the entered information saying- You have entered <info>.
save the user entered data in postgresSQL database (will use postgresSQL database docker image for storing data).
explain how the app will establish connection with postgresSQL image.
create app with javascript and/or HTML.
give the project file structure.
give the docker file for creating docker image of the app.
add the instruction for creating and pushing the image to the docker hub.

Give the kubernetes yaml definition file for  running the app in kubernetes minikube cluster.

usersDashboard-app/

i want to create another app that with retrieve the user registration data from the registration database and users table

- display the number of user already registered.
- also give an option to search the user list by country name and display data in a tabler form.
- add the docker file to create an image out of it.
- add the kubernaties yaml documentation file to deploy them in kubernaties cluster.

Current project structure if required. 

---

My project structure-

```yaml
USER_REGISTRATION/
├── k8s/
│   ├── postgres-deployment.yaml
│   ├── user-dashboard-deployment.yaml
│   ├── user-registration-deployment.yaml
├── registration-app/
│   ├── node_modules/
│   ├── src/
│   ├── .dockerignore
│   ├── .gitignore
│   ├── Dockerfile
│   ├── package-lock.json
│   ├── package.json
├── usersDashboard-app/
│   ├── node_modules/
│   ├── src/
│   ├── .dockerignore
│   ├── .gitignore
│   ├── Dockerfile
│   ├── package-lock.json
│   ├── package.json
├── readme.md

```

Project repo- https://github.com/masumshamsur/registration-app

To get the `node_modules`, `package.json`, and `package-lock.json` files in your project, follow these steps:

### **1. Initialize the `package.json` File**

Navigate to the directory of your project (`registration/` or `usersDashboard/`) in the terminal and run:

```bash
npm init -y
```

- This creates a basic `package.json` file with default values.
- The `y` flag accepts all the default settings (name, version, entry point, etc.).

If you already have a `package.json` file, you can skip this step.

### **2. Install Dependencies**

In the same directory, run:

```bash
npm install express pg
```

This will:

- Install the required dependencies (`express` and `pg` in this case).
- Create a `node_modules/` directory with the installed libraries and their dependencies.
- Automatically create or update the `package-lock.json` file to lock the versions of the installed libraries.

If you're using a Mac M1/M2 and targeting a Linux environment, build the image for the correct platform:

```yaml
docker buildx build --platform linux/amd64 -t masum012924/registration-app:v1 .
```

push the image to docker repo-

```yaml
docker push masum012924/registration-app:v1
```

run the image in local machine-

```yaml
docker run -d -p 3000:3000 registration-app:v1
```

Troubleshooting—-

### **Verify Database Existence and Table Structure**

Ensure that the `users` table exists in your `registration` database. You can connect to the database from within the PostgreSQL pod and verify:

1. **Get the PostgreSQL pod name**:
    
    ```bash
    kubectl get pods
    ```
    
2. **Connect to the PostgreSQL pod**:
    
    ```bash
    kubectl exec -it <postgres-pod-name> -- /bin/bash
    ```
    
3. **Access PostgreSQL**:
    
    ```bash
    psql -U postgres -d registration
    ```
    
4. **Check if the `users` table exists**:
    
    ```sql
    \dt
    ```
    
    If you don't see the `users` table, you can create it using:
    
    ```sql
    CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(100),
        country VARCHAR(100)
    );
    ```
    

Here's how you can view the records in the `users` table:

1. While still connected to your `registration` database (you're at the `registration=#` prompt), run the following SQL query to see all the records in the `users` table:
    
    ```sql
    SELECT * FROM users;
    ```
    
2. This will display all the rows in the `users` table. If you don't have any data yet, it will show an empty result set, like:
    
    ```sql
    id | name | email | country
    ----+------+-------+---------
    (0 rows)
    ```
    

### Inserting Data Manually (Optional)

If you want to manually insert some test data into the table to check everything works, you can run the following SQL:

```sql
INSERT INTO users (name, email, country) VALUES
('John Doe', 'john.doe@example.com', 'USA'),
('Jane Smith', 'jane.smith@example.com', 'Canada');
```

Now, when you visit the `/users` route in your app, it should return the inserted data.