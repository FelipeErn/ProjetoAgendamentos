import { Header } from "../components/Header";
import Schedule from "../components/Schedule";

const Home = () => {
  return (
    <>
      <Header />
      <div className="ml-64 mt-16 flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <Schedule />
      </div>
    </>
  );
};

export default Home;
