import { useEffect } from 'react'
import { useCountStore } from './stores/common.store';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import './App.css'

function App() {
  const { count: countFromStore } = useCountStore();


  useEffect(() => {

  }, [])

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
