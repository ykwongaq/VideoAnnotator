FILE_INPUT = document.getElementById("uploader");

// Scenes
SCENE_INFO = document.getElementById("scene_info");
IMAGE = document.getElementById("image");
VIDEO = document.getElementById("video");
VIDEO_SRC = document.getElementById("video_src");

// Buttons
PREV_BUTTON = document.getElementById("prev");
NEXT_BUTTON = document.getElementById("next");
SHOW_MASK_BUTTON = document.getElementById("show_mask");

// Sidebar
SCROLLBAR_ITEMS = document.getElementById("scrollbar-items");

const DATASET = Dataset.getInstance();

let INSTANCE_VIEWS = [];
let current_scene_index = 0;
let SHOW_MASK = true;

FILE_INPUT.addEventListener("change", function (e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
        DATASET.parseJSON(e.target.result);
        current_scene_index = 0;
        scene = DATASET.getScene(current_scene_index);
        showScene(scene);

        let elements = document.querySelectorAll(".hidden");
        elements.forEach((element) => {
            element.classList.remove("hidden");
        });
    };
    reader.readAsText(file);
    // Hide the upload file container after loading the json file
    FILE_INPUT.style.display = "none";
});

function showScene(scene) {
    removeInstanceList();
    if (SHOW_MASK) {
        showImage(scene.getFirstColoredFramePath());
        showVideo(scene.getVideoWithMaskPath());
        showInstanceList(scene.getInstanceWithMaskPaths());
    } else {
        showImage(scene.getFirstFramePath());
        showVideo(scene.getVideoPath());
        showInstanceList(scene.getInstancePaths());
    }
    showSceneInfo(
        `Scene: ${scene.getName()} \t (${
            current_scene_index + 1
        } / ${DATASET.getLen()})`
    );
}

function removeInstanceList() {
    SCROLLBAR_ITEMS.innerHTML = "";
}

function showInstanceList(instance_paths) {
    builder = new InstanceBuilder();
    INSTANCE_VIEWS = builder.build_instance_views(instance_paths);

    for (let instance_view of INSTANCE_VIEWS) {
        SCROLLBAR_ITEMS.appendChild(instance_view);
    }
}

function showInstance(instance_path) {
    const instance_div = document.createElement("div");
    instance_div.classList.add("instance");

    const instance_view = document.createElement("div");
    instance_view.classList.add("instance", "instance-view");

    const input_view = document.createElement("div");
    input_view.classList.add("instance", "input-view");

    instance_div.appendChild(instance_view);
    instance_div.appendChild(input_view);

    const instance_img = document.createElement("img");
    instance_img.src = instance_path;

    instance_view.appendChild(instance_img);

    SIDEBAR_ITEMS.appendChild(instance_div);
}

function showSceneInfo(scene_info) {
    SCENE_INFO.innerHTML = scene_info;
}

function showImage(image_path) {
    console.log(image_path);
    IMAGE.src = image_path;
}

function showVideo(video_path) {
    console.log(video_path);
    VIDEO_SRC.src = video_path;
    VIDEO.load();
    VIDEO.play();
}

PREV_BUTTON.addEventListener("click", function () {
    if (current_scene_index > 0) {
        current_scene_index -= 1;
        scene = DATASET.getScene(current_scene_index);
        showScene(scene);
    }
});

NEXT_BUTTON.addEventListener("click", function () {
    if (current_scene_index < DATASET.getLen() - 1) {
        current_scene_index += 1;
        scene = DATASET.getScene(current_scene_index);
        showScene(scene);
    }
});

SHOW_MASK_BUTTON.addEventListener("click", function () {
    SHOW_MASK = !SHOW_MASK;
    scene = DATASET.getScene(current_scene_index);
    showScene(scene);
});
