import { useEffect, useState } from "react"

const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState<boolean>(false)

  useEffect(() => {
    // Create a media query list
    const mediaQueryList = window.matchMedia(query)

    // Define a handler to update the matches state
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    // Set the initial state
    setMatches(mediaQueryList.matches)

    // Add listener for changes
    mediaQueryList.addEventListener("change", handleChange)

    // Clean up the listener on component unmount
    return () => {
      mediaQueryList.removeEventListener("change", handleChange)
    }
  }, [query])

  return matches
}

export default useMediaQuery
