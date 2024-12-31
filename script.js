function switchTab(tab) {
    // Hide both content sections initially
    document.getElementById('photos-content').style.display = 'none';
    document.getElementById('albums-content').style.display = 'none';

    // Show the corresponding section based on the tab clicked
    if (tab === 'photos') {
        document.getElementById('photos-content').style.display = 'block';
        displayAllPhotos(); // Call function to display all photos when Photos tab is active
    } else if (tab === 'albums') {
        document.getElementById('albums-content').style.display = 'block';
    }

    // Update the active class for tabs
    document.querySelectorAll('.tab').forEach(button => {
        button.classList.remove('active');
    });
    if (tab === 'photos') {
        document.querySelector('[onclick="switchTab(\'photos\')"]').classList.add('active');
    } else if (tab === 'albums') {
        document.querySelector('[onclick="switchTab(\'albums\')"]').classList.add('active');
    }
}


// Initialize the first tab as active (Albums)
window.onload = function() {
    switchTab('photos');
};

// Save albums to local storage
function saveAlbumsToLocalStorage(albums) {
    localStorage.setItem('albums', JSON.stringify(albums));
}

// Load albums from local storage
function loadAlbumsFromLocalStorage() {
    const albums = localStorage.getItem('albums');
    return albums ? JSON.parse(albums) : []; // Return albums or an empty array if none exist
}

document.getElementById("addAlbum").addEventListener("click", function () {
    // Prompt the user to enter a name for the new album
    const albumName = prompt("Enter the album name:");
    if (albumName && albumName.trim() !== "") {
        addAlbum(albumName);
    } else {
        alert("Album name cannot be empty.");
    }
});

// Function to add a new album to the list and local storage
function addAlbum(albumName) {
    const myAlbums = document.querySelector(".myalbums .line2"); // Assuming `.line2` is where albums are displayed
    const albums = loadAlbumsFromLocalStorage(); // Load albums from Local Storage

    // Create a new album object
    const newAlbum = {
        name: albumName,
        photoCount: 0, // Set the initial photo count to 0 (you can change this later)
        firstPhoto: "" // Store the first photo added
    };

    // Add the new album to the list
    albums.push(newAlbum);

    // Save the updated albums list to Local Storage
    saveAlbumsToLocalStorage(albums);

    // Add the album to the DOM
    displayAlbums();
}

// Function to display all albums (this function will be called after adding or loading albums)
function displayAlbums() {
    const myAlbums = document.querySelector(".myalbums .line2"); // Assuming `.line2` is where albums are displayed
    myAlbums.innerHTML = ""; // Clear the existing albums

    const albums = loadAlbumsFromLocalStorage(); // Load albums from Local Storage

    albums.forEach((album) => {
        const albumLink = document.createElement("a");
        albumLink.href = "#";

        const box = document.createElement("div");
        box.classList.add("box2");

        // Check if the album has any photos
        const photos = JSON.parse(localStorage.getItem(album.name)) || [];
        const firstImage = photos.length > 0 ? photos[0] : "#"; // Use the first photo or a placeholder

        const img = document.createElement("img");
        img.src = firstImage; // Set the first image as album cover
        img.alt = `${album.name} cover`;  // Optional alt text for the image
        box.appendChild(img);

        const albumTitle = document.createElement("h4");
        albumTitle.textContent = album.name;

        const photoCount = document.createElement("span");
        photoCount.textContent = album.photoCount;

        albumLink.appendChild(box);
        albumLink.appendChild(albumTitle);
        albumLink.appendChild(photoCount);
        myAlbums.appendChild(albumLink);

        // Right-click on the image to show context menu
        img.addEventListener("contextmenu", function (e) {
            e.preventDefault(); // Prevent default right-click menu

            // Create the custom context menu
            const contextMenu = document.createElement("div");
            contextMenu.classList.add("context-menu");
            contextMenu.style.position = "absolute";
            contextMenu.style.top = `${e.pageY}px`;
            contextMenu.style.left = `${e.pageX}px`;

            // Create the delete option
            const deleteOption = document.createElement("div");
            deleteOption.textContent = "Delete Photo";
            deleteOption.classList.add("context-menu-item");
            contextMenu.appendChild(deleteOption);

            // Append the context menu to the body
            document.body.appendChild(contextMenu);

            // When clicking outside the context menu, remove it
            document.addEventListener("click", function removeContextMenu() {
                contextMenu.remove();
                document.removeEventListener("click", removeContextMenu); // Remove the event listener
            });

            // Delete the photo when "Delete Photo" is clicked
            deleteOption.addEventListener("click", function () {
                // Remove the photo from the album (from localStorage)
                const albumPhotos = JSON.parse(localStorage.getItem(album.name)) || [];
                const photoIndex = albumPhotos.indexOf(img.src); // Find the photo index

                if (photoIndex > -1) {
                    albumPhotos.splice(photoIndex, 1); // Remove the photo from the array
                    localStorage.setItem(album.name, JSON.stringify(albumPhotos)); // Update localStorage

                    // Update the album count and re-render the albums
                    album.photoCount = albumPhotos.length;
                    displayAlbums(); // Re-render albums with updated data
                }
                contextMenu.remove(); // Remove the context menu after deletion
            });
        });

        albumLink.addEventListener("click", function () {
            const albumUrl = `album.html?name=${encodeURIComponent(album.name)}`;
            window.location.href = albumUrl;
        });
    });        
}

