class Core {
    constructor() {
        if (Core.instance instanceof Core) {
            return Core.instance;
        }

        Core.instance = this;
        this.projectLoaded = false;

        return this;
    }

    createProject(dataFolder, outputFolder) {
        eel.create_project(
            dataFolder,
            outputFolder
        )((projectData) => {
            this.setProjectLoaded(true);

            const dataset = new Dataset();
            dataset.loadProject(projectData);

            const mainPage = new MainPage();
            mainPage.showMainPage();
            const data = dataset.getCurrentData();
            this.setCurrentData(data);

        });
    }

    loadProject(projectPath) {
        eel.load_project(projectPath)((projectData) => {
            this.setProjectLoaded(true);

            const dataset = new Dataset();
            dataset.loadProject(projectData);

            const mainPage = new MainPage();
            mainPage.showMainPage();
            const data = dataset.getCurrentData();
            this.setCurrentData(data);
        });
    }

    exportResult(path) {
        this.save();
        const dataset = new Dataset();
        const exportedJson = dataset.exportJson();
        eel.export_result(exportedJson, path);
    }


    isProjectLoaded() {
        return this.projectLoaded;
    }

    setProjectLoaded(projectLoaded) {
        this.projectLoaded = projectLoaded;
    }

    setCurrentData(data) {
        const mainPage = new MainPage();
        mainPage.showData(data);
        mainPage.updateButtons();
    }

    extractSaveProjectData() {
        const dataset = new Dataset();
        const projectData = {
            "last_index": dataset.getCurrentDataIdx(),
            "data": dataset.exportJson()
        };
        return projectData;
    }

    async save() {
        const saveData = this.extractSaveProjectData();
        await eel.save(saveData);
    }

    nextVideo() {
        this.save();
        const dataset = new Dataset();
        const currentDataIdx = dataset.getCurrentDataIdx();
        const data = dataset.getData(currentDataIdx + 1);
        if (data) {
            dataset.setCurrentDataIdx(currentDataIdx + 1);
            this.setCurrentData(data);
        }
    }

    prevVideo() {
        this.save();
        const dataset = new Dataset();
        const currentDataIdx = dataset.getCurrentDataIdx();
        const data = dataset.getData(currentDataIdx - 1);
        if (data) {
            dataset.setCurrentDataIdx(currentDataIdx - 1);
            this.setCurrentData(data);
        }
    }
}
