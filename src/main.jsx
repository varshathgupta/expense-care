import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { Provider } from "react-redux";
import store from "./store/index.js";

const theme = extendTheme({
  colors: {
    primary: "#B83280",
    dark: "#1A202C",
    lightgray: "#2D3748",
  },
  styles: {
    global: {
      // styles for the `body`
      body: {
        bg: "#1A202C",
        color: "rgba(255, 255, 255, 0.92)",
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
    <Provider store={store}>
      <ChakraProvider
        theme={theme}
        toastOptions={{
          defaultOptions: {
            position: "top-right",
            isClosable: true,
            duration: 5000,
            containerStyle: {
              marginTop: "10vh",
              borderRadius: "0",
            },
          },
        }}
      >
        <App />
      </ChakraProvider>
    </Provider>
  // {/* </React.StrictMode> */}
);
