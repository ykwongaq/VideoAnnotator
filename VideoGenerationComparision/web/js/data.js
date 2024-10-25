class Data {
    constructor(data) {
        this.data = data;
    }

    getVideo2Path() {
        return this.data["video_1"];
    }   

    getVideo2Path() {
        return this.data["video_2"];
    }

    getFileName() {
        return this.data["file_name"];
    }

    selectBetterVideo(video_id) {
        this.data["better_video"] = video_id;
    }
}

class Dataset {
    constructor() {
        if (Dataset.instance instanceof Dataset) {
            return Dataset.instance
        }

        Dataset.instance = this;

        this.dataList = []
        this.currentDataIdx = 0;

        return this;
    }

    loadProject(projectData) {
        this.clearDataList();
        this.currentDataIdx = projectData["last_index"];
        for (const data of projectData["data"]) {
            this.dataList.push(new Data(data));
        }
    }

    clearDataList() {
        this.dataList = [];
    }

    setCurrentDataIdx(currentDataIdx) {
        this.currentDataIdx = currentDataIdx;
    }

    getCurrentData() {
        return this.dataList[this.currentDataIdx]
    }

    getData(dataIdx) {
        if (dataIdx < 0 || dataIdx >= this.dataList.length) {
            return null;
        }
        return this.dataList[dataIdx];
    }
}