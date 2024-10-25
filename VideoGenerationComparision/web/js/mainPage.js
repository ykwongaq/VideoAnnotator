class MainPage {
    constructor() {
        if (MainPage.instance instanceof MainPage) {
            return MainPage.instance;
        }

        MainPage.instance = this;

        this.mainPage = document.getElementById("main-page");

        this.info = document.getElementById("info");
        this.video1 = document.getElementById("video-1");
        this.video2 = document.getElementById("video-2");

        this.video1BetterButton = document.getElementById("video-1-button");
        this.video2BetterButton = document.getElementById("video-2-button");
        
        this.enable();

        return this;
    }

    enable() {
        this.enableVideo1Button();
        this.enableVideo2Button();
    }

    enableVideo1Button() {
        this.video1BetterButton.addEventListener("click", () => {
            const dataset = new Dataset();
            const data = dataset.getCurrentData();
            data.selectBetterVideo(1);
            this.updateButtons();
        });

        document.addEventListener("keydown", (event) => {
            const key = event.key.toLowerCase();
            if (key === "j") {
                this.video1BetterButton.click();
            }
        });
    }

    enableVideo2Button() {
        this.video2BetterButton.addEventListener("click", () => {
            const dataset = new Dataset();
            const data = dataset.getCurrentData();
            data.selectBetterVideo(2);
            this.updateButtons();
        });

        document.addEventListener("keydown", (event) => {
            const key = event.key.toLowerCase();
            if (key === "l") {
                this.video2BetterButton.click();
            }
        });
    }

    updateButtons() {
        this.clearSelectedButtonsClass();
        const dataset = new Dataset();
        const data = dataset.getCurrentData();
        const selectedIdx = data.getSelectedVideoIdx();
        if (selectedIdx === 1) {
            this.video1BetterButton.classList.add("selected");
        }   else if (selectedIdx === 2) {
            this.video2BetterButton.classList.add("selected");
        }
    }

    clearSelectedButtonsClass() {
        this.video1BetterButton.classList.remove("selected");
        this.video2BetterButton.classList.remove("selected");
    }

    showMainPage() {
        this.mainPage.classList.remove("hidden");
    }

    hideMainPage() {
        this.mainPage.classList.add("hidden");
    }

    showData(data) {
        this.showVideo(this.video1, data.getVideo1Path());
        this.showVideo(this.video2, data.getVideo2Path());
        
        const dataset = new Dataset();
        const currentDataIdx = dataset.getCurrentDataIdx();
        this.info.innerHTML = `Filename ${data.getFilename()} Progress: (${currentDataIdx+1}/${dataset.getSize()})`;
    }

    showVideo(videoDom, videoPath) {
        const source = videoDom.querySelector("source");
        eel.load_video(videoPath)((videoSrc) => {
            source.src = `data:video/mp4;base64,${videoSrc}`;
            videoDom.load();
        });
    }
}