const postLink = document.getElementById('postLink');
const usersLink = document.getElementById('usersLink');
const friendsLink = document.getElementById('friendsLink');
const profileName = document.getElementById('profileName');
const profileLink = document.getElementById('profileLink');
const contentBlock = document.getElementById('content');
const addButton = document.getElementById('addLink');


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
            contentBlock.innerHTML =   `<div class="user-content">
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

// profile item
function profileLinkClick(event) {
    event.preventDefault();
    postLink.classList.remove('active');
    usersLink.classList.remove('active');
    event.target.classList.add('active');
    fetch('/profile').then(response => response.json()).then(user => {
        const dateUser = new Date(user.birthdate);
            const options = {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
        };
        const formattedDate2 = dateUser.toLocaleString('en-US', options);
        contentBlock.innerHTML =   `    <div class="user-content">
                                            <div class="user-photo">
                                                <img src="materials/backrotate (2).gif">
                                            </div>
                                            <div class="user-info">
                                                <h2>${user.username}'s Profile</h2>
                                                <p>Email: ${user.email}</p>
                                                <p>Role: ${user.role}</p>
                                            </div>
                                        </div>
                                        <div class="update-content">
                                            <h2>Update information</h2>
                                            <div class="update-form">
                                                <div class="update-form-input">
                                                    <label for="email">Email: <span>${user.email ? user.email : ''}</span></label>
                                                    <input type="email" id="newEmail" name="email" placeholder="Enter new email">
                                                </div>
                                                <div class="update-form-input">
                                                    <label for="datetime">Birth date: <span>${user.birthdate ? formattedDate2 : ''}</span></label>
                                                    <input type="date" id="newBirthDate" name="datetime" placeholder="Enter your birth date">
                                                </div>
                                                <div class="update-form-input">
                                                    <label for="status">Status: <span>${user.status ? user.status : ''}</span></label>
                                                    <input type="text" id="newStatus" name="status" placeholder="Your status">
                                                </div>
                                                <div class="update-form-input">
                                                    <label for="city">City: <span>${user.city ? user.city : ''}</span></label>
                                                    <input type="text" id="newCity" name="city" placeholder="Your city">
                                                </div>
                                                <button id="updateInformationBtn">Save</button>
                                            </div>
                                        </div>`;
    }).catch(error => console.error('Error fetching profile:', error));

    fetch('/post/userpost').then(response => response.json()).then(posts => {
        const contentBlock2 = document.createElement('div')
        contentBlock2.classList.add('content-block')
        posts.forEach(post => {
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
            fetch('/getUserName').then(response => response.json()).then(user => {
                contentBlock2.innerHTML += `<div class="post-block">
                                                <h3>${post.title}</h3>
                                                <div class="white-line" style="background-color: white; height: 1px; width: 100%;"></div>
                                                <p>${post.description}</p>
                                                <p class="user-inform">${user.username}</p>
                                                <p  class="user-inform">${formattedDate}</p>
                                                <div class="post-btn-container">
                                                    <button class="edit-btn" onclick="editPost(${post.id})">Edit</button>
                                                    <button class="delete-btn" onclick="deletePost(${post.id})">Delete</button>
                                                </div>
                                            </div>`;
                contentBlock.appendChild(contentBlock2)
            }).catch(error => console.error('Error:', error));

            
            
        })
    })

}

document.addEventListener('click', async function(event) {
    const target = event.target;
    if(target.matches("#updateInformationBtn")) {
        const newEmail = document.getElementById("newEmail").value;
        const newBirthDate = document.getElementById("newBirthDate").value;
        const newStatus = document.getElementById("newStatus").value;
        const newCity = document.getElementById("newCity").value;
        if(newEmail !== null && newBirthDate !==null && newStatus !== null && newCity !== null) {
            fetch('/user/updateinf', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: newEmail, birthdate: newBirthDate, status: newStatus, city: newCity })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error: ${response.status} - ${response.statusText}`);
                }
            })
            .then(updatedUser => {
                alert('User updated successfully:', updatedUser);
                this.location.reload();
            })
        }
    }
})

