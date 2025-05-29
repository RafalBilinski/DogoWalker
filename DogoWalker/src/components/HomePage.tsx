
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase-config"
import { useEffect, useState } from 'react';

function HomePage() {
 const [count, setCount] = useState(0)

  const docRef =doc(db, "users", "CHLy717IbCTkjq843QnFHDajYlJ2");
  
  const getData= async () => {
    const docSnap = getDoc(docRef).then((doc) => {
    if (doc.exists()) {
      console.log("Document data:", doc.data());
    } else {
      console.log("No such document!");
    }
    }).catch((error) => {
      console.log("Error getting document:", error);
    });
    console.log(docSnap);  
    }
  
  useEffect(() => {
    getData();
  }
  , []);
  
  return(      
    <div className='flex flex-col max-w-10/12 mx-auto py-5 items-center justify-center h-[calc(100vh-6rem)] bg-gradient-to-br from-primary to-secondary  text-white rounded-lg'>

        <h1 className=' text-5xl '>Dogo Walker</h1>
        <button className="button bg-white text-amber-950 p-5 rounded-full w-fit m-1 " onClick={() => setCount((count) => count + 1)}>
          count is {count} 
        </button>
        <button className="button bg-white text-amber-950 p-5 rounded-full m-1" onClick={() => setCount(0)}>
          Reset
        </button>
    </div>
    );
}
export default HomePage;