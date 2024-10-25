class Core {
    constructor() {
        if (Core.instance instanceof Core) {
            return Core.instance;
        }

        Core.instance = this;
        this.isProjectLoaded = false;

        this.mainPage = document.getElementById("main-page");

        return this;
    }

    createProject(dataFolder, outputFolder) {
        eel.create_project(dataFolder, outputFolder)((projectData) => {
            const dataset = new Dataset();
            dataset.loadProject(projectData);
            
            this.showMainPage();
            const data = dataset.getCurrentData();
            this.showData(data);
        })
    }

    loadProject(projectPath) {
        eel.load_project(projectPath)((projectData) => {
            console.log(projectData);
        });
    }

    exportResult(result, outputFolder) {
        
    }

    showMainPage() {
        this.mainPage.classList.remove("hidden");
    }   

    hideMainPage() {    
        this.mainPage.classList.add("hidden");
    }
    
    isProjectLoaded() {
        return this.isProjectLoaded;
    }

    setProjectLoaded(isProjectLoaded) {
        this.isProjectLoaded = isProjectLoaded;
    }

    showData(data) {

    }
    
}