import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase-config";
import { useEffect, useState } from "react";


function HomePage() {
  const [count, setCount] = useState(0);

  const docRef = doc(db, "users", "CHLy717IbCTkjq843QnFHDajYlJ2");

  const getData = async () => {
    const docSnap = getDoc(docRef)
      .then((doc) => {
        if (doc.exists()) {
          console.log("Document data:", doc.data());
        } else {
          console.log("No such document!");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
    console.log(docSnap);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="flex flex-col max-w-10/12 mx-auto py-5 items-center justify-center h-[calc(100vh-6rem)] bg-gradient-to-br from-primary to-secondary  text-white rounded-lg">
      <h1 className=" text-5xl my-4">Welcome to Dogo Walker! </h1>
      <div className="grid grid-cols-3 items-center w-full h-full">
        <div
          className="flex items-center justify-center row-span-2 w-full h-full bg-[url('/images/homePage2/forest.png')] bg-center bg-cover rounded-lg shadow-lg"
        >
          <h2 className=" opacity-100 text-5xl  shadow-black text-shadow-lg backdrop-blur-[2px] "> Explore map </h2>{" "}
        </div>
        <div className=" col-span-2">
          {" "}
          <h2> Find new friends XD </h2>{" "}
        </div>
        <div className="">
          {" "}
          <h2> Create community</h2>{" "}
        </div>
        <div className="row-span-2">
          {" "}
          <h2> Reach out for others </h2>{" "}
        </div>
        <div className=" col-span-2">
          {" "}
          <h2> Let your dog play! </h2>{" "}
        </div>
      </div>
    </div>
  );
}
export default HomePage;
