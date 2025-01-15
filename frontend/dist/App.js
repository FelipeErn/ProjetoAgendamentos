import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import axios from "axios";
function App() {
    const [data, setData] = useState("");
    useEffect(() => {
        axios.get("http://localhost:3000").then((response) => {
            setData(response.data);
        });
    }, []);
    return _jsx("div", Object.assign({ className: "p-4 text-center" }, { children: data }));
}
export default App;
