import { Suspense } from "react";
import MainRouter from "./pages";

const App = () => {
  return (
    <div className="dark:bg-black dark:text-white bg-slate-100">
      <Suspense fallback={<p><img  src="https://cdn.dribbble.com/userupload/20130364/file/original-73e42728803da21a9265791e477cb3f2.gif" alt=""  className="w-96 h-96"/></p>}>
        <MainRouter />
      </Suspense>
    </div>
  );
};

export default App;
