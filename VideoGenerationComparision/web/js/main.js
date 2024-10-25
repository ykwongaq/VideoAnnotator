function main() {
    const topnavigationBar = new TopNavigationBar();
    topnavigationBar.enable();

    // Initialize the core
    const core = new Core();

    // Initialize main page
    const mainPage = new MainPage();

    // Initialize bottom navigation bar
    const bottomNavigationBar = new BottomNavigationBar();
    bottomNavigationBar.enable();
}

main()