// Function to show the context menu on right-click (rename/delete)
function showContextMenu(event, albumElement, albumTitleElement, album) {
    event.preventDefault();

    // Create context menu with Delete and Rename options
    const contextMenu = document.createElement("div");
    contextMenu.className = "context-menu";
    contextMenu.style.position = "absolute";
    contextMenu.style.left = `${event.clientX}px`;
    contextMenu.style.top = `${event.clientY}px`;

    const renameOption = document.createElement("div");
    renameOption.className = "context-menu-option";
    renameOption.innerText = "Rename";

    const deleteOption = document.createElement("div");
    deleteOption.className = "context-menu-option";
    deleteOption.innerText = "Delete";

    contextMenu.appendChild(renameOption);
    contextMenu.appendChild(deleteOption);

    document.body.appendChild(contextMenu);

    // Rename option functionality
    renameOption.addEventListener("click", function () {
        const newName = prompt("Enter the new album name:");
        if (newName && newName.trim() !== "") {
            album.name = newName; // Update album name in the object
            albumTitleElement.textContent = newName; // Update the album title in the DOM
            saveAlbumsToLocalStorage(loadAlbumsFromLocalStorage()); // Save updated albums to Local Storage
        } else {
            alert("Album name cannot be empty.");
        }
        contextMenu.remove();
    });

    // Delete option functionality
    deleteOption.addEventListener("click", function () {
        const albums = loadAlbumsFromLocalStorage();
        const albumIndex = albums.indexOf(album);
        if (albumIndex > -1) {
            albums.splice(albumIndex, 1); // Remove album from the array
            saveAlbumsToLocalStorage(albums); // Update Local Storage
            displayAlbums(); // Re-render albums
        }
        contextMenu.remove();
    });
}

// Call the displayAlbums() function to show albums when page loads
displayAlbums();

// -----------------------------------------------------------


function displayAllPhotos() {
    const photoGallery = document.getElementById("photo-gallery");
    photoGallery.innerHTML = ""; // Clear any existing photos

    const albums = loadAlbumsFromLocalStorage(); // Load albums from Local Storage

    albums.forEach((album) => {
        const albumPhotos = JSON.parse(localStorage.getItem(album.name)) || []; // Get photos for each album

        albumPhotos.forEach((photoUrl) => {
            const photoDiv = document.createElement("div");
            photoDiv.classList.add("photo-item");

            const img = document.createElement("img");
            img.src = photoUrl;
            img.alt = `Photo from ${album.name}`;

            photoDiv.appendChild(img);
            photoGallery.appendChild(photoDiv);
        });
    });
}




// Function to search albums and photos
function searchContent() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();

    // Filter albums based on the search term
    const albums = loadAlbumsFromLocalStorage();
    const filteredAlbums = albums.filter(album => album.name.toLowerCase().includes(searchTerm));

    // Display filtered albums
    displayAlbums(filteredAlbums);

    // Filter photos based on the search term
    const photoGallery = document.getElementById("photo-gallery");
    photoGallery.innerHTML = ""; // Clear any existing photos

    albums.forEach((album) => {
        const albumPhotos = JSON.parse(localStorage.getItem(album.name)) || []; // Get photos for each album

        // Filter photos that match the search term
        const filteredPhotos = albumPhotos.filter(photo => photo.toLowerCase().includes(searchTerm));

        filteredPhotos.forEach((photoUrl) => {
            const photoDiv = document.createElement("div");
            photoDiv.classList.add("photo-item");

            const img = document.createElement("img");
            img.src = photoUrl;
            img.alt = `Photo from ${album.name}`;

            photoDiv.appendChild(img);
            photoGallery.appendChild(photoDiv);
        });
    });
}

