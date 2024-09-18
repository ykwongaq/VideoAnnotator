class Scene {
    constructor(scene_name, floderPath, json_data) {
        this.scene_name = scene_name;
        this.first_frame_path = floderPath+"/"+json_data["first_frame_path"];
        this.first_colored_frame_path = floderPath+"/"+json_data["first_colored_frame_path"];
        this.video_path = floderPath+"/"+json_data["video_path"];
        this.video_with_mask_path = floderPath+"/"+json_data["video_with_mask_path"];
        this.instance_paths = json_data["instance_paths"].map(function(item) {
            return floderPath+"/"+ item;
        });
        this.instance_with_mask_paths = json_data["instance_with_mask_paths"].map(function(item) {
            return floderPath+"/"+ item;
        });
    }

    getFirstFramePath() {
        return this.first_frame_path;
    }

    getFirstColoredFramePath() {
        return this.first_colored_frame_path;
    }

    getVideoPath() {
        return this.video_path;
    }

    getVideoWithMaskPath() {
        return this.video_with_mask_path;
    }

    getName() {
        return this.scene_name;
    }

    getInstancePaths() {
        return this.instance_paths;
    }

    getInstanceWithMaskPaths() {
        return this.instance_with_mask_paths;
    }
}
