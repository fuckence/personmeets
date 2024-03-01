create TABLE users {
    id SERIAL PRIMARY KEY,
    username VARCHAR(50),
    password VARCHAR(50),
    role VARCHAR(20)
}

create TABLE posts {
    id SERIAL PRIMARY KEY,
    title VARCHAR(30),
    description VARCHAR(100)
}