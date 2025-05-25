
import './App.css'
import { Routes, BrowserRouter, Route, Link } from "react-router"
import Main from "./Components/mainComponent/mainComponent";
function App() {

  return (

    <div>

      <BrowserRouter>

        <Routes>

          <Route path='/' element={<Main />}></Route>


        </Routes>


      </BrowserRouter>

    </div>



  )

}

export default App;
