class BottomNavigationBar {
    constructor() {
        if (BottomNavigationBar.instance instanceof BottomNavigationBar) {
            return BottomNavigationBar.instance;
        } 

        BottomNavigationBar.instance = this;

        this.nextButton = document.getElementById("next-button");
        this.prevButton = document.getElementById("prev-button");

        return this;
    }

    enable() {
        this.nextButton.addEventListener("click", () => {
            const core = new Core();
            core.nextVideo();
        });

        this.prevButton.addEventListener("click", () => {
            const core = new Core();
            core.prevVideo();
        });

        // short cut
        document.addEventListener("keydown", (event) => {
            // Get the lower case of the input key
            const key = event.key.toLowerCase();

            if (key === "d") {
                this.nextButton.click();
            } else if (key === "a") {
                this.prevButton.click();
            }
        });
    }
}