async function editPost(postId) {
    const newTitle = prompt('Enter new title:');
    const newDescription = prompt('Enter new description:');
    console.log('Edit post clicked', postId);
    if (newTitle !== null && newDescription !== null) {
        fetch(`/post/posts/${postId}`, {
            method: 'PUT', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title: newTitle, description: newDescription}),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error: ${response.status} - ${response.statusText}`);
            }
        })
        .then(updatedPost => {
            console.log('Post updated successfully:', updatedPost);
        })
    }
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

// Post item
function postLinkClick(event) {
    event.preventDefault();
    localStorage.clear();
    profileLink.classList.remove('active');
    event.target.classList.add('active');
    fetch('/post/posts').then(response => response.json()).then(posts => {
        if (contentBlock) {
            contentBlock.innerHTML = '';
            const contentBlock2 = document.createElement('div')
            contentBlock2.classList.add('content-block')
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
                    fetch(`/post/like/number/${post.id}`).then(response => response.json()).then(data => {
                            contentBlock2.innerHTML += ` 
                            <div class="post-block">
                                <h3>${post.title}</h3>
                                <div class="white-line" style="background-color: white; height: 1px; width: 100%;"></div>
                                <p>${post.description}</p>
                                <p class="user-inform">${user.username}</p>
                                <p class="user-inform">${formattedDate}</p>
                                <button id="likeButton" onclick="likePost(${post.id}, this)" class="likeButton">${data.likeNumber} Likes</button>
                            </div>`;
                            contentBlock.appendChild(contentBlock2)
                            const likeButton = document.getElementById('likeButton');
                            const isButtonActive = localStorage.getItem(`active_${userID}`);
                            if (isButtonActive) {
                            likeButton.classList.add('liked');
                            } else {
                                likeButton.classList.remove('liked');
                            }
                    })
                })
            })
        } else {
            console.error('Error: postContent element not found');
        }
    }).catch(error => console.error('Error fetching posts:', error))
    
}


const userID = getUserId();
async function likePost(postId, likeButton) {
    fetch(`/post/like/exist/${postId}`).then(response => response.json()).then(async data => {
        const isLiked = data;
        if(isLiked) {
            fetch(`/post/like/${postId}`, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                },
            })
            .then(response => response.json())
            .then(data => {
                console.log(data);
            })
            .catch(error => console.error('Error removing like:', error));
            likeButton.classList.remove("liked")
        } else {
            const respone = await fetch(`/post/like/${postId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            const data = await respone.json()
            console.log(data)
        }
    })
}

async function getUserId() {
    const response = await fetch('/profile');
    const user = await response.json();
    return user.id;
}
usersLink.addEventListener('click', usersLinkClick)


// users item
function usersLinkClick(event){
    event.preventDefault()
    profileLink.classList.remove('active');
    postLink.classList.remove('active');
    event.target.classList.add('active');
    contentBlock.innerHTML = '';
    fetch('/users')
            .then(response => response.json())
            .then(async users => {
                const userListFollow = document.createElement("div")
                userListFollow.classList.add("users-block")
                const LoggedId = await getUserId();
                users.forEach(user => {
                    fetch(`/follows/${user.id}/${LoggedId}`)
                    .then(response => response.json())
                    .then(data => {
                        const isFollowing = data
                        userListFollow.innerHTML += `
                            <div class="users-block-div">
                                <span class="username">${user.username}</span>
                                <button class="follow-button" data-userid="${user.id}" onclick="handleFollowButtonClick('${user.id}', '${LoggedId}')">
                                ${isFollowing ? 'Unfollow' : 'Follow'}
                                </button>
                            </div>
                            `;
                        contentBlock.appendChild(userListFollow)
                    })
                    .catch(error => console.error(error));
                });
            })
            .catch(error => {
            console.error('Error fetching users:', error);
            });
}

function handleFollowButtonClick(followerId,followeeId) {
    console.log(followerId + " " + followeeId)
    const followButton = document.querySelector(".follow-button")
    fetch(`/follows/${followerId}/${followeeId}`)
        .then(response => response.json())
        .then(data => {
            const isFollowing = data
            if (isFollowing) {
                unfollowUser(followerId)
                    .then(() => {
                    followButton.innerText = 'Follow';
                  })
                  .catch(error => {
                    console.error('Error unfollowing user:', error);
                  });
              } else {
                followUser(followerId)
                  .then(() => {
                    followButton.innerText = 'Unfollow';
                  })
                  .catch(error => {
                    console.error('Error following user:', error);
                  });
              }
        })
        .catch(error => console.error(error));
}
  

function followUser(followeeId) {
    return fetch('/follows/follow', {
        method: 'POST',
        body: JSON.stringify({ followeeId: followeeId }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .catch(error => {
        throw error;
    });
}
  
function unfollowUser(followeeId) {
    return fetch('/follows/unfollow', {
        method: 'POST',
        body: JSON.stringify({ followeeId: followeeId }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .catch(error => {
        throw error;
    });
}

// add Post item
addButton.addEventListener('click', addLinkClick)
function addLinkClick (event) {
    event.preventDefault()
    const newTitle = prompt("Enter title: ")
    const newDescription = prompt("Enter description: ")
    if(newTitle !== null && newDescription !== null) {
        fetch("/post/addpost", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title: newTitle, description: newDescription}),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error: ${response.status} - ${response.statusText}`);
            }
        })
        .then(newPost => {
            console.log('Post added successfully:', newPost);
        })

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

profileName.addEventListener('click', profileLinkClick);
profileLink.addEventListener('click', profileLinkClick);
postLink.addEventListener('click', postLinkClick);