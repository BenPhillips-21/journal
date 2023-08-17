import React, { useEffect, useState } from 'react'
import Home from "./Home"
import CategorySelection from './CategorySelection'
import NewEntry from './NewEntry'
import NavBar from './NavBar'
import ShowEntry from './ShowEntry'
import { BrowserRouter, Routes, Route, useParams, useNavigate } from "react-router-dom"

const seedEntries = [
  { category: 'Among Us', content: "you're sus buddy"},
  { category: 'Napoleon', content: "Asked who was the greatest general of his day, Wellington replied: 'In this age, in past ages, in any age, Napoleon'"},
  { category: 'Coding', content: 'Javascript rocks'}
]

const App = () => {
  const nav = useNavigate()
  const [entries, setEntries] = useState(seedEntries)

  useEffect(() => {
    (async () => {
      const res = await fetch(`${import.meta.env.VITE_API_HOST}/entries`)
      const data = await res.json()
      setEntries(data)
    })()
  }, [])

  function ShowEntryWrapper() {
    const { id } = useParams()
    return <ShowEntry entry={entries[id]} />
  }

  async function addEntry(category, content) {
    const id = entries.length

    const returnedEntry = await fetch(`${import.meta.env.VITE_API_HOST}/entries`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ category, content })
    })
    setEntries([...entries, await returnedEntry.json()])
    nav(`/entry/${id}`)
  }

  return ( <>
    <NavBar />
      <Routes>
        <Route path='/' element={<Home entries={entries}/>} />
        <Route path='/category' element={<CategorySelection />} />
        <Route path='/entry'>
          <Route path=":id" element={<ShowEntryWrapper />} />
          <Route path='new/:category' element={<NewEntry addEntry={addEntry}/>} />
        </Route>
        <Route path='*' element={<h3>Error 404 - Page not found</h3>}/>
      </Routes>
    </>
  )
}

export default App