// Modified function to display albums with filtering
function displayAlbums(filteredAlbums = loadAlbumsFromLocalStorage()) {
    const myAlbums = document.querySelector(".myalbums .line2");
    myAlbums.innerHTML = ""; // Clear the existing albums

    filteredAlbums.forEach((album) => {
        const albumLink = document.createElement("a");
        albumLink.href = "#";

        const box = document.createElement("div");
        box.classList.add("box2");

        const photos = JSON.parse(localStorage.getItem(album.name)) || [];
        const firstImage = photos.length > 0 ? photos[0] : "#"; // Use the first photo or a placeholder

        const img = document.createElement("img");
        img.src = firstImage;
        img.alt = `${album.name} cover`;  
        box.appendChild(img);

        const albumTitle = document.createElement("h4");
        albumTitle.textContent = album.name;

        const photoCount = document.createElement("span");
        photoCount.textContent = album.photoCount;

        albumLink.appendChild(box);
        albumLink.appendChild(albumTitle);
        albumLink.appendChild(photoCount);
        myAlbums.appendChild(albumLink);

        img.addEventListener("contextmenu", function (e) {
            e.preventDefault();
            const contextMenu = document.createElement("div");
            contextMenu.classList.add("context-menu");
            contextMenu.style.position = "absolute";
            contextMenu.style.top = `${e.pageY}px`;
            contextMenu.style.left = `${e.pageX}px`;

            const deleteOption = document.createElement("div");
            deleteOption.textContent = "Delete Photo";
            deleteOption.classList.add("context-menu-item");
            contextMenu.appendChild(deleteOption);

            document.body.appendChild(contextMenu);

            document.addEventListener("click", function removeContextMenu() {
                contextMenu.remove();
                document.removeEventListener("click", removeContextMenu); 
            });

            deleteOption.addEventListener("click", function () {
                const albumPhotos = JSON.parse(localStorage.getItem(album.name)) || [];
                const photoIndex = albumPhotos.indexOf(img.src);
                if (photoIndex > -1) {
                    albumPhotos.splice(photoIndex, 1);
                    localStorage.setItem(album.name, JSON.stringify(albumPhotos));

                    album.photoCount = albumPhotos.length;
                    displayAlbums(); 
                }
                contextMenu.remove();
            });
        });

        albumLink.addEventListener("click", function () {
            const albumUrl = `album.html?name=${encodeURIComponent(album.name)}`;
            window.location.href = albumUrl;
        });
    });
}

// Modify the displayAllPhotos() function to filter photos based on the search term
function displayAllPhotos() {
    const photoGallery = document.getElementById("photo-gallery");
    photoGallery.innerHTML = "";

    const albums = loadAlbumsFromLocalStorage();

    albums.forEach((album) => {
        const albumPhotos = JSON.parse(localStorage.getItem(album.name)) || [];

        // Filter the photos
        const searchTerm = document.getElementById('search-input').value.toLowerCase();
        const filteredPhotos = albumPhotos.filter(photo => photo.toLowerCase().includes(searchTerm));

        filteredPhotos.forEach((photoUrl) => {
            const photoDiv = document.createElement("div");
            photoDiv.classList.add("photo-item");

            const img = document.createElement("img");
            img.src = photoUrl;
            img.alt = `Photo from ${album.name}`;

            photoDiv.appendChild(img);
            photoGallery.appendChild(photoDiv);
        });
    });
}

// Add event listener to call searchContent() on input change
document.getElementById('search-input').addEventListener('input', searchContent);




// script.js

// Get references to the search icon and input field
const searchIcon = document.getElementById('search-icon');
const searchInput = document.getElementById('search-input');

// Add a click event listener to the search icon
searchIcon.addEventListener('click', function() {
    // Toggle the display of the search input field
    if (searchInput.style.display === 'none' || searchInput.style.display === '') {
        searchInput.style.display = 'inline-block'; // Show the input field
        searchInput.focus(); // Automatically focus on the search input when it appears
    } else {
        searchInput.style.display = 'none'; // Hide the input field if already visible
    }
});
