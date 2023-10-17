import React, { useState, useEffect } from "react";
import axios from 'axios';
import DateTimePicker from "react-datetime-picker";
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import "./App.css";

function App() {
  const [alltodo, settodo] = useState([]); //array if alll todos/reminders

  const [title, setTitle] = useState("");
  const [desc, setdesc] = useState("");

  const[remindat,setremind] = useState();        //for time

  useEffect(()=>{
    axios.get("http://localhost:9000/getAllReminder").then(res=>{
      settodo(res.data)
    })                    //backend mai defined hai jo saare things ko load krega

  },[])            //ye array khaali isliye ye page start hote hi load hojayega

  const setTodo = () => {

    axios.post("http://localhost:9000/addReminder",{title,desc,remindat})   //sending the title desc and time to db
    .then(res=>{ settodo(res.data) })

    /// jaise hi add krdia saare inputs khaali ho hogye again
    setTitle("")  
    setdesc("")
    setremind();
  };

  const del = (id) =>{
    axios.post("http://localhost:9000/deleteReminder",{id})   //sending the title desc and time to db
    .then(res=>{ settodo(res.data) })
  }

  return (
    <div className="bg-gray-900 w-screen h-screen">
      <div className="text-white py-10 text-5xl font-bold text-center">
        My ToDOs
      </div>

      <div className="">
        <div className="bg-gray-800 w-fit m-auto p-11 rounded-md">
          <div className="wrapper justify-center flex space-x-8">
            <div className="todoinput order-1 grid grid-cols-2">
              <label className="text-white font-semibold mb-2">Title</label>
              <input
                type="text"
                className="col-span-2 border-blue-800 border-2 px-4 py-1 rounded-md"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="todoinput order-2 grid grid-cols-2">
              <label className="text-white font-semibold mb-2">
                Description
              </label>
              <input
                type="text"
                className="col-span-2 border-blue-800 border-2 px-4 py-1 rounded-md"
                placeholder="Description"
                value={desc}
                onChange={(e) => setdesc(e.target.value)}    // jaise hi kuch change hua e k andar aaya and then set hogya
              />
            </div>

              
          </div>
          <DateTimePicker
                className="date bg-white w-auto my-2 rounded-md"
                value={remindat}
                onChange={setremind}
                minDate={new Date()}
                minutePlaceholder="mm"
                hourPlaceholder="hh"
                dayPlaceholder="DD"
                monthPlaceholder="MM"
                yearPlaceholder="YYYY"
              />
          <div className="todoinput order-3 grid grid-cols-2">
              <label className="text-white mb-2"></label>
              <button
                type="text"
                className="text text-white col-span-2 bg-green-500 px-2 rounded-sm"
                placeholder="telltitle"
                onClick={setTodo} //run func to add new todo in array state "settodo"
              >
                Add
              </button>
          </div>
          
          
          <hr className="h-px mx-5 my-10 text-gray-900 rounded-sm" />

          <div className="Buttonarea ">
            <button
              className={`text-white col-span-2 bg-green-500 px-2 rounded-sm`}
            >
              Todo
            </button>
          </div>
          <div className="listarea mt-5 bg-gray-700 px-4 py-1 rounded-md">
              {alltodo.map((item)=>{       //the item is ultimately the indexes of object{title,desc} isliye direct access hora
                  return(
                    <div className="listitem" key={item._id}>
                      <div className="flex justify-between">
                        <div className="task font-bold text-2xl text-green-500 order-1">{item.title}</div>
                        <button onClick={()=>del(item._id)} className="font-bold text-2xl text-red-200 hover:text-red-700 order-2"><div >O</div></button>
                      </div>
                      <p className="description text-gray-400 font-thin">{item.desc}</p>
                      <p className="text-gray-400 font-thin">{item.remindat}</p>
                    </div>
                  )
                })
              }
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
