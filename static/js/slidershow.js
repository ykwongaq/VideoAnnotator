"use strict";

// Input parameter from python
const VIDEO_FOLDER = "videos";

// HTML elements
const VIDEO = document.getElementById("video");
const PROMPT = document.getElementById("prompt");
const VIDEO_IDX = document.getElementById("video_idx");
const NOTIFICATION = document.getElementById("notification");
const VIDEO_NAME = document.getElementById("video_name");

const LEFT_BUTTON = document.getElementById("left-button");
const BOTH_BUTTON = document.getElementById("both-button");
const RIGHT_BUTTON = document.getElementById("right-button");
const BUTTONS = [LEFT_BUTTON, BOTH_BUTTON, RIGHT_BUTTON];

// Label
const LEFT = "left";
const RIGHT = "right";
const BOTH = "both";
const EMPTY = "empty";

// Current idx of the image.
let currentIdx = 0;
let video_ids = [];

// Fetch the list of images
fetch("/api/video_ids")
    .then((response) => response.json())
    .then((ids) => {
        video_ids = ids;
        showSlides(currentIdx);
    });

// Add event handler to the buttons
LEFT_BUTTON.addEventListener("click", label_left);
BOTH_BUTTON.addEventListener("click", label_both);
RIGHT_BUTTON.addEventListener("click", label_right);

function joinPaths(...paths) {
    return paths
        .map((path, index) => {
            if (index === 0) {
                // Ensure the first path doesn't end with a slash
                return path.replace(/\/+$/, "");
            } else {
                // Ensure subsequent paths don't start or end with a slash
                return path.replace(/^\/+|\/+$/g, "");
            }
        })
        .join("/");
}

// Next/previous controls
function changeSlide(n) {
    let newIdx = currentIdx + n;
    if (newIdx < 0) {
        // First image, do nothing
        return;
    }

    if (newIdx > video_ids.length - 1) {
        // Last image, do nothing
        return;
    }

    currentIdx = newIdx;
    showSlides(currentIdx);
}

function get_video_path(video_id) {
    let filename = video_id + ".mp4";
    return joinPaths(VIDEO_FOLDER, filename);
}

function check_only(button) {
    for (let i = 0; i < BUTTONS.length; i++) {
        if (BUTTONS[i] !== button) {
            BUTTONS[i].checked = false;
        } else {
            BUTTONS[i].checked = true;
        }
    }
}

function showSlides(idx) {
    const video_id = video_ids[idx];
    fetch(`/api/video_data/${video_id}`)
        .then((response) => response.json())
        .then((data) => {
            // Load the video and play
            const uuid = data["uuid"];
            const video_path = get_video_path(uuid);
            VIDEO.src = video_path;
            VIDEO.play();

            // Show video name
            VIDEO_NAME.innerHTML = video_path;

            // Show prompt
            PROMPT.innerHTML = data["prompt"];

            // Show video label
            const label = data["label"];
            if (label === LEFT) {
                check_only(LEFT_BUTTON);
            } else if (label === RIGHT) {
                check_only(RIGHT_BUTTON);
            } else if (label === BOTH) {
                check_only(BOTH_BUTTON);
            } else {
                check_only(null);
            }
        })
        .catch((error) => {
            console.error("Error:", error);
        });
}

function update_label(video_id, label) {
    fetch("/api/save_label", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ video_id: video_id, label: label }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.status === "success") {
                // Do nothing
                showNotification(`Save label ${label} for video ${video_id}`);
            } else {
                console.error("Error saving label:", data.message);
            }
        })
        .catch((error) => {
            console.error("Error:", error);
        });
}

function label_left() {
    // When label left button is checked, all the other button should be un-checked
    check_only(LEFT_BUTTON);
    const video_id = video_ids[currentIdx];
    const label = LEFT;
    update_label(video_id, label);
}

function label_right() {
    // When label right button is checked, all the other button should be un-checked
    check_only(RIGHT_BUTTON);
    const video_id = video_ids[currentIdx];
    const label = RIGHT;
    update_label(video_id, label);
}

function label_both() {
    // When label both button is checked, all the other button should be un-checked
    check_only(BOTH_BUTTON);
    const video_id = video_ids[currentIdx];
    const label = BOTH;
    update_label(video_id, label);
}

function showNotification(message) {
    const notification = document.getElementById("notification");
    notification.innerText = message;
    notification.style.display = "block";
    setTimeout(() => {
        notification.style.display = "none";
    }, 1000); // Show notification for 1 second
}

document.addEventListener("keydown", (event) => {
    switch (event.key.toLowerCase()) {
        case "a":
            changeSlide(-1);
            break;
        case "d":
            changeSlide(1);
            break;
        case "j":
            label_left();
            break;
        case "k":
            label_both();
            break;
        case "l":
            label_right();
            break;
    }
});
