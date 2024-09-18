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

// FILE_INPUT.addEventListener("change", function (e) {
//     console.log(this.files[0].path);

//     const file = e.target.files[0];
//     let { path } = file;
//     let file_div = document.getElementById('file_path');
//     file_div.innerHTML = path;
//     const reader = new FileReader();
//     reader.onload = function (e) {
//         DATASET.parseJSON(e.target.result);
//         current_scene_index = 0;
//         scene = DATASET.getScene(current_scene_index);
//         showScene(scene);

//         let elements = document.querySelectorAll(".hidden");
//         elements.forEach((element) => {
//             element.classList.remove("hidden");
//         });
//     };
//     reader.readAsText(file);
//     // Hide the upload file container after loading the json file
//     FILE_INPUT.style.display = "none";
// });


const fileSelectElement = document.getElementById('fileSelect')
const loadingMsg = document.getElementById('loading_msg')

fileSelectElement.addEventListener('click', async () => {
    const open_res = await window.electronAPI.openFile()
    const filePath = String(open_res)
    let floderPathList = filePath.split("/")
    // console.log(floderPathList)
    floderPathList.pop()
    floderPathList.pop()
    let floderPath = floderPathList.join("/")
    console.log(floderPath)
    // filePathElement.innerText = filePath
    if (filePath) {
        const file = await window.electronAPI.readFile(filePath)
        if (file.success) {
            // console.log(file.data);
            DATASET.parseJSON(floderPath, file.data);
            current_scene_index = 0;
            scene = DATASET.getScene(current_scene_index);
            showScene(scene);

            let elements = document.querySelectorAll(".hidden");
            elements.forEach((element) => {
                element.classList.remove("hidden");
            });
            FILE_INPUT.style.display = "none";
        } else {
            loadingMsg.innerHTML = "Loading Error: "+ filePath + " \n" + file.error
        }
    }
})

function showScene(scene) {
    let instance_paths = null;
    if (SHOW_MASK) {
        showImage(scene.getFirstColoredFramePath());
        showVideo(scene.getVideoWithMaskPath());
        instance_paths = scene.getInstanceWithMaskPaths();
    } else {
        showImage(scene.getFirstFramePath());
        showVideo(scene.getVideoPath());
        instance_paths = scene.getInstancePaths();
    }

    removeInstanceList();
    showInstanceList(instance_paths);

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
    IMAGE.src = image_path;
}

function showVideo(video_path) {
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
    save_name_annotation();
    if (current_scene_index < DATASET.getLen() - 1) {
        current_scene_index += 1;
        scene = DATASET.getScene(current_scene_index);
        showScene(scene);
    }
});

SHOW_MASK_BUTTON.addEventListener("click", function () {
    SHOW_MASK = !SHOW_MASK;
    scene = DATASET.getScene(current_scene_index);
    adjust_mask();
});

function save_name_annotation() {
    const name_annotation_list = extract_input_list();
    const scene = DATASET.getScene(current_scene_index);
    const scene_name = scene.getName();

    const json = {
        scene_name: scene_name,
        name_annotations: name_annotation_list,
    };

    const json_str = JSON.stringify(json, null, 2);

    const blob = new Blob([json_str], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${scene_name}.json`;
    link.click();

    URL.revokeObjectURL(link.href);
}

function adjust_mask() {
    scene = DATASET.getScene(current_scene_index);
    let instance_paths = null;
    if (SHOW_MASK) {
        showImage(scene.getFirstColoredFramePath());
        showVideo(scene.getVideoWithMaskPath());
        instance_paths = scene.getInstanceWithMaskPaths();
    } else {
        showImage(scene.getFirstFramePath());
        showVideo(scene.getVideoPath());
        instance_paths = scene.getInstancePaths();
    }

    if (INSTANCE_VIEWS != null) {
        for (let i = 0; i < INSTANCE_VIEWS.length; i++) {
            INSTANCE_VIEWS[i].querySelector(".instance_view img").src =
                instance_paths[i];
        }
    }
}
function extract_input_list() {
    name_annotation_list = [];
    idx = 0;
    for (let input_view of INSTANCE_VIEWS) {
        const common_name_input = document.querySelector(
            'input[name="common_name"]'
        );
        const sci_name_input = document.querySelector('input[name="sci_name"]');
        const behavior_textarea = document.querySelector(
            'textarea[name="behavior"]'
        );

        const common_name = common_name_input.value.trim();
        const sci_name = sci_name_input.value.trim();
        const behavior = behavior_textarea.value.trim();

        json_item = {};

        if (common_name === "") {
            json_item["common_name"] = null;
        } else {
            json_item["common_name"] = common_name;
        }

        if (sci_name === "") {
            json_item["sci_name"] = null;
        } else {
            json_item["sci_name"] = sci_name;
        }
        if (behavior === "") {
            json_item["behavior"] = null;
        } else {
            json_item["behavior"] = behavior;
        }
        json_item["id"] = idx;
        name_annotation_list.push(json_item);

        idx += 1;
    }

    return name_annotation_list;
}
