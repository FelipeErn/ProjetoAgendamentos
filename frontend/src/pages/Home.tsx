import { Header } from "../components/Header";
import Schedule from "../components/Schedule";

const Home = () => {
  return (
    <>
      <Header />
      <div className="pl-[255px] pt-[75px] min-h-screen bg-slate-50 w-full flex flex-col">
        <Schedule />
      </div>
    </>
  );
};

export default Home;
