class Dataset {
    constructor() {
        this.scene_list = [];
    }

    /**
     * Get the singleton instance of the dataset.
     * @returns {Dataset} The instance of the dataset.
     */
    static getInstance() {
        if (!this.instance) {
            this.instance = new Dataset();
        }
        return this.instance;
    }

    parseJSON(json_str) {
        let json = JSON.parse(json_str);
        for (let scene_name in json) {
            const json_data = json[scene_name];
            const scene = new Scene(scene_name, json_data);
            this.scene_list.push(scene);
        }
    }

    getFirstScene() {
        return this.scene_list[0];
    }

    getScene(scene_idx) {
        return this.scene_list[scene_idx];
    }

    getLen() {
        return this.scene_list.length;
    }
}
