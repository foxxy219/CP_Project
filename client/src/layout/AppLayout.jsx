import SidebarLeft from "../public/global/Sidebar";
import Topbar from "../public/global/Topbar";
import { ColorModeContext, useMode } from "../theme";
import { CssBaseline, ThemeProvider } from "@mui/material";

const AppLayout = ({ children }) => {
    const [theme, colorMode] = useMode();

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <div className="app">
                    <SidebarLeft />
                    <main className="content">
                        <Topbar />
                        {children}
                    </main>
                </div>
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
}
export default AppLayout;