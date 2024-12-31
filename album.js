// Ensure the album name is retrieved from the URL
const urlParams = new URLSearchParams(window.location.search);
const albumName = urlParams.get('name') || 'Album Name';  // Fallback to 'Album Name' if not found

// Display the album name
document.getElementById('albumTitle').textContent = albumName;

// Load photos from localStorage and display them
function loadPhotos() {
    const storedPhotos = JSON.parse(localStorage.getItem(albumName)) || [];
    const albumPhotosContainer = document.getElementById('albumPhotos');
    albumPhotosContainer.innerHTML = '';  // Clear existing photos

    storedPhotos.forEach((photo, index) => {
        const photoElement = document.createElement('img');
        photoElement.src = photo;
        photoElement.alt = `Photo ${index + 1}`;
        photoElement.classList.add('album-image'); // Add class for styling (optional)
        albumPhotosContainer.appendChild(photoElement);
    });
}


// Add photos to album (localStorage)
function addPhotosToAlbum(files) {
    const storedPhotos = JSON.parse(localStorage.getItem(albumName)) || [];

    Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = function(e) {
            storedPhotos.push(e.target.result);  // Add photo to the array
            if (storedPhotos.length === 1) {
                const albums = loadAlbumsFromLocalStorage();
                const album = albums.find(a => a.name === albumName);
                if (album) {
                    album.firstPhoto = e.target.result; // Set the first photo
                    saveAlbumsToLocalStorage(albums);  // Save the updated album with the first photo
                }
            }
            localStorage.setItem(albumName, JSON.stringify(storedPhotos));  // Save to localStorage
            loadPhotos();  // Reload photos
        };
        reader.readAsDataURL(file);  // Convert the file to base64
    });
}


// Event listener for file input (to add photos)
document.getElementById('file-input').addEventListener('change', function(event) {
    if (event.target.files) {
        addPhotosToAlbum(event.target.files);  // Add the selected photos
    }
});


// Initial load of photos when page loads
window.onload = loadPhotos;






// Get modal elements
const modal = document.getElementById("imgModal");
const modalImg = document.getElementById("modalImage");
const captionText = document.getElementById("caption");
const closeModal = document.getElementById("closeModal");

// Get all image elements in the album
const albumPhotosContainer = document.getElementById('albumPhotos');

// Open the modal when an image is clicked
albumPhotosContainer.addEventListener('click', function(event) {
    const clickedImage = event.target;
    if (clickedImage.tagName.toLowerCase() === 'img') {
        modal.style.display = "block"; // Show the modal
        modalImg.src = clickedImage.src; // Set the clicked image as the modal image
        captionText.innerHTML = clickedImage.alt; // Optional: use alt text as the caption
    }
});

// Close the modal when the close button is clicked
closeModal.addEventListener("click", function () {
    modal.style.display = "none"; // Hide the modal
});

// Close the modal if the user clicks anywhere outside of the image
window.addEventListener("click", function (event) {
    if (event.target === modal) {
        modal.style.display = "none"; // Hide the modal if the background is clicked
    }
});
