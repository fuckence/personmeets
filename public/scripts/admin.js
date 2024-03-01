const userLink = document.getElementById('userLink')
const profileLink = document.getElementById('profileLink')
const postLink = document.getElementById('postLink')
const profileName = document.getElementById('profileName');
const contentBlock2 = document.getElementById('content')

fetch('/getUserName')
    .then(response => response.json())
    .then(user => {
        const usernameDisplay = document.getElementById('usernameDisplay');
        usernameDisplay.innerText = `${user.username}`;
    })
    .catch(error => console.error('Error:', error));
            
fetch('/profile')
        .then(response => response.json())
        .then(user => {
            contentBlock2.innerHTML =   `<div class="user-content">
                                            <div class="user-photo">
                                                <img src="materials/backrotate (2).gif">
                                            </div>
                                            <div class="user-info">
                                                <h2>${user.username}'s Profile</h2>
                                                <p>Email: ${user.email}</p>
                                                <p>Role: ${user.role}</p>
                                            </div>
                                        </div>`;
        })
    .catch(error => console.error('Error fetching profile:', error));

profileLink.addEventListener('click', profileLinkClick);
postLink.addEventListener('click', postLinkClick);
profileName.addEventListener('click', profileLinkClick);

// Profile item
function profileLinkClick(event) {
    event.preventDefault();

    postLink.classList.remove('active');
    userLink.classList.remove('active');
    event.target.classList.add('active');
    fetch('/profile')
        .then(response => response.json())
        .then(user => {
            contentBlock2.innerHTML =   `<div class="user-content">
                                            <div class="user-photo">
                                                <img src="materials/backrotate (2).gif">
                                            </div>
                                            <div class="user-info">
                                                <h2>${user.username}'s Profile</h2>
                                                <p>Email: ${user.email}</p>
                                                <p>Role: ${user.role}</p>
                                            </div>
                                        </div>`;
        })
    .catch(error => console.error('Error fetching profile:', error));
}


// Posts item
function postLinkClick(event) {
    event.preventDefault();
    profileLink.classList.remove('active');
    event.target.classList.add('active');
    const addPost = document.createElement("a")
    fetch('/post/posts')
        .then(response => response.json())
        .then(posts => {
            if (contentBlock2) {
                contentBlock2.innerHTML = '';
                const contentBlock = document.createElement('div')
                contentBlock.classList.add('content-block')
                posts.forEach(post => {
                    fetch(`/users/${post.userid}`).then(response => response.json()).then(user => {
                        const dateObject = new Date(post.date);
                        const options = {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric',
                            second: 'numeric',
                        };
                        const formattedDate = dateObject.toLocaleString('en-US', options);
                        contentBlock.innerHTML += ` 
                        <div class="post-block">
                            <h3>${post.title}</h3>
                            <div class="white-line" style="background-color: white; height: 1px; width: 100%;"></div>
                            <p>${post.description}</p>
                            <p class="user-inform">${user.username}</p>
                            <p  class="user-inform">${formattedDate}</p>
                            <div class="post-btn-container">
                                <button class="delete-btn" onclick="deletePost(${post.id})">Delete</button>
                            </div>
                        </div>`;
                        contentBlock2.appendChild(contentBlock)
                    })
                    
                });
            } else {
                console.error('Error: postContent element not found');
            }
        })
    .catch(error => console.error('Error fetching posts:', error))
}

async function deletePost(postId) {
    try {
        const confirmDelete = confirm('Are you sure you want to delete this post?');
        if (confirmDelete) {
            const deleteResponse = await fetch(`/post/posts/${postId}`, {
                method: 'DELETE',
            });
            if (deleteResponse.ok) {
            } else {
                console.error(`Error deleting user with ID ${postId}`);
            }
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Users item
async function fetchAndRenderUsers() {
    const response = await fetch('/users');
    const users = await response.json();
    const userTableBody = document.getElementById('userTableBody');
    userTableBody.innerHTML = '';

    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td>
                <button class="edit-btn" onclick="editUser(${user.id})">Edit</button>
                <button class="delete-btn" onclick="deleteUser(${user.id})">Delete</button>
            </td>
        `;
        userTableBody.appendChild(row);
    });
}


function loadUsers(event) {
    event.preventDefault()
    console.log("clicked")
    postLink.classList.remove('active')
    profileLink.classList.remove('active')
    userLink.classList.add('active')
    const userTable = document.createElement('table');
    userTable.innerHTML = `
        <thead>
            <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody id="userTableBody"></tbody>
    `;

    contentBlock2.innerHTML = '';
    contentBlock2.appendChild(userTable);

    fetchAndRenderUsers();
}

async function editUser(userId) {
    const newUsername = prompt('Enter new username:');
    const newEmail = prompt('Enter new email:');
    const newRole = prompt('Enter new role:');
    console.log('Edit user clicked', userId);
    if (newUsername !== null && newEmail !== null && newRole !== null) {
        fetch(`/users/${userId}`, {
            method: 'PUT', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: newUsername, email: newEmail, role: newRole }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error: ${response.status} - ${response.statusText}`);
            }
        })
        .then(updatedUser => {
            console.log('User updated successfully:', updatedUser);

            
        })
    }
    fetchAndRenderUsers();
    
}



async function deleteUser(userId) {
    try {
        const confirmDelete = confirm('Are you sure you want to delete this user?');
        if (confirmDelete) {
            const deleteResponse = await fetch(`/users/${userId}`, {
                method: 'DELETE',
            });

            if (deleteResponse.ok) {
                fetchAndRenderUsers();
            } else {
                console.error(`Error deleting user with ID ${userId}`);
            }
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

const menuBtn = document.querySelector(".menu-toggle-btn");
const sidebar = document.querySelector("aside");
const container = document.querySelector(".container");
const closeBtn = document.getElementById('close-btn');

closeBtn.addEventListener('click', function(event){
    event.preventDefault();
    sidebar.style.display = "none";
})

menuBtn.addEventListener('click', function(event){
    event.preventDefault();
    sidebar.style.display = "block";
})
